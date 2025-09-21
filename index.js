// index.js
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const SELLAUTH_API_KEY = '5244247|Fzn2eH0AmFVWaI5qHWr7IZWU6LSUvxtTpL4ztttE07d9729a';
const SHOP_ID = '5244247';

// Redact sensitive info
function redact(text) {
    if (!text) return text;
    return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]')
              .replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '[IP REDACTED]');
}

// Get invoice data
async function getInvoice(invoiceId) {
    const response = await axios.get(`https://api.sellauth.com/shops/${SHOP_ID}/invoices/${invoiceId}`, {
        headers: { 'Authorization': `Bearer ${SELLAUTH_API_KEY}` }
    });
    return response.data;
}

// Register commands
async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('invoice')
            .setDescription('Get invoice info')
            .addStringOption(option => 
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            )
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'invoice') return;

    const invoiceId = interaction.options.getString('id');
    
    try {
        await interaction.deferReply();
        const data = await getInvoice(invoiceId);
        
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`📄 Invoice #${data.id}`)
            .addFields(
                { name: '📧 Email', value: redact(data.email || 'N/A'), inline: true },
                { name: '⏰ Time', value: new Date(data.created_at).toLocaleString(), inline: true },
                { name: '💰 Amount', value: `$${data.price_usd || 0}`, inline: true },
                { name: '📊 Status', value: data.status || 'Unknown', inline: true }
            );

        if (data.invoice_items?.length > 0) {
            const products = data.invoice_items.map(item => 
                `• ${item.product?.name || 'Product'} (${item.quantity || 1}x)`
            ).join('\n');
            embed.addFields({ name: '🔑 Products', value: products, inline: false });
        }

        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Error')
            .setDescription(error.response?.status === 404 ? 'Invoice not found' : 'API error');
        await interaction.editReply({ embeds: [errorEmbed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
