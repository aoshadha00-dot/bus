const Bus = require('../models/bus');

// =====================================================
// GET ALL BUSES
// =====================================================
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });

    return res.status(200).json(buses);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch buses',
      error: error.message,
    });
  }
};

// =====================================================
// GET BUS BY ID
// =====================================================
const getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    let bus = await Bus.findById(id).catch(() => null);

    if (!bus) {
      bus = await Bus.findOne({
        $or: [{ id: id }, { _id: id }],
      });
    }

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    return res.status(200).json(bus);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bus',
      error: error.message,
    });
  }
};

// =====================================================
// CREATE BUS
// =====================================================
const createBus = async (req, res) => {
  try {
    const {
      name,
      busName,
      routeNumber,
      busNumber,
      routeName,
      startLocation,
      endLocation,
      availableSeats,
      totalSeats,
      latitude,
      longitude,
      driverName,
      arrivalTime,
      isActive,
    } = req.body;

    const finalName = (name || busName || '').trim();
    const finalRouteNumber = (routeNumber || busNumber || routeName || '').trim();
    const finalStartLocation = (startLocation || '').trim();
    const finalEndLocation = (endLocation || '').trim();
    const finalSeats = Number(availableSeats ?? totalSeats ?? 40);

    if (!finalName || !finalRouteNumber) {
      return res.status(400).json({
        success: false,
        message: 'Bus name and route number are required',
      });
    }
    console.log("BUS CREATE NEW VERSION RUNNING");
    console.log("ADMIN BUS ROUTE NEW");

    const bus = new Bus({
      id: `bus_${Date.now()}`,

      name: finalName,
      busName: finalName,

      routeNumber: finalRouteNumber,
      busNumber: finalRouteNumber,
      routeName: finalRouteNumber,

      startLocation: finalStartLocation,
      endLocation: finalEndLocation,

      totalSeats: 40,
      availableSeats: 40,
    });

    await bus.save();

    return res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      bus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create bus',
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE BUS
// =====================================================
const updateBus = async (req, res) => {
  try {
    const { id } = req.params;

    let bus = await Bus.findById(id).catch(() => null);

    if (!bus) {
      bus = await Bus.findOne({
        $or: [{ id: id }, { _id: id }],
      });
    }

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    const {
      name,
      busName,
      routeNumber,
      busNumber,
      routeName,
      startLocation,
      endLocation,
      availableSeats,
      totalSeats,
      latitude,
      longitude,
      driverName,
      arrivalTime,
      isActive,
    } = req.body;

    const finalName = (name || busName || bus.name || '').trim();
    const finalRouteNumber =
        (routeNumber || busNumber || routeName || bus.routeNumber || '').trim();

    bus.name = finalName;
    bus.busName = finalName;
    bus.routeNumber = finalRouteNumber;
    bus.busNumber = finalRouteNumber;
    bus.routeName = finalRouteNumber;

    if (startLocation !== undefined) {
      bus.startLocation = String(startLocation).trim();
    }

    if (endLocation !== undefined) {
      bus.endLocation = String(endLocation).trim();
    }

    if (availableSeats !== undefined || totalSeats !== undefined) {
      const finalSeats = Number(availableSeats ?? totalSeats ?? bus.availableSeats ?? 40);
      bus.availableSeats = finalSeats;
      bus.totalSeats = finalSeats;
    }

    if (latitude !== undefined) {
      bus.latitude = Number(latitude);
    }

    if (longitude !== undefined) {
      bus.longitude = Number(longitude);
    }

    if (driverName !== undefined) {
      bus.driverName = String(driverName).trim();
    }

    if (arrivalTime !== undefined) {
      bus.arrivalTime = String(arrivalTime).trim();
    }

    if (isActive !== undefined) {
      bus.isActive = isActive === true;
    }

    await bus.save();

    return res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      bus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update bus',
      error: error.message,
    });
  }
};

// =====================================================
// DELETE BUS
// =====================================================
const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    let deletedBus = await Bus.findByIdAndDelete(id).catch(() => null);

    if (!deletedBus) {
      deletedBus = await Bus.findOneAndDelete({
        $or: [{ id: id }, { _id: id }],
      });
    }

    if (!deletedBus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Bus deleted successfully',
      bus: deletedBus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete bus',
      error: error.message,
    });
  }
};

// =====================================================
// SEARCH BUSES
// =====================================================
const searchBuses = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    if (!q) {
      const buses = await Bus.find().sort({ createdAt: -1 });
      return res.status(200).json(buses);
    }

    const buses = await Bus.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { busName: { $regex: q, $options: 'i' } },
        { routeNumber: { $regex: q, $options: 'i' } },
        { busNumber: { $regex: q, $options: 'i' } },
        { routeName: { $regex: q, $options: 'i' } },
        { startLocation: { $regex: q, $options: 'i' } },
        { endLocation: { $regex: q, $options: 'i' } },
        { driverName: { $regex: q, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json(buses);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};

// =====================================================
// GET NEARBY BUSES
// =====================================================
const getNearbyBuses = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      const buses = await Bus.find().sort({ createdAt: -1 });
      return res.status(200).json(buses);
    }

    const buses = await Bus.find().sort({ createdAt: -1 });

    const withDistance = buses.map((bus) => {
      const busLat = Number(bus.latitude ?? 0);
      const busLng = Number(bus.longitude ?? 0);

      const distance =
          Math.pow(busLat - lat, 2) + Math.pow(busLng - lng, 2);

      return {
        bus,
        distance,
      };
    });

    withDistance.sort((a, b) => a.distance - b.distance);

    return res.status(200).json(withDistance.map((item) => item.bus));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby buses',
      error: error.message,
    });
  }
};

module.exports = {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  searchBuses,
  getNearbyBuses,
};