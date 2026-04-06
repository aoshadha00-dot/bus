const express = require('express');
const router = express.Router();

const {
  getAssignedBus,
  getAssignedBusOpen,
  startTrip,
  startTripOpen,
  stopTrip,
  stopTripOpen,
  updateLocation,
} = require('../controllers/driverController');

router.get('/assigned-bus', getAssignedBus);
router.get('/assigned-bus-open', getAssignedBusOpen);

router.post('/start-trip', startTrip);
router.post('/start-trip-open', startTripOpen);

router.post('/stop-trip', stopTrip);
router.post('/stop-trip-open', stopTripOpen);

router.post('/update-location', updateLocation);

module.exports = router;