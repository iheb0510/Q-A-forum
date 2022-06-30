const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
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

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

// Socket Layer over Http Server
const socket = require('socket.io')(server);
// On every Client Connection
socket.on('connection', (socket) => {
  console.log('Socket: client connected');
});

exports.socket = socket;
