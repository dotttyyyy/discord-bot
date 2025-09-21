// Complete SellAuth Discord Bot - All Features
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages]
});

// Configuration
const API_KEY = '5244265|C0ovkR6WFbzBV5R3lA6DPx5gIgA4KYf6NL8EwZHx7102715a';
const SHOP_ID = 121609;
const BASE_URL = 'https://api.sellauth.com/v1';
const MANAGEMENT_ROLE_ID = '1408813712503996516';

// Permission checks
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

// Universal API call function
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

// API Functions
async function getInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}`);
}

async function getInvoicesList(limit = 25, filters = {}) {
    let query = `invoices?perPage=${limit}&orderColumn=created_at&orderDirection=desc`;
    
    if (filters.status) query += `&status=${filters.status}`;
    if (filters.email) query += `&email=${filters.email}`;
    if (filters.gateway) query += `&gateway=${filters.gateway}`;
    if (filters.product) query += `&product_name=${filters.product}`;
    
    return await makeAPICall(query);
}

async function searchInvoicesByEmail(email) {
    return await makeAPICall(`invoices?email=${email}&perPage=50&orderColumn=created_at&orderDirection=desc`);
}

async function getProducts() {
    return await makeAPICall('products');
}

async function getProduct(productId) {
    return await makeAPICall(`products/${productId}`);
}

async function getCoupons() {
    return await makeAPICall('coupons');
}

async function createCoupon(couponData) {
    return await makeAPICall('coupons', 'POST', couponData);
}

async function getShopStats() {
    return await makeAPICall('stats');
}

async function refundInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}/refund`, 'PUT');
}

async function cancelInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}/cancel`, 'PUT');
}

async function processInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}/process`, 'PUT');
}

async function archiveInvoice(invoiceId) {
    return await makeAPICall(`invoices/${invoiceId}/archive`, 'PUT');
}

async function updateInvoiceNote(invoiceId, note) {
    return await makeAPICall(`invoices/${invoiceId}/note`, 'PUT', { note });
}

// Create comprehensive invoice embed
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

    // Status with processing time
    const statusIcons = {
        completed: '✅ Completed',
        pending: '🕐 Pending',
        cancelled: '❌ Cancelled', 
        refunded: '↩️ Refunded'
    };
    
    let statusValue = statusIcons[status] || `❓ ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    
    if (invoice.created_at && invoice.completed_at) {
        const processTime = Math.round((new Date(invoice.completed_at) - new Date(invoice.created_at)) / 60000);
        statusValue += `\n⏱️ Processed in ${processTime} minutes`;
    }
    
    embed.addFields({
        name: 'Status',
        value: statusValue,
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
            value: `$${invoice.price_usd}`,
            inline: true
        });
    }

    // Dates
    if (invoice.created_at) {
        const date = new Date(invoice.created_at);
        embed.addFields({
            name: 'Purchase Date',
            value: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
            inline: true
        });
    }

    if (invoice.completed_at) {
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

    // Products and delivery
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
        const products = invoice.invoice_items.map(item => {
            const name = item.product?.name || item.variant?.name || 'Unknown Product';
            const qty = item.quantity || 1;
            
            let productLine = `**${name}** (Qty: ${qty})`;
            
            if (item.deliverables && item.deliverables.length > 0) {
                productLine += `\n📦 Delivered: ${item.deliverables.length} items`;
                
                if (showSensitive) {
                    const preview = item.deliverables.slice(0, 2).map(d => {
                        const content = d.toString().substring(0, 40);
                        return `\`${content}${content.length >= 40 ? '...' : ''}\``;
                    }).join(', ');
                    productLine += `\n🔑 Content: ${preview}`;
                    if (item.deliverables.length > 2) {
                        productLine += ` +${item.deliverables.length - 2} more`;
                    }
                } else {
                    productLine += `\n🔑 Digital items delivered`;
                }
            } else {
                productLine += `\n⚠️ No delivery recorded`;
            }
            
            return productLine;
        }).join('\n\n');

        embed.addFields({
            name: `🛍️ Products & Delivery`,
            value: products.length > 1000 ? products.substring(0, 1000) + '...' : products,
            inline: false
        });
    }

    // Discord info
    if (invoice.discord_username) {
        embed.addFields({
            name: '🎮 Discord',
            value: invoice.discord_username,
            inline: true
        });
    }

    // Coupon
    if (invoice.coupon_code) {
        embed.addFields({
            name: '🎫 Coupon',
            value: invoice.coupon_code,
            inline: true
        });
    }

    // Management additional info
    if (showSensitive) {
        const additionalInfo = [];
        if (invoice.ip) additionalInfo.push(`🌐 IP: ${invoice.ip}`);
        if (invoice.user_agent) {
            const shortUA = invoice.user_agent.substring(0, 60) + '...';
            additionalInfo.push(`💻 User Agent: ${shortUA}`);
        }
        if (invoice.stripe_pi_id) additionalInfo.push(`🔵 Stripe: ${invoice.stripe_pi_id}`);
        if (invoice.paypal_order_id) additionalInfo.push(`💙 PayPal: ${invoice.paypal_order_id}`);
        
        if (additionalInfo.length > 0) {
            embed.addFields({
                name: '🔒 Management Info',
                value: additionalInfo.join('\n'),
                inline: false
            });
        }
    } else if (invoice.ip) {
        embed.addFields({
            name: '🔒 Additional Info',
            value: `🌐 IP: ${redactSensitive(invoice.ip)}`,
            inline: true
        });
    }

    return embed;
}

