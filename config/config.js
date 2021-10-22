require('dotenv').config()

module.exports = {
    PORT:  process.env.PORT || 4000,
    SECRET: process.env.SECRET || 'secret',
    DATABASE_URL: process.env.DATABASE_URL || './??'
}