const Bus = require("../models/bus");
const Timetable = require("../models/timetable");

const getStops = async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true });

    const stopSet = new Set();

    buses.forEach((bus) => {
      if (bus.from) stopSet.add(bus.from);
      if (bus.to) stopSet.add(bus.to);
    });

    const stops = Array.from(stopSet).sort();

    return res.status(200).json({
      success: true,
      stops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stops",
      error: error.message,
    });
  }
};

const searchBuses = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to query parameters are required",
      });
    }

    const buses = await Bus.find({
      isActive: true,
      from: { $regex: new RegExp(`^${from}$`, "i") },
      to: { $regex: new RegExp(`^${to}$`, "i") },
    }).sort({ departureTime: 1 });

    return res.status(200).json({
      success: true,
      buses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search buses",
      error: error.message,
    });
  }
};

const searchTimetable = async (req, res) => {
  try {
    const { from, to } = req.query;

    const query = { isActive: true };

    if (from) {
      query.from = { $regex: new RegExp(`^${from}$`, "i") };
    }

    if (to) {
      query.to = { $regex: new RegExp(`^${to}$`, "i") };
    }

    const timetable = await Timetable.find(query).sort({ departureTime: 1 });

    return res.status(200).json({
      success: true,
      timetable,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search timetable",
      error: error.message,
    });
  }
};

module.exports = {
  getStops,
  searchBuses,
  searchTimetable,
};