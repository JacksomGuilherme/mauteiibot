const axios = require('axios')
const { getBroadcast, saveBroadcast } = require('../repositories/broadcast.repository')
const { getUserByName } = require('./user')

module.exports = {
    async getBroadcasterId(channel) {
        const broadcast = getBroadcast(channel)

        if(!broadcast){
            const user = await getUserByName(channel)

            saveBroadcast(channel, user.id)

            return user.id
        }else{
            return broadcast.broadcast_id
        }
    
    
    }
}