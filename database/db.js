const { DatabaseSync } = require('node:sqlite')
const db = new DatabaseSync('./database.sqlite')

db.exec(`CREATE TABLE IF NOT EXISTS auth (
    access_token TEXT NOT NULL, 
    refresh_token TEXT NOT NULL, 
    expires_at DATE
) `);


db.exec("SELECT * FROM auth")

module.exports = { db }