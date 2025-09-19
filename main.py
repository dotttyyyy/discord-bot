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

    # Set bot status (minor change)
    activity = discord.Game(name="It's A Long Way To Tipperary")
    await bot.change_presence(status=discord.Status.online, activity=activity)

# The rest of your events and functions remain unchanged
# on_member_join, on_message, handle_dm, admin commands etc.

# Run the bot
if __name__ == "__main__":
    TOKEN = os.getenv('DISCORD_BOT_TOKEN')
    if not TOKEN:
        print("Error: DISCORD_BOT_TOKEN environment variable not set!")
        print("Please set your bot token as an environment variable.")
    else:
        bot.run(TOKEN)
