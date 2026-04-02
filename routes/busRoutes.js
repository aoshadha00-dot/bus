const express = require('express');
const router = express.Router();

const {
  getAllBuses,
  getBusById,
  updateBus,
} = require('../controllers/busController');

router.get('/', getAllBuses);
router.get('/:id', getBusById);
router.post('/update', updateBus);

module.exports = router;