const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

const getAllBuses = async (req, res) => {
  try {
    const db = getDB();
    const buses = await db.collection('buses').find({}).toArray();

    res.json(
      buses.map((bus) => ({
        ...bus,
        _id: undefined,
      }))
    );
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch buses', error: e.message });
  }
};

const getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const bus = await db.collection('buses').findOne({ id });

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(bus);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch bus', error: e.message });
  }
};

const updateBus = async (req, res) => {
  try {
    const { id, lat, lng, speed } = req.body;
    const db = getDB();

    const result = await db.collection('buses').findOneAndUpdate(
      { id },
      {
        $set: {
          lat,
          lng,
          speed,
          status: speed > 3 ? 'running' : 'stopped',
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({
      message: 'Bus updated successfully',
      bus: result,
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update bus', error: e.message });
  }
};

module.exports = {
  getAllBuses,
  getBusById,
  updateBus,
};