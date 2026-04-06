const Booking = require('../models/booking');
const Bus = require('../models/bus');

const createBooking = async (req, res) => {
  console.log("BOOKING BODY:", req.body);
  console.log("BOOKING busId:", req.body.busId);

  try {
    const {
      busId,
      passengerName,
      pickup,
      destination,
      seats,
      phone,
      notes,
    } = req.body;

    let bus = null;

    if (String(busId).match(/^[0-9a-fA-F]{24}$/)) {
      bus = await Bus.findById(busId);
    } else {
      bus = await Bus.findOne({ id: busId });
    }

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    const booking = new Booking({
      busId: bus._id,
      passengerName,
      pickup,
      destination,
      seats: Number(seats || 1),
      phone,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date(),
    });

    await booking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log("BOOKING ERROR:", error);
    return res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
}

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.log('GET MY BOOKINGS ERROR:', error);
    return res.status(500).json({
      message: 'Failed to load my bookings',
      error: error.message,
    });
  }
};

const getBookingsForBus = async (req, res) => {
  try {
    return res.status(200).json({
      bookings: [],
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to load bus bookings',
      error: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    return res.status(200).json({
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};
module.exports = {
  createBooking,
  getMyBookings,
  getBookingsForBus,
  cancelBooking,
};