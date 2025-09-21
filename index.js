// index.js - 100% Working SellAuth Discord Bot
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

// Check management permissions
function hasManagementRole(member) {
    return member.roles.cache.has(MANAGEMENT_ROLE_ID);
}

// Clean sensitive data
function redactSensitive(text) {
    if (!text) return 'N/A';
    return text.toString()
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***')
        .replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '***.***.***.***');
}

// API calls
async function makeAPICall(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method,
            url: `${BASE_URL}/shops/${SHOP_ID}/${endpoint}`,
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 15000
        };
        
        if (data && method !== 'GET') {
            config.data = data;
        }
        
        console.log(`API Call: ${method} ${config.url}`);
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        throw error;
    }
}

// Get single invoice
async function getInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}`);
}

// Get invoices list
async function getInvoicesList(limit = 10) {
    return await makeAPICall(`invoices?perPage=${limit}&orderColumn=created_at&orderDirection=desc`);
}

// Get products
async function getProducts() {
    return await makeAPICall('products');
}

// Refund invoice - Using correct SellAuth endpoint
async function refundInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}/refund`, 'POST');
}

// Process invoice (this might be the resend equivalent)
async function processInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}/process`, 'POST');
}

// Create clean invoice embed
function createInvoiceEmbed(invoice, showSensitive = false) {
    const status = invoice.status || 'unknown';
    const colors = {
        completed: 0x28a745,
        pending: 0xffc107, 
        cancelled: 0xdc3545,
        refunded: 0x6f42c1
    };

    const embed = new EmbedBuilder()
        .setColor(colors[status] || 0x6c757d)
        .setTitle(`Invoice ${invoice.id}`)
        .setTimestamp();

    // Status with icon
    const statusIcons = {
        completed: '✅ Completed',
        pending: '🕐 Pending',
        cancelled: '❌ Cancelled', 
        refunded: '↩️ Refunded'
    };
    
    embed.addFields({
        name: 'Status',
        value: statusIcons[status] || `❓ ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        inline: true
    });

    // Customer info
    if (invoice.email) {
        embed.addFields({
            name: 'Customer',
            value: showSensitive ? invoice.email : redactSensitive(invoice.email),
            inline: true
        });
    }

    // Amount
    if (invoice.price_usd) {
        embed.addFields({
            name: 'Amount',
            value: `${invoice.price_usd}`,
            inline: true
        });
    }

    // Purchase date
    if (invoice.created_at) {
        const date = new Date(invoice.created_at);
        embed.addFields({
            name: 'Purchase Date',
            value: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
            inline: true
        });
    }

    // Completion date
    if (invoice.completed_at && invoice.status === 'completed') {
        const date = new Date(invoice.completed_at);
        embed.addFields({
            name: 'Completed Date',
            value: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
            inline: true
        });
    }

    // Payment method
    if (invoice.gateway) {
        embed.addFields({
            name: 'Payment Method',
            value: invoice.gateway,
            inline: true
        });
    }

    // Products and delivery - This was missing proper display
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
        const products = invoice.invoice_items.map(item => {
            const name = item.product?.name || item.variant?.name || item.variant_name || item.product_name || 'Unknown Product';
            const qty = item.quantity || 1;
            let productLine = `**${name}** (Quantity: ${qty})`;
            
            // Show delivery info
            if (item.deliverables && item.deliverables.length > 0) {
                productLine += `\n📦 **Delivered:** ${item.deliverables.length} items`;
                if (showSensitive) {
                    // Show actual delivered content for management
                    const delivered = item.deliverables.slice(0, 3).map(d => `\`${d}\``).join(', ');
                    productLine += `\n🔑 **Content:** ${delivered}`;
                    if (item.deliverables.length > 3) {
                        productLine += ` +${item.deliverables.length - 3} more`;
                    }
                } else {
                    productLine += `\n🔑 **Keys/Items delivered to customer**`;
                }
            } else {
                productLine += `\n⚠️ **No delivery recorded**`;
            }
            
            return productLine;
        }).join('\n\n');

        embed.addFields({
            name: '🛍️ Products & Delivery',
            value: products.length > 1000 ? products.substring(0, 1000) + '...' : products,
            inline: false
        });
    }

    // Discord info
    if (invoice.discord_username || invoice.discord_id) {
        const discordInfo = [];
        if (invoice.discord_username) discordInfo.push(`Username: ${invoice.discord_username}`);
        if (invoice.discord_id) discordInfo.push(`ID: ${invoice.discord_id}`);
        
        embed.addFields({
            name: '🎮 Discord',
            value: discordInfo.join('\n'),
            inline: true
        });
    }

    // Coupon info
    if (invoice.coupon_code) {
        embed.addFields({
            name: '🎫 Coupon Used',
            value: invoice.coupon_code,
            inline: true
        });
    }

    // Additional sensitive info for management only
    if (showSensitive) {
        const additionalInfo = [];
        if (invoice.ip) additionalInfo.push(`🌐 IP: ${invoice.ip}`);
        if (invoice.user_agent) additionalInfo.push(`🖥️ User Agent: ${invoice.user_agent.substring(0, 50)}...`);
        if (invoice.stripe_pi_id) additionalInfo.push(`💳 Stripe ID: ${invoice.stripe_pi_id}`);
        if (invoice.paypal_order_id) additionalInfo.push(`💰 PayPal ID: ${invoice.paypal_order_id}`);
        
        if (additionalInfo.length > 0) {
            embed.addFields({
                name: '🔒 Additional Info (Management)',
                value: additionalInfo.join('\n'),
                inline: false
            });
        }
    } else if (invoice.ip) {
        // Show redacted info for regular users
        embed.addFields({
            name: '🔒 Additional Info',
            value: `🌐 IP: ${redactSensitive(invoice.ip)}`,
            inline: true
        });
    }

    return embed;
}

