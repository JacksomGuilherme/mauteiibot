import dotenv from 'dotenv'
import { RefreshingAuthProvider } from '@twurple/auth'
import { Bot, createBotCommand } from '@twurple/easy-bot'
import authRepo from './repositories/auth.repository.js'

dotenv.config()

const tokenData = authRepo.getTokens()

const authProvider = new RefreshingAuthProvider(
	{
		clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
	}
)

authProvider.onRefresh(async (userId, newTokenData) => authRepo.saveTokens(newTokenData))

await authProvider.addUserForToken(tokenData, ['chat'])

const bot = new Bot({
	authProvider,
	channels: ['mauteii'],
	commands: [
		createBotCommand('dice', (params, { reply }) => {
            console.log(params)
			const diceRoll = Math.floor(Math.random() * 6) + 1
			reply(`You rolled a ${diceRoll}`)
		}),
		createBotCommand('slap', (params, { userName, say }) => {
			say(`${userName} slaps ${params.join(' ')} around a bit with a large trout`)
		})
	]
})

bot.onSub(({ broadcasterName, userName }) => {
	bot.say(broadcasterName, `Thanks to @${userName} for subscribing to the channel!`)
})
bot.onResub(({ broadcasterName, userName, months }) => {
	bot.say(broadcasterName, `Thanks to @${userName} for subscribing to the channel for a total of ${months} months!`)
})
bot.onSubGift(({ broadcasterName, gifterName, userName }) => {
	bot.say(broadcasterName, `Thanks to @${gifterName} for gifting a subscription to @${userName}!`)
})