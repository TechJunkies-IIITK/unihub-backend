const { PORT } = require('./config/config')
const express = require('express')
const app = express()
const { logIn, signUp } = require('./controller/AuthController')
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

/*io.use((e,next)=>{
    // e[0] = path
    // e[1] = data
    if(e[0] === '/login' || e[0] === '/signup')
        return next()
    // verification for other paths
})*/

io.on('connection',(socket)=>{
    console.log('a user connected')
});

app.post('/login',logIn)

app.post('/signup',signUp)

app.listen(PORT,()=>console.log(`Server running at port ${PORT}`))