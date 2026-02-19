require('dotenv').config()
const axios = require('axios')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')
const { getBroadcast, saveBroadcast } = require('../repositories/broadcast.repository')

module.exports = {
    async getUserByName(username) {
        const accessToken = await getValidAccessToken()

        const res = await axios.get(
            'https://api.twitch.tv/helix/users',
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    login: username
                }
            }
        )

        const user = res.data.data[0]
        return user
    }
}
