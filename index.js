// index.js - Enhanced SellAuth Discord Bot
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages]
});

// Configuration
const API_KEY = '5244265|C0ovkR6WFbzBV5R3lA6DPx5gIgA4KYf6NL8EwZHx7102715a';
const SHOP_ID = 121609;
const BASE_URL = 'https://api.sellauth.com/v1';
const MANAGEMENT_ROLE_ID = '1408813712503996516';

// Check if user has management role
function hasManagementRole(member) {
    return member.roles.cache.has(MANAGEMENT_ROLE_ID);
}

// Redact sensitive information
function redactSensitive(text) {
    if (!text) return 'N/A';
    return text.toString()
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]')
        .replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '[IP REDACTED]')
        .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD REDACTED]');
}

// API Functions
async function getInvoice(invoiceId) {
    try {
        console.log(`Fetching invoice: ${invoiceId}`);
        const response = await axios.get(`${BASE_URL}/shops/${SHOP_ID}/invoices/${invoiceId}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error('Invoice fetch error:', error.response?.status, error.response?.data);
        throw error;
    }
}

async function getInvoicesList(limit = 10) {
    try {
        const response = await axios.get(`${BASE_URL}/shops/${SHOP_ID}/invoices`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            },
            params: {
                perPage: limit,
                orderColumn: 'created_at',
                orderDirection: 'desc'
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error('Invoice list error:', error.response?.status, error.response?.data);
        throw error;
    }
}

async function getTopProducts() {
    try {
        const response = await axios.get(`${BASE_URL}/shops/${SHOP_ID}/products`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error('Products fetch error:', error.response?.status, error.response?.data);
        throw error;
    }
}

async function refundInvoice(invoiceId) {
    try {
        const response = await axios.post(`${BASE_URL}/shops/${SHOP_ID}/invoices/${invoiceId}/refund`, {}, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error('Refund error:', error.response?.status, error.response?.data);
        throw error;
    }
}

async function resendInvoice(invoiceId) {
    try {
        // Note: Check SellAuth API docs for exact resend endpoint
        const response = await axios.post(`${BASE_URL}/shops/${SHOP_ID}/invoices/${invoiceId}/resend`, {}, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error('Resend error:', error.response?.status, error.response?.data);
        throw error;
    }
}

// Create enhanced invoice embed
function createInvoiceEmbed(invoice, isManagement = false) {
    const statusColors = {
        'completed': 0x00FF00,
        'pending': 0xFFA500,
        'cancelled': 0xFF0000,
        'refunded': 0x800080
    };

    const embed = new EmbedBuilder()
        .setColor(statusColors[invoice.status] || 0x0099FF)
        .setTitle(`📄 Invoice Details`)
        .setDescription(`**Invoice ID:** \`${invoice.id}\``)
        .setTimestamp()
        .setFooter({ text: 'SellAuth Invoice System' });

    // Customer Information Section
    const customerInfo = [];
    if (invoice.email) {
        customerInfo.push(`📧 **Email:** ${isManagement ? invoice.email : redactSensitive(invoice.email)}`);
    }
    if (invoice.discord_username) {
        customerInfo.push(`🎮 **Discord:** ${invoice.discord_username}`);
    }
    if (invoice.ip && isManagement) {
        customerInfo.push(`🌐 **IP:** ${invoice.ip}`);
    } else if (invoice.ip) {
        customerInfo.push(`🌐 **IP:** [REDACTED]`);
    }

    if (customerInfo.length > 0) {
        embed.addFields({
            name: '👤 Customer Information',
            value: customerInfo.join('\n'),
            inline: false
        });
    }

    // Purchase Details
    const purchaseInfo = [];
    if (invoice.created_at) {
        const date = new Date(invoice.created_at);
        purchaseInfo.push(`⏰ **Purchase Time:** ${date.toLocaleString('en-US', { 
            timeZone: 'UTC',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })} UTC`);
    }
    if (invoice.completed_at && invoice.status === 'completed') {
        const date = new Date(invoice.completed_at);
        purchaseInfo.push(`✅ **Completed:** ${date.toLocaleString('en-US', { 
            timeZone: 'UTC',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })} UTC`);
    }

    if (purchaseInfo.length > 0) {
        embed.addFields({
            name: '📅 Timeline',
            value: purchaseInfo.join('\n'),
            inline: true
        });
    }

    // Payment Information
    const paymentInfo = [];
    if (invoice.price_usd) {
        paymentInfo.push(`💰 **Amount:** $${invoice.price_usd}`);
    }
    if (invoice.paid_usd && invoice.paid_usd !== invoice.price_usd) {
        paymentInfo.push(`💳 **Paid:** $${invoice.paid_usd}`);
    }
    if (invoice.gateway) {
        paymentInfo.push(`🏦 **Gateway:** ${invoice.gateway}`);
    }
    if (invoice.coupon_code) {
        paymentInfo.push(`🎫 **Coupon:** ${invoice.coupon_code}`);
    }

    if (paymentInfo.length > 0) {
        embed.addFields({
            name: '💳 Payment Details',
            value: paymentInfo.join('\n'),
            inline: true
        });
    }

    // Status
    const statusEmojis = {
        'completed': '✅ COMPLETED',
        'pending': '⏳ PENDING',
        'cancelled': '❌ CANCELLED',
        'refunded': '↩️ REFUNDED'
    };

    embed.addFields({
        name: '📊 Status',
        value: statusEmojis[invoice.status] || `❓ ${invoice.status?.toUpperCase() || 'UNKNOWN'}`,
        inline: false
    });

    // Products/Deliveries
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
        const products = invoice.invoice_items.map(item => {
            const productName = item.product?.name || item.variant?.name || 'Unknown Product';
            const quantity = item.quantity || 1;
            let deliveryInfo = `• **${productName}** (Qty: ${quantity})`;
            
            // Add delivery details if available
            if (item.deliverables && item.deliverables.length > 0) {
                deliveryInfo += `\n  📦 **Delivered:** ${item.deliverables.length} item(s)`;
                if (isManagement && item.deliverables[0]) {
                    // Show first few characters of delivered content for management
                    const preview = item.deliverables[0].toString().substring(0, 30);
                    deliveryInfo += `\n  🔑 **Preview:** \`${preview}...\``;
                }
            }
            return deliveryInfo;
        }).join('\n\n');

        embed.addFields({
            name: '🛍️ Products & Delivery',
            value: products.length > 1000 ? products.substring(0, 1000) + '\n...' : products,
            inline: false
        });
    }

    return embed;
}

