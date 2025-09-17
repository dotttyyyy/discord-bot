import discord
from discord.ext import commands
import json
import os
from datetime import datetime
import asyncio

# Bot configuration
intents = discord.Intents.default()
intents.message_content = True
intents.dm_messages = True
intents.guilds = True
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)

# Configuration - Replace these with your actual values
GUILD_ID = 1143606196184551475  # Your server ID
ADMIN_CHANNEL_ID = 1414044553312468992  # Admin channel ID where verification requests go
ROLE_NAME = "gen"  # The role to give users
CHANNEL_LINK = "https://discord.com/channels/1143606196184551475/1417148177097691156"

# Simple JSON storage for pending verifications
PENDING_FILE = "pending_verifications.json"

def load_pending():
    """Load pending verifications from file"""
    try:
        with open(PENDING_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_pending(data):
    """Save pending verifications to file"""
    with open(PENDING_FILE, 'w') as f:
        json.dump(data, f, indent=2)

class VerificationView(discord.ui.View):
    def __init__(self, user_id, message_id):
        super().__init__(timeout=None)
        self.user_id = user_id
        self.message_id = message_id
    
    @discord.ui.button(label="✅ Approve", style=discord.ButtonStyle.green)
    async def approve(self, interaction: discord.Interaction, button: discord.ui.Button):
        await self.handle_verification(interaction, approved=True)
    
    @discord.ui.button(label="❌ Deny", style=discord.ButtonStyle.red)
    async def deny(self, interaction: discord.Interaction, button: discord.ui.Button):
        await self.handle_verification(interaction, approved=False)
    
    async def handle_verification(self, interaction, approved):
        # Get the user
        user = bot.get_user(self.user_id)
        if not user:
            await interaction.response.send_message("❌ Could not find user!", ephemeral=True)
            return
        
        # Get the guild and role
        guild = bot.get_guild(GUILD_ID)
        if not guild:
            await interaction.response.send_message("❌ Could not find server!", ephemeral=True)
            return
        
        member = guild.get_member(self.user_id)
        if not member:
            await interaction.response.send_message("❌ User is not in the server!", ephemeral=True)
            return
        
        if approved:
            # Find and assign the role
            role = discord.utils.get(guild.roles, name=ROLE_NAME)
            if not role:
                await interaction.response.send_message(f"❌ Could not find role '{ROLE_NAME}'!", ephemeral=True)
                return
            
            try:
                await member.add_roles(role)
                
                # Send success DM to user
                success_message = f"""🎉 **Congratulations!**

You have been approved and granted the **@{ROLE_NAME}** role!

Please head over to <#{CHANNEL_LINK.split('/')[-1]}> to access your new channel.

**Important Notice:** If you remove your guild tag while holding this role, you will be blacklisted from future gen applications. We ask all members to proudly represent our guild tag as it helps promote our community.

Welcome to the gen! We hope you enjoy your time here."""

                try:
                    await user.send(success_message)
                except discord.Forbidden:
                    pass  # User has DMs disabled
                
                # Update admin channel
                embed = discord.Embed(
                    title="✅ Verification Approved", 
                    description=f"**User:** {user.mention}\n**Role:** @{ROLE_NAME}\n**Admin:** {interaction.user.mention}",
                    color=discord.Color.green(),
                    timestamp=datetime.now()
                )
                
                await interaction.response.edit_message(embed=embed, view=None)
                
            except discord.Forbidden:
                await interaction.response.send_message("❌ I don't have permission to assign roles!", ephemeral=True)
        else:
            # Send denial DM
            denial_message = """❌ **Verification Denied**

Your guild tag verification request has been denied. This could be due to:
• Invalid or unclear screenshot
• Guild tag not clearly visible
• Not meeting current requirements

You may try again with a clearer screenshot if needed."""

            try:
                await user.send(denial_message)
            except discord.Forbidden:
                pass
            
            # Update admin channel
            embed = discord.Embed(
                title="❌ Verification Denied", 
                description=f"**User:** {user.mention}\n**Admin:** {interaction.user.mention}",
                color=discord.Color.red(),
                timestamp=datetime.now()
            )
            
            await interaction.response.edit_message(embed=embed, view=None)
        
        # Remove from pending
        pending = load_pending()
        if str(self.user_id) in pending:
            del pending[str(self.user_id)]
            save_pending(pending)

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')
    print(f'Bot is in {len(bot.guilds)} guilds')

@bot.event
async def on_message(message):
    # Ignore messages from the bot itself
    if message.author == bot.user:
        return
    
    # Only process DMs
    if isinstance(message.channel, discord.DMChannel):
        await handle_dm(message)
    
    await bot.process_commands(message)

async def handle_dm(message):
    user = message.author
    
    # Check if user is in the guild
    guild = bot.get_guild(GUILD_ID)
    if not guild:
        await message.reply("❌ Error: Could not find the server!")
        return
    
    member = guild.get_member(user.id)
    if not member:
        await message.reply("❌ You must be a member of our Discord server to use this verification system!")
        return
    
    # Check if user already has the role
    role = discord.utils.get(guild.roles, name=ROLE_NAME)
    if role and role in member.roles:
        await message.reply(f"✅ You already have the **@{ROLE_NAME}** role!")
        return
    
    # Check for attachments (screenshots)
    if not message.attachments:
        await message.reply("""📸 **Guild Tag Verification**

To verify your guild tag, please send a screenshot showing:
• Your Discord profile with the guild tag clearly visible
• Make sure the tag is legible and matches our guild

Please attach the screenshot to your next message.""")
        return
    
    # Check if it's an image
    attachment = message.attachments[0]
    if not attachment.content_type or not attachment.content_type.startswith('image/'):
        await message.reply("❌ Please send a valid image file (PNG, JPG, etc.)")
        return
    
    # Check if already pending
    pending = load_pending()
    if str(user.id) in pending:
        await message.reply("⏳ You already have a pending verification request. Please wait for admin review.")
        return
    
    # Send confirmation to user
    await message.reply("""⏳ **Verification Submitted**

Your guild tag verification has been submitted for admin review.

**Expected Review Time:** 1-24 hours

You will receive a DM once your verification has been processed. Thank you for your patience!""")
    
    # Send to admin channel for review
    admin_channel = bot.get_channel(ADMIN_CHANNEL_ID)
    if not admin_channel:
        print(f"Warning: Could not find admin channel {ADMIN_CHANNEL_ID}")
        return
    
    embed = discord.Embed(
        title="🔍 New Guild Tag Verification",
        description=f"**User:** {user.mention} ({user.name}#{user.discriminator})\n**User ID:** {user.id}",
        color=discord.Color.blue(),
        timestamp=datetime.now()
    )
    embed.set_image(url=attachment.url)
    embed.set_footer(text="Click a button below to approve or deny this verification")
    
    view = VerificationView(user.id, None)
    admin_message = await admin_channel.send(embed=embed, view=view)
    
    # Store pending verification
    pending[str(user.id)] = {
        "timestamp": datetime.now().isoformat(),
        "admin_message_id": admin_message.id,
        "image_url": attachment.url
    }
    save_pending(pending)

# Admin commands
@bot.command(name='pending')
@commands.has_permissions(administrator=True)
async def pending_verifications(ctx):
    """Show pending verifications"""
    pending = load_pending()
    if not pending:
        await ctx.send("✅ No pending verifications!")
        return
    
    embed = discord.Embed(title="⏳ Pending Verifications", color=discord.Color.orange())
    for user_id, data in pending.items():
        user = bot.get_user(int(user_id))
        username = f"{user.name}#{user.discriminator}" if user else f"Unknown User ({user_id})"
        embed.add_field(
            name=username,
            value=f"Submitted: {data['timestamp'][:19]}",
            inline=False
        )
    
    await ctx.send(embed=embed)

@bot.command(name='setup')
@commands.has_permissions(administrator=True)
async def setup_info(ctx):
    """Show setup information"""
    embed = discord.Embed(title="🔧 Bot Setup Information", color=discord.Color.blue())
    embed.add_field(name="Guild ID", value=str(GUILD_ID), inline=False)
    embed.add_field(name="Admin Channel ID", value=str(ADMIN_CHANNEL_ID) if ADMIN_CHANNEL_ID else "⚠️ NOT SET", inline=False)
    embed.add_field(name="Role Name", value=ROLE_NAME, inline=False)
    embed.add_field(name="Channel Link", value=CHANNEL_LINK, inline=False)
    
    if ADMIN_CHANNEL_ID == 0:
        embed.add_field(
            name="⚠️ Setup Required", 
            value=f"Set the ADMIN_CHANNEL_ID in the code to {ctx.channel.id} (this channel) or your preferred admin channel.",
            inline=False
        )
    
    await ctx.send(embed=embed)

# Run the bot
if __name__ == "__main__":
    TOKEN = os.getenv('DISCORD_BOT_TOKEN')
    if not TOKEN:
        print("Error: DISCORD_BOT_TOKEN environment variable not set!")
        print("Please set your bot token as an environment variable.")
    else:
        bot.run(TOKEN)
