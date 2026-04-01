const tmi = require('tmi.js')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')
const { sendMessage } = require('./messages')

let client = null
let isReconnecting = false
let instanceId = 0
let reconnectAttempts = 0

const MAX_BACKOFF = 30000

function getBackoffDelay() {
    const delay = Math.min(1000 * 2 ** reconnectAttempts, MAX_BACKOFF)
    reconnectAttempts++
    return delay
}

function resetBackoff() {
    reconnectAttempts = 0
}

function destroyClient(oldClient) {
    if (!oldClient) return

    try {
        oldClient.removeAllListeners()
    } catch {}

    try {
        oldClient.ws?.close()
    } catch {}
}

async function createClient(commands, parseCommand) {
    const accessToken = await getValidAccessToken()

    instanceId++
    const currentId = instanceId

    let clientOptions = {
        options: { debug: false },
        identity: {
            username: "mauteiibot",
            password: `oauth:${accessToken}`
        },
        channels: ['mauteii']
    }

    const newClient = new tmi.Client(clientOptions)

    newClient.on('message', async (channel, tags, message, self) => {
        if (self || currentId !== instanceId) return

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
        if (currentId !== instanceId) return

        console.log('❌ Disconnected:', reason)
        await reconnect(commands, parseCommand)
    })

    newClient.on('notice', async (channel, msgid, message) => {
        if (msgid === 'msg_login_authentication_failed') {
            console.log('❌ Login authentication failed')
            await reconnect(commands, parseCommand)
        }
    })

    await newClient.connect().then(() => {
        console.log('☑️ Bot connected')
        resetBackoff()
    })

    return newClient
}

async function reconnect(commands, parseCommand) {
    if (isReconnecting) return

    isReconnecting = true

    const delay = getBackoffDelay()
    console.log(`🔄 Reconnecting in ${delay / 1000}s...`)

    try {
        destroyClient(client)
        client = null

        await new Promise(res => setTimeout(res, delay))

        client = await createClient(commands, parseCommand)

    } catch (err) {
        console.error('Erro no reconnect:', err)

        isReconnecting = false
        await reconnect(commands, parseCommand)
        return
    }

    isReconnecting = false
}

async function start(commands, parseCommand) {
    client = await createClient(commands, parseCommand)
}

module.exports = {
    start
}