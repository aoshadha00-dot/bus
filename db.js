const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri =
      'mongodb+srv://magebususer:MageBus12345@magebus-cluster.zc5d4ia.mongodb.net/bus_tracker?retryWrites=true&w=majority&appName=Cluster0';

    await mongoose.connect(mongoUri);

    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;