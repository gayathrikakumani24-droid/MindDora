const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getWeeklyReport,
  downloadMonthlyReport,
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

// Secure all analytics routes
router.use(protect);

router.get('/dashboard', getDashboardData);
router.get('/weekly-report', getWeeklyReport);
router.get('/monthly-report/pdf', downloadMonthlyReport);

module.exports = router;