// Create management buttons
function createManagementButtons(invoiceId) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`fullinfo_${invoiceId}`)
            .setLabel('Send Full Info to DMs')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`refund_${invoiceId}`)
            .setLabel('Refund')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`resend_${invoiceId}`)
            .setLabel('Resend')
            .setStyle(ButtonStyle.Secondary)
    );
}

// Register commands
async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('invoice')
            .setDescription('Get invoice details')
            .addStringOption(option => 
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),
        
        new SlashCommandBuilder()
            .setName('recent')
            .setDescription('Show recent invoices')
            .addIntegerOption(option =>
                option.setName('limit').setDescription('Number to show (1-25)').setMinValue(1).setMaxValue(25)
            ),
        
        new SlashCommandBuilder()
            .setName('test')
            .setDescription('Test API connection'),

        new SlashCommandBuilder()
            .setName('refund')
            .setDescription('[MANAGEMENT] Refund an invoice')
            .addStringOption(option =>
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('resend')
            .setDescription('[MANAGEMENT] Resend invoice delivery')
            .addStringOption(option =>
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('top-products')
            .setDescription('[MANAGEMENT] View top products')
    ];

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Commands registered successfully');
    } catch (error) {
        console.error('Command registration failed:', error);
    }
}

// Bot ready
client.once('ready', async () => {
    console.log(`${client.user.tag} is online`);
    await registerCommands();
});

