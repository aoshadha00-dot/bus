const express = require('express');
const router = express.Router();

const {
  getAllTimetable,
  getTimetableByRoute,
} = require('../controllers/timetableController');

router.get('/', getAllTimetable);
router.get('/route', getTimetableByRoute);

module.exports = router;