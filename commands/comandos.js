require('dotenv').config()
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
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        let urlComandos = "https://jacksomguilherme.github.io/mauteiibot/"
        sendMessage(channel, `@${tags['display-name']} -> A lista dos meus comandos está aqui \n${urlComandos}`)
    }
}