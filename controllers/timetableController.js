const { getDB } = require('../db');

const getAllTimetables = async (req, res) => {
  try {
    const db = getDB();
    const timetables = await db.collection('timetables').find({}).toArray();
    res.json(timetables);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch timetables', error: e.message });
  }
};

const getTimetablesByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const db = getDB();

    const timetables = await db.collection('timetables').find({ routeId }).toArray();

    if (!timetables.length) {
      return res.status(404).json({ message: 'No timetable found for this route' });
    }

    res.json(timetables);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch route timetables', error: e.message });
  }
};

module.exports = {
  getAllTimetables,
  getTimetablesByRoute,
};