const fs = require('fs')
const path = require('path')

try {
    const commands = []

    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'))

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        if (!command.docignore) {
            commands.push({
                name: command.name || '',
                description: command.description || '',
                aliases: command.aliases || [],
                arguments: command.args || [],
                examples: command.examples || []
            })
        }
    }

    const outputDir = path.join(__dirname, 'docs')

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir)
    }

    fs.writeFileSync(path.join(outputDir, 'commands.json'), JSON.stringify(commands, null, 2))

    console.log("Build finalizado: comandos exportados para ./docs/commands.json")
} catch (err) {
    console.error("Erro durante o build: ", err)
}