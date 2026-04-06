const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  signup,
  login,
  socialLogin,
  getProfile,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/social-login', socialLogin);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;