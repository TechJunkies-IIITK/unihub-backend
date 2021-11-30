const { PORT, DATABASE_URL } = require('./config/config');
const express = require('express');
const app = express();
const { logIn, signUp, verify } = require('./controller/AuthController');
const { verifyToken } = require('./controller/JwtController');
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { allowEIO3: true, cors: { origin: '*' } });
const mongoose = require('mongoose');
const { join, create, leave, publicHubs, connections } = require('./controller/SocketController');

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  //useCreateIndex:true,
  useUnifiedTopology: true
});

mongoose.connection.on('connection', () => console.log('database connected'));

mongoose.connection.on('disconnected', () => console.log('database disconnected'));

io.use((socket, next) => {
  const token = socket.handshake.headers.token;
  const uid = Number(socket.handshake.headers.userid);
  if (verifyToken(token, uid)) {
    next();
  } else {
    socket.disconnect();
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  connections[socket.id] = {};
  create(socket);
  join(socket);
  leave(socket);
  publicHubs(socket);
  socket.on('disconnect', () => socket.emit('leave', {}));
});

app.use(express.json());

app.post('/login', logIn);

app.post('/signup', signUp);

app.post('/verify', verify);

server.listen(PORT, () => console.log(`Server running at port ${PORT}`));
