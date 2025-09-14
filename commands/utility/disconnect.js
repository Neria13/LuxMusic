const config = require("../../config");
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'disconnect',
    description:('Throws the bot out of the voice channel.'),
    voiceChannel: true,

	async execute({ inter }) {
        if (inter.channelId != config.app.voiceId) {
            await inter.followUp('This is not allowed in this channel. Please execute from the voice channel text.');
        } else {
            const connection = getVoiceConnection(config.app.guildId)
		    if (!connection) {
                await inter.followUp('The connection retrieval failed.');
            } else {
                connection.destroy();

                await inter.followUp('Successfully disconnected from channel ' + inter.channel.name);
            }    
        }
	},
};	