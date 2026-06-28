const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    habitName: {
      type: String,
      required: true,
      trim: true,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedDates: [
      {
        type: String, // format: 'YYYY-MM-DD'
      },
    ],
  },
  { timestamps: true }
);

// Custom method or middleware to recalculate streaks
habitSchema.methods.recalculateStreak = function () {
  if (this.completedDates.length === 0) {
    this.streak = 0;
    return;
  }

  // Sort dates descending
  const sortedDates = [...this.completedDates]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Parse first date in sorted list (most recent completion)
  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);

  // If the last completion was before yesterday, streak is broken
  if (mostRecent < yesterday && mostRecent.getTime() !== today.getTime()) {
    this.streak = 0;
    return;
  }

  let streakCount = 1;
  let prevDate = mostRecent;

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(prevDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streakCount++;
      prevDate = currentDate;
    } else if (diffDays > 1) {
      // Streak broken in history, stop counting
      break;
    }
    // If diffDays is 0 (duplicate entry), just ignore and continue
  }

  this.streak = streakCount;
};

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;
