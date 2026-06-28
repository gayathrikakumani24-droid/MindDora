const Habit = require('../models/Habit');

/**
 * Get all habits of user
 * GET /api/habits
 */
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    // Auto recalculate streaks on fetch to keep data fresh
    for (let habit of habits) {
      habit.recalculateStreak();
      await habit.save();
    }
    
    res.json({ success: true, count: habits.length, habits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new habit
 * POST /api/habits
 */
const createHabit = async (req, res) => {
  const { habitName } = req.body;

  try {
    if (!habitName) {
      return res.status(400).json({ success: false, message: 'Habit name is required' });
    }

    const habitExists = await Habit.findOne({
      userId: req.user._id,
      habitName: { $regex: new RegExp(`^${habitName}$`, 'i') },
    });

    if (habitExists) {
      return res.status(400).json({ success: false, message: 'Habit already being tracked' });
    }

    const habit = new Habit({
      userId: req.user._id,
      habitName,
    });

    await habit.save();
    res.status(201).json({ success: true, habit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle habit completion for a specific date
 * PUT /api/habits/:id/toggle
 */
const toggleHabitDate = async (req, res) => {
  const { date } = req.body; // Expect format YYYY-MM-DD
  
  if (!date) {
    return res.status(400).json({ success: false, message: 'Date (YYYY-MM-DD) is required' });
  }

  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const index = habit.completedDates.indexOf(date);
    if (index > -1) {
      // Toggle off: Date exists, remove it
      habit.completedDates.splice(index, 1);
    } else {
      // Toggle on: Add date
      habit.completedDates.push(date);
    }

    // Recalculate streak length
    habit.recalculateStreak();
    await habit.save();

    res.json({ success: true, habit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a habit track
 * DELETE /api/habits/:id
 */
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    res.json({ success: true, message: 'Habit tracking stopped successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHabits,
  createHabit,
  toggleHabitDate,
  deleteHabit,
};
