const Goal = require('../models/Goal');

/**
 * Get all goals for the logged-in user
 * GET /api/goals
 */
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: goals.length, goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new goal
 * POST /api/goals
 */
const createGoal = async (req, res) => {
  const { title, description, deadline } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ success: false, message: 'Goal title is required' });
    }

    const goal = new Goal({
      userId: req.user._id,
      title,
      description,
      deadline,
    });

    await goal.save();
    res.status(201).json({ success: true, goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update a goal
 * PUT /api/goals/:id
 */
const updateGoal = async (req, res) => {
  const { title, description, deadline, progress, status } = req.body;

  try {
    let goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (deadline !== undefined) goal.deadline = deadline;
    if (progress !== undefined) {
      goal.progress = progress;
      if (progress >= 100) {
        goal.status = 'completed';
      } else {
        goal.status = status || goal.status;
      }
    }
    if (status !== undefined) {
      goal.status = status;
      if (status === 'completed') {
        goal.progress = 100;
      }
    }

    await goal.save();
    res.json({ success: true, goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a goal
 * DELETE /api/goals/:id
 */
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
