const axios = require('axios')
const { sendMessage } = require('../utils/messages')
const { getValidAccessToken, getAuthProvider } = require('../authentication/twitchAuth.service')
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
        { "name": "Duração", "examples": ["30s", "45s", "60s"], "required": false },
        { "name": "Nome do Clipe", "examples": ["Dicção do mautei falhando"], "required": false },
    ],
    examples: ["!clipe 60s 1 minuto de jogadas insanas", "!clipe momento mais engraçado da live"],
    docignore: false,
    execute: async (params, { broadcasterId, userName, say }) => {
        const accessToken = await getValidAccessToken()

        const { seconds, title } = parseClipArgs(params)

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
            if (!clip?.id) {
                say(channel, 'Não foi possível criar o clipe, tente novamente.')
            }

            let url = `https://clips.twitch.tv/${clip.id}`

            let returnMessage = (title && title != '') ? `"${title}" ` : ""

            say(`Clipe ${returnMessage}criado:\n\n${url}`)
        } catch (error) {
            const status = error.response?.status

            if (status === 404 || status === 422) {
                say('Não é possível clipar um canal offline.')
            } else {
                console.error('Error during clip creation:', error.response?.data ?? error.message)
                say('Erro ao criar o clipe.')
            }
        }
    }
}