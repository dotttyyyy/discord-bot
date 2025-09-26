const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Commands array
const commands = [
    // Support Ticket Commands
    new SlashCommandBuilder()
        .setName('supportticketeng')
        .setDescription('Display support ticket requirements (English)'),
    
    new SlashCommandBuilder()
        .setName('supportticketdu')
        .setDescription('Display support ticket requirements (German)'),
    
    new SlashCommandBuilder()
        .setName('supportticketfr')
        .setDescription('Display support ticket requirements (French)'),
    
    // HWID Reset Commands
    new SlashCommandBuilder()
        .setName('hwidreseteng')
        .setDescription('Display HWID reset requirements (English)'),
    
    new SlashCommandBuilder()
        .setName('hwidresetdu')
        .setDescription('Display HWID reset requirements (German)'),
    
    new SlashCommandBuilder()
        .setName('hwidresetfr')
        .setDescription('Display HWID reset requirements (French)'),
    
    // HWID Reset Done Commands
    new SlashCommandBuilder()
        .setName('hwidresetdoneeng')
        .setDescription('Notify user that HWID reset has been completed (English)'),
    
    new SlashCommandBuilder()
        .setName('hwidresetdonedu')
        .setDescription('Notify user that HWID reset has been completed (German)'),
    
    new SlashCommandBuilder()
        .setName('hwidresetdonefr')
        .setDescription('Notify user that HWID reset has been completed (French)'),
    
    // Ticket Done Commands
    new SlashCommandBuilder()
        .setName('ticketdoneeng')
        .setDescription('Thank user and notify ticket will be closed shortly (English)'),
    
    new SlashCommandBuilder()
        .setName('ticketdonedu')
        .setDescription('Thank user and notify ticket will be closed shortly (German)'),
    
    new SlashCommandBuilder()
        .setName('ticketdonefr')
        .setDescription('Thank user and notify ticket will be closed shortly (French)')
];

