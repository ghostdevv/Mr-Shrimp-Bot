DiscordJS = require('discord.js');
const permissions = Object.keys(DiscordJS.Permissions.FLAGS);

module.exports = {
    category: '',
    description: 'Allows the bot owner to restart',
    minArgs: 0,
    ownerOnly: false,
    callback: async ({ message, client }) => {
        const member = message.mentions.members.first() || message.member;
        let text =
            '```\n' + `${message.author.username}'s permissions` + '\n\n';
        const mPermissions = message.channel.permissionsFor(member);
        const total = {
            denied: 0,
            allowed: 0,
        };
        permissions.forEach((perm) => {
            if (!mPermissions.has(perm)) {
                text += `[❌] ${perm}\n`;
                total.denied++;
            } else {
                text += `[✅] ${perm}\n`;
                total.allowed++;
            }
        });
        text += `\n${total.allowed} ✅ | ${total.denied} ❌` + '\n```';
        message.channel.send(text);
    },
};
