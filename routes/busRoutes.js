const express = require('express');
const router = express.Router();

const {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  searchBuses,
  getNearbyBuses,
} = require('../controllers/busController');

router.get('/search', searchBuses);
router.get('/nearby', getNearbyBuses);

router.get('/', getAllBuses);
router.get('/:id', getBusById);
router.post('/', createBus);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);

module.exports = router;