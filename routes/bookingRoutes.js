const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {
  createBooking,
  getMyBookings,
  getBookingsForBus,
  cancelBooking,
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getMyBookings);
router.get('/bus/:busId', authMiddleware, getBookingsForBus);
router.put('/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;