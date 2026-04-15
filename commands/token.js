const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const { exchangeCodeForToken } = require('../authentication/twitchAuth.service')
const { getBroadcasterId } = require('../utils/broadcast')

module.exports = {
    name: 'token',
    docignore: true,
    execute: async (params, { broadcasterId, msg, say }) => {
        if(msg.userInfo.isMod || msg.userInfo.isLeadMod || msg.userInfo.isBroadcaster){
            await exchangeCodeForToken(params[0])
        }else{
            say(`@${tags.username} você não tem permissão para usar esse comando!`)
        }
    }
}