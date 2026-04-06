const express = require("express");
const router = express.Router();

const {
  getStops,
  searchBuses,
  searchTimetable,
} = require("../controllers/searchController");

router.get("/stops", getStops);
router.get("/buses", searchBuses);
router.get("/timetable", searchTimetable);

module.exports = router;