require('dotenv').config()
const axios = require('axios')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')
const { getBroadcasterId } = require('./broadcast')

module.exports = {

    async sendMessage(channel, content) {
        try {
            const accessToken = await getValidAccessToken()
            const broadcasterId = await getBroadcasterId(channel)

            await axios.post(
                'https://api.twitch.tv/helix/chat/messages',
                {
                    broadcaster_id: broadcasterId,
                    sender_id: process.env.BOT_USER_ID,
                    message: content
                },
                {
                    headers: {
                        'Client-ID': process.env.TWITCH_CLIENT_ID,
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            )
        } catch (error) {
            console.error(error.message)
        }
    }

}