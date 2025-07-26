const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const config = require('./config');
const { createInvoice } = require('./nowpayments');

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.post('/api/create-invoice', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const invoice = await createInvoice(amount, currency);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const { user, message } = req.body;
    const notification = new Notification({ user, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');

    const User = require('./models/User');
    const Post = require('./models/Post');
    const Notification = require('./models/Notification');
    const notificationStream = Notification.watch();
    const userStream = User.watch();
    const postStream = Post.watch();

    userStream.on('change', (change) => {
      io.emit('users', change);
    });

    postStream.on('change', (change) => {
      io.emit('posts', change);
    });

    notificationStream.on('change', (change) => {
      io.to(change.fullDocument.user.toString()).emit('notification', change.fullDocument);
    });
  })
  .catch(err => console.log(err));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
