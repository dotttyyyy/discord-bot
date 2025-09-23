const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Commands array
const commands = [
    new SlashCommandBuilder()
        .setName('supportticket')
        .setDescription('Display support ticket requirements'),
    
    new SlashCommandBuilder()
        .setName('hwidreset')
        .setDescription('Display HWID reset requirements')
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
    client.user.setActivity('Supporting users', { type: 'WATCHING' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'supportticket') {
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

    if (commandName === 'hwidreset') {
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
});

client.login(process.env.DISCORD_TOKEN);
