require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  SECRET: process.env.SECRET || 'secret',
  DATABASE_URL: process.env.DATABASE_URL || './??',
  APP_ID: process.env.APP_ID || '',
  APP_CERTIFICATE: process.env.APP_CERTIFICATE || ''
};
