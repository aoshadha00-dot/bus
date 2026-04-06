const User = require('../models/user');
const Bus = require('../models/bus');

const findDriver = async () => {
  let driver = await User.findOne({ role: 'driver' });

  if (!driver) {
    driver = await User.findOne({ role: { $regex: '^driver$', $options: 'i' } });
  }

  return driver;
};

const findAssignedBus = async (assignedBusId) => {
  if (!assignedBusId) {
    return null;
  }

  let bus = await Bus.findById(assignedBusId).catch(() => null);

  if (!bus) {
    bus = await Bus.findOne({
      $or: [{ id: assignedBusId }, { _id: assignedBusId }],
    });
  }

  return bus;
};

const getAssignedBus = async (req, res) => {
  try {
    const driver = await findDriver();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    const assignedBusId = driver.assignedBusId || driver.assignedBus || '';

    if (!assignedBusId) {
      return res.status(404).json({
        success: false,
        message: 'No bus assigned to this driver',
      });
    }

    const bus = await findAssignedBus(assignedBusId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Assigned bus not found',
      });
    }

    return res.status(200).json({
      success: true,
      bus,
      tripStarted: bus.isActive === true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned bus',
      error: error.message,
    });
  }
};

const getAssignedBusOpen = async (req, res) => {
  return getAssignedBus(req, res);
};

const startTrip = async (req, res) => {
  try {
    const driver = await findDriver();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    const assignedBusId = driver.assignedBusId || driver.assignedBus || '';
    const bus = await findAssignedBus(assignedBusId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Assigned bus not found',
      });
    }

    bus.isActive = true;
    await bus.save();

    return res.status(200).json({
      success: true,
      message: 'Trip started successfully',
      bus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to start trip',
      error: error.message,
    });
  }
};

const startTripOpen = async (req, res) => {
  return startTrip(req, res);
};

const stopTrip = async (req, res) => {
  try {
    const driver = await findDriver();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    const assignedBusId = driver.assignedBusId || driver.assignedBus || '';
    const bus = await findAssignedBus(assignedBusId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Assigned bus not found',
      });
    }

    bus.isActive = false;
    await bus.save();

    return res.status(200).json({
      success: true,
      message: 'Trip stopped successfully',
      bus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to stop trip',
      error: error.message,
    });
  }
};

const stopTripOpen = async (req, res) => {
  return stopTrip(req, res);
};

const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const driver = await findDriver();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    const assignedBusId = driver.assignedBusId || driver.assignedBus || '';
    const bus = await findAssignedBus(assignedBusId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Assigned bus not found',
      });
    }

    bus.latitude = Number(latitude);
    bus.longitude = Number(longitude);
    await bus.save();

    return res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      bus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message,
    });
  }
};

module.exports = {
  getAssignedBus,
  getAssignedBusOpen,
  startTrip,
  startTripOpen,
  stopTrip,
  stopTripOpen,
  updateLocation,
};