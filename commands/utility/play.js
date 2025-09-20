const config = require("../../config");
const { useMainPlayer } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'play',
    description:('Plays the current song.'),
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('The song you want to play'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter, client }) {
        const player = useMainPlayer();
        const query = inter.options.getString('song', true);

        if (inter.channelId != config.app.voiceId) {
            await inter.reply('This is not allowed in this channel. Please execute from the voice channel text.');
        } else if (inter.guild.members.me.voice.channelId != config.app.voiceId) {
            await inter.followUp('The bot is currently not in the channel. Please /connect first.');
        } else {
            
            try {
                const result = await player.play(inter.channel, query, {
                    nodeOptions: {
                        metadata: {channel: inter.channel},
                    },
                });

                return inter.followUp(`${result.track.title} has been added to the queue!`);
            } catch (error) {
                console.error(error);
                return inter.followUp('An error occurred while playing the song!');
            }
        };
    }
}