const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const { exchangeCodeForToken } = require('../authentication/twitchAuth.service')
const { getBroadcasterId } = require('../utils/broadcast')

module.exports = {
    name: 'token',
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        const broadcasterId = await getBroadcasterId(channel)
        const usarTagId = parseInt(tags['user-id'])

        if((tags.mod) || (usarTagId === broadcasterId)){
            await exchangeCodeForToken(fullArgs)
        }else{
            sendMessage(channel, `@${tags.username} você não tem permissão para usar esse comando!`)
        }
    }
}