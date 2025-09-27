const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = '.';
const DEV_LOG_CHANNEL_ID = '1414044553312468992';

// Register slash command
const commands = [
    new SlashCommandBuilder()
        .setName('allcmds')
        .setDescription('Display all available bot commands (Staff Quick Reference)')
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    }
    
    // HWID Reset
    if (commandType === 'hwidreset') {
        if (language === 'en') {
            embed.setTitle('🔄 HWID Reset Requirements').setDescription('To assist you with your HWID reset request, please provide the following information:')
                .addFields(
                    { name: '📄 Required Documents', value: '• A clear and detailed image of your invoice ID\n• A screenshot or photo of your payment confirmation\n• The email associated with your key\n• The reason you are requesting a reset' },
                    { name: '⏳ Processing Time', value: 'Once all required information has been submitted, kindly allow some time for our team to review and respond accordingly.' }
                ).setFooter({ text: 'HWID Reset Team • All information is required' });
        }
        if (language === 'de') {
            embed.setTitle('🔄 HWID-Reset Anforderungen').setDescription('Um Ihnen bei Ihrer HWID-Reset-Anfrage zu helfen, stellen Sie bitte die folgenden Informationen bereit:')
                .addFields(
                    { name: '📄 Erforderliche Dokumente', value: '• Ein klares und detailliertes Bild Ihrer Rechnungs-ID\n• Ein Screenshot oder Foto Ihrer Zahlungsbestätigung\n• Die E-Mail, die mit Ihrem Schlüssel verknüpft ist\n• Der Grund für Ihre Reset-Anfrage' },
                    { name: '⏳ Bearbeitungszeit', value: 'Sobald alle erforderlichen Informationen übermittelt wurden, gewähren Sie unserem Team bitte etwas Zeit zur Überprüfung und entsprechenden Antwort.' }
                ).setFooter({ text: 'HWID-Reset Team • Alle Informationen sind erforderlich' });
        }
        if (language === 'fr') {
            embed.setTitle('🔄 Exigences de Réinitialisation HWID').setDescription('Pour vous aider avec votre demande de réinitialisation HWID, veuillez fournir les informations suivantes:')
                .addFields(
                    { name: '📄 Documents Requis', value: '• Une image claire et détaillée de votre ID de facture\n• Une capture d\'écran ou photo de votre confirmation de paiement\n• L\'e-mail associé à votre clé\n• La raison pour laquelle vous demandez une réinitialisation' },
                    { name: '⏳ Temps de Traitement', value: 'Une fois que toutes les informations requises ont été soumises, veuillez accorder du temps à notre équipe pour examiner et répondre en conséquence.' }
                ).setFooter({ text: 'Équipe de Réinitialisation HWID • Toutes les informations sont requises' });
        }
    }
    
    // Ticket Done
    if (commandType === 'ticketdone') {
        if (language === 'en') {
            embed.setTitle('🎉 Thank You for Your Business').setDescription('Thank you for shopping with us! We appreciate your trust in our services.')
                .addFields(
                    { name: '🔒 Ticket Closure', value: 'This support ticket will be closed shortly. If you need further assistance, please feel free to create a new ticket.' },
                    { name: '⭐ Feedback', value: 'We value your experience with us. Thank you for choosing our services!' }
                ).setFooter({ text: 'Support Team • Thank you for your business' });
        }
        if (language === 'de') {
            embed.setTitle('🎉 Vielen Dank für Ihr Vertrauen').setDescription('Vielen Dank, dass Sie bei uns eingekauft haben! Wir schätzen Ihr Vertrauen in unsere Dienste.')
                .addFields(
                    { name: '🔒 Ticket-Schließung', value: 'Dieses Support-Ticket wird in Kürze geschlossen. Wenn Sie weitere Hilfe benötigen, erstellen Sie gerne ein neues Ticket.' },
                    { name: '⭐ Feedback', value: 'Wir schätzen Ihre Erfahrung mit uns. Vielen Dank, dass Sie sich für unsere Dienste entschieden haben!' }
                ).setFooter({ text: 'Support Team • Vielen Dank für Ihr Vertrauen' });
        }
        if (language === 'fr') {
            embed.setTitle('🎉 Merci pour Votre Confiance').setDescription('Merci d\'avoir fait vos achats chez nous! Nous apprécions votre confiance en nos services.')
                .addFields(
                    { name: '🔒 Fermeture du Ticket', value: 'Ce ticket de support sera fermé sous peu. Si vous avez besoin d\'une assistance supplémentaire, n\'hésitez pas à créer un nouveau ticket.' },
                    { name: '⭐ Commentaires', value: 'Nous valorisons votre expérience avec nous. Merci d\'avoir choisi nos services!' }
                ).setFooter({ text: 'Équipe de Support • Merci pour votre confiance' });
        }
    }
    
    // Please Wait
    if (commandType === 'pleasewait') {
        if (language === 'en') {
            embed.setTitle('⏳ Please Wait').setDescription('Thank you for your patience. No support staff are currently active.')
                .addFields(
                    { name: '🕐 Support Hours', value: 'Our support team will be back online shortly. Please wait for a staff member to assist you.' },
                    { name: '📝 Important', value: 'Please do not spam or create multiple tickets. Your request has been received and will be handled in order.' }
                ).setFooter({ text: 'Support Team • Please Wait for Assistance' });
        }
        if (language === 'de') {
            embed.setTitle('⏳ Bitte Warten').setDescription('Vielen Dank für Ihre Geduld. Derzeit ist kein Support-Personal aktiv.')
                .addFields(
                    { name: '🕐 Support-Zeiten', value: 'Unser Support-Team wird in Kürze wieder online sein. Bitte warten Sie auf einen Mitarbeiter, der Ihnen hilft.' },
                    { name: '📝 Wichtig', value: 'Bitte spammen Sie nicht oder erstellen Sie mehrere Tickets. Ihre Anfrage wurde erhalten und wird der Reihe nach bearbeitet.' }
                ).setFooter({ text: 'Support-Team • Bitte Warten auf Unterstützung' });
        }
        if (language === 'fr') {
            embed.setTitle('⏳ Veuillez Patienter').setDescription('Merci de votre patience. Aucun membre du support n\'est actuellement actif.')
                .addFields(
                    { name: '🕐 Heures de Support', value: 'Notre équipe de support sera de retour en ligne sous peu. Veuillez attendre qu\'un membre du personnel vous aide.' },
                    { name: '📝 Important', value: 'Veuillez ne pas spammer ou créer plusieurs tickets. Votre demande a été reçue et sera traitée dans l\'ordre.' }
                ).setFooter({ text: 'Équipe de Support • Veuillez Attendre l\'Assistance' });
        }
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

// Simplified embed creation
function createEmbed(commandType, language = 'en') {
    let embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    // Support Ticket
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
        }
        if (language === 'de') {
            embed.setTitle('📋 Support-Ticket Anforderungen')
                .setDescription('Um Ihnen effizient zu helfen, stellen Sie bitte beim Öffnen eines Tickets die folgenden Informationen bereit:')
                .addFields(
                    { name: '📹 Erforderliche Informationen', value: '• Ein klares, hochwertiges Video, das das Problem demonstriert\n• Ein Screenshot der Fehlermeldung(en)\n• Der Name des Produkts, das Sie verwenden\n• Die Version von Windows, die Sie verwenden\n• Ein Screenshot jedes Tabs in Ihren Windows-Sicherheitseinstellungen' },
                    { name: '🔧 Diagnose-Tool', value: 'Führen Sie die folgende Diagnose-Datei aus und stellen Sie einen Screenshot bereit:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)' },
                    { name: '⚠️ Wichtige Hinweise', value: '• Das Nichtbefolgen dieser Schritte kann zu Verzögerungen führen oder uns daran hindern, effektiven Support zu bieten\n• Bitte stellen Sie sicher, dass alle angeforderten Informationen umgehend übermittelt werden\n• Warten Sie nach der Übermittlung geduldig auf die Antwort eines Administrators\n• Inaktivität im Ticket kann zur automatischen Schließung führen' }
                )
                .setFooter({ text: 'Support Team • Bitte befolgen Sie alle Anforderungen' });
        }
        if (language === 'fr') {
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
    
    // Status
    if (commandType === 'status') {
        if (language === 'en') {
            embed.setTitle('📊 Product Status').setDescription('Check the current status of all our products and services.')
                .addFields(
                    { name: '🔗 Status Page', value: '[View Live Status](https://dottyservices.online/status)\nMonitor real-time status updates for all products' },
                    { name: '⚠️ Important Notice', value: 'Always check the status page before using any products to ensure optimal performance and avoid potential issues.' }
                ).setFooter({ text: 'Status Team • Always check before use' });
        }
        if (language === 'de') {
            embed.setTitle('📊 Produktstatus').setDescription('Überprüfen Sie den aktuellen Status aller unserer Produkte und Dienstleistungen.')
                .addFields(
                    { name: '🔗 Status-Seite', value: '[Live-Status anzeigen](https://dottyservices.online/status)\nÜberwachen Sie Echtzeit-Status-Updates für alle Produkte' },
                    { name: '⚠️ Wichtiger Hinweis', value: 'Überprüfen Sie immer die Status-Seite vor der Verwendung von Produkten, um optimale Leistung zu gewährleisten und potenzielle Probleme zu vermeiden.' }
                ).setFooter({ text: 'Status Team • Immer vor Gebrauch prüfen' });
        }
        if (language === 'fr') {
            embed.setTitle('📊 Statut des Produits').setDescription('Vérifiez le statut actuel de tous nos produits et services.')
                .addFields(
                    { name: '🔗 Page de Statut', value: '[Voir le Statut en Direct](https://dottyservices.online/status)\nSurveiller les mises à jour de statut en temps réel pour tous les produits' },
                    { name: '⚠️ Avis Important', value: 'Vérifiez toujours la page de statut avant d\'utiliser des produits pour assurer des performances optimales et éviter des problèmes potentiels.' }
                ).setFooter({ text: 'Équipe de Statut • Toujours vérifier avant utilisation' });
        }
    }
    
    return embed;
}

// Logging System
async function logCommandUsage(user, commandName, startTime) {
    try {
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
                    { name: '⏱️ Response Time', value: `${responseTime}ms`, inline: true }
                )
                .setTimestamp();
                
            await devChannel.send({ embeds: [logEmbed] });
        }
    } catch (error) {
        console.error('Logging error:', error);
    }
}

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isChatInputCommand() && interaction.commandName === 'allcmds') {
            const embed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('🤖 All Bot Commands')
                .setDescription('Complete command list with translation system.')
                .addFields({ 
                    name: '📋 Commands', 
                    value: '`.supportticket` - Support requirements\n`.hwidreset` - HWID reset requirements\n`.ticketdone` - Ticket closure message\n`.status` - Product status\n`.pleasewait` - Please wait message\n`.allcmds` - Command list' 
                })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.isButton() && interaction.customId.startsWith('translate_')) {
            const language = interaction.customId.split('_')[1];
            const originalTitle = interaction.message.embeds[0].title;
            
            let commandType = '';
            if (originalTitle.includes('Support Ticket') || originalTitle.includes('Support-Ticket') || originalTitle.includes('Ticket de Support')) {
                commandType = 'supportticket';
            } else if (originalTitle.includes('Status') || originalTitle.includes('Produktstatus') || originalTitle.includes('Statut des Produits')) {
                commandType = 'status';
            } else if (originalTitle.includes('HWID Reset') || originalTitle.includes('HWID-Reset') || originalTitle.includes('Réinitialisation HWID')) {
                commandType = 'hwidreset';
            } else if (originalTitle.includes('Thank You') || originalTitle.includes('Vielen Dank') || originalTitle.includes('Merci')) {
                commandType = 'ticketdone';
            } else if (originalTitle.includes('Please Wait') || originalTitle.includes('Bitte Warten') || originalTitle.includes('Veuillez Patienter')) {
                commandType = 'pleasewait';
            }

            if (commandType) {
                const newEmbed = createEmbed(commandType, language);
                const buttons = createTranslationButtons();
                await interaction.update({ embeds: [newEmbed], components: [buttons] });
            }
        }
    } catch (error) {
        console.error('Interaction error:', error);
    }
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const startTime = Date.now();
    const command = message.content.slice(prefix.length).trim().toLowerCase();

    try {
        if (['supportticket', 'status', 'hwidreset', 'ticketdone', 'pleasewait', 'allcmds'].includes(command)) {
            if (command === 'allcmds') {
                const embed = new EmbedBuilder()
                    .setColor('#FFFFFF')
                    .setTitle('🤖 All Bot Commands')
                    .addFields({ 
                        name: '📋 Available Commands', 
                        value: '`.supportticket` - Support requirements\n`.hwidreset` - HWID reset requirements\n`.ticketdone` - Ticket closure\n`.status` - Product status\n`.pleasewait` - Please wait\n`.allcmds` - This list' 
                    })
                    .setTimestamp();
                
                await message.delete();
                await message.channel.send({ embeds: [embed] });
            } else {
                const embed = createEmbed(command, 'en');
                const buttons = createTranslationButtons();
                
                await message.delete();
                await message.channel.send({ embeds: [embed], components: [buttons] });
            }
            
            logCommandUsage(message.author, command, startTime);
        }
    } catch (error) {
        console.error('Command error:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);
