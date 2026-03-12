require('dotenv').config()
const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const xml2js = require("xml2js")
const axios = require('axios')

module.exports = {
    name: 'videonovo',
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        const response = await axios.get("https://www.youtube.com/feeds/videos.xml?channel_id=UCSRVVnOhNV4K9kqTDxBOOyw")

        const parser = new xml2js.Parser()
        const json = await parser.parseStringPromise(response.data)

        const title = json.feed.entry[0].title[0]
        const link = json.feed.entry[0].link[0]['$'].href
        sendMessage(channel, `Assista ao video novo no canal do @Mauteii:\n\n${title}\n${link}`)
    }
}