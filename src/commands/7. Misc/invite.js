const { MessageEmbed } = require('discord.js');

module.exports = {
    slash: 'both',
    testOnly: true,
    category: 'Development',
    description: 'Invite me to another server!',
    callback: ({ message, client }) => {
        const pongEmbed = new MessageEmbed()
        
        
        if (message) {
            message.reply(pongEmbed);
        }
        return;
    },
};