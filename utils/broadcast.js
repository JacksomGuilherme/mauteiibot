require('dotenv').config()
const axios = require('axios')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')

module.exports = {
    async getBroadcasterId(channel) {
        const accessToken = await getValidAccessToken()

        const res = await axios.get(
            'https://api.twitch.tv/helix/users',
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    login: channel
                }
            }
        )
    
        const user = res.data.data[0]
    
        return user.id
    }
}