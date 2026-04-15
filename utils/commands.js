const fs = require('fs')
const path = require('path')
const { createBotCommand } = require('@twurple/easy-bot')

function loadCommands() {
    const commands = []

    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands'))

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`)
        
        commands.push(createBotCommand(command.name, command.execute, { aliases: command.aliases }))
    }

    return commands
}

module.exports = { loadCommands }