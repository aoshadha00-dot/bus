require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./db');

const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const timetableRoutes = require('./routes/timetable_routes');
const bookingRoutes = require('./routes/bookingRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bus Tracker Backend is running');
});

app.use('/auth', authRoutes);
app.use('/bus', busRoutes);
app.use('/timetables', timetableRoutes);
app.use('/bookings', bookingRoutes);
app.use('/search', searchRoutes);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();