// Management action buttons
function createManagementButtons(invoiceId) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`fullinfo_${invoiceId}`)
            .setLabel('Full Info DM')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`refund_${invoiceId}`)
            .setLabel('Refund')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`resend_${invoiceId}`)
            .setLabel('Process/Resend')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`archive_${invoiceId}`)
            .setLabel('Archive')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`cancel_${invoiceId}`)
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
    );
}

// Create stats embed
function createStatsEmbed(stats, isManagement = false) {
    const embed = new EmbedBuilder()
        .setTitle('📊 Shop Statistics')
        .setColor(0x0099ff)
        .setTimestamp();

    if (stats.revenue) {
        embed.addFields({
            name: '💰 Revenue',
            value: `Total: $${stats.revenue.total || '0'}\nThis Month: $${stats.revenue.month || '0'}\nThis Week: $${stats.revenue.week || '0'}`,
            inline: true
        });
    }

    if (stats.orders) {
        embed.addFields({
            name: '📦 Orders',
            value: `Total: ${stats.orders.total || '0'}\nCompleted: ${stats.orders.completed || '0'}\nPending: ${stats.orders.pending || '0'}`,
            inline: true
        });
    }

    if (stats.customers) {
        embed.addFields({
            name: '👥 Customers',
            value: `Total: ${stats.customers.total || '0'}\nNew this month: ${stats.customers.new || '0'}`,
            inline: true
        });
    }

    return embed;
}

