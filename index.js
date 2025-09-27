});
    });

    return embed;
}

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
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        // Slash command for allcmds (ephemeral - only visible to staff member)
        if (commandName === 'allcmds') {
            const allCmdsEmbed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('🤖 All Bot Commands - Staff Guide & Usage')
                .setDescription('Complete command guide with usage instructions for support staff.')
                .addFields(
                    {
                        name: '📋 Support Commands',
                        value: '`.supportticket` - Customer opens ticket without required info\n`.hwidreset` - Customer requests HWID reset\n`.hwidresetdone` - After completing HWID reset\n`.ticketdone` - Issue resolved, closing ticket',
                        inline: false
                    },
                    {
                        name: '🔧 Help Commands',
                        value: '`.status` - Customer reports product not working\n`.unlockerhelp` - Customer needs unlocker assistance\n`.setupguide` - Customer needs installation help\n`.refundprocess` - Customer asks about refunds',
                        inline: false
                    },
                    {
                        name: '⚡ Management Commands',
                        value: '`.escalated` - Issue needs admin/HR attention\n`.pleasewait` - No support staff currently active',
                        inline: false
                    },
                    {
                        name: '🌍 Translation System',
                        value: 'All commands now have **translation buttons**!\n• Default: English embed with translation buttons\n• Users can click 🇺🇸 🇩🇪 🇫🇷 to change language\n• One command = all languages supported',
                        inline: false
                    }
                )
                .setFooter({ text: 'Total: 10 Commands • All support translation buttons • Commands auto-delete your message' })
                .setTimestamp();

            await interaction.reply({ embeds: [allCmdsEmbed], ephemeral: true });
        }
    }

    // Handle button interactions for translations
    if (interaction.isButton()) {
        const [action, language] = interaction.customId.split('_');
        
        if (action === 'translate') {
            // Get the command type from the embed title
            const originalEmbed = interaction.message.embeds[0];
            let commandType = '';
            
            // Map embed titles to command types
            if (originalEmbed.title.includes('Support Ticket') || originalEmbed.title.includes('Support-Ticket') || originalEmbed.title.includes('Ticket de Support')) {
                commandType = 'supportticket';
            } else if (originalEmbed.title.includes('HWID Reset') && originalEmbed.title.includes('Completed')) {
                commandType = 'hwidresetdone';
            } else if (originalEmbed.title.includes('HWID Reset') || originalEmbed.title.includes('HWID-Reset') || originalEmbed.title.includes('Réinitialisation HWID')) {
                commandType = 'hwidreset';
            } else if (originalEmbed.title.includes('Thank You') || originalEmbed.title.includes('Vielen Dank') || originalEmbed.title.includes('Merci')) {
                commandType = 'ticketdone';
            } else if (originalEmbed.title.includes('Status') || originalEmbed.title.includes('Statut')) {
                commandType = 'status';
            } else if (originalEmbed.title.includes('Unlocker')) {
                commandType = 'unlockerhelp';
            } else if (originalEmbed.title.includes('Setup') || originalEmbed.title.includes('Configuration')) {
                commandType = 'setupguide';
            } else if (originalEmbed.title.includes('Refund') || originalEmbed.title.includes('Rückerstattung') || originalEmbed.title.includes('Remboursement')) {
                commandType = 'refundprocess';
            } else if (originalEmbed.title.includes('Escalated') || originalEmbed.title.includes('Eskaliert') || originalEmbed.title.includes('Escaladé')) {
                commandType = 'escalated';
            } else if (originalEmbed.title.includes('Please Wait') || originalEmbed.title.includes('Bitte Warten') || originalEmbed.title.includes('Veuillez Patienter')) {
                commandType = 'pleasewait';
            }

            if (commandType && translations[commandType]) {
                const newEmbed = createEmbed(commandType, language);
                const buttons = createTranslationButtons();
                
                await interaction.update({ 
                    embeds: [newEmbed], 
                    components: [buttons] 
                });
            }
        }
    }
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const startTime = Date.now();
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        // All commands with translation buttons
        if (['supportticket', 'hwidreset', 'hwidresetdone', 'ticketdone', 'status', 'unlockerhelp', 'setupguide', 'refundprocess', 'escalated', 'pleasewait'].includes(command)) {
            const embed = createEmbed(command, 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ 
                embeds: [embed], 
                components: [buttons] 
            });
            
            logCommandUsage(message.author, command, startTime);
        }

        // All commands list
        if (command === 'allcmds') {
            const allCmdsEmbed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('🤖 All Bot Commands')
                .setDescription('Complete list of available bot commands for support staff.')
                .addFields(
                    {
                        name: '📋 Support Commands',
                        value: '`.supportticket` - Support ticket requirements\n`.hwidreset` - HWID reset requirements\n`.hwidresetdone` - HWID reset completion notice\n`.ticketdone` - Ticket closure message',
                        inline: false
                    },
                    {
                        name: '🔧 Help Commands',
                        value: '`.status` - Product status page\n`.unlockerhelp` - Unlocker video guide\n`.setupguide` - Product setup documentation\n`.refundprocess` - Refund policy information',
                        inline: false
                    },
                    {
                        name: '⚡ Management Commands',
                        value: '`.escalated` - Escalation notice\n`.pleasewait` - Please wait message\n`.allcmds` - This command list',
                        inline: false
                    },
                    {
                        name: '🌍 Translation Feature',
                        value: 'All commands include translation buttons (🇺🇸 🇩🇪 🇫🇷) for instant language switching',
                        inline: false
                    }
                )
                .setFooter({ text: 'Total: 10 Commands • All support translation buttons' })
                .setTimestamp();

            await message.delete();
            await message.channel.send({ embeds: [allCmdsEmbed] });
            logCommandUsage(message.author, 'allcmds', startTime);
        }

    } catch (error) {
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

// Translation data
const translations = {
    supportticket: {
        en: {
            title: '📋 Support Ticket Requirements',
            description: 'In order to assist you efficiently, please ensure you provide the following when opening a ticket:',
            fields: [
                {
                    name: '📹 Required Information',
                    value: '• A clear, high-quality video demonstrating the issue\n• A screenshot of the error message(s)\n• The name of the product you are using\n• The version of Windows you are running\n• A screenshot of each tab within your Windows Security settings'
                },
                {
                    name: '🔧 Diagnostic Tool',
                    value: 'Run the following diagnostic setup file and provide a screenshot when prompted:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)'
                },
                {
                    name: '⚠️ Important Notes',
                    value: '• Failure to follow these steps may result in delays or prevent us from providing effective support\n• Please ensure all requested information is submitted promptly\n• Once everything is submitted, kindly wait for an administrator to respond\n• Inactivity within the ticket may result in it being automatically closed'
                }
            ],
            footer: 'Support Team • Please follow all requirements'
        },
        de: {
            title: '📋 Support-Ticket Anforderungen',
            description: 'Um Ihnen effizient zu helfen, stellen Sie bitte beim Öffnen eines Tickets die folgenden Informationen bereit:',
            fields: [
                {
                    name: '📹 Erforderliche Informationen',
                    value: '• Ein klares, hochwertiges Video, das das Problem demonstriert\n• Ein Screenshot der Fehlermeldung(en)\n• Der Name des Produkts, das Sie verwenden\n• Die Version von Windows, die Sie verwenden\n• Ein Screenshot jedes Tabs in Ihren Windows-Sicherheitseinstellungen'
                },
                {
                    name: '🔧 Diagnose-Tool',
                    value: 'Führen Sie die folgende Diagnose-Datei aus und stellen Sie einen Screenshot bereit:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)'
                },
                {
                    name: '⚠️ Wichtige Hinweise',
                    value: '• Das Nichtbefolgen dieser Schritte kann zu Verzögerungen führen oder uns daran hindern, effektiven Support zu bieten\n• Bitte stellen Sie sicher, dass alle angeforderten Informationen umgehend übermittelt werden\n• Warten Sie nach der Übermittlung geduldig auf die Antwort eines Administrators\n• Inaktivität im Ticket kann zur automatischen Schließung führen'
                }
            ],
            footer: 'Support Team • Bitte befolgen Sie alle Anforderungen'
        },
        fr: {
            title: '📋 Exigences du Ticket de Support',
            description: 'Afin de vous aider efficacement, veuillez vous assurer de fournir les éléments suivants lors de l\'ouverture d\'un ticket:',
            fields: [
                {
                    name: '📹 Informations Requises',
                    value: '• Une vidéo claire et de haute qualité démontrant le problème\n• Une capture d\'écran du/des message(s) d\'erreur\n• Le nom du produit que vous utilisez\n• La version de Windows que vous utilisez\n• Une capture d\'écran de chaque onglet dans vos paramètres de sécurité Windows'
                },
                {
                    name: '🔧 Outil de Diagnostic',
                    value: 'Exécutez le fichier de configuration de diagnostic suivant et fournissez une capture d\'écran:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)'
                },
                {
                    name: '⚠️ Notes Importantes',
                    value: '• Ne pas suivre ces étapes peut entraîner des retards ou nous empêcher de fournir un support efficace\n• Veuillez vous assurer que toutes les informations demandées sont soumises rapidement\n• Une fois tout soumis, veuillez attendre patiemment qu\'un administrateur réponde\n• L\'inactivité dans le ticket peut entraîner sa fermeture automatique'
                }
            ],
            footer: 'Équipe de Support • Veuillez suivre toutes les exigences'
        }
    },
    hwidreset: {
        en: {
            title: '🔄 HWID Reset Requirements',
            description: 'To assist you with your HWID reset request, please provide the following information:',
            fields: [
                {
                    name: '📄 Required Documents',
                    value: '• A clear and detailed image of your invoice ID\n• A screenshot or photo of your payment confirmation\n• The email associated with your key\n• The reason you are requesting a reset'
                },
                {
                    name: '⏳ Processing Time',
                    value: 'Once all required information has been submitted, kindly allow some time for our team to review and respond accordingly.'
                }
            ],
            footer: 'HWID Reset Team • All information is required'
        },
        de: {
            title: '🔄 HWID-Reset Anforderungen',
            description: 'Um Ihnen bei Ihrer HWID-Reset-Anfrage zu helfen, stellen Sie bitte die folgenden Informationen bereit:',
            fields: [
                {
                    name: '📄 Erforderliche Dokumente',
                    value: '• Ein klares und detailliertes Bild Ihrer Rechnungs-ID\n• Ein Screenshot oder Foto Ihrer Zahlungsbestätigung\n• Die E-Mail, die mit Ihrem Schlüssel verknüpft ist\n• Der Grund für Ihre Reset-Anfrage'
                },
                {
                    name: '⏳ Bearbeitungszeit',
                    value: 'Sobald alle erforderlichen Informationen übermittelt wurden, gewähren Sie unserem Team bitte etwas Zeit zur Überprüfung und entsprechenden Antwort.'
                }
            ],
            footer: 'HWID-Reset Team • Alle Informationen sind erforderlich'
        },
        fr: {
            title: '🔄 Exigences de Réinitialisation HWID',
            description: 'Pour vous aider avec votre demande de réinitialisation HWID, veuillez fournir les informations suivantes:',
            fields: [
                {
                    name: '📄 Documents Requis',
                    value: '• Une image claire et détaillée de votre ID de facture\n• Une capture d\'écran ou photo de votre confirmation de paiement\n• L\'e-mail associé à votre clé\n• La raison pour laquelle vous demandez une réinitialisation'
                },
                {
                    name: '⏳ Temps de Traitement',
                    value: 'Une fois que toutes les informations requises ont été soumises, veuillez accorder du temps à notre équipe pour examiner et répondre en conséquence.'
                }
            ],
            footer: 'Équipe de Réinitialisation HWID • Toutes les informations sont requises'
        }
    },
    hwidresetdone: {
        en: {
            title: '✅ HWID Reset Completed',
            description: 'Your HWID reset has been successfully processed and completed.',
            fields: [
                {
                    name: '🎯 Status Update',
                    value: 'Your hardware identification has been reset and is now ready for use with your product.'
                },
                {
                    name: '📝 Next Steps',
                    value: 'You may now proceed to use your product normally. If you experience any further issues, please don\'t hesitate to create a new support ticket.'
                }
            ],
            footer: 'HWID Reset Team • Process Complete'
        },
        de: {
            title: '✅ HWID-Reset Abgeschlossen',
            description: 'Ihr HWID-Reset wurde erfolgreich verarbeitet und abgeschlossen.',
            fields: [
                {
                    name: '🎯 Status-Update',
                    value: 'Ihre Hardware-Identifikation wurde zurückgesetzt und ist nun für die Verwendung mit Ihrem Produkt bereit.'
                },
                {
                    name: '📝 Nächste Schritte',
                    value: 'Sie können Ihr Produkt nun normal verwenden. Sollten Sie weitere Probleme haben, erstellen Sie bitte ein neues Support-Ticket.'
                }
            ],
            footer: 'HWID-Reset Team • Vorgang Abgeschlossen'
        },
        fr: {
            title: '✅ Réinitialisation HWID Terminée',
            description: 'Votre réinitialisation HWID a été traitée avec succès et terminée.',
            fields: [
                {
                    name: '🎯 Mise à jour du Statut',
                    value: 'Votre identification matérielle a été réinitialisée et est maintenant prête à être utilisée avec votre produit.'
                },
                {
                    name: '📝 Prochaines Étapes',
                    value: 'Vous pouvez maintenant utiliser votre produit normalement. Si vous rencontrez d\'autres problèmes, n\'hésitez pas à créer un nouveau ticket de support.'
                }
            ],
            footer: 'Équipe de Réinitialisation HWID • Processus Terminé'
        }
    },
    ticketdone: {
        en: {
            title: '🎉 Thank You for Your Business',
            description: 'Thank you for shopping with us! We appreciate your trust in our services.',
            fields: [
                {
                    name: '🔒 Ticket Closure',
                    value: 'This support ticket will be closed shortly. If you need further assistance, please feel free to create a new ticket.'
                },
                {
                    name: '⭐ Feedback',
                    value: 'We value your experience with us. Thank you for choosing our services!'
                }
            ],
            footer: 'Support Team • Thank you for your business'
        },
        de: {
            title: '🎉 Vielen Dank für Ihr Vertrauen',
            description: 'Vielen Dank, dass Sie bei uns eingekauft haben! Wir schätzen Ihr Vertrauen in unsere Dienste.',
            fields: [
                {
                    name: '🔒 Ticket-Schließung',
                    value: 'Dieses Support-Ticket wird in Kürze geschlossen. Wenn Sie weitere Hilfe benötigen, erstellen Sie gerne ein neues Ticket.'
                },
                {
                    name: '⭐ Feedback',
                    value: 'Wir schätzen Ihre Erfahrung mit uns. Vielen Dank, dass Sie sich für unsere Dienste entschieden haben!'
                }
            ],
            footer: 'Support Team • Vielen Dank für Ihr Vertrauen'
        },
        fr: {
            title: '🎉 Merci pour Votre Confiance',
            description: 'Merci d\'avoir fait vos achats chez nous! Nous apprécions votre confiance en nos services.',
            fields: [
                {
                    name: '🔒 Fermeture du Ticket',
                    value: 'Ce ticket de support sera fermé sous peu. Si vous avez besoin d\'une assistance supplémentaire, n\'hésitez pas à créer un nouveau ticket.'
                },
                {
                    name: '⭐ Commentaires',
                    value: 'Nous valorisons votre expérience avec nous. Merci d\'avoir choisi nos services!'
                }
            ],
            footer: 'Équipe de Support • Merci pour votre confiance'
        }
    },
    status: {
        en: {
            title: '📊 Product Status',
            description: 'Check the current status of all our products and services.',
            fields: [
                {
                    name: '🔗 Status Page',
                    value: '[View Live Status](https://dottyservices.online/status)\nMonitor real-time status updates for all products'
                },
                {
                    name: '⚠️ Important Notice',
                    value: 'Always check the status page before using any products to ensure optimal performance and avoid potential issues.'
                }
            ],
            footer: 'Status Team • Always check before use'
        },
        de: {
            title: '📊 Produktstatus',
            description: 'Überprüfen Sie den aktuellen Status aller unserer Produkte und Dienstleistungen.',
            fields: [
                {
                    name: '🔗 Status-Seite',
                    value: '[Live-Status anzeigen](https://dottyservices.online/status)\nÜberwachen Sie Echtzeit-Status-Updates für alle Produkte'
                },
                {
                    name: '⚠️ Wichtiger Hinweis',
                    value: 'Überprüfen Sie immer die Status-Seite vor der Verwendung von Produkten, um optimale Leistung zu gewährleisten und potenzielle Probleme zu vermeiden.'
                }
            ],
            footer: 'Status Team • Immer vor Gebrauch prüfen'
        },
        fr: {
            title: '📊 Statut des Produits',
            description: 'Vérifiez le statut actuel de tous nos produits et services.',
            fields: [
                {
                    name: '🔗 Page de Statut',
                    value: '[Voir le Statut en Direct](https://dottyservices.online/status)\nSurveiller les mises à jour de statut en temps réel pour tous les produits'
                },
                {
                    name: '⚠️ Avis Important',
                    value: 'Vérifiez toujours la page de statut avant d\'utiliser des produits pour assurer des performances optimales et éviter des problèmes potentiels.'
                }
            ],
            footer: 'Équipe de Statut • Toujours vérifier avant utilisation'
        }
    },
    unlockerhelp: {
        en: {
            title: '🔓 Unlocker Help Guide',
            description: 'Need help with the unlocker? Follow our comprehensive video guide.',
            fields: [
                {
                    name: '🎥 Video Tutorial',
                    value: '[Watch Help Video](https://streamable.com/zn260n)\nStep-by-step instructions for unlocker usage'
                },
                {
                    name: '📋 Instructions',
                    value: 'Please follow the video tutorial carefully for proper unlocker setup and usage. The video covers all essential steps.'
                }
            ],
            footer: 'Unlocker Support • Follow the video guide'
        },
        de: {
            title: '🔓 Unlocker-Hilfe-Leitfaden',
            description: 'Benötigen Sie Hilfe mit dem Unlocker? Folgen Sie unserem umfassenden Video-Leitfaden.',
            fields: [
                {
                    name: '🎥 Video-Tutorial',
                    value: '[Hilfe-Video ansehen](https://streamable.com/zn260n)\nSchritt-für-Schritt-Anleitung für die Unlocker-Nutzung'
                },
                {
                    name: '📋 Anweisungen',
                    value: 'Bitte folgen Sie dem Video-Tutorial sorgfältig für die ordnungsgemäße Unlocker-Einrichtung und -Nutzung. Das Video deckt alle wesentlichen Schritte ab.'
                }
            ],
            footer: 'Unlocker-Support • Folgen Sie der Video-Anleitung'
        },
        fr: {
            title: '🔓 Guide d\'Aide Unlocker',
            description: 'Besoin d\'aide avec l\'unlocker? Suivez notre guide vidéo complet.',
            fields: [
                {
                    name: '🎥 Tutoriel Vidéo',
                    value: '[Regarder la Vidéo d\'Aide](https://streamable.com/zn260n)\nInstructions étape par étape pour l\'utilisation de l\'unlocker'
                },
                {
                    name: '📋 Instructions',
                    value: 'Veuillez suivre attentivement le tutoriel vidéo pour une configuration et utilisation appropriée de l\'unlocker. La vidéo couvre toutes les étapes essentielles.'
                }
            ],
            footer: 'Support Unlocker • Suivez le guide vidéo'
        }
    },
    setupguide: {
        en: {
            title: '⚙️ Product Setup Guide',
            description: 'Complete setup guide for all our products and services.',
            fields: [
                {
                    name: '📖 Setup Documentation',
                    value: '[View Setup Guide](https://dottyservices.online/setup)\nComprehensive setup instructions for all products'
                },
                {
                    name: '🔧 Installation Help',
                    value: 'Follow the setup guide carefully for proper installation and configuration of your products.'
                }
            ],
            footer: 'Setup Team • Follow the complete guide'
        },
        de: {
            title: '⚙️ Produkt-Setup-Leitfaden',
            description: 'Vollständiger Setup-Leitfaden für alle unsere Produkte und Dienstleistungen.',
            fields: [
                {
                    name: '📖 Setup-Dokumentation',
                    value: '[Setup-Leitfaden anzeigen](https://dottyservices.online/setup)\nUmfassende Setup-Anweisungen für alle Produkte'
                },
                {
                    name: '🔧 Installationshilfe',
                    value: 'Folgen Sie dem Setup-Leitfaden sorgfältig für die ordnungsgemäße Installation und Konfiguration Ihrer Produkte.'
                }
            ],
            footer: 'Setup Team • Folgen Sie dem vollständigen Leitfaden'
        },
        fr: {
            title: '⚙️ Guide de Configuration des Produits',
            description: 'Guide de configuration complet pour tous nos produits et services.',
            fields: [
                {
                    name: '📖 Documentation de Configuration',
                    value: '[Voir le Guide de Configuration](https://dottyservices.online/setup)\nInstructions de configuration complètes pour tous les produits'
                },
                {
                    name: '🔧 Aide à l\'Installation',
                    value: 'Suivez attentivement le guide de configuration pour une installation et configuration appropriée de vos produits.'
                }
            ],
            footer: 'Équipe de Configuration • Suivez le guide complet'
        }
    },
    refundprocess: {
        en: {
            title: '💰 Refund Policy & Process',
            description: 'Our refund policy in accordance with EU and German consumer protection laws.',
            fields: [
                {
                    name: '✅ Eligibility for Refunds',
                    value: '• Digital content not delivered due to technical issues on our side\n• Product is unusable due to technical problems from our end\n• Must be requested within 14 days of purchase'
                },
                {
                    name: '❌ Refund Limitations',
                    value: '• Refunds are not guaranteed if the product has been accessed, downloaded, or used successfully\n• Must comply with EU Directive 2011/83/EU on Consumer Rights'
                },
                {
                    name: '📧 How to Request',
                    value: 'Contact us at: dottywotty1234@outlook.com\nInclude your purchase details and reason for refund request'
                }
            ],
            footer: 'Refund Team • EU Consumer Rights Protected'
        },
        de: {
            title: '💰 Rückerstattungsrichtlinie & Verfahren',
            description: 'Unsere Rückerstattungsrichtlinie in Übereinstimmung mit EU- und deutschen Verbraucherschutzgesetzen.',
            fields: [
                {
                    name: '✅ Berechtigung für Rückerstattungen',
                    value: '• Digitale Inhalte nicht geliefert aufgrund technischer Probleme unsererseits\n• Produkt ist aufgrund technischer Probleme von unserer Seite unbrauchbar\n• Muss innerhalb von 14 Tagen nach dem Kauf beantragt werden'
                },
                {
                    name: '❌ Rückerstattungsbeschränkungen',
                    value: '• Rückerstattungen sind nicht garantiert, wenn das Produkt bereits aufgerufen, heruntergeladen oder erfolgreich verwendet wurde\n• Muss der EU-Richtlinie 2011/83/EU über Verbraucherrechte entsprechen'
                },
                {
                    name: '📧 Wie man anfragt',
                    value: 'Kontaktieren Sie uns unter: dottywotty1234@outlook.com\nFügen Sie Ihre Kaufdetails und den Grund für die Rückerstattungsanfrage bei'
                }
            ],
            footer: 'Rückerstattungsteam • EU-Verbraucherrechte geschützt'
        },
        fr: {
            title: '💰 Politique de Remboursement & Processus',
            description: 'Notre politique de remboursement conforme aux lois de protection des consommateurs de l\'UE et d\'Allemagne.',
            fields: [
                {
                    name: '✅ Éligibilité aux Remboursements',
                    value: '• Contenu numérique non livré en raison de problèmes techniques de notre côté\n• Produit inutilisable en raison de problèmes techniques de notre côté\n• Doit être demandé dans les 14 jours suivant l\'achat'
                },
                {
                    name: '❌ Limitations de Remboursement',
                    value: '• Les remboursements ne sont pas garantis si le produit a été consulté, téléchargé ou utilisé avec succès\n• Doit être conforme à la Directive UE 2011/83/UE sur les droits des consommateurs'
                },
                {
                    name: '📧 Comment Demander',
                    value: 'Contactez-nous à: dottywotty1234@outlook.com\nIncluez vos détails d\'achat et la raison de la demande de remboursement'
                }
            ],
            footer: 'Équipe de Remboursement • Droits des Consommateurs UE Protégés'
        }
    },
    escalated: {
        en: {
            title: '⬆️ Ticket Escalated',
            description: 'Your support ticket has been escalated for specialized assistance.',
            fields: [
                {
                    name: '🔝 Escalation Notice',
                    value: 'Your ticket has been forwarded to our administrative team and HR department for further review and assistance.'
                },
                {
                    name: '⏱️ Response Time',
                    value: 'Please allow additional time for our specialized team to review your case thoroughly. You will receive a response as soon as possible.'
                },
                {
                    name: '📝 Important',
                    value: 'Please do not create additional tickets for this issue. Our team will contact you through this existing ticket.'
                }
            ],
            footer: 'Administrative Team • Escalated for Review'
        },
        de: {
            title: '⬆️ Ticket Eskaliert',
            description: 'Ihr Support-Ticket wurde für spezialisierte Unterstützung eskaliert.',
            fields: [
                {
                    name: '🔝 Eskalationshinweis',
                    value: 'Ihr Ticket wurde zur weiteren Überprüfung und Unterstützung an unser Verwaltungsteam und die Personalabteilung weitergeleitet.'
                },
                {
                    name: '⏱️ Antwortzeit',
                    value: 'Bitte gewähren Sie zusätzliche Zeit, damit unser Spezialistenteam Ihren Fall gründlich überprüfen kann. Sie erhalten schnellstmöglich eine Antwort.'
                },
                {
                    name: '📝 Wichtig',
                    value: 'Bitte erstellen Sie keine zusätzlichen Tickets für dieses Problem. Unser Team wird Sie über dieses bestehende Ticket kontaktieren.'
                }
            ],
            footer: 'Verwaltungsteam • Zur Überprüfung Eskaliert'
        },
        fr: {
            title: '⬆️ Ticket Escaladé',
            description: 'Votre ticket de support a été escaladé pour une assistance spécialisée.',
            fields: [
                {
                    name: '🔝 Avis d\'Escalade',
                    value: 'Votre ticket a été transféré à notre équipe administrative et au département des ressources humaines pour examen et assistance supplémentaires.'
                },
                {
                    name: '⏱️ Temps de Réponse',
                    value: 'Veuillez accorder du temps supplémentaire à notre équipe spécialisée pour examiner votre cas en détail. Vous recevrez une réponse dès que possible.'
                },
                {
                    name: '📝 Important',
                    value: 'Veuillez ne pas créer de tickets supplémentaires pour ce problème. Notre équipe vous contactera via ce ticket existant.'
                }
            ],
            footer: 'Équipe Administrative • Escaladé pour Examen'
        }
    },
    pleasewait: {
        en: {
            title: '⏳ Please Wait',
            description: 'Thank you for your patience. No support staff are currently active.',
            fields: [
                {
                    name: '🕐 Support Hours',
                    value: 'Our support team will be back online shortly. Please wait for a staff member to assist you.'
                },
                {
                    name: '📝 Important',
                    value: 'Please do not spam or create multiple tickets. Your request has been received and will be handled in order.'
                },
                {
                    name: '🔔 Notification',
                    value: 'You will be notified when a support representative is available to help you.'
                }
            ],
            footer: 'Support Team • Please Wait for Assistance'
        },
        de: {
            title: '⏳ Bitte Warten',
            description: 'Vielen Dank für Ihre Geduld. Derzeit ist kein Support-Personal aktiv.',
            fields: [
                {
                    name: '🕐 Support-Zeiten',
                    value: 'Unser Support-Team wird in Kürze wieder online sein. Bitte warten Sie auf einen Mitarbeiter, der Ihnen hilft.'
                },
                {
                    name: '📝 Wichtig',
                    value: 'Bitte spammen Sie nicht oder erstellen Sie mehrere Tickets. Ihre Anfrage wurde erhalten und wird der Reihe nach bearbeitet.'
                },
                {
                    name: '🔔 Benachrichtigung',
                    value: 'Sie werden benachrichtigt, wenn ein Support-Vertreter verfügbar ist, um Ihnen zu helfen.'
                }
            ],
            footer: 'Support-Team • Bitte Warten auf Unterstützung'
        },
        fr: {
            title: '⏳ Veuillez Patienter',
            description: 'Merci de votre patience. Aucun membre du support n\'est actuellement actif.',
            fields: [
                {
                    name: '🕐 Heures de Support',
                    value: 'Notre équipe de support sera de retour en ligne sous peu. Veuillez attendre qu\'un membre du personnel vous aide.'
                },
                {
                    name: '📝 Important',
                    value: 'Veuillez ne pas spammer ou créer plusieurs tickets. Votre demande a été reçue et sera traitée dans l\'ordre.'
                },
                {
                    name: '🔔 Notification',
                    value: 'Vous serez notifié lorsqu\'un représentant du support sera disponible pour vous aider.'
                }
            ],
            footer: 'Équipe de Support • Veuillez Attendre l\'Assistance'
        }
    }
};

// Create embed from translation data
function createEmbed(commandType, language = 'en') {
    const data = translations[commandType][language];
    const embed = new EmbedBuilder()
        .setColor('#FFFFFF')
        .setTitle(data.title)
        .setDescription(data.description)
        .setFooter({ text: data.footer })
        .setTimestamp();

    data.fields.forEach(field => {
        embed.addFields({
            name: field.name,
            value: field.value,
            inline: false
