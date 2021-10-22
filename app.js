const express = require('express')
const cors = require('cors')
const { PORT } = require('./config/config')
const AuthController = require('./controller/AuthController')
const app = express()


app.use(cors())
app.use(express.json())
AuthController.login()


app.listen(PORT,console.log(`${PORT}`))