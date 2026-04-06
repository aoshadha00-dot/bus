const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    busName: {
      type: String,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Timetable', timetableSchema);