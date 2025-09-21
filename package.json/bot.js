const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// SellAuth API configuration
const SELLAUTH_API_BASE = 'https://sellauth.com/api/v1';
const SELLAUTH_API_KEY = '5244247|Fzn2eH0AmFVWaI5qHWr7IZWU6LSUvxtTpL4ztttE07d9729a';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Function to redact sensitive information
function redactSensitiveInfo(text) {
    if (!text) return text;
    
    // Redact email addresses
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');
    
    // Redact IP addresses
    text = text.replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '[IP REDACTED]');
    
    // Redact phone numbers
    text = text.replace(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g, '[PHONE REDACTED]');
    
    // Redact credit card numbers
    text = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD REDACTED]');
    
    return text;
}

// Function to fetch invoice data from SellAuth API
async function getInvoiceData(invoiceId) {
    try {
        const response = await axios.get(`${SELLAUTH_API_BASE}/invoices/${invoiceId}`, {
            headers: {
                'Authorization': `Bearer ${SELLAUTH_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching invoice data:', error.response?.data || error.message);
        throw error;
    }
}

// Function to format invoice data into Discord embed
function createInvoiceEmbed(invoiceData) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`📄 Invoice #${invoiceData.id || 'N/A'}`)
        .setTimestamp();

    // Add basic invoice information
    if (invoiceData.email) {
        embed.addFields({ 
            name: '📧 Customer Email', 
            value: redactSensitiveInfo(invoiceData.email), 
            inline: true 
        });
    }

    // Add purchase time
    if (invoiceData.created_at) {
        const purchaseDate = new Date(invoiceData.created_at);
        embed.addFields({ 
            name: '⏰ Purchase Time', 
            value: purchaseDate.toLocaleString(), 
            inline: true 
        });
    }

    // Add key deliveries/products
    if (invoiceData.products && invoiceData.products.length > 0) {
        const products = invoiceData.products.map(product => 
            `• ${product.name || 'Unknown Product'} (Qty: ${product.quantity || 1})`
        ).join('\n');
        embed.addFields({ 
            name: '🔑 Products/Keys Delivered', 
            value: products, 
            inline: false 
        });
    }

    // Add amount
    if (invoiceData.total) {
        embed.addFields({ 
            name: '💰 Total Amount', 
            value: `$${invoiceData.total}`, 
            inline: true 
        });
    }

    // Add status
    if (invoiceData.status) {
        embed.addFields({ 
            name: '📊 Status', 
            value: invoiceData.status, 
            inline: true 
        });
    }

    // Add other information (redacted)
    const otherInfo = [];
    if (invoiceData.gateway) otherInfo.push(`Gateway: ${invoiceData.gateway}`);
    if (invoiceData.currency) otherInfo.push(`Currency: ${invoiceData.currency}`);
    if (invoiceData.customer_ip) otherInfo.push(`IP: [REDACTED]`);
    if (invoiceData.user_agent) otherInfo.push(`User Agent: ${redactSensitiveInfo(invoiceData.user_agent)}`);
    
    if (otherInfo.length > 0) {
        embed.addFields({ 
            name: '📋 Additional Information', 
            value: otherInfo.join('\n'), 
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
            .setDescription('Get invoice information by ID')
            .addStringOption(option =>
                option.setName('id')
                    .setDescription('The invoice ID to lookup')
                    .setRequired(true)
            )
    ];

    try {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        
        const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
        
        console.log('Started refreshing application (/) commands.');
        
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands.map(command => command.toJSON()) }
        );
        
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

// Event listeners
client.once('ready', async () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'invoice') {
        const invoiceId = interaction.options.getString('id');
        
        try {
            await interaction.deferReply();
            
            console.log(`Fetching invoice data for ID: ${invoiceId}`);
            const invoiceData = await getInvoiceData(invoiceId);
            
            const embed = createInvoiceEmbed(invoiceData);
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error handling invoice command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Error')
                .setDescription(
                    error.response?.status === 404 
                        ? 'Invoice not found. Please check the invoice ID and try again.'
                        : 'An error occurred while fetching the invoice data. Please try again later.'
                )
                .setTimestamp();
                
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
});

// Login to Discord
client.login(DISCORD_TOKEN);

// Handle process termination
process.on('SIGINT', () => {
    console.log('Received SIGINT. Graceful shutdown...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Graceful shutdown...');
    client.destroy();
    process.exit(0);
});
