const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const https = require('https');
const querystring = require('querystring');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Store original messages for translation
const messageStore = new Map();

// Simple translation function using basic HTTPS request
function translateText(text, targetLang) {
    return new Promise((resolve, reject) => {
        const params = querystring.stringify({
            q: text,
            langpair: `auto|${targetLang}`
        });
        
        const options = {
            hostname: 'api.mymemory.translated.net',
            port: 443,
            path: `/get?${params}`,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.responseStatus === 200) {
                        resolve({ text: response.responseData.translatedText });
                    } else {
                        reject(new Error('Translation failed'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

client.on('ready', () => {
    console.log(`🤖 ${client.user.tag} is online and ready to translate!`);
});

client.on('messageCreate', async (message) => {
    // Ignore bot messages and empty messages
    if (message.author.bot || !message.content.trim()) return;
    
    // Only work in the specified channel - CHANGE THIS TO YOUR CHANNEL ID
    if (message.channel.id !== '1414421793393082461') return;
    
    // Skip if message is too short (less than 3 characters)
    if (message.content.length < 3) return;

    try {
        // Create translation buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`translate_de_${message.id}`)
                    .setLabel('🇩🇪 Auf Deutsch übersetzen')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`translate_fr_${message.id}`)
                    .setLabel('🇫🇷 Traduire en français')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`translate_es_${message.id}`)
                    .setLabel('🇪🇸 Traducir al español')
                    .setStyle(ButtonStyle.Secondary)
            );

        // Store the original message
        messageStore.set(message.id, {
            content: message.content,
            author: message.author.username,
            timestamp: Date.now()
        });

        // Clean up old stored messages (older than 1 hour)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        for (const [id, data] of messageStore.entries()) {
            if (data.timestamp < oneHourAgo) {
                messageStore.delete(id);
            }
        }

        // Reply with translation options
        await message.reply({
            components: [row],
            allowedMentions: { repliedUser: false }
        });

    } catch (error) {
        console.error('Error creating translation buttons:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const [action, language, messageId] = interaction.customId.split('_');
    
    if (action !== 'translate') return;

    // Get the original message
    const originalData = messageStore.get(messageId);
    if (!originalData) {
        return await interaction.reply({
            content: '❌ Original message not found. Translation buttons expire after 1 hour.',
            ephemeral: true
        });
    }

    await interaction.deferReply();

    try {
        // Translate the message
        const result = await translateText(originalData.content, language);
        
        // Language names for display
        const languageNames = {
            'de': 'German (Deutsch)',
            'fr': 'French (Français)', 
            'es': 'Spanish (Español)'
        };

        // Language flags
        const flags = {
            'de': '🇩🇪',
            'fr': '🇫🇷',
            'es': '🇪🇸'
        };

        // Create translation embed
        const embed = new EmbedBuilder()
            .setColor(0x4285f4)
            .setTitle(`${flags[language]} Translation to ${languageNames[language]}`)
            .setDescription(`**Original:** ${originalData.content}\n\n**Translation:** ${result.text}`)
            .setFooter({ 
                text: `Translated by ${originalData.author} • Powered by MyMemory`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Translation error:', error);
        await interaction.editReply({
            content: '❌ Translation failed. Please try again later.',
        });
    }
});

// Error handling
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);
