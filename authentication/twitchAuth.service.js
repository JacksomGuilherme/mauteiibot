const axios = require('axios')
require('dotenv').config()

const authRepo = require('../repositories/auth.repository')

async function refreshAccessToken(refreshToken) {
    console.log('🔄 Refreshing Twitch token...')

    const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET
            }
        }
    )

    const data = response.data

    const expiresAt = Date.now() + (data.expires_in * 1000)

    authRepo.saveTokens(
        data.access_token,
        data.refresh_token,
        expiresAt
    )

    console.log('✅ Token refreshed successfully')

    return data.access_token
}

async function getValidAccessToken() {
    const tokens = authRepo.getTokens()

    if (!tokens) {
        throw new Error('Bot ainda não foi autorizado pelo OAuth!')
    }

    const now = Date.now()

    const isExpired = now >= (tokens.expires_at - 60000)

    if (!isExpired) {
        return tokens.access_token
    }

    return await refreshAccessToken(tokens.refresh_token)
}

async function exchangeCodeForToken(code) {
    const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost'
            }
        }
    )

    const data = response.data
    const expiresAt = Date.now() + (data.expires_in * 1000)

    authRepo.saveTokens(
        data.access_token,
        data.refresh_token,
        expiresAt
    )

    console.log('✅ Tokens salvos no banco!')
}

module.exports = {
    exchangeCodeForToken,
    getValidAccessToken
}