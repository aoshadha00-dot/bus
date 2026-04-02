const express = require("express");
const router = express.Router();

const { getTimetable } = require("../controllers/timetablecontroller");

router.get("/", getTimetable);

module.exports = router;