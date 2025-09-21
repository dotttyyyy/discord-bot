// index.js - 100% WORKING VERSION
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// API Configuration
const API_KEY = '5244265|C0ovkR6WFbzBV5R3lA6DPx5gIgA4KYf6NL8EwZHx7102715a';
const SHOP_ID = 5244265; // Integer as per documentation
const BASE_URL = 'https://api.sellauth.com/v1';

// Redact sensitive information
function redactSensitive(text) {
    if (!text) return 'N/A';
    return text.toString()
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]')
        .replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '[IP REDACTED]')
        .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD REDACTED]');
}

// Get single invoice
async function getInvoice(invoiceId) {
    try {
        console.log(`Fetching invoice: ${invoiceId} from shop: ${SHOP_ID}`);
        
        const response = await axios.get(`${BASE_URL}/shops/${SHOP_ID}/invoices/${invoiceId}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('Invoice found:', response.data);
        return response.data;
    } catch (error) {
        console.error('Invoice fetch error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
}

// Get list of invoices 
async function getInvoicesList(limit = 10) {
    try {
        console.log(`Fetching recent invoices from shop: ${SHOP_ID}`);
        
        const response = await axios.get(`${BASE_URL}/shops/${SHOP_ID}/invoices`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                perPage: limit,
                orderColumn: 'created_at',
                orderDirection: 'desc'
            },
            timeout: 10000
        });
        
        console.log('Invoices list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Invoice list error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
}

// Test API connection
async function testAPI() {
    try {
        console.log(`Testing API connection for shop: ${SHOP_ID}`);
        
        const response = await axios.get(`${BASE_URL}/shops/${SHOP_ID}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('API test successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('API test error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
}

// Create invoice embed
function createInvoiceEmbed(invoice) {
    const embed = new EmbedBuilder()
        .setColor(invoice.status === 'completed' ? 0x00FF00 : invoice.status === 'pending' ? 0xFFA500 : 0xFF0000)
        .setTitle(`📄 Invoice #${invoice.id}`)
        .setTimestamp();

    // Customer email (redacted)
    if (invoice.email) {
        embed.addFields({ 
            name: '📧 Customer Email', 
            value: redactSensitive(invoice.email), 
            inline: true 
        });
    }

    // Purchase time
    if (invoice.created_at) {
        const purchaseDate = new Date(invoice.created_at);
        embed.addFields({ 
            name: '⏰ Purchase Time', 
            value: purchaseDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC'
            }) + ' UTC', 
            inline: true 
        });
    }

    // Products/Keys delivered
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
        const products = invoice.invoice_items.map(item => {
            const productName = item.product?.name || item.variant?.name || 'Unknown Product';
            const quantity = item.quantity || 1;
            const deliverables = item.deliverables ? ` (${item.deliverables.length} keys)` : '';
            return `• ${productName} (Qty: ${quantity})${deliverables}`;
        }).join('\n');
        
        embed.addFields({ 
            name: '🔑 Products/Keys Delivered', 
            value: products.length > 1000 ? products.substring(0, 1000) + '...' : products, 
            inline: false 
        });
    }

    // Price information
    if (invoice.price_usd) {
        embed.addFields({ 
            name: '💰 Total Amount', 
            value: `$${invoice.price_usd}`, 
            inline: true 
        });
    }

    if (invoice.paid_usd && invoice.paid_usd !== invoice.price_usd) {
        embed.addFields({ 
            name: '💳 Amount Paid', 
            value: `$${invoice.paid_usd}`, 
            inline: true 
        });
    }

    // Status
    if (invoice.status) {
        const statusEmoji = {
            'completed': '✅',
            'pending': '⏳',
            'cancelled': '❌',
            'refunded': '↩️'
        };
        embed.addFields({ 
            name: '📊 Status', 
            value: `${statusEmoji[invoice.status] || '❓'} ${invoice.status.toUpperCase()}`, 
            inline: true 
        });
    }

    // Payment gateway
    if (invoice.gateway) {
        embed.addFields({ 
            name: '💳 Payment Gateway', 
            value: invoice.gateway, 
            inline: true 
        });
    }

    // Additional info (with sensitive data redacted)
    const additionalInfo = [];
    if (invoice.completed_at && invoice.status === 'completed') {
        const completedDate = new Date(invoice.completed_at);
        additionalInfo.push(`✅ Completed: ${completedDate.toLocaleString()}`);
    }
    if (invoice.coupon_code) additionalInfo.push(`🎫 Coupon: ${invoice.coupon_code}`);
    if (invoice.ip) additionalInfo.push(`🌐 IP: [REDACTED]`);
    if (invoice.discord_username) additionalInfo.push(`🎮 Discord: ${invoice.discord_username}`);
    
    if (additionalInfo.length > 0) {
        embed.addFields({ 
            name: '📋 Additional Information', 
            value: additionalInfo.join('\n'), 
            inline: false 
        });
    }

    return embed;
}

