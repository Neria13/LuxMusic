const { EmbedBuilder, InteractionType, MessageFlags } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = async (client, inter) => {
    await inter.deferReply({ flags: MessageFlags.Ephemeral });
    if (inter.type === InteractionType.ApplicationCommand) {
        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);

        if (!command) {
            console.log('<❌> | Error! Please contact Developers! \n');
            return;
        }

        if (command.permissions && !inter.member.permissions.has(command.permissions)) {
            console.log(`<❌> | You need do not have the proper permissions to exacute this command`);
            return;
        }

        if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
            console.log(`<❌> | This command is reserved For members with <\`${DJ.roleName}\`> `);
            return;
        }

        command.execute({ inter, client });
    } else if (inter.type === InteractionType.MessageComponent) {
        const customId = inter.customId;
        if (!customId) return;

        const queue = useQueue(inter.guild);
        const path = `../../buttons/${customId}.js`;

        delete require.cache[require.resolve(path)];
        const button = require(path);
        if (button) return button({ client, inter, customId, queue });
    }
}