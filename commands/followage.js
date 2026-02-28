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
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        const broadcasterId = await getBroadcasterId(channel)
        const usarTagId = parseInt(tags['user-id'])
        const accessToken = await getValidAccessToken()

        if (args[0]) {
            let username = args[0].replace('@', '').toLowerCase()
            const user = await getUserByName(username)
            if (parseInt(user.id) === broadcasterId) {
                sendMessage(channel, `O @${user.display_name} é o streamer, ele não precisa se seguir`)
            } else {
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
                    sendMessage(channel, `@${user.display_name} ainda não segue o canal! bora seguir ai @${user.display_name} na humildade?`)
                } else {
                    sendMessage(channel, `@${user.display_name} ${getFollowDuration(followerData.followed_at)}`)
                }
            }
        } else {
            if (usarTagId === broadcasterId) {
                sendMessage(channel, `@${tags.username} você é o streamer zé bunda`)
            } else {
                const res = await axios.get(
                    'https://api.twitch.tv/helix/channels/followers',
                    {
                        headers: {
                            'Client-ID': process.env.TWITCH_CLIENT_ID,
                            'Authorization': `Bearer ${accessToken}`
                        },
                        params: {
                            broadcaster_id: broadcasterId,
                            user_id: usarTagId
                        }
                    }
                )
                const followerData = res.data.data[0]
                sendMessage(channel, `@${tags['display-name']} ${getFollowDuration(followerData.followed_at)}`)
            }
        }

    }
}