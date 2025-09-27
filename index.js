const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = '.';
const DEV_LOG_CHANNEL_ID = '1414044553312468992';

// Register slash command for allcmds
const commands = [
    new SlashCommandBuilder()
        .setName('allcmds')
        .setDescription('Display all available bot commands (Staff Quick Reference)')
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'Doing things others cant.', type: 4 }],
        status: 'online'
    });
});

// Logging System
async function logCommandUsage(user, commandName, startTime) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const devChannel = client.channels.cache.get(DEV_LOG_CHANNEL_ID);
    if (devChannel) {
        const logEmbed = new EmbedBuilder()
            .setColor(responseTime > 3000 ? '#FF6B6B' : responseTime > 1000 ? '#FFE66D' : '#4ECDC4')
            .setTitle('📊 Command Usage Log')
            .addFields(
                {
                    name: '👤 User',
                    value: `${user.username}\n\`${user.id}\``,
                    inline: true
                },
                {
                    name: '⚡ Command',
                    value: `\`.${commandName}\``,
                    inline: true
                },
                {
                    name: '⏱️ Response Time',
                    value: `${responseTime}ms`,
                    inline: true
                },
                {
                    name: '📅 Timestamp',
                    value: `<t:${Math.floor(endTime/1000)}:F>`,
                    inline: false
                }
            )
            .setFooter({ 
                text: responseTime > 3000 ? '⚠️ SLOW RESPONSE' : responseTime > 1000 ? '⚡ MODERATE RESPONSE' : '✅ FAST RESPONSE' 
            })
            .setTimestamp();
            
        try {
            await devChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error('Failed to send log:', error);
        }
    }
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // Slash command for allcmds (ephemeral - only visible to staff member)
    if (commandName === 'allcmds') {
        const allCmdsEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🤖 All Bot Commands - Staff Guide & Usage')
            .setDescription('Complete command guide with usage instructions for support staff.')
            .addFields(
                {
                    name: '📋 Support Ticket Commands',
                    value: '`.supportticketeng/du/fr` - **When to use:** Customer opens ticket without providing required info\n**How to use:** Type command to display requirements list',
                    inline: false
                },
                {
                    name: '🔄 HWID Reset Commands', 
                    value: '`.hwidreseteng/du/fr` - **When to use:** Customer requests HWID reset\n**How to use:** Shows required documents and process',
                    inline: false
                },
                {
                    name: '✅ HWID Reset Done Commands',
                    value: '`.hwidresetdoneeng/du/fr` - **When to use:** After completing HWID reset\n**How to use:** Confirms reset completion to customer',
                    inline: false
                },
                {
                    name: '🎉 Ticket Closure Commands',
                    value: '`.ticketdoneeng/du/fr` - **When to use:** Issue resolved, closing ticket\n**How to use:** Thanks customer and announces closure',
                    inline: false
                },
                {
                    name: '📊 Status Commands',
                    value: '`.statuseng/du/fr` - **When to use:** Customer reports product not working\n**How to use:** Direct them to check status page first',
                    inline: false
                },
                {
                    name: '🔓 Unlocker Help Commands',
                    value: '`.unlockerhelpeng/du/fr` - **When to use:** Customer needs unlocker assistance\n**How to use:** Provides video tutorial and instructions',
                    inline: false
                },
                {
                    name: '⚙️ Setup Guide Commands',
                    value: '`.setupguideeng/du/fr` - **When to use:** Customer needs installation help\n**How to use:** Links to comprehensive setup documentation',
                    inline: false
                },
                {
                    name: '💰 Refund Commands',
                    value: '`.refundprocesseng/du/fr` - **When to use:** Customer asks about refunds\n**How to use:** Shows policy and process requirements',
                    inline: false
                },
                {
                    name: '⬆️ Escalation Commands',
                    value: '`.escalatedeng/du/fr` - **When to use:** Issue needs admin/HR attention\n**How to use:** Notifies customer ticket has been escalated',
                    inline: false
                },
                {
                    name: '⏳ Wait Commands',
                    value: '`.pleasewaiteng/du/fr` - **When to use:** No support staff currently active\n**How to use:** Asks customer to wait for assistance',
                    inline: false
                }
            )
            .setFooter({ text: 'Total: 31 Commands • Always use customer\'s language • Commands auto-delete your message' })
            .setTimestamp();

        await interaction.reply({ embeds: [allCmdsEmbed], ephemeral: true });
    }
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const startTime = Date.now();
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        // Support Ticket Commands
        if (command === 'supportticketeng') {
            const supportEmbed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('📋 Support Ticket Requirements')
                .setDescription('In order to assist you efficiently, please ensure you provide the following when opening a ticket:')
                .addFields(
                    {
                        name: '📹 Required Information',
                        value: '• A clear, high-quality video demonstrating the issue\n• A screenshot of the error message(s)\n• The name of the product you are using\n• The version of Windows you are running\n• A screenshot of each tab within your Windows Security settings',
                        inline: false
                    },
                    {
                        name: '🔧 Diagnostic Tool',
                        value: 'Run the following diagnostic setup file and provide a screenshot when prompted:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)',
                        inline: false
                    },
                    {
                        name: '⚠️ Important Notes',
                        value: '• Failure to follow these steps may result in delays or prevent us from providing effective support\n• Please ensure all requested information is submitted promptly\n• Once everything is submitted, kindly wait for an administrator to respond\n• Inactivity within the ticket may result in it being automatically closed',
                        inline: false
                    }
                )
                .setFooter({ text: 'Support Team • Please follow all requirements' })
                .setTimestamp();

            await message.delete();
            await message.channel.send({ embeds: [supportEmbed] });
            logCommandUsage(message.author, 'supportticketeng', startTime);
        }

        // Escalated Commands
        if (command === 'escalatedeng') {
            const escalatedEmbed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('⬆️ Ticket Escalated')
                .setDescription('Your support ticket has been escalated for specialized assistance.')
                .addFields(
                    {
                        name: '🔝 Escalation Notice',
                        value: 'Your ticket has been forwarded to our administrative team and HR department for further review and assistance.',
                        inline: false
                    },
                    {
                        name: '⏱️ Response Time',
                        value: 'Please allow additional time for our specialized team to review your case thoroughly. You will receive a response as soon as possible.',
                        inline: false
                    },
                    {
                        name: '📝 Important',
                        value: 'Please do not create additional tickets for this issue. Our team will contact you through this existing ticket.',
                        inline: false
                    }
                )
                .setFooter({ text: 'Administrative Team • Escalated for Review' })
                .setTimestamp();

            await message.delete();
            await message.channel.send({ embeds: [escalatedEmbed] });
            logCommandUsage(message.author, 'escalatedeng', startTime);
        }

        // Please Wait Commands
        if (command === 'pleasewaiteng') {
            const waitEmbed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('⏳ Please Wait')
                .setDescription('Thank you for your patience. No support staff are currently active.')
                .addFields(
                    {
                        name: '🕐 Support Hours',
                        value: 'Our support team will be back online shortly. Please wait for a staff member to assist you.',
                        inline: false
                    },
                    {
                        name: '📝 Important',
                        value: 'Please do not spam or create multiple tickets. Your request has been received and will be handled in order.',
                        inline: false
                    },
                    {
                        name: '🔔 Notification',
                        value: 'You will be notified when a support representative is available to help you.',
                        inline: false
                    }
                )
                .setFooter({ text: 'Support Team • Please Wait for Assistance' })
                .setTimestamp();

            await message.delete();
            await message.channel.send({ embeds: [waitEmbed] });
            logCommandUsage(message.author, 'pleasewaiteng', startTime);
        }

    } catch (error) {
        console.error('Command error:', error);
        
        // Error logging to dev channel
        const devChannel = client.channels.cache.get(DEV_LOG_CHANNEL_ID);
        if (devChannel) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF4757')
                .setTitle('🚨 Command Error')
                .addFields(
                    {
                        name: '👤 User',
                        value: `${message.author.username}\n\`${message.author.id}\``,
                        inline: true
                    },
                    {
                        name: '⚡ Command',
                        value: `\`.${command}\``,
                        inline: true
                    },
                    {
                        name: '❌ Error',
                        value: `\`\`\`${error.message}\`\`\``,
                        inline: false
                    }
                )
                .setTimestamp();
                
            try {
                await devChannel.send({ embeds: [errorEmbed] });
            } catch (logError) {
                console.error('Failed to send error log:', logError);
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
