const {db} = require('../database/db.js')

// prepared statements (cacheados)
const insertStmt = db.prepare(`
    INSERT INTO auth (accessToken, refreshToken, expiresIn, obtainmentTimestamp)
    VALUES (?, ?, ?, ?)
`)

const updateStmt = db.prepare(`
    UPDATE auth
    SET accessToken = ?, refreshToken = ?, expiresIn = ?, obtainmentTimestamp = ?
`)

const selectStmt = db.prepare(`SELECT * FROM auth LIMIT 1`)

module.exports = {
    saveTokens(tokenData) {
        const existing = selectStmt.get()

        if (existing) {
            updateStmt.run(
                tokenData.accessToken, 
                tokenData.refreshToken, 
                tokenData.expiresIn, 
                tokenData.obtainmentTimestamp)
        } else {
            insertStmt.run(
                tokenData.accessToken, 
                tokenData.refreshToken, 
                tokenData.expiresIn, 
                tokenData.obtainmentTimestamp)
        }
    },

    getTokens() {
        return selectStmt.get()
    }
}
