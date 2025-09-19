// index.js
import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Set the bot's status
    client.user.setActivity("It's A Long Way To Tipperary", {
        type: ActivityType.Playing
    });
});

client.login(process.env.TOKEN);
