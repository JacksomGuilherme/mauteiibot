const { RefreshingAuthProvider } = require('@twurple/auth')
const authRepo = require('../repositories/auth.repository')

let authProvider = null

async function getAuthProvider() {
    if (authProvider) return authProvider

    const tokens = authRepo.getTokens()

    if (!tokens) {
        throw new Error('Bot are not authorized from Twitch OAuth!')
    }

    authProvider = new RefreshingAuthProvider({
		clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }
    )

    await authProvider.onRefresh((userId, newTokenData) => {
        authRepo.saveTokens(newTokenData)
        console.log('✅ Token refreshed successfully')
    })

    await authProvider.addUserForToken(
        tokens,
        ['chat', 'api']
    )

    return authProvider
}


async function getValidAccessToken() {
    const provider = await getAuthProvider()
    const token = await provider.getAccessTokenForUser(process.env.BOT_USER_ID)
    return token.accessToken
}

async function exchangeCodeForToken(code) {
    const axios = require('axios')

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

    const tokenData = response.data

    authRepo.saveTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        obtainmentTimestamp: Date.now()
    })

    authProvider = null

    console.log('✅ Tokens salvos no banco!')
}
module.exports = {
    getAuthProvider,
    getValidAccessToken,
    exchangeCodeForToken
}
