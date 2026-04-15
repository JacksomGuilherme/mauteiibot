import { RefreshingAuthProvider } from '@twurple/auth'
import { Bot, BotCommand, createBotCommand } from '@twurple/easy-bot'
import { EventSubWsListener } from '@twurple/eventsub-ws'
import { getAuthProvider } from './authentication/twitchAuth.service.js'
import { loadCommands } from './utils/commands.js'

import dotenv from 'dotenv'
dotenv.config()

const authProvider = await getAuthProvider()
const commands = loadCommands()

const bot = new Bot({
	authProvider,
	chatClientOptions: {
		rejoinChannelsOnReconnect: true
	},
	channels: ['mauteii'],
	commands
})

bot.onSub(({ broadcasterName, userName }) => {
	bot.say(broadcasterName, `Valeu @${userName} pelo sub!`)
})
bot.onResub(({ broadcasterName, userName, months }) => {
	bot.say(broadcasterName, `Valeu @${userName} por passar ${months} meses dando pro mautei!`)
})
bot.onSubGift(({ broadcasterName, gifterName, userName }) => {
	bot.say(broadcasterName, `Valeu @${gifterName} por dar um sub para @${userName}!`)
})