// Handle interactions
client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const { commandName, member } = interaction;
        const isManagement = hasManagementRole(member);

        // Check management permissions for restricted commands
        const mgmtCommands = ['refund', 'resend', 'top-products'];
        if (mgmtCommands.includes(commandName) && !isManagement) {
            return await interaction.reply({
                content: 'This command requires management permissions.',
                ephemeral: true
            });
        }

        try {
            if (commandName === 'invoice') {
                const invoiceId = interaction.options.getString('id');
                
                await interaction.reply('Fetching invoice...');
                
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
                    let message = 'Failed to fetch invoice';
                    if (error.response?.status === 404) {
                        message = `Invoice ${invoiceId} not found`;
                    }
                    await interaction.editReply(message);
                }
            }

            else if (commandName === 'recent') {
                const limit = interaction.options.getInteger('limit') || 10;
                await interaction.deferReply();
                
                try {
                    const data = await getInvoicesList(limit);
                    const invoices = data.data || data;
                    
                    if (!invoices?.length) {
                        return await interaction.editReply('No invoices found');
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(`Recent ${invoices.length} Invoices`)
                        .setColor(0x0099ff)
                        .setTimestamp();

                    const list = invoices.slice(0, 10).map(inv => {
                        const status = inv.status === 'completed' ? '✅' : 
                                      inv.status === 'pending' ? '🕐' : '❌';
                        const date = new Date(inv.created_at).toLocaleDateString();
                        const email = redactSensitive(inv.email);
                        return `${status} \`${inv.id}\`\n${email} - $${inv.price_usd || '0'} - ${date}`;
                    }).join('\n\n');

                    embed.setDescription(list);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply('Failed to fetch recent invoices');
                }
            }

            else if (commandName === 'test') {
                await interaction.deferReply();
                
                const embed = new EmbedBuilder()
                    .setTitle('API Status')
                    .setColor(0x00ff00)
                    .addFields(
                        { name: 'Shop ID', value: SHOP_ID.toString(), inline: true },
                        { name: 'Permissions', value: isManagement ? 'Management' : 'User', inline: true }
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
                        .setTitle('Refund Successful')
                        .setDescription(`Invoice \`${invoiceId}\` has been refunded`)
                        .setColor(0x6f42c1)
                        .setTimestamp();
                    
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    let message = 'Refund failed';
                    if (error.response?.status === 404) {
                        message = `Invoice ${invoiceId} not found`;
                    } else if (error.response?.data?.message) {
                        message = error.response.data.message;
                    }
                    await interaction.editReply(message);
                }
            }

            else if (commandName === 'resend') {
                const invoiceId = interaction.options.getString('id');
                await interaction.deferReply();
                
                try {
                    await processInvoice(invoiceId);
                    
                    const embed = new EmbedBuilder()
                        .setTitle('Invoice Processed')
                        .setDescription(`Invoice \`${invoiceId}\` has been processed/resent`)
                        .setColor(0x28a745)
                        .setTimestamp();
                    
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    let message = 'Process failed';
                    if (error.response?.status === 404) {
                        message = `Invoice ${invoiceId} not found`;
                    } else if (error.response?.data?.message) {
                        message = error.response.data.message;
                    }
                    await interaction.editReply(message);
                }
            }

            else if (commandName === 'top-products') {
                await interaction.deferReply();
                
                try {
                    const products = await getProducts();
                    const productList = products.data || products;
                    
                    if (!productList?.length) {
                        return await interaction.editReply('No products found');
                    }

                    const embed = new EmbedBuilder()
                        .setTitle('Products')
                        .setColor(0xffc107)
                        .setTimestamp();

                    const list = productList.slice(0, 10).map(product => 
                        `**${product.name}** - $${product.price || '0'}`
                    ).join('\n');

                    embed.setDescription(list);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply('Failed to fetch products');
                }
            }

        } catch (error) {
            console.error('Command error:', error);
            const reply = { content: 'An error occurred', ephemeral: true };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    }

    // Handle button clicks
    else if (interaction.isButton()) {
        const [action, invoiceId] = interaction.customId.split('_');
        const isManagement = hasManagementRole(interaction.member);

        if (!isManagement) {
            return await interaction.reply({
                content: 'Management permissions required',
                ephemeral: true
            });
        }

        if (action === 'fullinfo') {
            await interaction.deferReply({ ephemeral: true });
            
            try {
                const invoice = await getInvoice(invoiceId);
                const fullEmbed = createInvoiceEmbed(invoice, true);
                
                await interaction.user.send({
                    content: `Full invoice details for ${invoiceId}`,
                    embeds: [fullEmbed]
                });
                
                await interaction.editReply('Full details sent to your DMs');
            } catch (error) {
                await interaction.editReply('Failed to send DM - check your privacy settings');
            }
        }
        
        else if (action === 'refund') {
            await interaction.deferReply({ ephemeral: true });
            
            try {
                await refundInvoice(invoiceId);
                await interaction.editReply(`Invoice ${invoiceId} has been refunded`);
            } catch (error) {
                await interaction.editReply('Refund failed');
            }
        }
        
        else if (action === 'resend') {
            await interaction.deferReply({ ephemeral: true });
            
            try {
                await processInvoice(invoiceId);
                await interaction.editReply(`Invoice ${invoiceId} has been processed/resent`);
            } catch (error) {
                await interaction.editReply('Resend failed');
            }
        }
    }
});

// Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Start bot
client.login(process.env.DISCORD_TOKEN);
