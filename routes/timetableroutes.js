const express = require('express');
const router = express.Router();

const {
  getAllTimetables,
  getTimetablesByRoute,
} = require('../controllers/timetablecontroller');

router.get('/', getAllTimetables);
router.get('/:routeId', getTimetablesByRoute);

module.exports = router;