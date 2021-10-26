const { PORT } = require('./config/config')
const { logIn, signUp } = require('./controller/AuthController')
const io = require('socket.io')
const server = io.listen(PORT)

server.use((e,next)=>{
    // e[0] = path
    // e[1] = data
    if(e[0] === '/login' || e[0] === '/signup')
        return next()
    // verification for other paths
})

server.on('connection',(socket)=>{
    console.log('a user connected')
    logIn(socket)
    signUp(socket)
});