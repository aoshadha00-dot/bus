const { getDB } = require('../db');

const getAllBookings = async (req, res) => {
  try {
    const db = getDB();
    const bookings = await db.collection('bookings').find({}).toArray();
    res.json(
      bookings.map((b) => ({
        ...b,
        id: b.id || b._id.toString(),
      }))
    );
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: e.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      userName,
      busId,
      routeId,
      routeName,
      departure,
      arrival,
      seatNo,
    } = req.body;

    if (!userName || !busId || !routeId || !departure || !seatNo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDB();
    const busesCol = db.collection('buses');
    const bookingsCol = db.collection('bookings');

    const bus = await busesCol.findOne({ id: busId });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const capacity = bus.capacity || 40;
    const seatNumber = parseInt(seatNo, 10);

    if (isNaN(seatNumber) || seatNumber < 1 || seatNumber > capacity) {
      return res.status(400).json({
        message: `Seat number must be between 1 and ${capacity}`,
      });
    }

    const existingBooking = await bookingsCol.findOne({
      busId,
      departure,
      seatNo,
      status: 'confirmed',
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'Seat already booked for this trip',
      });
    }

    const booking = {
      id: `booking_${Date.now()}`,
      userName,
      busId,
      routeId,
      routeName,
      departure,
      arrival,
      seatNo,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };

    await bookingsCol.insertOne(booking);

    res.json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create booking', error: e.message });
  }
};

const getSeatAvailability = async (req, res) => {
  try {
    const { busId, departure } = req.query;

    if (!busId || !departure) {
      return res.status(400).json({
        message: 'busId and departure are required',
      });
    }

    const db = getDB();
    const busesCol = db.collection('buses');
    const bookingsCol = db.collection('bookings');

    const bus = await busesCol.findOne({ id: busId });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const capacity = bus.capacity || 40;

    const booked = await bookingsCol
      .find({
        busId,
        departure,
        status: 'confirmed',
      })
      .toArray();

    const bookedSeats = booked
      .map((item) => item.seatNo)
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    const availableSeats = [];
    for (let i = 1; i <= capacity; i++) {
      if (!bookedSeats.includes(i.toString())) {
        availableSeats.push(i.toString());
      }
    }

    res.json({
      busId,
      departure,
      capacity,
      bookedSeats,
      availableSeats,
      availableCount: availableSeats.length,
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch seat availability', error: e.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const booking = await db.collection('bookings').findOne({ id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await db.collection('bookings').updateOne(
      { id },
      {
        $set: {
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
        },
      }
    );

    res.json({
      message: 'Booking cancelled successfully',
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to cancel booking', error: e.message });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  getSeatAvailability,
  cancelBooking,
};