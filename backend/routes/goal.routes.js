const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth.middleware');

// Secure all goal routes
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
