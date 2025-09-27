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
    if (commandType === 'hwidreset') {
        if (language === 'en') {
            embed.setTitle('🔄 HWID Reset Requirements')
                .setDescription('To assist you with your HWID reset request, please provide the following information:')
                .addFields(
                    { name: '📄 Required Documents', value: '• A clear and detailed image of your invoice ID\n• A screenshot or photo of your payment confirmation\n• The email associated with your key\n• The reason you are requesting a reset', inline: false },
                    { name: '⏳ Processing Time', value: 'Once all required information has been submitted, kindly allow some time for our team to review and respond accordingly.', inline: false }
                )
                .setFooter({ text: 'HWID Reset Team • All information is required' });
        } else if (language === 'de') {
            embed.setTitle('🔄 HWID-Reset Anforderungen')
                .setDescription('Um Ihnen bei Ihrer HWID-Reset-Anfrage zu helfen, stellen Sie bitte die folgenden Informationen bereit:')
                .addFields(
                    { name: '📄 Erforderliche Dokumente', value: '• Ein klares und detailliertes Bild Ihrer Rechnungs-ID\n• Ein Screenshot oder Foto Ihrer Zahlungsbestätigung\n• Die E-Mail, die mit Ihrem Schlüssel verknüpft ist\n• Der Grund für Ihre Reset-Anfrage', inline: false },
                    { name: '⏳ Bearbeitungszeit', value: 'Sobald alle erforderlichen Informationen übermittelt wurden, gewähren Sie unserem Team bitte etwas Zeit zur Überprüfung und entsprechenden Antwort.', inline: false }
                )
                .setFooter({ text: 'HWID-Reset Team • Alle Informationen sind erforderlich' });
        } else if (language === 'fr') {
            embed.setTitle('🔄 Exigences de Réinitialisation HWID')
                .setDescription('Pour vous aider avec votre demande de réinitialisation HWID, veuillez fournir les informations suivantes:')
                .addFields(
                    { name: '📄 Documents Requis', value: '• Une image claire et détaillée de votre ID de facture\n• Une capture d\'écran ou photo de votre confirmation de paiement\n• L\'e-mail associé à votre clé\n• La raison pour laquelle vous demandez une réinitialisation', inline: false },
                    { name: '⏳ Temps de Traitement', value: 'Une fois que toutes les informations requises ont été soumises, veuillez accorder du temps à notre équipe pour examiner et répondre en conséquence.', inline: false }
                )
                .setFooter({ text: 'Équipe de Réinitialisation HWID • Toutes les informations sont requises' });
        }
    }
    
    if (commandType === 'hwidresetdone') {
        if (language === 'en') {
            embed.setTitle('✅ HWID Reset Completed')
                .setDescription('Your HWID reset has been successfully processed and completed.')
                .addFields(
                    { name: '🎯 Status Update', value: 'Your hardware identification has been reset and is now ready for use with your product.', inline: false },
                    { name: '📝 Next Steps', value: 'You may now proceed to use your product normally. If you experience any further issues, please don\'t hesitate to create a new support ticket.', inline: false }
                )
                .setFooter({ text: 'HWID Reset Team • Process Complete' });
        } else if (language === 'de') {
            embed.setTitle('✅ HWID-Reset Abgeschlossen')
                .setDescription('Ihr HWID-Reset wurde erfolgreich verarbeitet und abgeschlossen.')
                .addFields(
                    { name: '🎯 Status-Update', value: 'Ihre Hardware-Identifikation wurde zurückgesetzt und ist nun für die Verwendung mit Ihrem Produkt bereit.', inline: false },
                    { name: '📝 Nächste Schritte', value: 'Sie können Ihr Produkt nun normal verwenden. Sollten Sie weitere Probleme haben, erstellen Sie bitte ein neues Support-Ticket.', inline: false }
                )
                .setFooter({ text: 'HWID-Reset Team • Vorgang Abgeschlossen' });
        } else if (language === 'fr') {
            embed.setTitle('✅ Réinitialisation HWID Terminée')
                .setDescription('Votre réinitialisation HWID a été traitée avec succès et terminée.')
                .addFields(
                    { name: '🎯 Mise à jour du Statut', value: 'Votre identification matérielle a été réinitialisée et est maintenant prête à être utilisée avec votre produit.', inline: false },
                    { name: '📝 Prochaines Étapes', value: 'Vous pouvez maintenant utiliser votre produit normalement. Si vous rencontrez d\'autres problèmes, n\'hésitez pas à créer un nouveau ticket de support.', inline: false }
                )
                .setFooter({ text: 'Équipe de Réinitialisation HWID • Processus Terminé' });
        }
    }
    
    if (commandType === 'ticketdone') {
        if (language === 'en') {
            embed.setTitle('🎉 Thank You for Your Business')
                .setDescription('Thank you for shopping with us! We appreciate your trust in our services.')
                .addFields(
                    { name: '🔒 Ticket Closure', value: 'This support ticket will be closed shortly. If you need further assistance, please feel free to create a new ticket.', inline: false },
                    { name: '⭐ Feedback', value: 'We value your experience with us. Thank you for choosing our services!', inline: false }
                )
                .setFooter({ text: 'Support Team • Thank you for your business' });
        } else if (language === 'de') {
            embed.setTitle('🎉 Vielen Dank für Ihr Vertrauen')
                .setDescription('Vielen Dank, dass Sie bei uns eingekauft haben! Wir schätzen Ihr Vertrauen in unsere Dienste.')
                .addFields(
                    { name: '🔒 Ticket-Schließung', value: 'Dieses Support-Ticket wird in Kürze geschlossen. Wenn Sie weitere Hilfe benötigen, erstellen Sie gerne ein neues Ticket.', inline: false },
                    { name: '⭐ Feedback', value: 'Wir schätzen Ihre Erfahrung mit uns. Vielen Dank, dass Sie sich für unsere Dienste entschieden haben!', inline: false }
                )
                .setFooter({ text: 'Support Team • Vielen Dank für Ihr Vertrauen' });
        } else if (language === 'fr') {
            embed.setTitle('🎉 Merci pour Votre Confiance')
                .setDescription('Merci d\'avoir fait vos achats chez nous! Nous apprécions votre confiance en nos services.')
                .addFields(
                    { name: '🔒 Fermeture du Ticket', value: 'Ce ticket de support sera fermé sous peu. Si vous avez besoin d\'une assistance supplémentaire, n\'hésitez pas à créer un nouveau ticket.', inline: false },
                    { name: '⭐ Commentaires', value: 'Nous valorisons votre expérience avec nous. Merci d\'avoir choisi nos services!', inline: false }
                )
                .setFooter({ text: 'Équipe de Support • Merci pour votre confiance' });
        }
    }
    
    if (commandType === 'escalated') {
        if (language === 'en') {
            embed.setTitle('⬆️ Ticket Escalated')
                .setDescription('Your support ticket has been escalated for specialized assistance.')
                .addFields(
                    { name: '🔝 Escalation Notice', value: 'Your ticket has been forwarded to our administrative team and HR department for further review and assistance.', inline: false },
                    { name: '⏱️ Response Time', value: 'Please allow additional time for our specialized team to review your case thoroughly. You will receive a response as soon as possible.', inline: false },
                    { name: '📝 Important', value: 'Please do not create additional tickets for this issue. Our team will contact you through this existing ticket.', inline: false }
                )
                .setFooter({ text: 'Administrative Team • Escalated for Review' });
        } else if (language === 'de') {
            embed.setTitle('⬆️ Ticket Eskaliert')
                .setDescription('Ihr Support-Ticket wurde für spezialisierte Unterstützung eskaliert.')
                .addFields(
                    { name: '🔝 Eskalationshinweis', value: 'Ihr Ticket wurde zur weiteren Überprüfung und Unterstützung an unser Verwaltungsteam und die Personalabteilung weitergeleitet.', inline: false },
                    { name: '⏱️ Antwortzeit', value: 'Bitte gewähren Sie zusätzliche Zeit, damit unser Spezialistenteam Ihren Fall gründlich überprüfen kann. Sie erhalten schnellstmöglich eine Antwort.', inline: false },
                    { name: '📝 Wichtig', value: 'Bitte erstellen Sie keine zusätzlichen Tickets für dieses Problem. Unser Team wird Sie über dieses bestehende Ticket kontaktieren.', inline: false }
                )
                .setFooter({ text: 'Verwaltungsteam • Zur Überprüfung Eskaliert' });
        } else if (language === 'fr') {
            embed.setTitle('⬆️ Ticket Escaladé')
                .setDescription('Votre ticket de support a été escaladé pour une assistance spécialisée.')
                .addFields(
                    { name: '🔝 Avis d\'Escalade', value: 'Votre ticket a été transféré à notre équipe administrative et au département des ressources humaines pour examen et assistance supplémentaires.', inline: false },
                    { name: '⏱️ Temps de Réponse', value: 'Veuillez accorder du temps supplémentaire à notre équipe spécialisée pour examiner votre cas en détail. Vous recevrez une réponse dès que possible.', inline: false },
                    { name: '📝 Important', value: 'Veuillez ne pas créer de tickets supplémentaires pour ce problème. Notre équipe vous contactera via ce ticket existant.', inline: false }
                )
                .setFooter({ text: 'Équipe Administrative • Escaladé pour Examen' });
        }
    }
    
    if (commandType === 'status') {
        if (language === 'en') {
            embed.setTitle('📊 Product Status')
                .setDescription('Check the current status of all our products and services.')
                .addFields(
                    { name: '🔗 Status Page', value: '[View Live Status](https://dottyservices.online/status)\nMonitor real-time status updates for all products', inline: false },
                    { name: '⚠️ Important Notice', value: 'Always check the status page before using any products to ensure optimal performance and avoid potential issues.', inline: false }
                )
                .setFooter({ text: 'Status Team • Always check before use' });
        } else if (language === 'de') {
            embed.setTitle('📊 Produktstatus')
                .setDescription('Überprüfen Sie den aktuellen Status aller unserer Produkte und Dienstleistungen.')
                .addFields(
                    { name: '🔗 Status-Seite', value: '[Live-Status anzeigen](https://dottyservices.online/status)\nÜberwachen Sie Echtzeit-Status-Updates für alle Produkte', inline: false },
                    { name: '⚠️ Wichtiger Hinweis', value: 'Überprüfen Sie immer die Status-Seite vor der Verwendung von Produkten, um optimale Leistung zu gewährleisten und potenzielle Probleme zu vermeiden.', inline: false }
                )
                .setFooter({ text: 'Status Team • Immer vor Gebrauch prüfen' });
        } else if (language === 'fr') {
            embed.setTitle('📊 Statut des Produits')
                .setDescription('Vérifiez le statut actuel de tous nos produits et services.')
                .addFields(
                    { name: '🔗 Page de Statut', value: '[Voir le Statut en Direct](https://dottyservices.online/status)\nSurveiller les mises à jour de statut en temps réel pour tous les produits', inline: false },
                    { name: '⚠️ Avis Important', value: 'Vérifiez toujours la page de statut avant d\'utiliser des produits pour assurer des performances optimales et éviter des problèmes potentiels.', inline: false }
                )
                .setFooter({ text: 'Équipe de Statut • Toujours vérifier avant utilisation' });
        }
    }
    
    if (commandType === 'unlockerhelp') {
        if (language === 'en') {
            embed.setTitle('🔓 Unlocker Help Guide')
                .setDescription('Need help with the unlocker? Follow our comprehensive video guide.')
                .addFields(
                    { name: '🎥 Video Tutorial', value: '[Watch Help Video](https://streamable.com/zn260n)\nStep-by-step instructions for unlocker usage', inline: false },
                    { name: '📋 Instructions', value: 'Please follow the video tutorial carefully for proper unlocker setup and usage. The video covers all essential steps.', inline: false }
                )
                .setFooter({ text: 'Unlocker Support • Follow the video guide' });
        } else if (language === 'de') {
            embed.setTitle('🔓 Unlocker-Hilfe-Leitfaden')
                .setDescription('Benötigen Sie Hilfe mit dem Unlocker? Folgen Sie unserem umfassenden Video-Leitfaden.')
                .addFields(
                    { name: '🎥 Video-Tutorial', value: '[Hilfe-Video ansehen](https://streamable.com/zn260n)\nSchritt-für-Schritt-Anleitung für die Unlocker-Nutzung', inline: false },
                    { name: '📋 Anweisungen', value: 'Bitte folgen Sie dem Video-Tutorial sorgfältig für die ordnungsgemäße Unlocker-Einrichtung und -Nutzung. Das Video deckt alle wesentlichen Schritte ab.', inline: false }
                )
                .setFooter({ text: 'Unlocker-Support • Folgen Sie der Video-Anleitung' });
        } else if (language === 'fr') {
            embed.setTitle('🔓 Guide d\'Aide Unlocker')
                .setDescription('Besoin d\'aide avec l\'unlocker? Suivez notre guide vidéo complet.')
                .addFields(
                    { name: '🎥 Tutoriel Vidéo', value: '[Regarder la Vidéo d\'Aide](https://streamable.com/zn260n)\nInstructions étape par étape pour l\'utilisation de l\'unlocker', inline: false },
                    { name: '📋 Instructions', value: 'Veuillez suivre attentivement le tutoriel vidéo pour une configuration et utilisation appropriée de l\'unlocker. La vidéo couvre toutes les étapes essentielles.', inline: false }
                )
                .setFooter({ text: 'Support Unlocker • Suivez le guide vidéo' });
        }
    }
    
    if (commandType === 'setupguide') {
        if (language === 'en') {
            embed.setTitle('⚙️ Product Setup Guide')
                .setDescription('Complete setup guide for all our products and services.')
                .addFields(
                    { name: '📖 Setup Documentation', value: '[View Setup Guide](https://dottyservices.online/setup)\nComprehensive setup instructions for all products', inline: false },
                    { name: '🔧 Installation Help', value: 'Follow the setup guide carefully for proper installation and configuration of your products.', inline: false }
                )
                .setFooter({ text: 'Setup Team • Follow the complete guide' });
        } else if (language === 'de') {
            embed.setTitle('⚙️ Produkt-Setup-Leitfaden')
                .setDescription('Vollständiger Setup-Leitfaden für alle unsere Produkte und Dienstleistungen.')
                .addFields(
                    { name: '📖 Setup-Dokumentation', value: '[Setup-Leitfaden anzeigen](https://dottyservices.online/setup)\nUmfassende Setup-Anweisungen für alle Produkte', inline: false },
                    { name: '🔧 Installationshilfe', value: 'Folgen Sie dem Setup-Leitfaden sorgfältig für die ordnungsgemäße Installation und Konfiguration Ihrer Produkte.', inline: false }
                )
                .setFooter({ text: 'Setup Team • Folgen Sie dem vollständigen Leitfaden' });
        } else if (language === 'fr') {
            embed.setTitle('⚙️ Guide de Configuration des Produits')
                .setDescription('Guide de configuration complet pour tous nos produits et services.')
                .addFields(
                    { name: '📖 Documentation de Configuration', value: '[Voir le Guide de Configuration](https://dottyservices.online/setup)\nInstructions de configuration complètes pour tous les produits', inline: false },
                    { name: '🔧 Aide à l\'Installation', value: 'Suivez attentivement le guide de configuration pour une installation et configuration appropriée de vos produits.', inline: false }
                )
                .setFooter({ text: 'Équipe de Configuration • Suivez le guide complet' });
        }
    }
    
    if (commandType === 'refundprocess') {
        if (language === 'en') {
            embed.setTitle('💰 Refund Policy & Process')
                .setDescription('Our refund policy in accordance with EU and German consumer protection laws.')
                .addFields(
                    { name: '✅ Eligibility for Refunds', value: '• Digital content not delivered due to technical issues on our side\n• Product is unusable due to technical problems from our end\n• Must be requested within 14 days of purchase', inline: false },
                    { name: '❌ Refund Limitations', value: '• Refunds are not guaranteed if the product has been accessed, downloaded, or used successfully\n• Must comply with EU Directive 2011/83/EU on Consumer Rights', inline: false },
                    { name: '📧 How to Request', value: 'Contact us at: dottywotty1234@outlook.com\nInclude your purchase details and reason for refund request', inline: false }
                )
                .setFooter({ text: 'Refund Team • EU Consumer Rights Protected' });
        } else if (language === 'de') {
            embed.setTitle('💰 Rückerstattungsrichtlinie & Verfahren')
                .setDescription('Unsere Rückerstattungsrichtlinie in Übereinstimmung mit EU- und deutschen Verbraucherschutzgesetzen.')
                .addFields(
                    { name: '✅ Berechtigung für Rückerstattungen', value: '• Digitale Inhalte nicht geliefert aufgrund technischer Probleme unsererseits\n• Produkt ist aufgrund technischer Probleme von unserer Seite unbrauchbar\n• Muss innerhalb von 14 Tagen nach dem Kauf beantragt werden', inline: false },
                    { name: '❌ Rückerstattungsbeschränkungen', value: '• Rückerstattungen sind nicht garantiert, wenn das Produkt bereits aufgerufen, heruntergeladen oder erfolgreich verwendet wurde\n• Muss der EU-Richtlinie 2011/83/EU über Verbraucherrechte entsprechen', inline: false },
                    { name: '📧 Wie man anfragt', value: 'Kontaktieren Sie uns unter: dottywotty1234@outlook.com\nFügen Sie Ihre Kaufdetails und den Grund für die Rückerstattungsanfrage bei', inline: false }
                )
                .setFooter({ text: 'Rückerstattungsteam • EU-Verbraucherrechte geschützt' });
        } else if (language === 'fr') {
            embed.setTitle('💰 Politique de Remboursement & Processus')
                .setDescription('Notre politique de remboursement conforme aux lois de protection des consommateurs de l\'UE et d\'Allemagne.')
                .addFields(
                    { name: '✅ Éligibilité aux Remboursements', value: '• Contenu numérique non livré en raison de problèmes techniques de notre côté\n• Produit inutilisable en raison de problèmes techniques de notre côté\n• Doit être demandé dans les 14 jours suivant l\'achat', inline: false },
                    { name: '❌ Limitations de Remboursement', value: '• Les remboursements ne sont pas garantis si le produit a été consulté, téléchargé ou utilisé avec succès\n• Doit être conforme à la Directive UE 2011/83/UE sur les droits des consommateurs', inline: false },
                    { name: '📧 Comment Demander', value: 'Contactez-nous à: dottywotty1234@outlook.com\nIncluez vos détails d\'achat et la raison de la demande de remboursement', inline: false }
                )
                .setFooter({ text: 'Équipe de Remboursement • Droits des Consommateurs UE Protégés' });
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
                } else if (originalEmbed.title.includes('HWID Reset') && (originalEmbed.title.includes('Completed') || originalEmbed.title.includes('Abgeschlossen') || originalEmbed.title.includes('Terminée'))) {
                    commandType = 'hwidresetdone';
                } else if (originalEmbed.title.includes('HWID Reset') || originalEmbed.title.includes('HWID-Reset') || originalEmbed.title.includes('Réinitialisation HWID')) {
                    commandType = 'hwidreset';
                } else if (originalEmbed.title.includes('Thank You') || originalEmbed.title.includes('Vielen Dank') || originalEmbed.title.includes('Merci')) {
                    commandType = 'ticketdone';
                } else if (originalEmbed.title.includes('Escalated') || originalEmbed.title.includes('Eskaliert') || originalEmbed.title.includes('Escaladé')) {
                    commandType = 'escalated';
                } else if (originalEmbed.title.includes('Status') || originalEmbed.title.includes('Produktstatus') || originalEmbed.title.includes('Statut des Produits')) {
                    commandType = 'status';
                } else if (originalEmbed.title.includes('Unlocker')) {
                    commandType = 'unlockerhelp';
                } else if (originalEmbed.title.includes('Setup') || originalEmbed.title.includes('Configuration')) {
                    commandType = 'setupguide';
                } else if (originalEmbed.title.includes('Refund') || originalEmbed.title.includes('Rückerstattung') || originalEmbed.title.includes('Remboursement')) {
                    commandType = 'refundprocess';
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

        if (command === 'hwidreset') {
            const embed = createEmbed('hwidreset', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'hwidreset', startTime);
        }

        if (command === 'hwidresetdone') {
            const embed = createEmbed('hwidresetdone', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'hwidresetdone', startTime);
        }

        if (command === 'ticketdone') {
            const embed = createEmbed('ticketdone', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'ticketdone', startTime);
        }

        if (command === 'pleasewait') {
            const embed = createEmbed('pleasewait', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'pleasewait', startTime);
        }

        if (command === 'escalated') {
            const embed = createEmbed('escalated', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'escalated', startTime);
        }

        if (command === 'status') {
            const embed = createEmbed('status', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'status', startTime);
        }

        if (command === 'unlockerhelp') {
            const embed = createEmbed('unlockerhelp', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'unlockerhelp', startTime);
        }

        if (command === 'setupguide') {
            const embed = createEmbed('setupguide', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'setupguide', startTime);
        }

        if (command === 'refundprocess') {
            const embed = createEmbed('refundprocess', 'en');
            const buttons = createTranslationButtons();
            
            await message.delete();
            await message.channel.send({ embeds: [embed], components: [buttons] });
            logCommandUsage(message.author, 'refundprocess', startTime);
        }
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
                    { name: '📋 Commands', value: '`.supportticket` - Support requirements with translations\n`.hwidreset` - HWID reset requirements with translations\n`.hwidresetdone` - HWID reset completion notice with translations\n`.ticketdone` - Ticket closure message with translations\n`.escalated` - Escalation notice with translations\n`.status` - Product status page with translations\n`.unlockerhelp` - Unlocker video guide with translations\n`.setupguide` - Product setup documentation with translations\n`.refundprocess` - Refund policy information with translations\n`.pleasewait` - Please wait message with translations\n`.allcmds` - This command list', inline: false },
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
