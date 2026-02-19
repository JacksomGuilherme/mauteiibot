const {db} = require('../database/db.js')

// prepared statements (cacheados)
const insertStmt = db.prepare(`
    INSERT INTO broadcast (channel_name, broadcast_id)
    VALUES (?, ?)
`)

const selectStmt = db.prepare(`SELECT * FROM broadcast WHERE channel_name = ?`)

module.exports = {
    saveBroadcast(channelName, broadcast_id) {
        const existing = selectStmt.get(channelName)

        if (!existing) {
            insertStmt.run(channelName, broadcast_id)
        } 
    },

    getBroadcast(channelName) {
        return selectStmt.get(channelName)
    }
}
