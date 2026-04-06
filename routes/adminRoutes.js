const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  getDrivers,
  assignBusToDriver,
} = require('../controllers/admincontroller');

const router = express.Router();

router.get('/buses', authMiddleware, adminMiddleware, getAllBuses);
router.post('/buses', authMiddleware, adminMiddleware, createBus);
router.put('/buses/:id', authMiddleware, adminMiddleware, updateBus);
router.delete('/buses/:id', authMiddleware, adminMiddleware, deleteBus);

router.get('/drivers', authMiddleware, adminMiddleware, getDrivers);
router.post('/assign-bus', authMiddleware, adminMiddleware, assignBusToDriver);

module.exports = router;