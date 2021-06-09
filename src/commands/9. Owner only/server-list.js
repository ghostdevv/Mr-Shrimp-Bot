//TODO: Add a error on return if here is no next page or find a way to know when you can go back and forth a page.

const DiscordJS = require('discord.js');

module.exports = {
    category: '',
    description: 'Shows guilds that the bot is in',
    minArgs: 0,
    ownerOnly: true,
    callback: async ({ message, client }) => {
        await message.delete();

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        let description =
            `Servers: ${client.guilds.cache.size}\n\n` +
            client.guilds.cache
                .array((r) => r)
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(
                    (r, i) =>
                        `**${i + 1}** - ${r.name} | ${r.memberCount} Members`,
                )
                .slice(0, 10)
                .join('\n');

        const embed = new DiscordJS.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({
                    size: 512,
                    dynamic: true,
                    format: 'png',
                }),
            )
            .setColor('#EC8023')
            .setFooter(client.user.username)
            .setTitle(
                `Page: ${page}/${Math.ceil(client.guilds.cache.size / 10)}`,
            )
            .setDescription(description);

        const msg = await message.channel.send(embed);

        await msg.react('⬅');
        await msg.react('➡');
        await msg.react('❌');

        const collector = msg.createReactionCollector(
            (reaction, user) => user.id === message.author.id,
        );

        collector.on('collect', async (reaction) => {
            if (reaction._emoji.name === '⬅') {
                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;

                if (i0 < 0) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                description =
                    `Servers: ${client.guilds.cache.size}\n\n` +
                    client.guilds.cache
                        .array((r) => r)
                        .sort((a, b) => b.memberCount - a.memberCount)
                        .map(
                            (r, i) =>
                                `**${i + 1}** - ${r.name} | ${
                                    r.memberCount
                                } Members`,
                        )
                        .slice(i0, i1)
                        .join('\n');

                embed
                    .setTitle(
                        `Page: ${page}/${Math.round(
                            client.guilds.cache.size / 10,
                        )}`,
                    )
                    .setDescription(description);

                msg.edit(embed);
            }

            if (reaction._emoji.name === '➡') {
                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                if (i1 > client.guilds.cache.size + 10) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                description =
                    `Servers: ${client.guilds.cache.size}\n\n` +
                    client.guilds.cache
                        .array((r) => r)
                        .sort((a, b) => b.memberCount - a.memberCount)
                        .map(
                            (r, i) =>
                                `**${i + 1}** - ${r.name} | ${
                                    r.memberCount
                                } Members`,
                        )
                        .slice(i0, i1)
                        .join('\n');

                embed
                    .setTitle(
                        `Page: ${page}/${Math.round(
                            client.guilds.cache.size / 10,
                        )}`,
                    )
                    .setDescription(description);

                msg.edit(embed);
            }

            if (reaction._emoji.name === '❌') {
                return msg.delete();
            }

            await reaction.users.remove(message.author.id);
        });
    },
};
