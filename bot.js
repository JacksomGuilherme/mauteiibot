const tmi = require('tmi.js')
require('dotenv').config()
const { getValidAccessToken } = require('./authentication/twitchAuth.service')

const { loadCommands } = require('./utils/handler')

const commands = loadCommands()

function parseCommand(message) {
    if (!message.startsWith('!')) return null

    const args = message.slice(1).split(' ')
    const command = args.shift().toLowerCase()

    return { command, args: sanitizeArgs(args), fullArgs: args.join(' ') }
}

function sanitizeArgs(args) {
    return args
        .map(a =>
            a
                .normalize("NFKC")                // normaliza unicode
                .replace(/[\u0300-\u036F]/g, "") 
                .trim()
        )
        .filter(a => a.length > 0)
}

async function startBot() {
    const accessToken = await getValidAccessToken()

    const client = new tmi.Client({
        options: { debug: true },
        identity: {
            username: "mauteiibot",
            password: `oauth:${accessToken}`
        },
        channels: ['mauteii']
    })

    await client.connect()

    client.on('message', async (channel, tags, message, self) => {
        if (self) return

        const parsed = parseCommand(message)
        if (!parsed) return

        const command = commands.get(parsed.command)
        if (!command) return

        try {
            await command.execute({
                client,
                channel: channel.replace('#', ''),
                tags,
                args: parsed.args,
                fullArgs: parsed.fullArgs
            })
        } catch (err) {
            console.error(err)
        }
    })
}

startBot()