// Register slash commands
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
    client.user.setActivity('Supporting users', { type: 'WATCHING' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // Support Ticket Commands
    if (commandName === 'supportticketeng') {
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

        await interaction.reply({ embeds: [supportEmbed] });
    }

    if (commandName === 'supportticketdu') {
        const supportEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📋 Support-Ticket Anforderungen')
            .setDescription('Um Ihnen effizient zu helfen, stellen Sie bitte beim Öffnen eines Tickets die folgenden Informationen bereit:')
            .addFields(
                {
                    name: '📹 Erforderliche Informationen',
                    value: '• Ein klares, hochwertiges Video, das das Problem demonstriert\n• Ein Screenshot der Fehlermeldung(en)\n• Der Name des Produkts, das Sie verwenden\n• Die Version von Windows, die Sie verwenden\n• Ein Screenshot jedes Tabs in Ihren Windows-Sicherheitseinstellungen',
                    inline: false
                },
                {
                    name: '🔧 Diagnose-Tool',
                    value: 'Führen Sie die folgende Diagnose-Datei aus und stellen Sie einen Screenshot bereit:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)',
                    inline: false
                },
                {
                    name: '⚠️ Wichtige Hinweise',
                    value: '• Das Nichtbefolgen dieser Schritte kann zu Verzögerungen führen oder uns daran hindern, effektiven Support zu bieten\n• Bitte stellen Sie sicher, dass alle angeforderten Informationen umgehend übermittelt werden\n• Warten Sie nach der Übermittlung geduldig auf die Antwort eines Administrators\n• Inaktivität im Ticket kann zur automatischen Schließung führen',
                    inline: false
                }
            )
            .setFooter({ text: 'Support Team • Bitte befolgen Sie alle Anforderungen' })
            .setTimestamp();

        await interaction.reply({ embeds: [supportEmbedDE] });
    }

    if (commandName === 'supportticketfr') {
        const supportEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📋 Exigences du Ticket de Support')
            .setDescription('Afin de vous aider efficacement, veuillez vous assurer de fournir les éléments suivants lors de l\'ouverture d\'un ticket:')
            .addFields(
                {
                    name: '📹 Informations Requises',
                    value: '• Une vidéo claire et de haute qualité démontrant le problème\n• Une capture d\'écran du/des message(s) d\'erreur\n• Le nom du produit que vous utilisez\n• La version de Windows que vous utilisez\n• Une capture d\'écran de chaque onglet dans vos paramètres de sécurité Windows',
                    inline: false
                },
                {
                    name: '🔧 Outil de Diagnostic',
                    value: 'Exécutez le fichier de configuration de diagnostic suivant et fournissez une capture d\'écran:\n[TX Support Tool](https://cdn.discordapp.com/attachments/1413199327249170472/1418206411178901558/TX_Support_Tool.exe)',
                    inline: false
                },
                {
                    name: '⚠️ Notes Importantes',
                    value: '• Ne pas suivre ces étapes peut entraîner des retards ou nous empêcher de fournir un support efficace\n• Veuillez vous assurer que toutes les informations demandées sont soumises rapidement\n• Une fois tout soumis, veuillez attendre patiemment qu\'un administrateur réponde\n• L\'inactivité dans le ticket peut entraîner sa fermeture automatique',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Support • Veuillez suivre toutes les exigences' })
            .setTimestamp();

        await interaction.reply({ embeds: [supportEmbedFR] });
    }

    // HWID Reset Commands
    if (commandName === 'hwidreseteng') {
        const hwidEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🔄 HWID Reset Requirements')
            .setDescription('To assist you with your HWID reset request, please provide the following information:')
            .addFields(
                {
                    name: '📄 Required Documents',
                    value: '• A clear and detailed image of your invoice ID\n• A screenshot or photo of your payment confirmation\n• The email associated with your key\n• The reason you are requesting a reset',
                    inline: false
                },
                {
                    name: '⏳ Processing Time',
                    value: 'Once all required information has been submitted, kindly allow some time for our team to review and respond accordingly.',
                    inline: false
                }
            )
            .setFooter({ text: 'HWID Reset Team • All information is required' })
            .setTimestamp();

        await interaction.reply({ embeds: [hwidEmbed] });
    }

    if (commandName === 'hwidresetdu') {
        const hwidEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🔄 HWID-Reset Anforderungen')
            .setDescription('Um Ihnen bei Ihrer HWID-Reset-Anfrage zu helfen, stellen Sie bitte die folgenden Informationen bereit:')
            .addFields(
                {
                    name: '📄 Erforderliche Dokumente',
                    value: '• Ein klares und detailliertes Bild Ihrer Rechnungs-ID\n• Ein Screenshot oder Foto Ihrer Zahlungsbestätigung\n• Die E-Mail, die mit Ihrem Schlüssel verknüpft ist\n• Der Grund für Ihre Reset-Anfrage',
                    inline: false
                },
                {
                    name: '⏳ Bearbeitungszeit',
                    value: 'Sobald alle erforderlichen Informationen übermittelt wurden, gewähren Sie unserem Team bitte etwas Zeit zur Überprüfung und entsprechenden Antwort.',
                    inline: false
                }
            )
            .setFooter({ text: 'HWID-Reset Team • Alle Informationen sind erforderlich' })
            .setTimestamp();

        await interaction.reply({ embeds: [hwidEmbedDE] });
    }

    if (commandName === 'hwidresetfr') {
        const hwidEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🔄 Exigences de Réinitialisation HWID')
            .setDescription('Pour vous aider avec votre demande de réinitialisation HWID, veuillez fournir les informations suivantes:')
            .addFields(
                {
                    name: '📄 Documents Requis',
                    value: '• Une image claire et détaillée de votre ID de facture\n• Une capture d\'écran ou photo de votre confirmation de paiement\n• L\'e-mail associé à votre clé\n• La raison pour laquelle vous demandez une réinitialisation',
                    inline: false
                },
                {
                    name: '⏳ Temps de Traitement',
                    value: 'Une fois que toutes les informations requises ont été soumises, veuillez accorder du temps à notre équipe pour examiner et répondre en conséquence.',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Réinitialisation HWID • Toutes les informations sont requises' })
            .setTimestamp();

        await interaction.reply({ embeds: [hwidEmbedFR] });
    }

    // HWID Reset Done Commands
    if (commandName === 'hwidresetdoneeng') {
        const resetDoneEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('✅ HWID Reset Completed')
            .setDescription('Your HWID reset has been successfully processed and completed.')
            .addFields(
                {
                    name: '🎯 Status Update',
                    value: 'Your hardware identification has been reset and is now ready for use with your product.',
                    inline: false
                },
                {
                    name: '📝 Next Steps',
                    value: 'You may now proceed to use your product normally. If you experience any further issues, please don\'t hesitate to create a new support ticket.',
                    inline: false
                }
            )
            .setFooter({ text: 'HWID Reset Team • Process Complete' })
            .setTimestamp();

        await interaction.reply({ embeds: [resetDoneEmbed] });
    }

    if (commandName === 'hwidresetdonedu') {
        const resetDoneEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('✅ HWID-Reset Abgeschlossen')
            .setDescription('Ihr HWID-Reset wurde erfolgreich verarbeitet und abgeschlossen.')
            .addFields(
                {
                    name: '🎯 Status-Update',
                    value: 'Ihre Hardware-Identifikation wurde zurückgesetzt und ist nun für die Verwendung mit Ihrem Produkt bereit.',
                    inline: false
                },
                {
                    name: '📝 Nächste Schritte',
                    value: 'Sie können Ihr Produkt nun normal verwenden. Sollten Sie weitere Probleme haben, erstellen Sie bitte ein neues Support-Ticket.',
                    inline: false
                }
            )
            .setFooter({ text: 'HWID-Reset Team • Vorgang Abgeschlossen' })
            .setTimestamp();

        await interaction.reply({ embeds: [resetDoneEmbedDE] });
    }

    if (commandName === 'hwidresetdonefr') {
        const resetDoneEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('✅ Réinitialisation HWID Terminée')
            .setDescription('Votre réinitialisation HWID a été traitée avec succès et terminée.')
            .addFields(
                {
                    name: '🎯 Mise à jour du Statut',
                    value: 'Votre identification matérielle a été réinitialisée et est maintenant prête à être utilisée avec votre produit.',
                    inline: false
                },
                {
                    name: '📝 Prochaines Étapes',
                    value: 'Vous pouvez maintenant utiliser votre produit normalement. Si vous rencontrez d\'autres problèmes, n\'hésitez pas à créer un nouveau ticket de support.',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Réinitialisation HWID • Processus Terminé' })
            .setTimestamp();

        await interaction.reply({ embeds: [resetDoneEmbedFR] });
    }

    // Ticket Done Commands
    if (commandName === 'ticketdoneeng') {
        const ticketDoneEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🎉 Thank You for Your Business')
            .setDescription('Thank you for shopping with us! We appreciate your trust in our services.')
            .addFields(
                {
                    name: '🔒 Ticket Closure',
                    value: 'This support ticket will be closed shortly. If you need further assistance, please feel free to create a new ticket.',
                    inline: false
                },
                {
                    name: '⭐ Feedback',
                    value: 'We value your experience with us. Thank you for choosing our services!',
                    inline: false
                }
            )
            .setFooter({ text: 'Support Team • Thank you for your business' })
            .setTimestamp();

        await interaction.reply({ embeds: [ticketDoneEmbed] });
    }

    if (commandName === 'ticketdonedu') {
        const ticketDoneEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🎉 Vielen Dank für Ihr Vertrauen')
            .setDescription('Vielen Dank, dass Sie bei uns eingekauft haben! Wir schätzen Ihr Vertrauen in unsere Dienste.')
            .addFields(
                {
                    name: '🔒 Ticket-Schließung',
                    value: 'Dieses Support-Ticket wird in Kürze geschlossen. Wenn Sie weitere Hilfe benötigen, erstellen Sie gerne ein neues Ticket.',
                    inline: false
                },
                {
                    name: '⭐ Feedback',
                    value: 'Wir schätzen Ihre Erfahrung mit uns. Vielen Dank, dass Sie sich für unsere Dienste entschieden haben!',
                    inline: false
                }
            )
            .setFooter({ text: 'Support Team • Vielen Dank für Ihr Vertrauen' })
            .setTimestamp();

        await interaction.reply({ embeds: [ticketDoneEmbedDE] });
    }

    if (commandName === 'ticketdonefr') {
        const ticketDoneEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🎉 Merci pour Votre Confiance')
            .setDescription('Merci d\'avoir fait vos achats chez nous! Nous apprécions votre confiance en nos services.')
            .addFields(
                {
                    name: '🔒 Fermeture du Ticket',
                    value: 'Ce ticket de support sera fermé sous peu. Si vous avez besoin d\'une assistance supplémentaire, n\'hésitez pas à créer un nouveau ticket.',
                    inline: false
                },
                {
                    name: '⭐ Commentaires',
                    value: 'Nous valorisons votre expérience avec nous. Merci d\'avoir choisi nos services!',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Support • Merci pour votre confiance' })
            .setTimestamp();

        await interaction.reply({ embeds: [ticketDoneEmbedFR] });
    }
});

client.login(process.env.DISCORD_TOKEN);