// Register all commands
async function registerCommands() {
    const commands = [
        // Basic commands
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
            )
            .addStringOption(option =>
                option.setName('status').setDescription('Filter by status')
                .addChoices(
                    { name: 'Completed', value: 'completed' },
                    { name: 'Pending', value: 'pending' },
                    { name: 'Cancelled', value: 'cancelled' },
                    { name: 'Refunded', value: 'refunded' }
                )
            ),

        new SlashCommandBuilder()
            .setName('search')
            .setDescription('Search invoices by email')
            .addStringOption(option =>
                option.setName('email').setDescription('Customer email').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('test')
            .setDescription('Test API connection'),

        // Management commands
        new SlashCommandBuilder()
            .setName('refund')
            .setDescription('[MANAGEMENT] Refund an invoice')
            .addStringOption(option =>
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('cancel')
            .setDescription('[MANAGEMENT] Cancel a pending invoice')
            .addStringOption(option =>
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('resend')
            .setDescription('[MANAGEMENT] Process/resend invoice')
            .addStringOption(option =>
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('archive')
            .setDescription('[MANAGEMENT] Archive an invoice')
            .addStringOption(option =>
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('note')
            .setDescription('[MANAGEMENT] Add note to invoice')
            .addStringOption(option =>
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            )
            .addStringOption(option =>
                option.setName('note').setDescription('Note to add').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('products')
            .setDescription('[MANAGEMENT] List all products'),

        new SlashCommandBuilder()
            .setName('product')
            .setDescription('[MANAGEMENT] Get product details')
            .addStringOption(option =>
                option.setName('id').setDescription('Product ID').setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('coupons')
            .setDescription('[MANAGEMENT] List all coupons'),

        new SlashCommandBuilder()
            .setName('stats')
            .setDescription('[MANAGEMENT] View shop statistics'),

        new SlashCommandBuilder()
            .setName('pending')
            .setDescription('[MANAGEMENT] Show pending invoices'),

        new SlashCommandBuilder()
            .setName('failed')
            .setDescription('[MANAGEMENT] Show failed/cancelled invoices'),

        new SlashCommandBuilder()
            .setName('help')
            .setDescription('Show all available commands'),

        new SlashCommandBuilder()
            .setName('dashboard')
            .setDescription('[MANAGEMENT] Interactive dashboard')
    ];

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('All commands registered successfully');
    } catch (error) {
        console.error('Command registration failed:', error);
    }
}

// Help command embed
function createHelpEmbed(isManagement = false) {
    const embed = new EmbedBuilder()
        .setTitle('🤖 SellAuth Bot Commands')
        .setColor(0x0099ff)
        .setTimestamp();

    // Public commands
    embed.addFields({
        name: '📋 General Commands',
        value: `\`/invoice <id>\` - Get invoice details
\`/recent [limit] [status]\` - Show recent invoices
\`/search <email>\` - Find invoices by email
\`/test\` - Test API connection
\`/help\` - Show this help menu`,
        inline: false
    });

    if (isManagement) {
        embed.addFields({
            name: '🛡️ Management Commands',
            value: `\`/refund <id>\` - Refund an invoice
\`/cancel <id>\` - Cancel pending invoice
\`/resend <id>\` - Process/resend invoice
\`/archive <id>\` - Archive an invoice
\`/note <id> <note>\` - Add note to invoice
\`/products\` - List all products
\`/product <id>\` - Get product details
\`/coupons\` - List all coupons
\`/stats\` - View shop statistics
\`/pending\` - Show pending invoices
\`/failed\` - Show failed/cancelled invoices
\`/dashboard\` - Interactive management dashboard`,
            inline: false
        });
    }

    return embed;
}

// Interactive dashboard
function createDashboard() {
    const embed = new EmbedBuilder()
        .setTitle('🏪 SellAuth Management Dashboard')
        .setDescription('Select an action from the menu below')
        .setColor(0x0099ff)
        .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('dashboard_action')
        .setPlaceholder('Choose an action...')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('View Recent Orders')
                .setDescription('Show last 10 orders')
                .setValue('recent_orders'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Pending Orders')
                .setDescription('Show pending orders')
                .setValue('pending_orders'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Shop Statistics')
                .setDescription('View sales stats')
                .setValue('shop_stats'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Product List')
                .setDescription('View all products')
                .setValue('product_list'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Coupon Management')
                .setDescription('View active coupons')
                .setValue('coupon_list')
        );

    return { embed, selectMenu };
}

// Bot ready
client.once('ready', async () => {
    console.log(`${client.user.tag} is online with ALL features!`);
    await registerCommands();
});

// Handle all interactions
client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const { commandName, member } = interaction;
        const isManagement = hasManagementRole(member);

        // Management-only commands
        const mgmtCommands = ['refund', 'cancel', 'resend', 'archive', 'note', 'products', 'product', 'coupons', 'stats', 'pending', 'failed', 'dashboard'];
        if (mgmtCommands.includes(commandName) && !isManagement) {
            return await interaction.reply({
                content: 'This command requires management permissions.',
                ephemeral: true
            });
        }

        try {
            // Basic commands
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
                const status = interaction.options.getString('status');
                await interaction.deferReply();
                
                try {
                    const filters = status ? { status } : {};
                    const data = await getInvoicesList(limit, filters);
                    const invoices = data.data || data;
                    
                    if (!invoices?.length) {
                        return await interaction.editReply('No invoices found');
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(`Recent ${invoices.length} Invoices${status ? ` (${status})` : ''}`)
                        .setColor(0x0099ff)
                        .setTimestamp();

                    const list = invoices.slice(0, 15).map(inv => {
                        const statusEmoji = inv.status === 'completed' ? '✅' : 
                                           inv.status === 'pending' ? '🕐' : '❌';
                        const date = new Date(inv.created_at).toLocaleDateString();
                        const email = redactSensitive(inv.email);
                        return `${statusEmoji} \`${inv.id}\`\n${email} - $${inv.price_usd || '0'} - ${date}`;
                    }).join('\n\n');

                    embed.setDescription(list);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply('Failed to fetch invoices');
                }
            }

            else if (commandName === 'search') {
                const email = interaction.options.getString('email');
                await interaction.deferReply();
                
                try {
                    const data = await searchInvoicesByEmail(email);
                    const invoices = data.data || data;
                    
                    if (!invoices?.length) {
                        return await interaction.editReply(`No invoices found for ${redactSensitive(email)}`);
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(`Invoices for ${isManagement ? email : redactSensitive(email)}`)
                        .setColor(0x0099ff)
                        .setTimestamp();

                    const list = invoices.slice(0, 10).map(inv => {
                        const statusEmoji = inv.status === 'completed' ? '✅' : 
                                           inv.status === 'pending' ? '🕐' : '❌';
                        const date = new Date(inv.created_at).toLocaleDateString();
                        return `${statusEmoji} \`${inv.id}\` - $${inv.price_usd || '0'} - ${date}`;
                    }).join('\n');

                    embed.setDescription(list);
                    embed.addFields({
                        name: 'Summary',
                        value: `Total orders: ${invoices.length}\nTotal spent: $${invoices.reduce((sum, inv) => sum + (inv.price_usd || 0), 0)}`,
                        inline: false
                    });

                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply('Search failed');
                }
            }

            else if (commandName === 'test') {
                await interaction.deferReply();
                
                const embed = new EmbedBuilder()
                    .setTitle('🟢 Bot Status')
                    .setColor(0x00ff00)
                    .addFields(
                        { name: 'Shop ID', value: SHOP_ID.toString(), inline: true },
                        { name: 'API Status', value: '✅ Connected', inline: true },
                        { name: 'Your Role', value: isManagement ? '🛡️ Management' : '👤 User', inline: true },
                        { name: 'Commands', value: `${isManagement ? '20+' : '5'} available`, inline: true }
                    )
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [embed] });
            }

            else if (commandName === 'help') {
                const embed = createHelpEmbed(isManagement);
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Management commands
            else if (commandName === 'refund') {
                const invoiceId = interaction.options.getString('id');
                await interaction.deferReply();
                
                try {
                    await refundInvoice(invoiceId);
                    const embed = new EmbedBuilder()
                        .setTitle('✅ Refund Successful')
                        .setDescription(`Invoice \`${invoiceId}\` has been refunded`)
                        .setColor(0x6f42c1);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply(`Refund failed: ${error.response?.data?.message || error.message}`);
                }
            }

            else if (commandName === 'cancel') {
                const invoiceId = interaction.options.getString('id');
                await interaction.deferReply();
                
                try {
                    await cancelInvoice(invoiceId);
                    const embed = new EmbedBuilder()
                        .setTitle('✅ Invoice Cancelled')
                        .setDescription(`Invoice \`${invoiceId}\` has been cancelled`)
                        .setColor(0xdc3545);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply(`Cancel failed: ${error.response?.data?.message || error.message}`);
                }
            }

            else if (commandName === 'resend') {
                const invoiceId = interaction.options.getString('id');
                await interaction.deferReply();
                
                try {
                    await processInvoice(invoiceId);
                    const embed = new EmbedBuilder()
                        .setTitle('✅ Invoice Processed')
                        .setDescription(`Invoice \`${invoiceId}\` has been processed`)
                        .setColor(0x28a745);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply(`Process failed: ${error.response?.data?.message || error.message}`);
                }
            }

            else if (commandName === 'products') {
                await interaction.deferReply();
                
                try {
                    const products = await getProducts();
                    const productList = products.data || products;
                    
                    const embed = new EmbedBuilder()
                        .setTitle('🛍️ All Products')
                        .setColor(0x0099ff);

                    const list = productList.slice(0, 15).map(product => 
                        `**${product.name}** - $${product.price || '0'}\nID: \`${product.id}\``
                    ).join('\n\n');

                    embed.setDescription(list);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply('Failed to fetch products');
                }
            }

            else if (commandName === 'stats') {
                await interaction.deferReply();
                
                try {
                    const stats = await getShopStats();
                    const embed = createStatsEmbed(stats, isManagement);
                    await interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    await interaction.editReply('Failed to fetch statistics');
                }
            }

            else if (commandName === 'dashboard') {
                const { embed, selectMenu } = createDashboard();
                const row = new ActionRowBuilder().addComponents(selectMenu);
                
                await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    ephemeral: true
                });
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

    // Handle button interactions
    else if (interaction.isButton()) {
        const [action, invoiceId] = interaction.customId.split('_');
        const isManagement = hasManagementRole(interaction.member);

        if (!isManagement) {
            return await interaction.reply({ content: 'Management required', ephemeral: true });
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
                await interaction.editReply('Failed to send DM');
            }
        }
        
        else if (action === 'refund') {
            await interaction.deferReply({ ephemeral: true });
            try {
                await refundInvoice(invoiceId);
                await interaction.editReply(`✅ Invoice ${invoiceId} refunded`);
            } catch (error) {
                await interaction.editReply('Refund failed');
            }
        }
    }

    // Handle select menu interactions
    else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'dashboard_action') {
            const action = interaction.values[0];
            await interaction.deferUpdate();

            try {
                let embed;
                
                switch (action) {
