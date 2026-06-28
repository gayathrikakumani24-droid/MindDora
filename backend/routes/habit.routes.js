const express = require('express');
const router = express.Router();
const {
  getHabits,
  createHabit,
  toggleHabitDate,
  deleteHabit,
} = require('../controllers/habit.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply protection middleware to all habit routes
router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.put('/:id/toggle', toggleHabitDate);
router.delete('/:id', deleteHabit);

module.exports = router;
