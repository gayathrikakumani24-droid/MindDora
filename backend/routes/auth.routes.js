const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateMentorPreference,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public auth endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected auth endpoints
router.get('/me', protect, getCurrentUser);
router.put('/me/mentor', protect, updateMentorPreference);

module.exports = router;
