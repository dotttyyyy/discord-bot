await interaction.reply({ embeds: [ticketDoneEmbedFR] });
    }

    // Status Commands
    if (commandName === 'statuseng') {
        const statusEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📊 Product Status')
            .setDescription('Check the current status of all our products and services.')
            .addFields(
                {
                    name: '🔗 Status Page',
                    value: '[View Live Status](https://dottyservices.online/status)\nMonitor real-time status updates for all products',
                    inline: false
                },
                {
                    name: '⚠️ Important Notice',
                    value: 'Always check the status page before using any products to ensure optimal performance and avoid potential issues.',
                    inline: false
                }
            )
            .setFooter({ text: 'Status Team • Always check before use' })
            .setTimestamp();

        await interaction.reply({ embeds: [statusEmbed] });
    }

    if (commandName === 'statusdu') {
        const statusEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📊 Produktstatus')
            .setDescription('Überprüfen Sie den aktuellen Status aller unserer Produkte und Dienstleistungen.')
            .addFields(
                {
                    name: '🔗 Status-Seite',
                    value: '[Live-Status anzeigen](https://dottyservices.online/status)\nÜberwachen Sie Echtzeit-Status-Updates für alle Produkte',
                    inline: false
                },
                {
                    name: '⚠️ Wichtiger Hinweis',
                    value: 'Überprüfen Sie immer die Status-Seite vor der Verwendung von Produkten, um optimale Leistung zu gewährleisten und potenzielle Probleme zu vermeiden.',
                    inline: false
                }
            )
            .setFooter({ text: 'Status Team • Immer vor Gebrauch prüfen' })
            .setTimestamp();

        await interaction.reply({ embeds: [statusEmbedDE] });
    }

    if (commandName === 'statusfr') {
        const statusEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📊 Statut des Produits')
            .setDescription('Vérifiez le statut actuel de tous nos produits et services.')
            .addFields(
                {
                    name: '🔗 Page de Statut',
                    value: '[Voir le Statut en Direct](https://dottyservices.online/status)\nSurveiller les mises à jour de statut en temps réel pour tous les produits',
                    inline: false
                },
                {
                    name: '⚠️ Avis Important',
                    value: 'Vérifiez toujours la page de statut avant d\'utiliser des produits pour assurer des performances optimales et éviter des problèmes potentiels.',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Statut • Toujours vérifier avant utilisation' })
            .setTimestamp();

        await interaction.reply({ embeds: [statusEmbedFR] });
    }

    // Unlocker Help Commands
    if (commandName === 'unlockerhelpeng') {
        const unlockerEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🔓 Unlocker Help Guide')
            .setDescription('Need help with the unlocker? Follow our comprehensive video guide.')
            .addFields(
                {
                    name: '🎥 Video Tutorial',
                    value: '[Watch Help Video](https://streamable.com/zn260n)\nStep-by-step instructions for unlocker usage',
                    inline: false
                },
                {
                    name: '📋 Instructions',
                    value: 'Please follow the video tutorial carefully for proper unlocker setup and usage. The video covers all essential steps.',
                    inline: false
                }
            )
            .setFooter({ text: 'Unlocker Support • Follow the video guide' })
            .setTimestamp();

        await interaction.reply({ embeds: [unlockerEmbed] });
    }

    if (commandName === 'unlockerhelpdu') {
        const unlockerEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🔓 Unlocker-Hilfe-Leitfaden')
            .setDescription('Benötigen Sie Hilfe mit dem Unlocker? Folgen Sie unserem umfassenden Video-Leitfaden.')
            .addFields(
                {
                    name: '🎥 Video-Tutorial',
                    value: '[Hilfe-Video ansehen](https://streamable.com/zn260n)\nSchritt-für-Schritt-Anleitung für die Unlocker-Nutzung',
                    inline: false
                },
                {
                    name: '📋 Anweisungen',
                    value: 'Bitte folgen Sie dem Video-Tutorial sorgfältig für die ordnungsgemäße Unlocker-Einrichtung und -Nutzung. Das Video deckt alle wesentlichen Schritte ab.',
                    inline: false
                }
            )
            .setFooter({ text: 'Unlocker-Support • Folgen Sie der Video-Anleitung' })
            .setTimestamp();

        await interaction.reply({ embeds: [unlockerEmbedDE] });
    }

    if (commandName === 'unlockerhelpfr') {
        const unlockerEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🔓 Guide d\'Aide Unlocker')
            .setDescription('Besoin d\'aide avec l\'unlocker? Suivez notre guide vidéo complet.')
            .addFields(
                {
                    name: '🎥 Tutoriel Vidéo',
                    value: '[Regarder la Vidéo d\'Aide](https://streamable.com/zn260n)\nInstructions étape par étape pour l\'utilisation de l\'unlocker',
                    inline: false
                },
                {
                    name: '📋 Instructions',
                    value: 'Veuillez suivre attentivement le tutoriel vidéo pour une configuration et utilisation appropriée de l\'unlocker. La vidéo couvre toutes les étapes essentielles.',
                    inline: false
                }
            )
            .setFooter({ text: 'Support Unlocker • Suivez le guide vidéo' })
            .setTimestamp();

        await interaction.reply({ embeds: [unlockerEmbedFR] });
    }

    // Setup Guide Commands
    if (commandName === 'setupguideeng') {
        const setupEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('⚙️ Product Setup Guide')
            .setDescription('Complete setup guide for all our products and services.')
            .addFields(
                {
                    name: '📖 Setup Documentation',
                    value: '[View Setup Guide](https://dottyservices.online/setup)\nComprehensive setup instructions for all products',
                    inline: false
                },
                {
                    name: '🔧 Installation Help',
                    value: 'Follow the setup guide carefully for proper installation and configuration of your products.',
                    inline: false
                }
            )
            .setFooter({ text: 'Setup Team • Follow the complete guide' })
            .setTimestamp();

        await interaction.reply({ embeds: [setupEmbed] });
    }

    if (commandName === 'setupguidedu') {
        const setupEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('⚙️ Produkt-Setup-Leitfaden')
            .setDescription('Vollständiger Setup-Leitfaden für alle unsere Produkte und Dienstleistungen.')
            .addFields(
                {
                    name: '📖 Setup-Dokumentation',
                    value: '[Setup-Leitfaden anzeigen](https://dottyservices.online/setup)\nUmfassende Setup-Anweisungen für alle Produkte',
                    inline: false
                },
                {
                    name: '🔧 Installationshilfe',
                    value: 'Folgen Sie dem Setup-Leitfaden sorgfältig für die ordnungsgemäße Installation und Konfiguration Ihrer Produkte.',
                    inline: false
                }
            )
            .setFooter({ text: 'Setup Team • Folgen Sie dem vollständigen Leitfaden' })
            .setTimestamp();

        await interaction.reply({ embeds: [setupEmbedDE] });
    }

    if (commandName === 'setupguidefr') {
        const setupEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('⚙️ Guide de Configuration des Produits')
            .setDescription('Guide de configuration complet pour tous nos produits et services.')
            .addFields(
                {
                    name: '📖 Documentation de Configuration',
                    value: '[Voir le Guide de Configuration](https://dottyservices.online/setup)\nInstructions de configuration complètes pour tous les produits',
                    inline: false
                },
                {
                    name: '🔧 Aide à l\'Installation',
                    value: 'Suivez attentivement le guide de configuration pour une installation et configuration appropriée de vos produits.',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Configuration • Suivez le guide complet' })
            .setTimestamp();

        await interaction.reply({ embeds: [setupEmbedFR] });
    }

    // All Commands List (Staff Only)
    if (commandName === 'allcmds') {
        const allCmdsEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🤖 All Bot Commands')
            .setDescription('Complete list of available bot commands for support staff.')
            .addFields(
                {
                    name: '📋 Support Ticket Commands',
                    value: '`/supportticketeng` - Support requirements (English)\n`/supportticketdu` - Support requirements (German)\n`/supportticketfr` - Support requirements (French)',
                    inline: false
                },
                {
                    name: '🔄 HWID Reset Commands',
                    value: '`/hwidreseteng` - HWID reset requirements (English)\n`/hwidresetdu` - HWID reset requirements (German)\n`/hwidresetfr` - HWID reset requirements (French)',
                    inline: false
                },
                {
                    name: '✅ HWID Reset Done Commands',
                    value: '`/hwidresetdoneeng` - Notify reset complete (English)\n`/hwidresetdonedu` - Notify reset complete (German)\n`/hwidresetdonefr` - Notify reset complete (French)',
                    inline: false
                },
                {
                    name: '🎉 Ticket Done Commands',
                    value: '`/ticketdoneeng` - Thank user & close ticket (English)\n`/ticketdonedu` - Thank user & close ticket (German)\n`/ticketdonefr` - Thank user & close ticket (French)',
                    inline: false
                },
                {
                    name: '📊 Status Commands',
                    value: '`/statuseng` - Product status page (English)\n`/statusdu` - Product status page (German)\n`/statusfr` - Product status page (French)',
                    inline: false
                },
                {
                    name: '🔓 Unlocker Help Commands',
                    value: '`/unlockerhelpeng` - Unlocker video guide (English)\n`/unlockerhelpdu` - Unlocker video guide (German)\n`/unlockerhelpfr` - Unlocker video guide (French)',
                    inline: false
                },
                {
                    name: '⚙️ Setup Guide Commands',
                    value: '`/setupguideeng` - Product setup guide (English)\n`/setupguidedu` - Product setup guide (German)\n`/setupguidefr` - Product setup guide (French)',
                    inline: false
                },
                {
                    name: '📝 Staff Commands',
                    value: '`/allcmds` - Display all commands (Staff Only)',
                    inline: false
                },
                {
                    name: '💰 Refund Process Commands',
                    value: '`/refundprocesseng` - Refund policy & process (English)\n`/refundprocessdu` - Refund policy & process (German)\n`/refundprocessfr` - Refund policy & process (French)',
                    inline: false
                }
            )
            .setFooter({ text: 'Bot Commands • Total: 25 Commands' })
            .setTimestamp();

        await interaction.reply({ embeds: [allCmdsEmbed] });
    }

    // Refund Process Commands
    if (commandName === 'refundprocesseng') {
        const refundEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('💰 Refund Policy & Process')
            .setDescription('Our refund policy in accordance with EU and German consumer protection laws.')
            .addFields(
                {
                    name: '✅ Eligibility for Refunds',
                    value: '• Digital content not delivered due to technical issues on our side\n• Product is unusable due to technical problems from our end\n• Must be requested within 14 days of purchase',
                    inline: false
                },
                {
                    name: '❌ Refund Limitations',
                    value: '• Refunds are not guaranteed if the product has been accessed, downloaded, or used successfully\n• Must comply with EU Directive 2011/83/EU on Consumer Rights',
                    inline: false
                },
                {
                    name: '📧 How to Request',
                    value: 'Contact us at: dottywotty1234@outlook.com\nInclude your purchase details and reason for refund request',
                    inline: false
                }
            )
            .setFooter({ text: 'Refund Team • EU Consumer Rights Protected' })
            .setTimestamp();

        await interaction.reply({ embeds: [refundEmbed] });
    }

    if (commandName === 'refundprocessdu') {
        const refundEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('💰 Rückerstattungsrichtlinie & Verfahren')
            .setDescription('Unsere Rückerstattungsrichtlinie in Übereinstimmung mit EU- und deutschen Verbraucherschutzgesetzen.')
            .addFields(
                {
                    name: '✅ Berechtigung für Rückerstattungen',
                    value: '• Digitale Inhalte nicht geliefert aufgrund technischer Probleme unsererseits\n• Produkt ist aufgrund technischer Probleme von unserer Seite unbrauchbar\n• Muss innerhalb von 14 Tagen nach dem Kauf beantragt werden',
                    inline: false
                },
                {
                    name: '❌ Rückerstattungsbeschränkungen',
                    value: '• Rückerstattungen sind nicht garantiert, wenn das Produkt bereits aufgerufen, heruntergeladen oder erfolgreich verwendet wurde\n• Muss der EU-Richtlinie 2011/83/EU über Verbraucherrechte entsprechen',
                    inline: false
                },
                {
                    name: '📧 Wie man anfragt',
                    value: 'Kontaktieren Sie uns unter: dottywotty1234@outlook.com\nFügen Sie Ihre Kaufdetails und den Grund für die Rückerstattungsanfrage bei',
                    inline: false
                }
            )
            .setFooter({ text: 'Rückerstattungsteam • EU-Verbraucherrechte geschützt' })
            .setTimestamp();

        await interaction.reply({ embeds: [refundEmbedDE] });
    }

    if (commandName === 'refundprocessfr') {
        const refundEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('💰 Politique de Remboursement & Processus')
            .setDescription('Notre politique de remboursement conforme aux lois de protection des consommateurs de l\'UE et d\'Allemagne.')
            .addFields(
                {
                    name: '✅ Éligibilité aux Remboursements',
                    value: '• Contenu numérique non livré en raison de problèmes techniques de notre côté\n• Produit inutilisable en raison de problèmes techniques de notre côté\n• Doit être demandé dans les 14 jours suivant l\'achat',
                    inline: false
                },
                {
                    name: '❌ Limitations de Remboursement',
                    value: '• Les remboursements ne sont pas garantis si le produit a été consulté, téléchargé ou utilisé avec succès\n• Doit être conforme à la Directive UE 2011/83/UE sur les droits des consommateurs',
                    inline: false
                },
                {
                    name: '📧 Comment Demander',
                    value: 'Contactez-nous à: dottywotty1234@outlook.com\nIncluez vos détails d\'achat et la raison de la demande de remboursement',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Remboursement • Droits des Consommateurs UE Protégés' })
            .setTimestamp();

        await interaction.reply({ embeds: [refundEmbedFR] });
    }

    // Status Commands
    if (commandName === 'statuseng') {
        const statusEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📊 Product Status')
            .setDescription('Check the current status of all our products and services.')
            .addFields(
                {
                    name: '🔗 Status Page',
                    value: '[View Live Status](https://dottyservices.online/status)\nMonitor real-time status updates for all products',
                    inline: false
                },
                {
                    name: '⚠️ Important Notice',
                    value: 'Always check the status page before using any products to ensure optimal performance and avoid potential issues.',
                    inline: false
                }
            )
            .setFooter({ text: 'Status Team • Always check before use' })
            .setTimestamp();

        await interaction.reply({ embeds: [statusEmbed] });
    }

    if (commandName === 'statusdu') {
        const statusEmbedDE = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📊 Produktstatus')
            .setDescription('Überprüfen Sie den aktuellen Status aller unserer Produkte und Dienstleistungen.')
            .addFields(
                {
                    name: '🔗 Status-Seite',
                    value: '[Live-Status anzeigen](https://dottyservices.online/status)\nÜberwachen Sie Echtzeit-Status-Updates für alle Produkte',
                    inline: false
                },
                {
                    name: '⚠️ Wichtiger Hinweis',
                    value: 'Überprüfen Sie immer die Status-Seite vor der Verwendung von Produkten, um optimale Leistung zu gewährleisten und potenzielle Probleme zu vermeiden.',
                    inline: false
                }
            )
            .setFooter({ text: 'Status Team • Immer vor Gebrauch prüfen' })
            .setTimestamp();

        await interaction.reply({ embeds: [statusEmbedDE] });
    }

    if (commandName === 'statusfr') {
        const statusEmbedFR = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('📊 Statut des Produits')
            .setDescription('Vérifiez le statut actuel de tous nos produits et services.')
            .addFields(
                {
                    name: '🔗 Page de Statut',
                    value: '[Voir le Statut en Direct](https://dottyservices.online/status)\nSurveiller les mises à jour de statut en temps réel pour tous les produits',
                    inline: false
                },
                {
                    name: '⚠️ Avis Important',
                    value: 'Vérifiez toujours la page de statut avant d\'utiliser des produits pour assurer des performances optimales et éviter des problèmes potentiels.',
                    inline: false
                }
            )
            .setFooter({ text: 'Équipe de Statut • Toujours vérifier avant utilisation' })
            .setTimestamp();

        await interaction.reply({ embeds: [statusEmbedFR] });
    }

    // Unlocker Help Commands
    if (commandName === 'unlockerhelpeng') {
        const unlockerEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('🔓 Unlocker Help Guide')
            .setDescription('Need help with the unlocker? Follow our comprehensive video guide.')
            .addFields(
                {
                    name: '🎥 Video Tutorial',
                    value: '[Watch Help Video](https://streamable.com/zn260n)\nStep-by-step instructions for unlocker usage',
                    inline: false
                },
                {
                    name: '📋 Instructions',
                    value: 'Please follow the video tutorial carefully for proper unlocker setup and usage. The video covers all essential steps.',
                    inline: false
                }
            )
            .setFooter({ text:const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');

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
        .setDescription('Thank user and notify ticket will be closed shortly (French)'),
    
    // Status Commands
    new SlashCommandBuilder()
        .setName('statuseng')
        .setDescription('Display product status and status page link (English)'),
    
    new SlashCommandBuilder()
        .setName('statusdu')
        .setDescription('Display product status and status page link (German)'),
    
    new SlashCommandBuilder()
        .setName('statusfr')
        .setDescription('Display product status and status page link (French)'),
    
    // Unlocker Help Commands
    new SlashCommandBuilder()
        .setName('unlockerhelpeng')
        .setDescription('Provide unlocker help video and instructions (English)'),
    
    new SlashCommandBuilder()
        .setName('unlockerhelpdu')
        .setDescription('Provide unlocker help video and instructions (German)'),
    
    new SlashCommandBuilder()
        .setName('unlockerhelpfr')
        .setDescription('Provide unlocker help video and instructions (French)'),
    
    // Setup Guide Commands
    new SlashCommandBuilder()
        .setName('setupguideeng')
        .setDescription('Provide setup guide for all products (English)'),
    
    new SlashCommandBuilder()
        .setName('setupguidedu')
        .setDescription('Provide setup guide for all products (German)'),
    
    new SlashCommandBuilder()
        .setName('setupguidefr')
        .setDescription('Provide setup guide for all products (French)'),
    
    // All Commands List (Staff Only)
    new SlashCommandBuilder()
        .setName('allcmds')
        .setDescription('Display all available bot commands (Staff Only)'),
    
    // Refund Process Commands
    new SlashCommandBuilder()
        .setName('refundprocesseng')
        .setDescription('Display refund policy and process (English)'),
    
    new SlashCommandBuilder()
        .setName('refundprocessdu')
        .setDescription('Display refund policy and process (German)'),
    
    new SlashCommandBuilder()
        .setName('refundprocessfr')
        .setDescription('Display refund policy and process (French)')
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
    client.user.setActivity('Helping users', { type: 'WATCHING' });
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
