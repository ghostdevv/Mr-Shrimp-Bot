const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
const Chalk = require('chalk');
const box = require('./features/start-up-log');
const { getMongoConnection } = require('wokcommands/dist/mongo');
const { Connection } = require('mongoose');
const { Model } = require('mongoose');
require('dotenv').config();

const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION'],
});
const disbut = require('discord-buttons')(client);

client.on('ready', () => {
    const dbOptions = {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };

    const wok = new WOKCommands(client, {
        commandsDir: 'commands',
        messagesPath: 'messages.json',
        showWarns: true,
        testServers: ['843592912315220008', '843936038551289866'],
    })
        // Bot owner cainthebest#6969
        .setBotOwner(['724379828748550215'])
        .setDisplayName('Mr.Shrimp')
        .setDefaultPrefix('ms!')
        .setDefaultLanguage('english')
        .setMongoPath(process.env.MONGO_URI);

    wok.on('databaseConnected', async (connection, state) => {
        const models = [
            'wokcommands-languages',
            'wokcommands-cooldowns',
            'wokcommands-disabled-commands',
            'wokcommands-prefixes',
            'wokcommands-required-roles',
        ];

        const documentCounts = await Promise.all(
            models.map(
                (m) =>
                    new Promise((r) =>
                        connection.models[m].countDocuments((_, c) => r(c)),
                    ),
            ),
        );

        const [
            langResults,
            coolDownResults,
            desCmdsResults,
            prefixResults,
            reqRoleResults,
        ] = documentCounts;

        box.log(
            [
                {
                    name: 'Status',
                    value: ['Online'],
                },
                {
                    name: 'Client',
                    value: [`Logged in as ${client.user.tag}`],
                },
                {
                    name: 'Discord Data',
                    value: [
                        `Watching ${client.users.cache.size} users`,
                        `In ${client.guilds.cache.size} servers`,
                        `With a total of ${client.channels.cache.size} channels`,
                    ],
                },
                {
                    name: 'MongoDB Status',
                    value: [`${state}`],
                },
                {
                    name: "DB Model's",
                    value: [
                        `${langResults} Language docs in DB`,
                        `${coolDownResults} Cooldown docs in DB`,
                        `${desCmdsResults} Disabled commands docs in DB`,
                        `${prefixResults} Prefix docs in DB`,
                        `${reqRoleResults} Required roles docs in DB`,
                    ],
                },
                {
                    name: 'Ping',
                    value: [
                        `Discord API: ${Math.round(client.ws.ping)}ms`,
                        `Bot: UNAVALABLE`,
                    ],
                },
            ],
            68,
            { end: true },
        );
    });

    wok.on('languageNotSupported', (message, lang) => {
        const { guild } = message;
        console.log(
            Chalk.red(`"${guild.name}" Attempted to set language to "${lang}"`),
        );
    });

    wok.on('commandException', (command, message, error) => {
        console.log(
            Chalk.red(
                `An exception occured when using command "${command.names[0]}"! The error is:`,
            ),
        );
        console.error(error);
    })

        .setCategorySettings([
            {
                name: 'Moderation',
                emoji: '👮‍♂️',
                hidden: true,
            },
            {
                name: 'General',
                emoji: '✨',
            },
            {
                name: 'Economy',
                emoji: '💰',
            },
            {
                name: 'Fun',
                emoji: '🎭',
            },
            {
                name: 'Music',
                emoji: '🎶',
            },
            {
                name: 'Util',
                emoji: '🌀',
            },
            {
                name: 'Prem',
                emoji: '💳',
            },
        ])
        .setColor('#EC8023');
});

client.login(process.env.TOKEN);
