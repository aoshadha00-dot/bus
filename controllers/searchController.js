const { getDB } = require('../db');

const searchBusesByStops = async (req, res) => {
  try {
    const { pickup, destination } = req.query;

    if (!pickup || !destination) {
      return res.status(400).json({
        message: 'pickup and destination are required',
      });
    }

    const db = getDB();
    const buses = await db.collection('buses').find({}).toArray();
    const routes = await db.collection('routes').find({}).toArray();

    const routeMap = {};
    for (const route of routes) {
      routeMap[route.id] = route;
    }

    const results = [];

    for (const bus of buses) {
      const route = routeMap[bus.routeId];
      if (!route) continue;

      const pickupIndex = route.stops.indexOf(pickup);
      const destinationIndex = route.stops.indexOf(destination);

      if (pickupIndex !== -1 && destinationIndex !== -1 && pickupIndex < destinationIndex) {
        results.push({
          ...bus,
          routeName: route.name,
          pickup,
          destination,
        });
      }
    }

    res.json(results);
  } catch (e) {
    res.status(500).json({ message: 'Failed to search buses', error: e.message });
  }
};

const getAllStops = async (req, res) => {
  try {
    const db = getDB();
    const routes = await db.collection('routes').find({}).toArray();

    const stopSet = new Set();

    for (const route of routes) {
      for (const stop of route.stops) {
        stopSet.add(stop);
      }
    }

    res.json(Array.from(stopSet));
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch stops', error: e.message });
  }
};

module.exports = {
  searchBusesByStops,
  getAllStops,
};