for (const [category, emoji] of Object.entries(categories)) {
        const categoryCommands = Array.from(commands.values())
            .filter(cmd => cmd.category === category)
            .map(cmd => `\`/${cmd.name}\``)
            .join(', ');
        
        if (categoryCommands) {
            embed.addFields({
                name: emoji,
                value: categoryCommands || 'None',
                inline: false
            });
        }
    }
    
    embed.addFields({
        name: '🔗 Useful Links',
        value: '[Support Server](https://discord.gg/support) | [Invite Bot](https://discord.com/oauth2/authorize) | [Website](https://example.com)',
        inline: false
    });
    
    await interaction.reply({ embeds: [embed] });
});

// =================
// ADDITIONAL COMMANDS
// =================

createCommand('stats', 'Show bot statistics', 'utility', async (interaction) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('📊 Bot Statistics')
        .addFields(
            { name: '🏓 Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
            { name: '⏱️ Uptime', value: utils.formatTime(uptime * 1000), inline: true },
            { name: '🏠 Servers', value: client.guilds.cache.size.toString(), inline: true },
            { name: '👥 Users', value: client.users.cache.size.toString(), inline: true },
            { name: '💾 Memory', value: `${Math.round(memoryUsage.used / 1024 / 1024)}MB`, inline: true },
            { name: '⚡ Commands', value: commands.size.toString(), inline: true }
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('snipe', 'View the last deleted message', 'utility', async (interaction) => {
    // This would require storing deleted messages
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('👻 Message Snipe')
        .setDescription('No recently deleted messages found!')
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('afk', 'Set yourself as AFK', 'utility', async (interaction) => {
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    // Store AFK status
    const userData = utils.getUserData(interaction.user.id);
    userData.afk = {
        reason,
        timestamp: Date.now()
    };
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('💤 AFK Set')
        .setDescription(`You are now AFK: **${reason}**`)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'reason', description: 'Reason for being AFK', type: 'string' }
]);

createCommand('say', 'Make the bot say something', 'fun', async (interaction) => {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    
    if (!channel.isTextBased()) {
        return interaction.reply({ content: 'Invalid channel type!', ephemeral: true });
    }
    
    try {
        await channel.send(message);
        await interaction.reply({ content: 'Message sent!', ephemeral: true });
    } catch (error) {
        await interaction.reply({ content: 'Failed to send message!', ephemeral: true });
    }
}, [
    { name: 'message', description: 'Message to send', type: 'string', required: true },
    { name: 'channel', description: 'Channel to send message to', type: 'channel' }
], PermissionFlagsBits.ManageMessages);

createCommand('embed', 'Create an embed message', 'utility', async (interaction) => {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color') || '#7289DA';
    
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(parseInt(color.replace('#', ''), 16))
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'title', description: 'Embed title', type: 'string', required: true },
    { name: 'description', description: 'Embed description', type: 'string', required: true },
    { name: 'color', description: 'Embed color (hex)', type: 'string' }
], PermissionFlagsBits.ManageMessages);

createCommand('lockdown', 'Lockdown a channel', 'moderation', async (interaction) => {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: false
        });
        
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('🔒 Channel Locked')
            .setDescription(`${channel} has been locked down.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to lockdown channel!', ephemeral: true });
    }
}, [
    { name: 'channel', description: 'Channel to lockdown', type: 'channel' },
    { name: 'reason', description: 'Reason for lockdown', type: 'string' }
], PermissionFlagsBits.ManageChannels);

createCommand('unlock', 'Unlock a channel', 'moderation', async (interaction) => {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: null
        });
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🔓 Channel Unlocked')
            .setDescription(`${channel} has been unlocked.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to unlock channel!', ephemeral: true });
    }
}, [
    { name: 'channel', description: 'Channel to unlock', type: 'channel' },
    { name: 'reason', description: 'Reason for unlock', type: 'string' }
], PermissionFlagsBits.ManageChannels);

createCommand('slowmode', 'Set channel slowmode', 'moderation', async (interaction) => {
    const seconds = interaction.options.getInteger('seconds');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    
    try {
        await channel.setRateLimitPerUser(seconds);
        
        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('⏱️ Slowmode Updated')
            .setDescription(`Slowmode set to **${seconds}** seconds in ${channel}.`)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to set slowmode!', ephemeral: true });
    }
}, [
    { name: 'seconds', description: 'Slowmode duration in seconds (0 to disable)', type: 'integer', required: true, min: 0, max: 21600 },
    { name: 'channel', description: 'Channel to set slowmode for', type: 'channel' }
], PermissionFlagsBits.ManageChannels);

createCommand('nuke', 'Delete and recreate a channel', 'admin', async (interaction) => {
    const channel = interaction.channel;
    const channelName = channel.name;
    const channelPosition = channel.position;
    const channelParent = channel.parent;
    
    try {
        const newChannel = await channel.clone();
        await newChannel.setPosition(channelPosition);
        await channel.delete();
        
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('💥 Channel Nuked')
            .setDescription(`Channel **${channelName}** has been nuked and recreated!`)
            .setTimestamp();
        
        await newChannel.send({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to nuke channel!', ephemeral: true });
    }
}, [], PermissionFlagsBits.ManageChannels);

// =================
// IMAGE COMMANDS
// =================

createCommand('hug', 'Hug someone', 'fun', async (interaction) => {
    const user = interaction.options.getUser('user');
    
    const hugGifs = [
        'https://media.giphy.com/media/3bqtLDeiDtwhq/giphy.gif',
        'https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif',
        'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif'
    ];
    
    const randomGif = hugGifs[Math.floor(Math.random() * hugGifs.length)];
    
    const embed = new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle('🤗 Hug!')
        .setDescription(`${interaction.user} hugged ${user}!`)
        .setImage(randomGif)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to hug', type: 'user', required: true }
]);

createCommand('pat', 'Pat someone', 'fun', async (interaction) => {
    const user = interaction.options.getUser('user');
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('👋 Pat!')
        .setDescription(`${interaction.user} patted ${user}!`)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to pat', type: 'user', required: true }
]);

// =================
// MATH COMMANDS
// =================

createCommand('calculate', 'Calculate a math expression', 'utility', async (interaction) => {
    const expression = interaction.options.getString('expression');
    
    try {
        // Simple calculator - in production, use a proper math parser
        const result = eval(expression.replace(/[^0-9+\-*/.() ]/g, ''));
        
        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('🧮 Calculator')
            .addFields(
                { name: 'Expression', value: `\`${expression}\``, inline: true },
                { name: 'Result', value: `\`${result}\``, inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Invalid mathematical expression!', ephemeral: true });
    }
}, [
    { name: 'expression', description: 'Math expression to calculate', type: 'string', required: true }
]);

// =================
// COLOR COMMANDS
// =================

createCommand('color', 'View color information', 'utility', async (interaction) => {
    const color = interaction.options.getString('color');
    
    // Convert hex to decimal
    const hexColor = color.startsWith('#') ? color : `#${color}`;
    const decimalColor = parseInt(hexColor.replace('#', ''), 16);
    
    const embed = new EmbedBuilder()
        .setColor(decimalColor)
        .setTitle('🎨 Color Information')
        .addFields(
            { name: 'Hex', value: hexColor, inline: true },
            { name: 'Decimal', value: decimalColor.toString(), inline: true },
createCommand('color', 'View color information', 'utility', async (interaction) => {
    const color = interaction.options.getString('color');
    
    // Convert hex to decimal
    const hexColor = color.startsWith('#') ? color : `#${color}`;
    const decimalColor = parseInt(hexColor.replace('#', ''), 16);
    
    const r = (decimalColor >> 16) & 255;
    const g = (decimalColor >> 8) & 255;
    const b = decimalColor & 255;
    
    const embed = new EmbedBuilder()
        .setColor(decimalColor)
        .setTitle('🎨 Color Information')
        .addFields(
            { name: 'Hex', value: hexColor, inline: true },
            { name: 'Decimal', value: decimalColor.toString(), inline: true },
            { name: 'RGB', value: `${r}, ${g}, ${b}`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'color', description: 'Color in hex format', type: 'string', required: true }
]);

// =================
// RANDOM GENERATORS
// =================

createCommand('password', 'Generate a random password', 'utility', async (interaction) => {
    const length = interaction.options.getInteger('length') || 12;
    
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🔐 Password Generated')
        .setDescription(`\`\`\`${password}\`\`\``)
        .addFields({ name: 'Length', value: length.toString() })
        .setFooter({ text: 'Keep this password safe!' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}, [
    { name: 'length', description: 'Password length', type: 'integer', min: 6, max: 50 }
]);

// =================
// FINAL SETUP
// =================

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
});

// Login to Discord
client.login(config.token).catch(console.error);const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Bot Configuration - Uses Railway Environment Variables
const config = {
    token: process.env.DISCORD_TOKEN, // Set this in Railway environment variables
    prefix: process.env.PREFIX || '!',
    embedColor: 0x7289DA,
    owners: process.env.OWNER_IDS ? process.env.OWNER_IDS.split(',') : [], // Comma separated IDs
};

// Initialize client with all intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
    ]
});

// Data Storage (In production, use a proper database)
const data = {
    users: new Map(),
    guilds: new Map(),
    warnings: new Map(),
    economy: new Map(),
    levels: new Map(),
    automod: new Map(),
    tickets: new Map(),
    giveaways: new Map(),
    reminders: new Map(),
    polls: new Map(),
    suggestions: new Map(),
};

// Utility Functions
const utils = {
    formatTime: (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    },
    
    generateId: () => Math.random().toString(36).substring(2, 15),
    
    getUserData: (userId) => {
        if (!data.users.has(userId)) {
            data.users.set(userId, {
                balance: 1000,
                bank: 0,
                level: 1,
                xp: 0,
                daily: 0,
                work: 0,
                reputation: 0,
                profile: {
                    color: '#7289DA',
                    description: 'No description set.',
                }
            });
        }
        return data.users.get(userId);
    },
    
    getGuildData: (guildId) => {
        if (!data.guilds.has(guildId)) {
            data.guilds.set(guildId, {
                prefix: config.prefix,
                welcomeChannel: null,
                leaveChannel: null,
                logChannel: null,
                muteRole: null,
                automod: {
                    enabled: false,
                    antiSpam: false,
                    badWords: [],
                    maxMentions: 5,
                    maxLines: 10,
                },
                leveling: {
                    enabled: true,
                    channel: null,
                    roles: new Map(),
                },
                economy: {
                    enabled: true,
                    dailyAmount: 100,
                    workCooldown: 3600000, // 1 hour
                }
            });
        }
        return data.guilds.get(guildId);
    }
};

// Commands Map
const commands = new Map();

// Slash Commands Array
const slashCommands = [];

// Command Handler Function
function createCommand(name, description, category, execute, options = [], permissions = null) {
    const command = {
        name,
        description,
        category,
        execute,
        options,
        permissions
    };
    
    commands.set(name, command);
    
    const slashCommand = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description);
    
    if (permissions) {
        slashCommand.setDefaultMemberPermissions(permissions);
    }
    
    options.forEach(option => {
        switch (option.type) {
            case 'string':
                slashCommand.addStringOption(opt => {
                    opt.setName(option.name).setDescription(option.description);
                    if (option.required) opt.setRequired(true);
                    if (option.choices) opt.addChoices(...option.choices);
                    return opt;
                });
                break;
            case 'user':
                slashCommand.addUserOption(opt => {
                    opt.setName(option.name).setDescription(option.description);
                    if (option.required) opt.setRequired(true);
                    return opt;
                });
                break;
            case 'channel':
                slashCommand.addChannelOption(opt => {
                    opt.setName(option.name).setDescription(option.description);
                    if (option.required) opt.setRequired(true);
                    return opt;
                });
                break;
            case 'role':
                slashCommand.addRoleOption(opt => {
                    opt.setName(option.name).setDescription(option.description);
                    if (option.required) opt.setRequired(true);
                    return opt;
                });
                break;
            case 'integer':
                slashCommand.addIntegerOption(opt => {
                    opt.setName(option.name).setDescription(option.description);
                    if (option.required) opt.setRequired(true);
                    if (option.min) opt.setMinValue(option.min);
                    if (option.max) opt.setMaxValue(option.max);
                    return opt;
                });
                break;
            case 'number':
                slashCommand.addNumberOption(opt => {
                    opt.setName(option.name).setDescription(option.description);
                    if (option.required) opt.setRequired(true);
                    return opt;
                });
                break;
            case 'boolean':
                slashCommand.addBooleanOption(opt => {
                    opt.setName(option.name).setDescription(option.description);
                    if (option.required) opt.setRequired(true);
                    return opt;
                });
                break;
        }
    });
    
    slashCommands.push(slashCommand.toJSON());
}

// =================
// MODERATION COMMANDS
// =================

createCommand('ban', 'Ban a member from the server', 'moderation', async (interaction) => {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
        await interaction.guild.members.ban(user, { reason });
        
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Member Banned')
            .setDescription(`**${user.tag}** has been banned.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
        // Log to modlog if set
        const guildData = utils.getGuildData(interaction.guild.id);
        if (guildData.logChannel) {
            const logChannel = interaction.guild.channels.cache.get(guildData.logChannel);
            if (logChannel) {
                await logChannel.send({ embeds: [embed] });
            }
        }
    } catch (error) {
        await interaction.reply({ content: 'Failed to ban user. Make sure I have permission and the user is bannable.', ephemeral: true });
    }
}, [
    { name: 'user', description: 'User to ban', type: 'user', required: true },
    { name: 'reason', description: 'Reason for ban', type: 'string' }
], PermissionFlagsBits.BanMembers);

createCommand('unban', 'Unban a user from the server', 'moderation', async (interaction) => {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
        await interaction.guild.members.unban(userId, reason);
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Member Unbanned')
            .setDescription(`User with ID **${userId}** has been unbanned.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to unban user. Make sure the ID is correct.', ephemeral: true });
    }
}, [
    { name: 'userid', description: 'User ID to unban', type: 'string', required: true },
    { name: 'reason', description: 'Reason for unban', type: 'string' }
], PermissionFlagsBits.BanMembers);

createCommand('kick', 'Kick a member from the server', 'moderation', async (interaction) => {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    if (!member.kickable) {
        return interaction.reply({ content: 'I cannot kick this member.', ephemeral: true });
    }
    
    try {
        await member.kick(reason);
        
        const embed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('Member Kicked')
            .setDescription(`**${member.user.tag}** has been kicked.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to kick user.', ephemeral: true });
    }
}, [
    { name: 'user', description: 'User to kick', type: 'user', required: true },
    { name: 'reason', description: 'Reason for kick', type: 'string' }
], PermissionFlagsBits.KickMembers);

createCommand('mute', 'Mute a member', 'moderation', async (interaction) => {
    const member = interaction.options.getMember('user');
    const duration = interaction.options.getInteger('duration') || 60;
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
        await member.timeout(duration * 60 * 1000, reason);
        
        const embed = new EmbedBuilder()
            .setColor(0x808080)
            .setTitle('Member Muted')
            .setDescription(`**${member.user.tag}** has been muted for ${duration} minutes.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to mute user.', ephemeral: true });
    }
}, [
    { name: 'user', description: 'User to mute', type: 'user', required: true },
    { name: 'duration', description: 'Duration in minutes', type: 'integer', min: 1, max: 40320 },
    { name: 'reason', description: 'Reason for mute', type: 'string' }
], PermissionFlagsBits.ModerateMembers);

createCommand('unmute', 'Unmute a member', 'moderation', async (interaction) => {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
        await member.timeout(null, reason);
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Member Unmuted')
            .setDescription(`**${member.user.tag}** has been unmuted.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({ content: 'Failed to unmute user.', ephemeral: true });
    }
}, [
    { name: 'user', description: 'User to unmute', type: 'user', required: true },
    { name: 'reason', description: 'Reason for unmute', type: 'string' }
], PermissionFlagsBits.ModerateMembers);

createCommand('warn', 'Warn a member', 'moderation', async (interaction) => {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    if (!data.warnings.has(interaction.guild.id)) {
        data.warnings.set(interaction.guild.id, new Map());
    }
    
    const guildWarnings = data.warnings.get(interaction.guild.id);
    if (!guildWarnings.has(user.id)) {
        guildWarnings.set(user.id, []);
    }
    
    const userWarnings = guildWarnings.get(user.id);
    userWarnings.push({
        id: utils.generateId(),
        reason,
        moderator: interaction.user.id,
        timestamp: Date.now()
    });
    
    const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle('Member Warned')
        .setDescription(`**${user.tag}** has been warned.`)
        .addFields(
            { name: 'Reason', value: reason },
            { name: 'Total Warnings', value: userWarnings.length.toString() }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to warn', type: 'user', required: true },
    { name: 'reason', description: 'Reason for warning', type: 'string', required: true }
], PermissionFlagsBits.ModerateMembers);

createCommand('warnings', 'View warnings for a member', 'moderation', async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    
    const guildWarnings = data.warnings.get(interaction.guild.id);
    if (!guildWarnings || !guildWarnings.has(user.id)) {
        return interaction.reply({ content: `${user.tag} has no warnings.`, ephemeral: true });
    }
    
    const userWarnings = guildWarnings.get(user.id);
    const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle(`Warnings for ${user.tag}`)
        .setDescription(`Total warnings: ${userWarnings.length}`)
        .setTimestamp();
    
    userWarnings.slice(0, 10).forEach((warning, index) => {
        embed.addFields({
            name: `Warning ${index + 1}`,
            value: `**Reason:** ${warning.reason}\n**Date:** <t:${Math.floor(warning.timestamp / 1000)}:R>`,
            inline: true
        });
    });
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to check warnings for', type: 'user' }
]);

createCommand('clear', 'Clear messages in a channel', 'moderation', async (interaction) => {
    const amount = interaction.options.getInteger('amount');
    const user = interaction.options.getUser('user');
    
    if (amount < 1 || amount > 100) {
        return interaction.reply({ content: 'Amount must be between 1 and 100.', ephemeral: true });
    }
    
    try {
        const messages = await interaction.channel.messages.fetch({ limit: amount });
        let messagesToDelete = messages;
        
        if (user) {
            messagesToDelete = messages.filter(msg => msg.author.id === user.id);
        }
        
        await interaction.channel.bulkDelete(messagesToDelete, true);
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Messages Cleared')
            .setDescription(`Successfully deleted ${messagesToDelete.size} messages${user ? ` from ${user.tag}` : ''}.`)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        await interaction.reply({ content: 'Failed to delete messages. Messages older than 14 days cannot be bulk deleted.', ephemeral: true });
    }
}, [
    { name: 'amount', description: 'Number of messages to clear (1-100)', type: 'integer', required: true, min: 1, max: 100 },
    { name: 'user', description: 'Clear messages only from this user', type: 'user' }
], PermissionFlagsBits.ManageMessages);

// =================
// ECONOMY COMMANDS
// =================

createCommand('balance', 'Check your balance', 'economy', async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const userData = utils.getUserData(user.id);
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`${user.username}'s Balance`)
        .addFields(
            { name: '💰 Wallet', value: `$${userData.balance.toLocaleString()}`, inline: true },
            { name: '🏦 Bank', value: `$${userData.bank.toLocaleString()}`, inline: true },
            { name: '💎 Net Worth', value: `$${(userData.balance + userData.bank).toLocaleString()}`, inline: true }
        )
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to check balance for', type: 'user' }
]);

createCommand('daily', 'Claim your daily reward', 'economy', async (interaction) => {
    const userData = utils.getUserData(interaction.user.id);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours
    
    if (userData.daily && now - userData.daily < cooldown) {
        const remaining = cooldown - (now - userData.daily);
        return interaction.reply({ 
            content: `You already claimed your daily reward! Next daily in ${utils.formatTime(remaining)}.`, 
            ephemeral: true 
        });
    }
    
    const amount = 100 + Math.floor(Math.random() * 400); // $100-500
    userData.balance += amount;
    userData.daily = now;
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Daily Reward Claimed!')
        .setDescription(`You received **${amount}**! 💰`)
        .addFields({ name: 'New Balance', value: `${userData.balance.toLocaleString()}` })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('work', 'Work to earn money', 'economy', async (interaction) => {
    const userData = utils.getUserData(interaction.user.id);
    const now = Date.now();
    const cooldown = 60 * 60 * 1000; // 1 hour
    
    if (userData.work && now - userData.work < cooldown) {
        const remaining = cooldown - (now - userData.work);
        return interaction.reply({ 
            content: `You're tired from working! Rest for ${utils.formatTime(remaining)}.`, 
            ephemeral: true 
        });
    }
    
    const jobs = [
        { name: 'Pizza Delivery', min: 50, max: 200 },
        { name: 'Uber Driver', min: 75, max: 250 },
        { name: 'Dog Walker', min: 30, max: 150 },
        { name: 'Freelance Coding', min: 200, max: 500 },
        { name: 'Street Performer', min: 10, max: 300 },
        { name: 'Lawn Mowing', min: 80, max: 180 },
    ];
    
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const amount = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
    
    userData.balance += amount;
    userData.work = now;
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Work Complete!')
        .setDescription(`You worked as a **${job.name}** and earned **${amount}**! 💼`)
        .addFields({ name: 'New Balance', value: `${userData.balance.toLocaleString()}` })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('deposit', 'Deposit money to your bank', 'economy', async (interaction) => {
    const amount = interaction.options.getInteger('amount');
    const userData = utils.getUserData(interaction.user.id);
    
    if (amount === -1) { // All
        const depositAmount = userData.balance;
        userData.bank += depositAmount;
        userData.balance = 0;
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Deposit Successful!')
            .setDescription(`Deposited **${depositAmount.toLocaleString()}** to your bank! 🏦`)
            .addFields(
                { name: 'Wallet', value: `${userData.balance.toLocaleString()}`, inline: true },
                { name: 'Bank', value: `${userData.bank.toLocaleString()}`, inline: true }
            )
            .setTimestamp();
        
        return interaction.reply({ embeds: [embed] });
    }
    
    if (amount > userData.balance) {
        return interaction.reply({ content: 'You don\'t have that much money in your wallet!', ephemeral: true });
    }
    
    userData.balance -= amount;
    userData.bank += amount;
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Deposit Successful!')
        .setDescription(`Deposited **${amount.toLocaleString()}** to your bank! 🏦`)
        .addFields(
            { name: 'Wallet', value: `${userData.balance.toLocaleString()}`, inline: true },
            { name: 'Bank', value: `${userData.bank.toLocaleString()}`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'amount', description: 'Amount to deposit (use -1 for all)', type: 'integer', required: true }
]);

createCommand('withdraw', 'Withdraw money from your bank', 'economy', async (interaction) => {
    const amount = interaction.options.getInteger('amount');
    const userData = utils.getUserData(interaction.user.id);
    
    if (amount === -1) { // All
        const withdrawAmount = userData.bank;
        userData.balance += withdrawAmount;
        userData.bank = 0;
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Withdrawal Successful!')
            .setDescription(`Withdrew **${withdrawAmount.toLocaleString()}** from your bank! 💰`)
            .addFields(
                { name: 'Wallet', value: `${userData.balance.toLocaleString()}`, inline: true },
                { name: 'Bank', value: `${userData.bank.toLocaleString()}`, inline: true }
            )
            .setTimestamp();
        
        return interaction.reply({ embeds: [embed] });
    }
    
    if (amount > userData.bank) {
        return interaction.reply({ content: 'You don\'t have that much money in your bank!', ephemeral: true });
    }
    
    userData.bank -= amount;
    userData.balance += amount;
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Withdrawal Successful!')
        .setDescription(`Withdrew **${amount.toLocaleString()}** from your bank! 💰`)
        .addFields(
            { name: 'Wallet', value: `${userData.balance.toLocaleString()}`, inline: true },
            { name: 'Bank', value: `${userData.bank.toLocaleString()}`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'amount', description: 'Amount to withdraw (use -1 for all)', type: 'integer', required: true }
]);

createCommand('pay', 'Pay money to another user', 'economy', async (interaction) => {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    
    if (user.id === interaction.user.id) {
        return interaction.reply({ content: 'You cannot pay yourself!', ephemeral: true });
    }
    
    const userData = utils.getUserData(interaction.user.id);
    const targetData = utils.getUserData(user.id);
    
    if (amount > userData.balance) {
        return interaction.reply({ content: 'You don\'t have that much money!', ephemeral: true });
    }
    
    userData.balance -= amount;
    targetData.balance += amount;
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Payment Successful!')
        .setDescription(`You paid **${amount.toLocaleString()}** to ${user.tag}! 💸`)
        .addFields({ name: 'Your New Balance', value: `${userData.balance.toLocaleString()}` })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to pay', type: 'user', required: true },
    { name: 'amount', description: 'Amount to pay', type: 'integer', required: true, min: 1 }
]);

createCommand('gamble', 'Gamble your money', 'economy', async (interaction) => {
    const amount = interaction.options.getInteger('amount');
    const userData = utils.getUserData(interaction.user.id);
    
    if (amount > userData.balance) {
        return interaction.reply({ content: 'You don\'t have that much money!', ephemeral: true });
    }
    
    const win = Math.random() < 0.47; // 47% chance to win
    let winAmount = 0;
    
    if (win) {
        winAmount = Math.floor(amount * (1.5 + Math.random())); // 1.5x to 2.5x multiplier
        userData.balance += winAmount;
    } else {
        userData.balance -= amount;
        winAmount = -amount;
    }
    
    const embed = new EmbedBuilder()
        .setColor(win ? 0x00FF00 : 0xFF0000)
        .setTitle(win ? '🎉 You Won!' : '💸 You Lost!')
        .setDescription(win ? 
            `You gambled **${amount.toLocaleString()}** and won **${winAmount.toLocaleString()}**!` :
            `You gambled **${amount.toLocaleString()}** and lost it all!`)
        .addFields({ name: 'New Balance', value: `${userData.balance.toLocaleString()}` })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'amount', description: 'Amount to gamble', type: 'integer', required: true, min: 1 }
]);

createCommand('rob', 'Attempt to rob another user', 'economy', async (interaction) => {
    const user = interaction.options.getUser('user');
    const userData = utils.getUserData(interaction.user.id);
    const targetData = utils.getUserData(user.id);
    
    if (user.id === interaction.user.id) {
        return interaction.reply({ content: 'You cannot rob yourself!', ephemeral: true });
    }
    
    if (targetData.balance < 100) {
        return interaction.reply({ content: 'That user doesn\'t have enough money to rob!', ephemeral: true });
    }
    
    if (userData.balance < 50) {
        return interaction.reply({ content: 'You need at least $50 to attempt a robbery!', ephemeral: true });
    }
    
    const success = Math.random() < 0.3; // 30% success rate
    
    if (success) {
        const stolenAmount = Math.floor(targetData.balance * (0.1 + Math.random() * 0.2)); // 10-30%
        userData.balance += stolenAmount;
        targetData.balance -= stolenAmount;
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Robbery Successful!')
            .setDescription(`You successfully robbed **${stolenAmount.toLocaleString()}** from ${user.tag}! 💰`)
            .addFields({ name: 'Your New Balance', value: `${userData.balance.toLocaleString()}` })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } else {
        const fine = 50;
        userData.balance -= fine;
        
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Robbery Failed!')
            .setDescription(`You got caught and paid a **${fine}** fine! 🚓`)
            .addFields({ name: 'Your New Balance', value: `${userData.balance.toLocaleString()}` })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
}, [
    { name: 'user', description: 'User to rob', type: 'user', required: true }
]);

// =================
// LEVELING COMMANDS
// =================

createCommand('rank', 'Check your or someone\'s rank', 'leveling', async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const userData = utils.getUserData(user.id);
    
    const xpNeeded = userData.level * 100;
    const progress = (userData.xp / xpNeeded) * 100;
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle(`${user.username}'s Rank`)
        .addFields(
            { name: '📊 Level', value: userData.level.toString(), inline: true },
            { name: '⭐ XP', value: `${userData.xp}/${xpNeeded}`, inline: true },
            { name: '📈 Progress', value: `${Math.floor(progress)}%`, inline: true }
        )
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to check rank for', type: 'user' }
]);

createCommand('leaderboard', 'View the server leaderboard', 'leveling', async (interaction) => {
    const type = interaction.options.getString('type') || 'level';
    
    let sortedUsers;
    if (type === 'level') {
        sortedUsers = Array.from(data.users.entries())
            .sort(([,a], [,b]) => b.level - a.level || b.xp - a.xp)
            .slice(0, 10);
    } else if (type === 'money') {
        sortedUsers = Array.from(data.users.entries())
            .sort(([,a], [,b]) => (b.balance + b.bank) - (a.balance + a.bank))
            .slice(0, 10);
    }
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle(`🏆 ${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard`)
        .setTimestamp();
    
    let description = '';
    for (let i = 0; i < sortedUsers.length; i++) {
        const [userId, userData] = sortedUsers[i];
        const user = await client.users.fetch(userId).catch(() => null);
        if (!user) continue;
        
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[i] || `**${i + 1}.**`;
        
        if (type === 'level') {
            description += `${medal} ${user.username} - Level ${userData.level} (${userData.xp} XP)\n`;
        } else {
            const netWorth = userData.balance + userData.bank;
            description += `${medal} ${user.username} - ${netWorth.toLocaleString()}\n`;
        }
    }
    
    embed.setDescription(description);
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'type', description: 'Leaderboard type', type: 'string', choices: [
        { name: 'Level', value: 'level' },
        { name: 'Money', value: 'money' }
    ] }
]);

// =================
// FUN COMMANDS
// =================

createCommand('8ball', 'Ask the magic 8ball a question', 'fun', async (interaction) => {
    const question = interaction.options.getString('question');
    
    const responses = [
        'It is certain.', 'It is decidedly so.', 'Without a doubt.',
        'Yes definitely.', 'You may rely on it.', 'As I see it, yes.',
        'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
        'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.',
        'Cannot predict now.', 'Concentrate and ask again.',
        'Don\'t count on it.', 'My reply is no.', 'My sources say no.',
        'Outlook not so good.', 'Very doubtful.'
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🎱 Magic 8-Ball')
        .addFields(
            { name: 'Question', value: question },
            { name: 'Answer', value: response }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'question', description: 'Your question for the 8ball', type: 'string', required: true }
]);

createCommand('coinflip', 'Flip a coin', 'fun', async (interaction) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '🪙' : '🔘';
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('Coin Flip')
        .setDescription(`${emoji} **${result}**!`)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('dice', 'Roll a dice', 'fun', async (interaction) => {
    const sides = interaction.options.getInteger('sides') || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🎲 Dice Roll')
        .setDescription(`You rolled a **${result}** on a ${sides}-sided dice!`)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'sides', description: 'Number of sides on the dice', type: 'integer', min: 2, max: 100 }
]);

createCommand('rps', 'Play rock paper scissors', 'fun', async (interaction) => {
    const userChoice = interaction.options.getString('choice');
    const choices = ['rock', 'paper', 'scissors'];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    
    let result;
    if (userChoice === botChoice) {
        result = 'It\'s a tie!';
    } else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
    ) {
        result = 'You win! 🎉';
    } else {
        result = 'You lose! 😔';
    }
    
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('Rock Paper Scissors')
        .addFields(
            { name: 'You chose', value: `${emojis[userChoice]} ${userChoice}`, inline: true },
            { name: 'I chose', value: `${emojis[botChoice]} ${botChoice}`, inline: true },
            { name: 'Result', value: result, inline: false }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'choice', description: 'Your choice', type: 'string', required: true, choices: [
        { name: 'Rock', value: 'rock' },
        { name: 'Paper', value: 'paper' },
        { name: 'Scissors', value: 'scissors' }
    ] }
]);

createCommand('joke', 'Get a random joke', 'fun', async (interaction) => {
    const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? He was outstanding in his field!",
        "Why don't eggs tell jokes? They'd crack each other up!",
        "What do you call a fake noodle? An impasta!",
        "Why did the math book look so sad? Because of all of its problems!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why can't a bicycle stand up by itself? It's two tired!",
        "What do you call a sleeping bull? A bulldozer!",
        "Why did the coffee file a police report? It got mugged!",
        "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
    ];
    
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('😂 Random Joke')
        .setDescription(joke)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('meme', 'Get a random meme', 'fun', async (interaction) => {
    const memes = [
        'https://i.imgur.com/QkCqHzV.jpg',
        'https://i.imgur.com/3w8tIHF.jpg',
        'https://i.imgur.com/kQJwvYy.jpg',
        'https://i.imgur.com/FcYX1vG.jpg',
        'https://i.imgur.com/wG0N2y7.jpg'
    ];
    
    const meme = memes[Math.floor(Math.random() * memes.length)];
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🤣 Random Meme')
        .setImage(meme)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

// =================
// UTILITY COMMANDS
// =================

createCommand('userinfo', 'Get information about a user', 'utility', async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle(`User Info - ${user.tag}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: 'ID', value: user.id, inline: true },
            { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true }
        )
        .setTimestamp();
    
    if (member) {
        embed.addFields(
            { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: 'Roles', value: member.roles.cache.size.toString(), inline: true },
            { name: 'Nickname', value: member.nickname || 'None', inline: true }
        );
    }
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to get info about', type: 'user' }
]);

createCommand('serverinfo', 'Get information about the server', 'utility', async (interaction) => {
    const guild = interaction.guild;
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle(`Server Info - ${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
            { name: 'ID', value: guild.id, inline: true },
            { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
            { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Members', value: guild.memberCount.toString(), inline: true },
            { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
            { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
            { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true },
            { name: 'Boosts', value: guild.premiumSubscriptionCount.toString(), inline: true },
            { name: 'Verification', value: guild.verificationLevel.toString(), inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('avatar', 'Get a user\'s avatar', 'utility', async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle(`${user.username}'s Avatar`)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to get avatar of', type: 'user' }
]);

createCommand('ping', 'Check the bot\'s latency', 'utility', async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🏓 Pong!')
        .addFields(
            { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true },
            { name: 'Bot Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('invite', 'Get the bot\'s invite link', 'utility', async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('Invite Me!')
        .setDescription(`[Click here to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

// =================
// ADMIN/CONFIG COMMANDS
// =================

createCommand('setup', 'Setup the bot for your server', 'admin', async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🛠️ Bot Setup')
        .setDescription('Use the following commands to configure the bot:')
        .addFields(
            { name: '/config welcome', value: 'Set welcome channel', inline: true },
            { name: '/config leave', value: 'Set leave channel', inline: true },
            { name: '/config logs', value: 'Set log channel', inline: true },
            { name: '/config prefix', value: 'Change prefix', inline: true },
            { name: '/automod setup', value: 'Setup automoderation', inline: true },
            { name: '/leveling setup', value: 'Setup leveling system', inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [], PermissionFlagsBits.ManageGuild);

createCommand('config', 'Configure bot settings', 'admin', async (interaction) => {
    const setting = interaction.options.getString('setting');
    const value = interaction.options.getString('value') || interaction.options.getChannel('channel');
    
    const guildData = utils.getGuildData(interaction.guild.id);
    
    switch (setting) {
        case 'prefix':
            guildData.prefix = value;
            await interaction.reply({ content: `Prefix set to \`${value}\``, ephemeral: true });
            break;
        case 'welcome':
            guildData.welcomeChannel = value.id;
            await interaction.reply({ content: `Welcome channel set to ${value}`, ephemeral: true });
            break;
        case 'leave':
            guildData.leaveChannel = value.id;
            await interaction.reply({ content: `Leave channel set to ${value}`, ephemeral: true });
            break;
        case 'logs':
            guildData.logChannel = value.id;
            await interaction.reply({ content: `Log channel set to ${value}`, ephemeral: true });
            break;
    }
}, [
    { name: 'setting', description: 'Setting to configure', type: 'string', required: true, choices: [
        { name: 'Prefix', value: 'prefix' },
        { name: 'Welcome Channel', value: 'welcome' },
        { name: 'Leave Channel', value: 'leave' },
        { name: 'Log Channel', value: 'logs' }
    ] },
    { name: 'value', description: 'New value (for prefix)', type: 'string' },
    { name: 'channel', description: 'Channel to set', type: 'channel' }
], PermissionFlagsBits.ManageGuild);

// =================
// MORE FUN COMMANDS
// =================

createCommand('ascii', 'Convert text to ASCII art', 'fun', async (interaction) => {
    const text = interaction.options.getString('text');
    
    // Simple ASCII art conversion
    const asciiText = text.toUpperCase().split('').map(char => {
        if (char === ' ') return '   ';
        return `[${char}]`;
    }).join(' ');
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('ASCII Art')
        .setDescription(`\`\`\`${asciiText}\`\`\``)
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'text', description: 'Text to convert to ASCII', type: 'string', required: true }
]);

createCommand('reverse', 'Reverse text', 'fun', async (interaction) => {
    const text = interaction.options.getString('text');
    const reversed = text.split('').reverse().join('');
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('Reversed Text')
        .addFields(
            { name: 'Original', value: text },
            { name: 'Reversed', value: reversed }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'text', description: 'Text to reverse', type: 'string', required: true }
]);

createCommand('choose', 'Choose between multiple options', 'fun', async (interaction) => {
    const options = interaction.options.getString('options').split(',').map(opt => opt.trim());
    
    if (options.length < 2) {
        return interaction.reply({ content: 'Please provide at least 2 options separated by commas!', ephemeral: true });
    }
    
    const choice = options[Math.floor(Math.random() * options.length)];
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🎯 Choice Made!')
        .setDescription(`I choose: **${choice}**`)
        .addFields({ name: 'Options', value: options.join(', ') })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'options', description: 'Options separated by commas', type: 'string', required: true }
]);

createCommand('rate', 'Rate something out of 10', 'fun', async (interaction) => {
    const thing = interaction.options.getString('thing');
    const rating = Math.floor(Math.random() * 10) + 1;
    
    const stars = '⭐'.repeat(Math.floor(rating / 2)) + (rating % 2 ? '✨' : '');
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('📊 Rating')
        .setDescription(`I rate **${thing}** ${rating}/10!`)
        .addFields({ name: 'Stars', value: stars || '💫' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'thing', description: 'Thing to rate', type: 'string', required: true }
]);

createCommand('ship', 'Ship two users together', 'fun', async (interaction) => {
    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2');
    
    // Create ship name
    const name1 = user1.username.slice(0, Math.ceil(user1.username.length / 2));
    const name2 = user2.username.slice(Math.floor(user2.username.length / 2));
    const shipName = name1 + name2;
    
    // Generate compatibility percentage
    const compatibility = Math.floor(Math.random() * 101);
    
    let hearts = '';
    if (compatibility >= 80) hearts = '💖💖💖💖💖';
    else if (compatibility >= 60) hearts = '💕💕💕💕';
    else if (compatibility >= 40) hearts = '💗💗💗';
    else if (compatibility >= 20) hearts = '💔💔';
    else hearts = '💔';
    
    const embed = new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle('💘 Shipping Results')
        .setDescription(`${user1.username} + ${user2.username} = **${shipName}**`)
        .addFields(
            { name: 'Compatibility', value: `${compatibility}%`, inline: true },
            { name: 'Rating', value: hearts, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user1', description: 'First user', type: 'user', required: true },
    { name: 'user2', description: 'Second user', type: 'user', required: true }
]);

// =================
// TICKET SYSTEM
// =================

createCommand('ticket', 'Create a support ticket', 'utility', async (interaction) => {
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    // Create ticket channel
    const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        type: 0, // Text channel
        parent: null, // You can set a category ID here
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: ['ViewChannel'],
            },
            {
                id: interaction.user.id,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
            },
        ],
    });
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🎫 Ticket Created')
        .setDescription(`Support ticket created: ${ticketChannel}`)
        .addFields({ name: 'Reason', value: reason })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
    // Send welcome message in ticket channel
    const welcomeEmbed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('Support Ticket')
        .setDescription(`Hello ${interaction.user}, thank you for creating a ticket!`)
        .addFields({ name: 'Reason', value: reason })
        .setTimestamp();
    
    const closeButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🗑️')
        );
    
    await ticketChannel.send({ embeds: [welcomeEmbed], components: [closeButton] });
}, [
    { name: 'reason', description: 'Reason for creating ticket', type: 'string' }
]);

// =================
// GIVEAWAY SYSTEM
// =================

createCommand('giveaway', 'Start a giveaway', 'admin', async (interaction) => {
    const duration = interaction.options.getInteger('duration'); // in minutes
    const winners = interaction.options.getInteger('winners') || 1;
    const prize = interaction.options.getString('prize');
    
    const endTime = Date.now() + (duration * 60 * 1000);
    
    const embed = new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle('🎉 GIVEAWAY 🎉')
        .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endTime / 1000)}:R>`)
        .addFields({ name: 'How to Enter', value: 'React with 🎉 to enter!' })
        .setTimestamp(endTime);
    
    const giveawayMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
    await giveawayMessage.react('🎉');
    
    // Store giveaway data
    data.giveaways.set(giveawayMessage.id, {
        prize,
        winners,
        endTime,
        channelId: interaction.channel.id,
        hostId: interaction.user.id
    });
    
    // Set timeout to end giveaway
    setTimeout(async () => {
        try {
            const updatedMessage = await interaction.channel.messages.fetch(giveawayMessage.id);
            const reaction = updatedMessage.reactions.cache.get('🎉');
            
            if (!reaction) return;
            
            const users = await reaction.users.fetch();
            const participants = users.filter(user => !user.bot);
            
            if (participants.size === 0) {
                const noWinnerEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🎉 Giveaway Ended')
                    .setDescription(`**Prize:** ${prize}\n**Winner:** No valid entries`)
                    .setTimestamp();
                
                await updatedMessage.edit({ embeds: [noWinnerEmbed] });
                return;
            }
            
            const winnerArray = participants.random(Math.min(winners, participants.size));
            const winnerMentions = Array.isArray(winnerArray) ? 
                winnerArray.map(user => user.toString()).join(', ') : 
                winnerArray.toString();
            
            const winnerEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🎉 Giveaway Ended')
                .setDescription(`**Prize:** ${prize}\n**Winner(s):** ${winnerMentions}`)
                .setTimestamp();
            
            await updatedMessage.edit({ embeds: [winnerEmbed] });
            await interaction.followUp({ content: `🎉 Congratulations ${winnerMentions}! You won **${prize}**!` });
            
            data.giveaways.delete(giveawayMessage.id);
        } catch (error) {
            console.error('Giveaway error:', error);
        }
    }, duration * 60 * 1000);
}, [
    { name: 'duration', description: 'Duration in minutes', type: 'integer', required: true, min: 1 },
    { name: 'prize', description: 'Giveaway prize', type: 'string', required: true },
    { name: 'winners', description: 'Number of winners', type: 'integer', min: 1, max: 20 }
], PermissionFlagsBits.ManageMessages);

// =================
// POLL SYSTEM
// =================

createCommand('poll', 'Create a poll', 'utility', async (interaction) => {
    const question = interaction.options.getString('question');
    const options = interaction.options.getString('options').split(',').map(opt => opt.trim());
    
    if (options.length < 2 || options.length > 10) {
        return interaction.reply({ content: 'Please provide 2-10 options separated by commas!', ephemeral: true });
    }
    
    const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('📊 Poll')
        .setDescription(`**${question}**\n\n${options.map((opt, i) => `${reactions[i]} ${opt}`).join('\n')}`)
        .setTimestamp();
    
    const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
    
    // Add reactions
    for (let i = 0; i < options.length; i++) {
        await pollMessage.react(reactions[i]);
    }
}, [
    { name: 'question', description: 'Poll question', type: 'string', required: true },
    { name: 'options', description: 'Poll options separated by commas', type: 'string', required: true }
]);

// =================
// REMINDER SYSTEM
// =================

createCommand('remind', 'Set a reminder', 'utility', async (interaction) => {
    const time = interaction.options.getInteger('time'); // in minutes
    const reminder = interaction.options.getString('reminder');
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('⏰ Reminder Set')
        .setDescription(`I'll remind you about: **${reminder}**`)
        .addFields({ name: 'Time', value: `In ${time} minute(s)` })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
    setTimeout(async () => {
        try {
            const reminderEmbed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('⏰ Reminder')
                .setDescription(reminder)
                .setTimestamp();
            
            await interaction.user.send({ embeds: [reminderEmbed] }).catch(() => {
                interaction.followUp({ content: `⏰ Reminder: ${reminder}`, ephemeral: true });
            });
        } catch (error) {
            console.error('Reminder error:', error);
        }
    }, time * 60 * 1000);
}, [
    { name: 'time', description: 'Time in minutes', type: 'integer', required: true, min: 1, max: 10080 },
    { name: 'reminder', description: 'What to remind you about', type: 'string', required: true }
]);

// =================
// AUTOMOD COMMANDS
// =================

createCommand('automod', 'Configure automoderation', 'admin', async (interaction) => {
    const action = interaction.options.getString('action');
    const guildData = utils.getGuildData(interaction.guild.id);
    
    switch (action) {
        case 'enable':
            guildData.automod.enabled = true;
            await interaction.reply({ content: 'Automod enabled!', ephemeral: true });
            break;
        case 'disable':
            guildData.automod.enabled = false;
            await interaction.reply({ content: 'Automod disabled!', ephemeral: true });
            break;
        case 'antispam':
            guildData.automod.antiSpam = !guildData.automod.antiSpam;
            await interaction.reply({ content: `Anti-spam ${guildData.automod.antiSpam ? 'enabled' : 'disabled'}!`, ephemeral: true });
            break;
    }
}, [
    { name: 'action', description: 'Automod action', type: 'string', required: true, choices: [
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' },
        { name: 'Toggle Anti-Spam', value: 'antispam' }
    ] }
], PermissionFlagsBits.ManageGuild);

// =================
// MUSIC COMMANDS (Basic)
// =================

createCommand('play', 'Play music (placeholder)', 'music', async (interaction) => {
    await interaction.reply({ content: '🎵 Music feature coming soon! This would require additional dependencies like @discordjs/voice.', ephemeral: true });
}, [
    { name: 'query', description: 'Song to play', type: 'string', required: true }
]);

createCommand('skip', 'Skip current song', 'music', async (interaction) => {
    await interaction.reply({ content: '⏭️ Song skipped! (Music feature coming soon)', ephemeral: true });
});

createCommand('queue', 'View music queue', 'music', async (interaction) => {
    await interaction.reply({ content: '📜 Music queue is empty! (Music feature coming soon)', ephemeral: true });
});

// =================
// WEATHER COMMAND
// =================

createCommand('weather', 'Get weather information', 'utility', async (interaction) => {
    const location = interaction.options.getString('location');
    
    // This would require a weather API key in production
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle(`🌤️ Weather for ${location}`)
        .setDescription('Weather feature requires API integration!')
        .addFields(
            { name: 'Temperature', value: '72°F / 22°C', inline: true },
            { name: 'Condition', value: 'Partly Cloudy', inline: true },
            { name: 'Humidity', value: '65%', inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'location', description: 'Location to get weather for', type: 'string', required: true }
]);

// =================
// MORE ECONOMY COMMANDS
// =================

createCommand('shop', 'View the shop', 'economy', async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('🛒 Shop')
        .setDescription('Items available for purchase:')
        .addFields(
            { name: '🎭 VIP Role', value: '$5,000', inline: true },
            { name: '🌟 Custom Color', value: '$2,500', inline: true },
            { name: '💎 Premium Status', value: '$10,000', inline: true },
            { name: '🎪 Fun Pack', value: '$1,000', inline: true },
            { name: '🚀 Boost Badge', value: '$7,500', inline: true },
            { name: '👑 Crown Emoji', value: '$3,000', inline: true }
        )
        .setFooter({ text: 'Use /buy <item> to purchase' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
});

createCommand('buy', 'Buy an item from the shop', 'economy', async (interaction) => {
    const item = interaction.options.getString('item');
    const userData = utils.getUserData(interaction.user.id);
    
    const items = {
        'vip': { name: '🎭 VIP Role', price: 5000 },
        'color': { name: '🌟 Custom Color', price: 2500 },
        'premium': { name: '💎 Premium Status', price: 10000 },
        'funpack': { name: '🎪 Fun Pack', price: 1000 },
        'boost': { name: '🚀 Boost Badge', price: 7500 },
        'crown': { name: '👑 Crown Emoji', price: 3000 }
    };
    
    const shopItem = items[item];
    if (!shopItem) {
        return interaction.reply({ content: 'Item not found! Use `/shop` to see available items.', ephemeral: true });
    }
    
    if (userData.balance < shopItem.price) {
        return interaction.reply({ content: `You don't have enough money! You need ${shopItem.price.toLocaleString()}.`, ephemeral: true });
    }
    
    userData.balance -= shopItem.price;
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🛍️ Purchase Successful!')
        .setDescription(`You bought **${shopItem.name}** for **${shopItem.price.toLocaleString()}**!`)
        .addFields({ name: 'New Balance', value: `${userData.balance.toLocaleString()}` })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'item', description: 'Item to buy', type: 'string', required: true, choices: [
        { name: 'VIP Role', value: 'vip' },
        { name: 'Custom Color', value: 'color' },
        { name: 'Premium Status', value: 'premium' },
        { name: 'Fun Pack', value: 'funpack' },
        { name: 'Boost Badge', value: 'boost' },
        { name: 'Crown Emoji', value: 'crown' }
    ] }
]);

// =================
// REPUTATION SYSTEM
// =================

createCommand('rep', 'Give reputation to a user', 'social', async (interaction) => {
    const user = interaction.options.getUser('user');
    
    if (user.id === interaction.user.id) {
        return interaction.reply({ content: 'You cannot give reputation to yourself!', ephemeral: true });
    }
    
    const userData = utils.getUserData(interaction.user.id);
    const targetData = utils.getUserData(user.id);
    
    // Check cooldown (24 hours)
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    
    if (userData.lastRep && now - userData.lastRep < cooldown) {
        const remaining = cooldown - (now - userData.lastRep);
        return interaction.reply({ 
            content: `You can give reputation again in ${utils.formatTime(remaining)}!`, 
            ephemeral: true 
        });
    }
    
    targetData.reputation += 1;
    userData.lastRep = now;
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('⭐ Reputation Given!')
        .setDescription(`You gave +1 reputation to ${user.tag}!`)
        .addFields({ name: 'Their New Rep', value: targetData.reputation.toString() })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to give reputation to', type: 'user', required: true }
]);

createCommand('profile', 'View a user\'s profile', 'social', async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const userData = utils.getUserData(user.id);
    
    const embed = new EmbedBuilder()
        .setColor(userData.profile.color || 0x7289DA)
        .setTitle(`${user.username}'s Profile`)
        .setDescription(userData.profile.description)
        .addFields(
            { name: '📊 Level', value: userData.level.toString(), inline: true },
            { name: '⭐ Reputation', value: userData.reputation.toString(), inline: true },
            { name: '💰 Net Worth', value: `${(userData.balance + userData.bank).toLocaleString()}`, inline: true }
        )
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}, [
    { name: 'user', description: 'User to view profile of', type: 'user' }
]);

// =================
// EVENT HANDLERS
// =================

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Register slash commands
    try {
        console.log('Started refreshing application (/) commands.');
        await client.application.commands.set(slashCommands);
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    
    // Set bot status
    client.user.setActivity('with Discord users | /help', { type: 'PLAYING' });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = commands.get(interaction.commandName);
    if (!command) return;
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Error')
            .setDescription('An error occurred while executing this command!')
            .setTimestamp();
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
});

// Button interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId === 'close_ticket') {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('🗑️ Closing Ticket')
            .setDescription('This ticket will be deleted in 5 seconds...')
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
        setTimeout(async () => {
            try {
                await interaction.channel.delete();
            } catch (error) {
                console.error('Error deleting ticket channel:', error);
            }
        }, 5000);
    }
});

// Message create for XP system
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    
    const userData = utils.getUserData(message.author.id);
    const guildData = utils.getGuildData(message.guild.id);
    
    // XP System
    if (guildData.leveling.enabled) {
        const xpGain = Math.floor(Math.random() * 15) + 5; // 5-20 XP
        userData.xp += xpGain;
        
        const xpNeeded = userData.level * 100;
        if (userData.xp >= xpNeeded) {
            userData.level += 1;
            userData.xp = 0;
            
            const levelEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🎉 Level Up!')
                .setDescription(`${message.author} reached level **${userData.level}**!`)
                .setTimestamp();
            
            if (guildData.leveling.channel) {
                const channel = message.guild.channels.cache.get(guildData.leveling.channel);
                if (channel) {
                    channel.send({ embeds: [levelEmbed] });
                } else {
                    message.channel.send({ embeds: [levelEmbed] });
                }
            } else {
                message.channel.send({ embeds: [levelEmbed] });
            }
        }
    }
    
    // Automod
    if (guildData.automod.enabled) {
        // Anti-spam
        if (guildData.automod.antiSpam) {
            // Basic spam detection logic here
        }
        
        // Bad words filter
        const content = message.content.toLowerCase();
        const hasBadWord = guildData.automod.badWords.some(word => content.includes(word));
        
        if (hasBadWord) {
            try {
                await message.delete();
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('⚠️ Message Deleted')
                    .setDescription('Message contained inappropriate content.')
                    .setTimestamp();
                
                await message.channel.send({ embeds: [embed] }).then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
            } catch (error) {
                console.error('Automod error:', error);
            }
        }
    }
});

// Member join/leave events
client.on('guildMemberAdd', async (member) => {
    const guildData = utils.getGuildData(member.guild.id);
    
    if (guildData.welcomeChannel) {
        const channel = member.guild.channels.cache.get(guildData.welcomeChannel);
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('👋 Welcome!')
                .setDescription(`Welcome to **${member.guild.name}**, ${member}!`)
                .addFields(
                    { name: 'Member Count', value: member.guild.memberCount.toString(), inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();
            
            channel.send({ embeds: [embed] });
        }
    }
});

client.on('guildMemberRemove', async (member) => {
    const guildData = utils.getGuildData(member.guild.id);
    
    if (guildData.leaveChannel) {
        const channel = member.guild.channels.cache.get(guildData.leaveChannel);
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('👋 Goodbye!')
                .setDescription(`**${member.user.tag}** left the server.`)
                .addFields({ name: 'Member Count', value: member.guild.memberCount.toString(), inline: true })
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();
            
            channel.send({ embeds: [embed] });
        }
    }
});

// Help command
createCommand('help', 'Show all available commands', 'utility', async (interaction) => {
    const categories = {
        'moderation': '🔨 Moderation',
        'economy': '💰 Economy',
        'leveling': '📊 Leveling',
        'fun': '🎉 Fun',
        'utility': '🔧 Utility',
        'admin': '⚙️ Admin',
        'social': '👥 Social',
        'music': '🎵 Music'
    };
    
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('📚 Bot Commands')
        .setDescription('Here are all available commands:')
        .setTimestamp();
    
    for (const [category, emoji] of Object.entries(categories)) {
        const categoryCommands =
