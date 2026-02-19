require('dotenv').config()
const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')
const { getBroadcasterId } = require('../utils/broadcast')
const { getUserByName } = require('../utils/user')

module.exports = {
    name: 'followage',
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        const accessToken = await getValidAccessToken()

        let username = args[0].replace('@', '').toLowerCase()
        const broadcasterId = getBroadcasterId(channel)

        const user = await getUserByName(username)

        const res = await axios.get(
            'https://api.twitch.tv/helix/channels/followers',
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    broadcaster_id: broadcasterId,
                    user_id: user.id
                }
            }
        )

        console.log(res.data)

    }
}