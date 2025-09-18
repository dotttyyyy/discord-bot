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
                
                # Send enhanced success DM to user
                success_embed = discord.Embed(
                    title="🎉 Verification Approved!",
                    description=f"Congratulations! You have been granted the **@{ROLE_NAME}** role.",
                    color=discord.Color.green(),
                    timestamp=datetime.now()
                )
                
                success_embed.add_field(
                    name="✅ Next Steps",
                    value=f"Please head over to <#{CHANNEL_LINK.split('/')[-1]}> to access your new channel.",
                    inline=False
                )
                
                success_embed.add_field(
                    name="⚠️ IMPORTANT RULES",
                    value="**By accepting this role, you agree to:**\n"
                          "• Keep your guild tag equipped at all times while holding this role\n"
                          "• Represent our guild proudly and honestly\n"
                          "• NOT remove your guild tag while using gen privileges\n\n"
                          "**⚡ BLACKLIST WARNING:** Removing your guild tag while holding the gen role will result in an **immediate and permanent blacklist** from all future applications.",
                    inline=False
                )
                
                success_embed.add_field(
                    name="🤝 Community Guidelines",
                    value="We ask all gen members to proudly display our guild tag as it helps promote our community. This is a privilege, not a right - please respect it!",
                    inline=False
                )
                
                success_embed.add_field(
                    name="ℹ️ Guild Tag Updates",
                    value="Note: Our guild tag may change **icon/color** over time, but will always keep the **DMA** name. Continue representing the DMA tag regardless of visual updates.",
                    inline=False
                )
                
                success_embed.add_field(
                    name="🆘 Need Support?",
                    value="Contact our support team: <#1399534470029115443>",
                    inline=False
                )
                
                success_embed.set_footer(text="Welcome to the gen! We hope you enjoy your time here.")
                success_embed.set_thumbnail(url=user.display_avatar.url)

                try:
                    await user.send(embed=success_embed)
                except discord.Forbidden:
                    pass  # User has DMs disabled
                
                # Enhanced admin success embed
                success_admin_embed = discord.Embed(
                    title="✅ Verification Approved", 
                    color=discord.Color.green(),
                    timestamp=datetime.now()
                )
                success_admin_embed.add_field(
                    name="User Details",
                    value=f"**User:** {user.mention}\n**Username:** {user.name}#{user.discriminator}\n**ID:** {user.id}",
                    inline=True
                )
                success_admin_embed.add_field(
                    name="Action Details",
                    value=f"**Role Given:** @{ROLE_NAME}\n**Admin:** {interaction.user.mention}\n**Status:** Successfully processed",
                    inline=True
                )
                success_admin_embed.set_thumbnail(url=user.display_avatar.url)
                success_admin_embed.set_footer(text="Guild Tag Verification System")
                
                await interaction.response.edit_message(embed=success_admin_embed, view=None)
                
            except discord.Forbidden:
                await interaction.response.send_message("❌ I don't have permission to assign roles!", ephemeral=True)
        else:
            # Enhanced denial message
            denial_embed = discord.Embed(
                title="❌ Verification Denied",
                description="Your guild tag verification request has been denied by our admin team.",
                color=discord.Color.red(),
                timestamp=datetime.now()
            )
            
            denial_embed.add_field(
                name="Common Reasons for Denial",
                value="• Guild tag not clearly visible or legible\n• Screenshot quality too poor\n• Guild tag does not match our requirements\n• Suspicious or edited image\n• Account does not meet our standards",
                inline=False
            )
            
            denial_embed.add_field(
                name="🔄 Can I Reapply?",
                value="You may submit a new application with a clearer screenshot if you believe this was an error. Please ensure your guild tag is clearly visible and meets all requirements.",
                inline=False
            )
            
            denial_embed.add_field(
                name="ℹ️ Remember",
                value="We're looking for the **DMA** guild tag name. The icon/color may change, but the DMA text should be visible.",
                inline=False
            )
            
            denial_embed.add_field(
                name="🆘 Need Support?",
                value="Contact our support team: <#1399534470029115443>",
                inline=False
            )
            
            denial_embed.set_footer(text="If you believe this was a mistake, please contact an admin directly.")

            try:
                await user.send(embed=denial_embed)
            except discord.Forbidden:
                pass
            
            # Enhanced admin denial embed
            denial_admin_embed = discord.Embed(
                title="❌ Verification Denied", 
                color=discord.Color.red(),
                timestamp=datetime.now()
            )
            denial_admin_embed.add_field(
                name="User Details",
                value=f"**User:** {user.mention}\n**Username:** {user.name}#{user.discriminator}\n**ID:** {user.id}",
                inline=True
            )
            denial_admin_embed.add_field(
                name="Action Details",
                value=f"**Admin:** {interaction.user.mention}\n**Status:** Denied",
                inline=True
            )
            denial_admin_embed.set_thumbnail(url=user.display_avatar.url)
            denial_admin_embed.set_footer(text="Guild Tag Verification System")
            
            await interaction.response.edit_message(embed=denial_admin_embed, view=None)
        
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
async def on_member_join(member):
    """Send welcome DM to new members"""
    # Only send welcome DM for our specific guild
    if member.guild.id != GUILD_ID:
        return
    
    # Create welcome embed
    welcome_embed = discord.Embed(
        title="🎉 Welcome to the Server!",
        description=f"Hey {member.display_name}, welcome to our community!",
        color=discord.Color.blue(),
        timestamp=datetime.now()
    )
    
    welcome_embed.add_field(
        name="🔐 Get Verified",
        value="Visit <#1372022169361580113> to get verified and unlock exclusive channels!",
        inline=False
    )
    
    welcome_embed.add_field(
        name="🛒 Shop & Services",
        value="Check out <#1372022401222836345> to purchase items and services.",
        inline=False
    )
    
    welcome_embed.add_field(
        name="❓ Need Help?",
        value="Have questions? Visit <#1399534470029115443> for support from our team.",
        inline=False
    )
    
    welcome_embed.add_field(
        name="🏷️ Guild Tag Information",
        value="Get our guild tag to unlock the **gen** role and access exclusive content! Use our verification system to get started.",
        inline=False
    )
    
    welcome_embed.set_thumbnail(url=member.display_avatar.url)
    welcome_embed.set_footer(text="We're glad to have you here!", icon_url=member.guild.icon.url if member.guild.icon else None)
    
    # Try to send welcome DM
    try:
        await member.send(embed=welcome_embed)
        print(f"SUCCESS: Welcome DM sent to {member.name}#{member.discriminator}")
    except discord.Forbidden:
        print(f"WARNING: Could not send welcome DM to {member.name}#{member.discriminator} - DMs disabled")
    except Exception as e:
        print(f"ERROR sending welcome DM to {member.name}#{member.discriminator}: {e}")

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
        # Send welcome embed with rules and tutorial
        welcome_embed = discord.Embed(
            title="🏷️ Guild Tag Verification",
            description="Welcome to our guild tag verification system!",
            color=discord.Color.gold(),
            timestamp=datetime.now()
        )
        
        welcome_embed.add_field(
            name="📋 Requirements",
            value="• You must have our guild tag equipped\n• Screenshot must clearly show the tag\n• Tag must be visible and legible",
            inline=False
        )
        
        welcome_embed.add_field(
            name="⚠️ Important Rules",
            value="• **Be honest** - only apply if you genuinely have our guild tag equipped\n• **Keep the tag** - do not remove your guild tag while using the gen role\n• **Respect the system** - removing your tag after getting gen will result in a **permanent blacklist**\n• We expect members to proudly represent our guild tag as long as they hold the gen role",
            inline=False
        )
        
        welcome_embed.add_field(
            name="ℹ️ Important Information",
            value="• Our guild tag may change **icon/color** over time, but we will always keep the **DMA** tag name\n• Look for the **DMA** text in your guild tag - that's what we're verifying",
            inline=False
        )
        
        welcome_embed.add_field(
            name="📸 How to Submit",
            value="Send a screenshot of your Discord profile showing the guild tag clearly visible.",
            inline=False
        )
        
        welcome_embed.add_field(
            name="🆘 Need Support?",
            value="Contact our support team: <#1399534470029115443>",
            inline=False
        )
        
        welcome_embed.set_image(url="https://r2.e-z.host/dbb0a9f7-2339-44f0-b6e7-69743e508106/ru9kyhhl.gif")
        welcome_embed.set_footer(text="Please attach your verification screenshot to your next message")
        
        await message.reply(embed=welcome_embed)
        return
    
    # Enhanced file type validation
    attachment = message.attachments[0]
    if not attachment.content_type or not attachment.content_type.startswith('image/'):
        error_embed = discord.Embed(
            title="❌ Invalid File Type",
            description="Please send a valid image file for verification.",
            color=discord.Color.red(),
            timestamp=datetime.now()
        )
        error_embed.add_field(
            name="Accepted Formats",
            value="• PNG (.png)\n• JPEG (.jpg, .jpeg)\n• WebP (.webp)\n• GIF (.gif)",
            inline=False
        )
        error_embed.add_field(
            name="What to Send",
            value="Take a screenshot of your Discord profile showing the guild tag clearly visible.",
            inline=False
        )
        await message.reply(embed=error_embed)
        return
    
    # Check file size (Discord limit is 25MB, but let's be reasonable)
    if attachment.size > 10 * 1024 * 1024:  # 10MB limit
        await message.reply("❌ **File too large!** Please send an image smaller than 10MB.")
        return
    
    # Check if already pending
    pending = load_pending()
    if str(user.id) in pending:
        pending_embed = discord.Embed(
            title="⏳ Already Pending",
            description="You already have a verification request waiting for admin review.",
            color=discord.Color.orange(),
            timestamp=datetime.now()
        )
        pending_embed.add_field(
            name="Expected Review Time",
            value="1-24 hours",
            inline=True
        )
        pending_embed.add_field(
            name="Status",
            value="Waiting for admin approval",
            inline=True
        )
        await message.reply(embed=pending_embed)
        return
    
    # Send confirmation to user
    confirmation_embed = discord.Embed(
        title="✅ Verification Submitted",
        description="Your guild tag verification has been successfully submitted!",
        color=discord.Color.green(),
        timestamp=datetime.now()
    )
    confirmation_embed.add_field(
        name="⏰ Expected Review Time",
        value="1-24 hours",
        inline=True
    )
    confirmation_embed.add_field(
        name="📬 Next Steps",
        value="You will receive a DM once processed",
        inline=True
    )
    confirmation_embed.add_field(
        name="⚠️ Important Reminder",
        value="Keep your guild tag equipped while waiting for review. Removing it may result in denial or blacklisting.",
        inline=False
    )
    confirmation_embed.set_footer(text="Thank you for your patience!")
    
    await message.reply(embed=confirmation_embed)
    
    # Enhanced admin notification
    admin_channel = bot.get_channel(ADMIN_CHANNEL_ID)
    if not admin_channel:
        print(f"ERROR: Could not find admin channel {ADMIN_CHANNEL_ID}")
        # Try to send error message to user
        await message.reply("⚠️ **System Error**: Could not reach admin team. Please try again later or contact support.")
        return
    
    print(f"DEBUG: Sending verification to admin channel: {admin_channel.name}")
    
    try:
    
    try:
        # Calculate account age
        account_age = datetime.now() - user.created_at
        join_date = member.joined_at
        
        admin_embed = discord.Embed(
            title="🔍 New Guild Tag Verification Request",
            color=discord.Color.blue(),
            timestamp=datetime.now()
        )
        
        admin_embed.add_field(
            name="👤 User Information",
            value=f"**User:** {user.mention}\n**Username:** {user.name}#{user.discriminator}\n**ID:** {user.id}",
            inline=True
        )
        
        admin_embed.add_field(
            name="📊 Account Details",
            value=f"**Created:** {user.created_at.strftime('%b %d, %Y')}\n**Joined Server:** {join_date.strftime('%b %d, %Y') if join_date else 'Unknown'}\n**Account Age:** {account_age.days} days",
            inline=True
        )
        
        admin_embed.add_field(
            name="📷 Verification Image",
            value="Screenshot attached below",
            inline=False
        )
        
        admin_embed.set_image(url=attachment.url)
        admin_embed.set_thumbnail(url=user.display_avatar.url)
        admin_embed.set_footer(text="Guild Tag Verification System", icon_url=bot.user.display_avatar.url)
        
        view = VerificationView(user.id, None)
        admin_message = await admin_channel.send(embed=admin_embed, view=view)
        print(f"SUCCESS: Admin message sent with ID: {admin_message.id}")
        
        # Store pending verification
        pending[str(user.id)] = {
            "timestamp": datetime.now().isoformat(),
            "admin_message_id": admin_message.id,
            "image_url": attachment.url,
            "user_info": {
                "username": f"{user.name}#{user.discriminator}",
                "created_at": user.created_at.isoformat(),
                "joined_at": join_date.isoformat() if join_date else None
            }
        }
        save_pending(pending)
        
    except Exception as e:
        print(f"ERROR sending to admin channel: {e}")
        await message.reply("⚠️ **System Error**: Could not process your verification. Please try again later or contact support.")

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
