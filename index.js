const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

// Store original messages for translation
const messageStore = new Map();

// Real translation function using LibreTranslate API (Railway-compatible)
async function translateText(text, targetLang) {
    try {
        // Using LibreTranslate public instance - more Railway-compatible
        const https = require('https');
        const querystring = require('querystring');
        
        const postData = JSON.stringify({
            q: text,
            source: 'auto',
            target: targetLang,
            format: 'text'
        });
        
        const options = {
            hostname: 'libretranslate.de',
            port: 443,
            path: '/translate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'DiscordBot/1.0'
            },
            timeout: 10000
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.translatedText) {
                            resolve({ text: response.translatedText });
                        } else {
                            // Fallback to mock if API response is unexpected
                            const mockTranslations = {
                                'de': `🇩🇪 [GERMAN FALLBACK]: ${text}`,
                                'fr': `🇫🇷 [FRENCH FALLBACK]: ${text}`
                            };
                            resolve({ text: mockTranslations[targetLang] || text });
                        }
                    } catch (error) {
                        // Fallback to mock if JSON parsing fails
                        const mockTranslations = {
                            'de': `🇩🇪 [GERMAN FALLBACK]: ${text}`,
                            'fr': `🇫🇷 [FRENCH FALLBACK]: ${text}`
                        };
                        resolve({ text: mockTranslations[targetLang] || text });
                    }
                });
            });

            req.on('error', (error) => {
                console.log('Translation API error, using fallback:', error.message);
                // Always fallback to mock - never crash
                const mockTranslations = {
                    'de': `🇩🇪 [GERMAN FALLBACK]: ${text}`,
                    'fr': `🇫🇷 [FRENCH FALLBACK]: ${text}`
                };
                resolve({ text: mockTranslations[targetLang] || text });
            });

            req.on('timeout', () => {
                req.destroy();
                console.log('Translation API timeout, using fallback');
                // Fallback to mock on timeout
                const mockTranslations = {
                    'de': `🇩🇪 [GERMAN FALLBACK]: ${text}`,
                    'fr': `🇫🇷 [FRENCH FALLBACK]: ${text}`
                };
                resolve({ text: mockTranslations[targetLang] || text });
            });

            req.write(postData);
            req.end();
        });
        
    } catch (error) {
        console.log('Translation function error, using fallback:', error.message);
        // Ultimate fallback - always works
        const mockTranslations = {
            'de': `🇩🇪 [GERMAN FALLBACK]: ${text}`,
            'fr': `🇫🇷 [FRENCH FALLBACK]: ${text}`
        };
        return { text: mockTranslations[targetLang] || text };
    }
}

client.on('ready', () => {
    console.log(`🤖 ${client.user.tag} is online and ready to translate!`);
});

client.on('messageCreate', async (message) => {
    // Ignore bot messages and empty messages
    if (message.author.bot || !message.content.trim()) return;
    
    // Only work in the specified channel
    if (message.channel.id !== '1414421793393082461') return;
    
    // Skip if message is too short (less than 3 characters)
    if (message.content.length < 3) return;

    try {

            }
        }

        // Reply with translation options
        await message.reply({
            content: 'Click a button to translate:',
            components: [row]
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
        
        // Language names for display (removed Spanish)
        const languageNames = {
            'de': 'German (Deutsch)',
            'fr': 'French (Français)'
        };

        // Language flags (removed Spanish)
        const flags = {
            'de': '🇩🇪',
            'fr': '🇫🇷'
        };

        // Create translation embed (Discord.js v13 style)
        const embed = new MessageEmbed()
            .setColor(0x4285f4)
            .setTitle(`${flags[language]} Translation to ${languageNames[language]}`)
            .setDescription(`**Original:** ${originalData.content}\n\n**Translation:** ${result.text}`)
            .setFooter({ 
                text: `Translated by ${originalData.author} • LibreTranslate API`,
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
