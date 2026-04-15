const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const xml2js = require("xml2js")

module.exports = {
    name: 'comandos',
    description: 'Envia no chat o link da página com os meus comandos',
    aliases: ["commands", "comms"],
    args: [],
    examples: ["!comandos"],
    docignore: false,
    execute: async (params, { userDisplayName ,say }) => {
        let urlComandos = "https://jacksomguilherme.github.io/mauteiibot/"
        say(`@${userDisplayName} -> A lista dos meus comandos está aqui \n${urlComandos}`)
    }
}