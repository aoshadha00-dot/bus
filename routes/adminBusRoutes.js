const express = require("express");
const Bus = require("../models/bus");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/buses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      buses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch buses",
      error: error.message,
    });
  }
});

router.get("/buses/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.json({
      success: true,
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bus",
      error: error.message,
    });
  }
});

router.post("/buses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      busNumber,
      routeName,
      startLocation,
      endLocation,
      driverName,
      driverId,
      departureTime,
      price,
      totalSeats,
      availableSeats,
      isActive,
    } = req.body;

    if (!busNumber || !routeName) {
      return res.status(400).json({
        success: false,
        message: "busNumber and routeName are required",
      });
    }

    const existingBus = await Bus.findOne({ busNumber: busNumber.trim() });

    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: "Bus number already exists",
      });
    }

    const bus = new Bus({
  busNumber: busNumber.trim(),
  routeName: routeName.trim(),
  name: routeName.trim(),

  startLocation: startLocation || "",
  endLocation: endLocation || "",
  driverName: driverName || "",
  driverId: driverId || null,
  departureTime: departureTime || "",
  price: Number(price || 0),
  totalSeats: Number(totalSeats || 40),
  availableSeats: Number(availableSeats || totalSeats || 40),
  isActive: isActive !== undefined ? isActive : true,
});

    await bus.save();

    res.status(201).json({
      success: true,
      message: "Bus created successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create bus",
      error: error.message,
    });
  }
});

router.put("/buses/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      busNumber,
      routeName,
      startLocation,
      endLocation,
      driverName,
      driverId,
      departureTime,
      price,
      totalSeats,
      availableSeats,
      isActive,
    } = req.body;

    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    if (busNumber && busNumber.trim() !== bus.busNumber) {
      const existingBus = await Bus.findOne({ busNumber: busNumber.trim() });

      if (existingBus) {
        return res.status(400).json({
          success: false,
          message: "Another bus already uses this bus number",
        });
      }

      bus.busNumber = busNumber.trim();
    }

    if (routeName !== undefined) {
      bus.routeName = routeName.trim();
    }

    if (startLocation !== undefined) {
      bus.startLocation = startLocation;
    }

    if (endLocation !== undefined) {
      bus.endLocation = endLocation;
    }

    if (driverName !== undefined) {
      bus.driverName = driverName;
    }

    if (driverId !== undefined) {
      bus.driverId = driverId || null;
    }

    if (departureTime !== undefined) {
      bus.departureTime = departureTime;
    }

    if (price !== undefined) {
      bus.price = Number(price);
    }

    if (totalSeats !== undefined) {
      bus.totalSeats = Number(totalSeats);
    }

    if (availableSeats !== undefined) {
      bus.availableSeats = Number(availableSeats);
    }

    if (isActive !== undefined) {
      bus.isActive = isActive;
    }

    await bus.save();

    res.json({
      success: true,
      message: "Bus updated successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update bus",
      error: error.message,
    });
  }
});

router.delete("/buses/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    await Bus.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete bus",
      error: error.message,
    });
  }
});

module.exports = router;