const Bus = require('../models/bus');
const User = require('../models/user');

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });

    return res.json({
      buses,
    });
  } catch (error) {
    console.log('GET ALL BUSES ERROR:', error);

    return res.status(500).json({
      message: 'Failed to load buses',
      error: error.message,
    });
  }
};

const createBus = async (req, res) => {
  try {
    const {
      name,

      busName,
      busNumber,
      routeNumber,
      routeName,
      startLocation,
      endLocation,
      totalSeats,
      availableSeats,
      latitude,
      longitude,
      speed,
    } = req.body;

    if (!busName || !(busNumber || routeNumber) || !startLocation || !endLocation) {
      return res.status(400).json({
        message: 'busName, busNumber/routeNumber, startLocation and endLocation are required',
      });
    }

    const bus = await Bus.create({
      name: (name || routeName || busName || "Bus").trim(),
      busName: (busName || name || routeName || "Bus").trim(),

      busNumber: (busNumber || routeNumber || "001").trim(),
      routeNumber: (routeNumber || busNumber || "001").trim(),
      routeName: (routeName || name || busName || "Route").trim(),

      startLocation: (startLocation || "start").trim(),
      endLocation: (endLocation || "end").trim(),

      totalSeats: Number(totalSeats || 40),
      availableSeats: Number(availableSeats || totalSeats || 40),
      latitude: Number(latitude || 0),
      longitude: Number(longitude || 0),
      speed: Number(speed || 0),
    });

    return res.status(201).json({
      message: 'Bus created successfully',
      bus,
    });
  } catch (error) {
    console.log('CREATE BUS ERROR:', error);

    return res.status(500).json({
      message: 'Failed to create bus',
      error: error.message,
    });
  }
};

const updateBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({
        message: 'Bus not found',
      });
    }

    const {
      busName,
      busNumber,
      routeNumber,
      routeName,
      startLocation,
      endLocation,
      totalSeats,
      availableSeats,
      latitude,
      longitude,
      speed,
    } = req.body;

    if (busName != null) bus.busName = String(busName).trim();
    if (busNumber != null) bus.busNumber = String(busNumber).trim();
    if (routeNumber != null) bus.routeNumber = String(routeNumber).trim();
    if (routeName != null) bus.routeName = String(routeName).trim();
    if (startLocation != null) bus.startLocation = String(startLocation).trim();
    if (endLocation != null) bus.endLocation = String(endLocation).trim();
    if (totalSeats != null) bus.totalSeats = Number(totalSeats);
    if (availableSeats != null) bus.availableSeats = Number(availableSeats);
    if (latitude != null) bus.latitude = Number(latitude);
    if (longitude != null) bus.longitude = Number(longitude);
    if (speed != null) bus.speed = Number(speed);
    if (isActive != null) bus.isActive = Boolean(isActive);

    await bus.save();

    return res.json({
      message: 'Bus updated successfully',
      bus,
    });
  } catch (error) {
    console.log('UPDATE BUS ERROR:', error);

    return res.status(500).json({
      message: 'Failed to update bus',
      error: error.message,
    });
  }
};

const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({
        message: 'Bus not found',
      });
    }

    await Bus.findByIdAndDelete(id);

    return res.json({
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    console.log('DELETE BUS ERROR:', error);

    return res.status(500).json({
      message: 'Failed to delete bus',
      error: error.message,
    });
  }
};

const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).sort({ createdAt: -1 });

    return res.json({
      drivers: drivers.map((driver) => ({
        _id: driver._id,
        id: driver._id,
        name: driver.name,
        email: driver.email,
        role: driver.role,
        assignedBusId: driver.assignedBusId || '',
      })),
    });
  } catch (error) {
    console.log('GET DRIVERS ERROR:', error);

    return res.status(500).json({
      message: 'Failed to load drivers',
      error: error.message,
    });
  }
};

const assignBusToDriver = async (req, res) => {
  try {
    const { driverId, busId } = req.body;

    if (!driverId || !busId) {
      return res.status(400).json({
        message: 'driverId and busId are required',
      });
    }

    const driver = await User.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        message: 'Driver not found',
      });
    }

    if (driver.role !== 'driver') {
      return res.status(400).json({
        message: 'Selected user is not a driver',
      });
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({
        message: 'Bus not found',
      });
    }

    driver.assignedBusId = bus._id.toString();
    await driver.save();

    return res.json({
      message: 'Bus assigned successfully',
      driver: {
        _id: driver._id,
        id: driver._id,
        name: driver.name,
        email: driver.email,
        role: driver.role,
        assignedBusId: driver.assignedBusId,
      },
      bus,
    });
  } catch (error) {
    console.log('ASSIGN BUS TO DRIVER ERROR:', error);

    return res.status(500).json({
      message: 'Failed to assign bus',
      error: error.message,
    });
  }
};

module.exports = {
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  getDrivers,
  assignBusToDriver,
};