const express = require('express');
const router = express.Router();

const {
  getAllBookings,
  createBooking,
  getSeatAvailability,
} = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.get('/availability', getSeatAvailability);
router.post('/', createBooking);

module.exports = router;