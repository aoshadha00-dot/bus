const Timetable = require('../models/timetable');

const getAllTimetable = async (req, res) => {
  try {
    const records = await Timetable.find().sort({ createdAt: -1 });

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable',
      error: error.message,
    });
  }
};

const getTimetableByRoute = async (req, res) => {
  try {
    const routeName = (req.query.routeName || '').trim();

    if (!routeName) {
      return res.status(400).json({
        success: false,
        message: 'routeName is required',
      });
    }

    const records = await Timetable.find({
      routeName: { $regex: routeName, $options: 'i' },
    }).sort({ createdAt: -1 });

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch route timetable',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTimetable,
  getTimetableByRoute,
};