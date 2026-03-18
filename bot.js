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

    const newClient = new tmi.Client({
        options: { debug: false },
        identity: {
            username: "mauteiibot",
            password: `oauth:${accessToken}`
        },
        channels: ['mauteii']
    })

    newClient.on('message', async (channel, tags, message, self) => {
        if (self) return

        const parsed = parseCommand(message)
        if (!parsed) return

        const command = commands.get(parsed.command)
        if (!command) return

        try {
            await command.execute({
                client: newClient,
                channel: channel.replace('#', ''),
                tags,
                args: parsed.args,
                fullArgs: parsed.fullArgs
            })
        } catch (err) {
            console.error(err)
        }
    })

    newClient.on('disconnected', async (reason) => {
        console.log('Bot disconnected:', reason)
        await reconnectBot()
    })

    await newClient.connect()
    console.log('☑️ Bot connected')

    return newClient
}

let isReconnecting = false

async function reconnectBot() {
    if (isReconnecting) return
    
    isReconnecting = true

    console.log('🔄 Reconnecting bot with new token...')

    try {
        if (client) await client.disconnect()
    } catch {}

    try {
        client = await createClient()
    } finally {
        isReconnecting = false
    }
}

async function startBot() {
    client = await createClient()
}

startBot()

setInterval(() => {
    console.log("🔥 TESTANDO RECONNECT FORÇADO")
    reconnectBot()
}, 5000)