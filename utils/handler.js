const fs = require('fs')
const path = require('path')

function loadCommands() {
    const commands = new Map()

    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands'))

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`)

        commands.set(command.name, command)

        if (command.aliases && Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
                commands.set(alias, command)
            }
        }
    }

    return commands
}

module.exports = { loadCommands }