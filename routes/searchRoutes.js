const express = require('express');
const router = express.Router();

const {
  searchBusesByStops,
  getAllStops,
} = require('../controllers/searchController');

router.get('/stops', getAllStops);
router.get('/buses', searchBusesByStops);

module.exports = router;