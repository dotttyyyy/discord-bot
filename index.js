import { Client, GatewayIntentBits, ActivityType } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Set the bot's status
    client.user.setActivity("It's A Long Way To Tipperary", {
        type: ActivityType.Playing
    });
});

// Read the token from the Railway environment variable
client.login(process.env.TOKEN);
