const Chalk = require('chalk');

module.exports = {
    category: '',
    description: 'Allows the bot owner to restart',
    minArgs: 0,
    ownerOnly: true,
    callback: async ({ message }) => {
        await message.reply('Restarting...');
        await console.log(Chalk.blue('Restart init by owner'));
        process.exit();
    },
};