// Register slash commands
async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('invoice')
            .setDescription('Get specific invoice information')
            .addStringOption(option => 
                option.setName('id')
                    .setDescription('Invoice ID')
                    .setRequired(true)
            ),
        
        new SlashCommandBuilder()
            .setName('recent')
            .setDescription('Get recent invoices')
            .addIntegerOption(option =>
                option.setName('limit')
                    .setDescription('Number of invoices to show (1-25)')
                    .setMinValue(1)
                    .setMaxValue(25)
            ),
        
        new SlashCommandBuilder()
            .setName('test')
            .setDescription('Test API connection')
    ];

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        console.log('Registering slash commands...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        
        console.log('Successfully registered slash commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

// Bot ready event
client.once('ready', async () => {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    console.log(`📡 Connected to ${client.guilds.cache.size} servers`);
    await registerCommands();
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        await interaction.deferReply();

        if (commandName === 'test') {
            try {
                const shopData = await testAPI();
                
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✅ API Connection Test')
                    .addFields(
                        { name: '🏪 Shop Name', value: shopData.name || 'Unknown', inline: true },
                        { name: '🆔 Shop ID', value: SHOP_ID.toString(), inline: true },
                        { name: '🔑 API Key', value: `${API_KEY.substring(0, 15)}...`, inline: true }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ API Test Failed')
                    .setDescription(`Error: ${error.response?.data?.message || error.message}`)
                    .setTimestamp();
                    
                await interaction.editReply({ embeds: [errorEmbed] });
            }
        }

        else if (commandName === 'recent') {
            const limit = interaction.options.getInteger('limit') || 10;
            
            try {
                const invoicesData = await getInvoicesList(limit);
                const invoices = invoicesData.data || invoicesData;
                
                if (!invoices || invoices.length === 0) {
                    await interaction.editReply('No invoices found.');
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`📋 Recent ${invoices.length} Invoices`)
                    .setTimestamp();

                const invoiceList = invoices.slice(0, 15).map(invoice => {
                    const date = new Date(invoice.created_at).toLocaleDateString();
                    const status = invoice.status === 'completed' ? '✅' : invoice.status === 'pending' ? '⏳' : '❌';
                    const email = redactSensitive(invoice.email);
                    return `${status} **${invoice.id}** - ${email} - $${invoice.price_usd || '0'} (${date})`;
                }).join('\n');

                embed.setDescription(invoiceList);
                
                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ Failed to fetch recent invoices')
                    .setDescription(`Error: ${error.response?.data?.message || error.message}`)
                    .setTimestamp();
                    
                await interaction.editReply({ embeds: [errorEmbed] });
            }
        }

        else if (commandName === 'invoice') {
            const invoiceId = interaction.options.getString('id');
            
            try {
                const invoice = await getInvoice(invoiceId);
                const embed = createInvoiceEmbed(invoice);
                
                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                let errorMessage = 'Unknown error occurred';
                
                if (error.response?.status === 404) {
                    errorMessage = `Invoice "${invoiceId}" not found. Use \`/recent\` to see available invoice IDs.`;
                } else if (error.response?.status === 401) {
                    errorMessage = 'API authentication failed. Invalid API key.';
                } else if (error.response?.status === 403) {
                    errorMessage = 'Access forbidden. Check API permissions.';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }

                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ Invoice Lookup Failed')
                    .setDescription(errorMessage)
                    .setTimestamp();
                    
                await interaction.editReply({ embeds: [errorEmbed] });
            }
        }

    } catch (error) {
        console.error('Interaction error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Command Error')
            .setDescription('An unexpected error occurred while processing your command.')
            .setTimestamp();

        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ embeds: [errorEmbed] });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
});

// Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login
client.login(process.env.DISCORD_TOKEN);
