
require('dotenv').config();

const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    disableMentions: 'everyone',
});

client.config = require("./config");

// create player
const player = new Player(client, client.config.opt.discordPlayer);

console.clear();
require("./loader.js");

// attempt to login with config-token
client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        require('./process_tools').throwConfigError('app', 'token', 'An invalid token was provided. Change it in config. \n');
    } else {
        console.error('An error occurred while trying to login to the bot! \n', e);
    }
});