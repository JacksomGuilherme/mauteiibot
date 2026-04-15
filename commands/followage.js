const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')
const { getBroadcasterId } = require('../utils/broadcast')
const { getUserByName } = require('../utils/user')

function getFollowDuration(followedAt) {
    const start = new Date(followedAt)
    const now = new Date()

    let years = now.getFullYear() - start.getFullYear()
    let months = now.getMonth() - start.getMonth()
    let days = now.getDate() - start.getDate()
    let hours = now.getHours() - start.getHours()

    if (hours < 0) {
        hours += 24
        days--
    }

    if (days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        days += lastMonth.getDate()
        months--
    }

    if (months < 0) {
        months += 12
        years--
    }

    const parts = []

    if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`)
    }

    if (months > 0) {
        parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`)
    }

    if (days > 0) {
        parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`)
    }

    if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`)
    }

    if (parts.length === 0) {
        return 'começou a seguir agora mesmo 👀'
    }

    if (parts.length === 1) {
        return `está seguindo há ${parts[0]}`
    }

    const last = parts.pop()
    return `está seguindo há ${parts.join(', ')} e ${last}`
}

module.exports = {
    name: 'followage',
    description: 'Mostra o tempo que você segue o canal ou o tempo que a pessoa que você marcar segue o canal',
    aliases: [],
    args: [
        { "name": "Usuário", "examples": ["@Mauteiibot"], "required": false },
    ],
    examples: ["!followage", "!followage @Mauteiibot"],
    docignore: false,
    execute: async (params, { broadcasterName, broadcasterId, userId, userDisplayName, say }) => {
        if (params[0]) {
            let username = params[0].replace('@', '').toLowerCase()
            if (username === broadcasterName) {
                say(`O @${username} é o streamer, ele não precisa se seguir`)
            } else {
                const accessToken = await getValidAccessToken()

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

                const followerData = res.data.data[0]
                if (!followerData) {
                    say(`@${user.display_name} ainda não segue o canal! bora seguir ai @${user.display_name} na humildade?`)
                } else {
                    say(`@${user.display_name} ${getFollowDuration(followerData.followed_at)}`)
                }
            }
        } else {
            if (userId === broadcasterId) {
                say(`@${userDisplayName} você é o streamer zé bunda`)
            } else {
                const accessToken = await getValidAccessToken()

                const res = await axios.get(
                    'https://api.twitch.tv/helix/channels/followers',
                    {
                        headers: {
                            'Client-ID': process.env.TWITCH_CLIENT_ID,
                            'Authorization': `Bearer ${accessToken}`
                        },
                        params: {
                            broadcaster_id: broadcasterId,
                            user_id: userId
                        }
                    }
                )
                const followerData = res.data.data[0]
                say(`@${userDisplayName} ${getFollowDuration(followerData.followed_at)}`)
            }
        }

    }
}