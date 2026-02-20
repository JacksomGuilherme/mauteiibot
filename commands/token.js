require('dotenv').config()
const axios = require('axios')
const { sendMessage } = require('../utils/messages')

module.exports = {
    name: 'token',
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        if(!tags.mod){
            sendMessage(channel, `@${tags.username} você não tem permissão para usar esse comando!`)
        }else{
            await exchangeCodeForToken(fullArgs)
        }
    }
}