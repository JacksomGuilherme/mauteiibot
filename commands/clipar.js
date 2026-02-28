const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')
const { getBroadcasterId } = require('../utils/broadcast')

module.exports = {
    name: 'clip',
    aliases: ['clipar', 'clipe'],
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        const accessToken = await getValidAccessToken()
        const broadcasterId = await getBroadcasterId(channel)
        try {
            let response = await axios.post(
                `https://api.twitch.tv/helix/clips`,
                null,
                {
                    headers: {
                        'Client-ID': process.env.TWITCH_CLIENT_ID,
                        'Authorization': `Bearer ${accessToken}`
                    },
                    params: {
                        title: fullArgs,
                        broadcaster_id: broadcasterId
                    }
                }
            )
            let clip = await response.data.data[0]

            let url = `https://clips.twitch.tv/${clip.id}`

            sendMessage(channel, `Clipe "${fullArgs}" criado:\n\n${url}`)
        } catch (error) {
            if (error.status === 404) {
                sendMessage(channel, `Não é possível clipar um canal offline`)
            }
        }
    }
}