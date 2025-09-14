const { readdirSync } = require("fs");
const { REST, Routes, Collection } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const config = require("./config");

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

client.commands = new Collection();
const commandArray = [];
const player = useMainPlayer();

// Gather all the DiscordEvents
const discordEvents = readdirSync("./events/discord").filter((file) => file.endsWith(".js"));

for (const file of discordEvents) {
    const DiscordEvent = require(`./events/discord/${file}`);
    console.log(`# Successfully loaded <${file.split(".")[0]}>`);
    client.on(file.split(".")[0], DiscordEvent.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
}

// Gather all the Commands
readdirSync("./commands/").forEach((dirs) => {
    const commands = readdirSync(`./commands/${dirs}`).filter((files) => files.endsWith(".js"));

    for (const file of commands)  {
        const command = require(`./commands/${dirs}/${file}`);
        // if (command.data.name && command.data.description) {
        if ('name' in command && 'description' in command) {
            commandArray.push(command);
            client.commands.set(command.name.toLowerCase(), command);
            delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
        } else {
            console.log("Problem with loading command. Name and/or description is missing. (" + command.name + ").");
        }
    }
});

// Deploy commands
const rest = new REST().setToken(config.app.token);

// Uncomment this if a command deletion is needed
/* rest.put(Routes.applicationGuildCommands(config.app.clientId, config.app.guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error); */

// Deploy the commands
(async () => {
	try {
		console.log(`# Starting to load ${commandArray.length} slash commands.`);

        client.on("clientReady", (client) => {
            if (client.config.app.global) {
                client.application.commands.set(commandArray);
            } else {
                client.guilds.cache
                    .get(client.config.app.guildId)
                    .commands.set(commandArray);
            }        
        })

		console.log(`# Successfully reloaded ${commandArray.length} slash commands.`);
	} catch (error) {
		console.error(error);
	}
})();