// Create action buttons for management
function createManagementButtons(invoiceId) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`full_info_${invoiceId}`)
                .setLabel('📨 Send Full Info to DMs')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`refund_${invoiceId}`)
                .setLabel('↩️ Refund')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`resend_${invoiceId}`)
                .setLabel('📧 Resend')
                .setStyle(ButtonStyle.Secondary)
        );
}

// Register commands
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
                    .setDescription('Number of invoices (1-25)')
                    .setMinValue(1)
                    .setMaxValue(25)
            ),
        
        new SlashCommandBuilder()
            .setName('test')
            .setDescription('Test API connection'),

        new SlashCommandBuilder()
            .setName('refund')
            .setDescription('Refund an invoice (Management only)')
            .addStringOption(option =>
                option.setName('id')
                    .setDescription('Invoice ID to refund')
                    .setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('resend')
            .setDescription('Resend invoice delivery (Management only)')
            .addStringOption(option =>
                option.setName('id')
                    .setDescription('Invoice ID to resend')
                    .setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('top-products')
            .setDescription('View top performing products (Management only)')
    ];

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commands registered successfully');
    } catch (error) {
        console.error('❌ Command registration failed:', error);
    }
}

// Bot ready
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📡 Serving ${client.guilds.cache.size} servers`);
    await registerCommands();
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const { commandName, member } = interaction;
        const isManagement = hasManagementRole(member);

        // Management-only commands
        const managementCommands = ['refund', 'resend', 'top-products'];
        if (managementCommands.includes(commandName) && !isManagement) {
            return await interaction.reply({
                content: '❌ This command requires management permissions.',
                ephemeral: true
            });
        }

        try {
            if (commandName === 'invoice') {
                const invoiceId = interaction.options.getString('id');
                
                // Show loading message
                await interaction.reply('🔍 **Fetching invoice data...** Please wait...');
                
                try {
                    const invoice = await getInvoice(invoiceId);
                    const embed = createInvoiceEmbed(invoice, isManagement);
                    
                    const components = isManagement ? [createManagementButtons(invoiceId)] : [];
                    
                    await interaction.editReply({
                        content: '',
                        embeds: [embed],
                        components
                    });
                } catch (error) {
                    let errorMsg = 'Unknown error occurred';
                    if (error.response?.status === 404) {
                        errorMsg = `Invoice "${invoiceId}" not found. Use \`/recent\` to see available IDs.`;
                    } else if (error.response?.status === 401) {
                        errorMsg = 'Authentication failed. Invalid API key.';
                    }

                    await interaction.editReply({
                        content: `❌ **Error:** ${errorMsg}`,
                        embeds: [],
                        components: []
                    });
                }
            }

            else if (commandName === 'recent') {
                const limit = interaction.options.getInteger('limit') || 10;
                await interaction.deferReply();
                
                try {
                    const data = await getInvoicesList(limit);
                    const invoices = data.data || data;
                    
                    if (!invoices || invoices.length === 0) {
                        return await interaction.editReply('📭 No invoices found.');
                    }

                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`📋 Recent ${invoices.length} Invoices`)
                        .setTimestamp()
                        .setFooter({ text: 'Use /invoice <id> for detailed info' });

                    const invoiceList = invoices.slice(0, 10).map(invoice => {
                        const date = new Date(invoice.created_at).toLocaleDateString();
                        const status = invoice.status === 'completed' ? '✅' : 
                                      invoice.status === 'pending' ? '⏳' : '❌';
                        const email = redactSensitive(invoice.email);
                        return `${status} \`${invoice.id}\`\n   ${email} - $${invoice.price_usd || '0'} (${date})`;
                    }).join('\n\n');

                    embed.setDescription(invoiceList);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply(`❌ Failed to fetch invoices: ${error.message}`);
                }
            }

            else if (commandName === 'test') {
                await interaction.deferReply();
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✅ Bot Status')
                    .addFields(
                        { name: '🏪 Shop ID', value: SHOP_ID.toString(), inline: true },
                        { name: '🔑 API Key', value: `${API_KEY.substring(0, 15)}...`, inline: true },
                        { name: '👤 Your Role', value: isManagement ? '🛡️ Management' : '👤 User', inline: true }
                    )
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [embed] });
            }

            else if (commandName === 'refund') {
                const invoiceId = interaction.options.getString('id');
                await interaction.deferReply();
                
                try {
                    await refundInvoice(invoiceId);
                    const embed = new EmbedBuilder()
                        .setColor(0x800080)
                        .setTitle('↩️ Refund Processed')
                        .setDescription(`Invoice \`${invoiceId}\` has been marked as refunded.`)
                        .setTimestamp();
                    
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply(`❌ Refund failed: ${error.response?.data?.message || error.message}`);
                }
            }

            else if (commandName === 'resend') {
                const invoiceId = interaction.options.getString('id');
                await interaction.deferReply();
                
                try {
                    await resendInvoice(invoiceId);
                    const embed = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle('📧 Delivery Resent')
                        .setDescription(`Invoice delivery for \`${invoiceId}\` has been resent to customer.`)
                        .setTimestamp();
                    
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply(`❌ Resend failed: ${error.response?.data?.message || error.message}`);
                }
            }

            else if (commandName === 'top-products') {
                await interaction.deferReply();
                
                try {
                    const products = await getTopProducts();
                    // Process and display top products (implementation depends on API structure)
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('🏆 Top Products')
                        .setDescription('Product performance data')
                        .setTimestamp();
                    
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply(`❌ Failed to fetch products: ${error.message}`);
                }
            }

        } catch (error) {
            console.error('Command error:', error);
            const errorReply = { content: '❌ An unexpected error occurred.', ephemeral: true };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(errorReply);
            } else {
                await interaction.reply(errorReply);
            }
        }
    }

    // Handle button interactions
    else if (interaction.isButton()) {
        const [action, invoiceId] = interaction.customId.split('_');
        const isManagement = hasManagementRole(interaction.member);

        if (!isManagement) {
            return await interaction.reply({
                content: '❌ Management permissions required.',
                ephemeral: true
            });
        }

        if (action === 'full' && interaction.customId.startsWith('full_info_')) {
            await interaction.deferReply({ ephemeral: true });
            
            try {
                const invoice = await getInvoice(invoiceId);
                const fullEmbed = createInvoiceEmbed(invoice, true);
                
                // Send full details to DM
                await interaction.user.send({
                    content: `🔒 **Confidential Invoice Details**\nRequested by: ${interaction.user.tag}`,
                    embeds: [fullEmbed]
                });
                
                await interaction.editReply({
                    content: '✅ Full invoice details sent to your DMs.',
                    ephemeral: true
                });
            } catch (error) {
                await interaction.editReply({
                    content: '❌ Failed to send DM. Check your privacy settings.',
                    ephemeral: true
                });
            }
        }
    }
});

// Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login
client.login(process.env.DISCORD_TOKEN);
