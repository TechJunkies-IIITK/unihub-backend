const { PORT, DATABASE_URL } = require('./config/config')
const express = require('express')
const app = express()
const { logIn, signUp } = require('./controller/AuthController')
const { verifyToken } = require('./controller/JwtController') 
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server,{cors:{origin:'*'}})
const mongoose = require('mongoose')
const { join, create, leave, publicHubs} = require('./controller/SocketController')

mongoose.connect(DATABASE_URL,{
    useNewUrlParser:true,
    //useCreateIndex:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connection',()=>console.log('database connected'))

mongoose.connection.on('disconnected',()=>console.log('database disconnected'))

io.use((socket,next)=>{
    const token = socket.handshake.auth.token;
    const uid = socket.handshake.auth.userID;
    if(verifyToken(token,uid)){
        next()
    }else{
        socket.disconnect()
    }
})

io.on('connection',(socket)=>{
    console.log('a user connected')
    create(socket)
    join(socket)
    leave(socket)
    publicHubs(socket)
});

app.use(express.json())

app.post('/login',logIn)

app.post('/signup',signUp)

server.listen(PORT,()=>console.log(`Server running at port ${PORT}`))