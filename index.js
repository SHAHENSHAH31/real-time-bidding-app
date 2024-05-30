const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./utils/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
//const errorMiddleware = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/items', authMiddleware, itemRoutes);
app.use('/api/items/:itemId/bids', authMiddleware, bidRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// Error handling middleware
//app.use(errorMiddleware);

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('bid', (bid) => {
    // Handle new bid event
    io.emit('update', bid);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Sync database schema
sequelize.sync().then(() => {
  console.log('Database synced successfully');
}).catch(err => {
  console.error('Error syncing database:', err);
});
