require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const busRoutes = require('./routes/busRoutes');
const timetableRoutes = require('./routes/timetableroutes');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const DB_NAME = process.env.DB_NAME || 'bus_tracker';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.log('MongoDB URI not found in .env');
      return;
    }

    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.log('MongoDB Error:', error.message);
  }
};

connectDB();

app.get('/', (req, res) => {
  return res.json({
    message: 'MageBus backend running',
  });
});
// ===== SEED BUSES (TEMP FOR TESTING) =====
app.get("/seed-buses", async (req, res) => {
  await Bus.deleteMany({});

  const buses = await Bus.insertMany([
    {
      busName: "Colombo Express",
      routeNumber: "100",
      startLocation: "Colombo",
      endLocation: "Galle",
      latitude: 6.9271,
      longitude: 79.8612,
      speed: 0,
      availableSeats: 40,
    },
    {
      busName: "Negombo Rider",
      routeNumber: "245",
      startLocation: "Negombo",
      endLocation: "Colombo",
      latitude: 7.2083,
      longitude: 79.8358,
      speed: 0,
      availableSeats: 30,
    },
    {
      busName: "Kandy Line",
      routeNumber: "01",
      startLocation: "Colombo",
      endLocation: "Kandy",
      latitude: 7.2906,
      longitude: 80.6337,
      speed: 0,
      availableSeats: 35,
    }
  ]);

  res.json({
    message: "Buses added successfully",
    buses,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/timetables', timetableRoutes);

// driver list alias
app.get('/api/driver', async (req, res) => {
  try {
    const User = require('./models/user');

    const drivers = await User.find({ role: 'driver' }).sort({ createdAt: -1 });

    return res.json({
      drivers: drivers.map((driver) => ({
        _id: driver._id,
        id: driver._id,
        name: driver.name,
        email: driver.email,
        role: driver.role,
        assignedBusId: driver.assignedBusId || '',
      })),
    });
  } catch (error) {
    console.log('DRIVER LIST ERROR:', error);

    return res.status(500).json({
      message: 'Failed to load drivers',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});