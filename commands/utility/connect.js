const config = require("../../config");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	name: 'connect',
    description:('Connects the bot to radio tower.'),
    voiceChannel: true,

    async execute({ inter }) {
        if (inter.channelId != config.app.voiceId) {
            await inter.reply('This is not allowed in this channel. Please execute from the voice channel text.');
        } else {
            const connection = joinVoiceChannel({
	            channelId: inter.channelId,
	            guildId: inter.guildId,
	            adapterCreator: inter.channel.guild.voiceAdapterCreator,
            })

            await inter.followUp('Successfully connected to channel ' + inter.channel.name);
        };
    }
}