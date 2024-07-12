const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDb = require('./config/db')
const Message = require('./model/messageModel')
const cors = require('cors')
const chatRoomRouter = require('./routes/chatRoomRouter')
const morgan = require('morgan')
const userRouter = require('./routes/userRouter');
const messageRouter = require('./routes/messageRouter')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: "*",
      methods: ["GET", "POST"]
   }
});
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

io.on('connection', (socket) => {
   console.log('a user connected');

   socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
   });

   socket.on('send_message', async ({ room, sender, message, time }) => {
      console.log('room:', room, 'message:', message, 'sender:', sender)
      if (room && sender && message) {
         const newMessage = new Message({ chatRoom: room, message: message, sender: sender });
         await newMessage.save();
      }

      io.to(room).emit('receive_message', { sender, message, time });
   });

   socket.on('disconnect', () => {
      console.log(`user disconnected : ${socket.id}`);
   });
});

app.use(userRouter)
app.use(messageRouter)
app.use(chatRoomRouter)

connectDb('mongodb://localhost:27017/db_chat')

server.listen(3001, () => {
   console.log('listening on *:3001');
});
