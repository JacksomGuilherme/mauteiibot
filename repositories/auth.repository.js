const {db} = require('../database/db.js')

// prepared statements (cacheados)
const insertStmt = db.prepare(`
    INSERT INTO auth (access_token, refresh_token, expires_at)
    VALUES (?, ?, ?)
`)

const updateStmt = db.prepare(`
    UPDATE auth
    SET access_token = ?, refresh_token = ?, expires_at = ?
`)

const selectStmt = db.prepare(`SELECT * FROM auth LIMIT 1`)

module.exports = {
    saveTokens(access, refresh, expiresAt) {
        const existing = selectStmt.get()

        if (existing) {
            updateStmt.run(access, refresh, expiresAt)
        } else {
            insertStmt.run(access, refresh, expiresAt)
        }
    },

    getTokens() {
        return selectStmt.get()
    }
}
