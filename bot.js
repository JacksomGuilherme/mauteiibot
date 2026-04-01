require('dotenv').config()
const { loadCommands } = require('./utils/handler')
const { start } = require('./utils/connectionManager.js')

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

start(commands, parseCommand)