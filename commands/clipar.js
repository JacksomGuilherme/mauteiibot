const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const { getValidAccessToken } = require('../authentication/twitchAuth.service')
const { getBroadcasterId } = require('../utils/broadcast')

function parseClipArgs(args) {
    let seconds = null
    let title = args.join(' ')

    if (args.length > 0) {
        const match = args[0].match(/^(\d+)s$/i)

        if (match) {
            seconds = parseInt(match[1])

            // limite seguro
            if (seconds < 5) seconds = 5
            if (seconds > 60) seconds = 60

            title = args.slice(1).join(' ')
        }
    }

    return { seconds, title }
}

module.exports = {
    name: 'clip',
    description: 'Cria clipes automaticamente, o comando aceita o tempo de duração (5s - 60s) e o nome do clipe',
    aliases: ['clipar', 'clipe'],
    args: [
        {"name": "Duração", "examples": ["30s", "45s", "60s"], "required": false},
        {"name": "Nome do Clipe", "examples": ["Dicção do mautei falhando"], "required": false},
    ],
    examples: ["!clipe 60s 1 minuto de jogadas insantas", "!clipe momento mais engraçado da live"],
    docignore: false,
    execute: async ({ client, channel, tags, args, fullArgs }) => {
        const accessToken = await getValidAccessToken()
        const broadcasterId = await getBroadcasterId(channel)

        const { seconds, title } = parseClipArgs(args)

        let duration = seconds != null ? seconds : 30

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
                        title: title,
                        duration: duration,
                        broadcaster_id: broadcasterId
                    }
                }
            )
            let clip = await response.data.data[0]

            let url = `https://clips.twitch.tv/${clip.id}`

            let returnMessage = (title && title != '') ? `"${title}" ` : ""

            sendMessage(channel, `Clipe ${returnMessage}criado:\n\n${url}`)
        } catch (error) {
            if (error.status === 404) {
                sendMessage(channel, `Não é possível clipar um canal offline`)
            }
        }
    }
}