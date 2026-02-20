const { DatabaseSync } = require('node:sqlite')
const db = new DatabaseSync('./database.sqlite')

db.exec(`CREATE TABLE IF NOT EXISTS auth (
    access_token TEXT NOT NULL, 
    refresh_token TEXT NOT NULL, 
    expires_at DATE
) `);


db.exec(`CREATE TABLE IF NOT EXISTS broadcast (
    channel_name TEXT PRIMARY KEY, 
    broadcast_id INTEGER
) `);


module.exports = { db }