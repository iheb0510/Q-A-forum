const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { addUser, getUser, user_Disconnect } = require('./socket/chat.js');
const corsWithOptions = require('./routes/cors.js');
const { Server } = require('socket.io');
const Conversation = require('./models/Conversation');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// set cors preflight options
app.options('*', cors());
app.use(corsWithOptions);
//upload folder static routes
app.use('/uploads', express.static('uploads'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/community', require('./routes/community'));
app.use('/api/question', require('./routes/question'));
app.use('/api/answer', require('./routes/answer'));
app.use('/api/tag', require('./routes/tag'));
app.use('/api/chat', require('./routes/chat'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// On every Client Connection
io.on('connection', (socket) => {
  socket.on('join', ({ name, room }) => {
    console.log('name', name);
    const { user } = addUser({ id: socket.id, name, room });
    console.log('u', user);
    socket.join(user.room);
    console.log('socket', socket.id);
  });

  // send message
  socket.on('sendMessage', async (message, username,room, callback) => {
    const user = getUser(socket.id, username, room);
    console.log('ff', user);
    if (user) {
      await Conversation.create({
        room: user.room,
        user: user.id,
        userName: user.name,
        text: message,
      });
      const conversationMessages = await Conversation.find({ room: user.room });
      io.to(user.room).emit('message', { conversationMessages });
    }
    callback();
  });

  // get conversations
  socket.on('getMessages', async (room) => {
    const conversationMessages = await Conversation.find({ room: room });
    io.to(room).emit('returnMessages', { conversationMessages });
  });

  socket.on('disconnect', () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit('message', {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
    }
  });
});
// Server listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ` + `${PORT}`);
});
