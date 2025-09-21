// index.js - DEBUG VERSION
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const SELLAUTH_API_KEY = '5244265|C0ovkR6WFbzBV5R3lA6DPx5gIgA4KYf6NL8EwZHx7102715a';
const SHOP_ID = '5244247';

// Test multiple API endpoints to find the right one
async function getInvoice(invoiceId) {
    const endpoints = [
        `https://api.sellauth.com/shops/${SHOP_ID}/invoices/${invoiceId}`,
        `https://sellauth.com/api/v1/shops/${SHOP_ID}/invoices/${invoiceId}`,
        `https://api.sellauth.com/v1/shops/${SHOP_ID}/invoices/${invoiceId}`,
        `https://sellauth.com/api/invoices/${invoiceId}`,
        `https://api.sellauth.com/invoices/${invoiceId}`
    ];
    
    console.log(`Testing invoice ID: ${invoiceId}`);
    
    for (let i = 0; i < endpoints.length; i++) {
        try {
            console.log(`Testing endpoint ${i + 1}: ${endpoints[i]}`);
            const response = await axios.get(endpoints[i], {
                headers: { 
                    'Authorization': `Bearer ${SELLAUTH_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('SUCCESS! Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            console.log(`Endpoint ${i + 1} failed:`, error.response?.status, error.response?.data || error.message);
        }
    }
    
    throw new Error('All endpoints failed');
}

async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('invoice')
            .setDescription('Get invoice info')
            .addStringOption(option => 
                option.setName('id').setDescription('Invoice ID').setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('test')
            .setDescription('Test API connection')
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'test') {
        await interaction.reply('Bot is working! API Key: ' + SELLAUTH_API_KEY.substring(0, 10) + '...');
        return;
    }

    if (interaction.commandName === 'invoice') {
        const invoiceId = interaction.options.getString('id');
        
        try {
            await interaction.deferReply();
            console.log(`User requested invoice: ${invoiceId}`);
            
            const data = await getInvoice(invoiceId);
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`✅ Found Invoice #${data.id || invoiceId}`)
                .setDescription('```json\n' + JSON.stringify(data, null, 2).substring(0, 1000) + '\n```');

            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Final error:', error.message);
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Debug Info')
                .setDescription(`All API endpoints failed for invoice: ${invoiceId}\nCheck Railway logs for details.`);
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
