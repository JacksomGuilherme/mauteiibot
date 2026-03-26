require('dotenv').config()
const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const xml2js = require("xml2js")

module.exports = {
    name: 'videonovo',
    description: 'Envia no chat o link do video mais rescente do canal do Mauteii',
    aliases: [],
    args: [],
    examples: ["!videonovo"],
    docignore: false,
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        const response = await axios.get("https://www.youtube.com/feeds/videos.xml?channel_id=UCSRVVnOhNV4K9kqTDxBOOyw")

        const parser = new xml2js.Parser()
        const json = await parser.parseStringPromise(response.data)

        const videoValido = json.feed.entry.find(v => {
            const link = v.link[0]['$'].href
            return !link.includes("shorts")
        })

        const title = videoValido.title[0]
        const link = videoValido.link[0]['$'].href
        
        sendMessage(channel, `Assista ao vídeo novo no canal do Mauteii:\n\n${title}\n${link}`)
    }
}