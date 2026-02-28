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

let client

async function createClient() {
    const accessToken = await getValidAccessToken()

    client = new tmi.Client({
        options: { 
            debug: true,
            messagesLogLevel: 'info'
        },
        identity: {
            username: "mauteiibot",
            password: `oauth:${accessToken}`
        },
        channels: ['mauteii']
    })

    await client.connect()
}

async function reconnectBot() {
    console.log('🔄 Reconnecting bot with new token...')
    if (client) {
        await client.disconnect()
    }
    await createClient()
}

async function startBot() {
    await createClient()

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

    client.on('disconnected', async (reason) => {
        console.log('Bot disconnected:', reason)

        await reconnectBot()
    })
}

startBot()