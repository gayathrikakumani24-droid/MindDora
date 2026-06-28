const Journal = require('../models/Journal');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');
const aiService = require('../services/ai.service');
const pdfService = require('../services/pdf.service');

/**
 * Get Dashboard aggregation metrics
 * GET /api/analytics/dashboard
 */
const getDashboardData = async (req, res) => {
  const userId = req.user._id;

  try {
    // 1. Fetch data from DB
    const journals = await Journal.find({ userId, status: 'published' }).sort({ date: -1 });
    const goals = await Goal.find({ userId });
    const habits = await Habit.find({ userId });

    // 2. Compute Writing Statistics
    let totalWords = 0;
    const datesWithEntries = new Set();
    
    journals.forEach((j) => {
      if (j.content) {
        totalWords += j.content.split(/\s+/).filter(Boolean).length;
      }
      if (j.date) {
        datesWithEntries.add(new Date(j.date).toISOString().split('T')[0]);
      }
    });

    // Compute Writing Streak
    let writingStreak = 0;
    const sortedDates = Array.from(datesWithEntries).sort((a, b) => new Date(b) - new Date(a));
    
    if (sortedDates.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      const mostRecent = sortedDates[0];
      
      // If the user wrote today or yesterday, they can keep their streak
      if (mostRecent === todayStr || mostRecent === yesterdayStr) {
        writingStreak = 1;
        let prevDate = new Date(mostRecent);
        
        for (let i = 1; i < sortedDates.length; i++) {
          const currDate = new Date(sortedDates[i]);
          const diffDays = Math.ceil(Math.abs(prevDate - currDate) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            writingStreak++;
            prevDate = currDate;
          } else if (diffDays > 1) {
            break;
          }
        }
      }
    }

    // 3. Compute Mood Trends & Average Scores (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentJournals = journals.filter((j) => new Date(j.date) >= thirtyDaysAgo);
    
    const moodCounts = {};
    let totalStress = 0;
    let totalConfidence = 0;
    let totalProductivity = 0;
    const recentCount = recentJournals.length;

    recentJournals.forEach((j) => {
      // Mood count
      moodCounts[j.mood] = (moodCounts[j.mood] || 0) + 1;
      
      // AI scores
      totalStress += j.aiAnalysis?.stressLevel || 5;
      totalConfidence += j.aiAnalysis?.confidenceScore || 5;
      totalProductivity += j.aiAnalysis?.productivityScore || 5;
    });

    // Map journals over time (past 30 days, sorted chronological) for charts
    const timelineData = recentJournals
      .map((j) => ({
        date: new Date(j.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        stress: j.aiAnalysis?.stressLevel || 5,
        confidence: j.aiAnalysis?.confidenceScore || 5,
        productivity: j.aiAnalysis?.productivityScore || 5,
        mood: j.mood,
      }))
      .reverse();

    // 4. Goal Analytics
    const activeGoals = goals.filter((g) => g.status === 'active').length;
    const completedGoals = goals.filter((g) => g.status === 'completed').length;
    const totalGoals = goals.length;
    const goalProgressPct = totalGoals > 0 
      ? Math.round((goals.reduce((acc, curr) => acc + curr.progress, 0) / totalGoals))
      : 0;

    // 5. Habit Completion rates
    const habitStats = habits.map((h) => ({
      _id: h._id,
      habitName: h.habitName,
      streak: h.streak,
      completionCount: h.completedDates.length,
    }));

    res.json({
      success: true,
      stats: {
        writing: {
          totalEntries: journals.length,
          totalWords,
          streak: writingStreak,
          entriesThisMonth: recentCount,
        },
        moods: {
          counts: moodCounts,
          avgStress: recentCount > 0 ? Math.round((totalStress / recentCount) * 10) / 10 : 5,
          avgConfidence: recentCount > 0 ? Math.round((totalConfidence / recentCount) * 10) / 10 : 5,
          avgProductivity: recentCount > 0 ? Math.round((totalProductivity / recentCount) * 10) / 10 : 5,
        },
        goals: {
          active: activeGoals,
          completed: completedGoals,
          total: totalGoals,
          averageProgress: goalProgressPct,
        },
        habits: habitStats,
        timeline: timelineData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Weekly AI Analysis Report
 * GET /api/analytics/weekly-report
 */
const getWeeklyReport = async (req, res) => {
  const userId = req.user._id;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const weeklyJournals = await Journal.find({
      userId,
      status: 'published',
      date: { $gte: oneWeekAgo },
    }).sort({ date: 1 });

    const weeklyReport = await aiService.generateWeeklySummary(weeklyJournals);
    res.json({ success: true, report: weeklyReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Download Monthly Growth PDF Report
 * GET /api/analytics/monthly-report/pdf
 */
const downloadMonthlyReport = async (req, res) => {
  const userId = req.user._id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const user = req.user;
    const journals = await Journal.find({
      userId,
      status: 'published',
      date: { $gte: thirtyDaysAgo },
    });
    const goals = await Goal.find({ userId });
    const habits = await Habit.find({ userId });

    // Aggregate statistics
    const moodCounts = {};
    let totalStress = 0;
    let totalConfidence = 0;
    let totalProductivity = 0;
    const count = journals.length;

    journals.forEach((j) => {
      moodCounts[j.mood] = (moodCounts[j.mood] || 0) + 1;
      totalStress += j.aiAnalysis?.stressLevel || 5;
      totalConfidence += j.aiAnalysis?.confidenceScore || 5;
      totalProductivity += j.aiAnalysis?.productivityScore || 5;
    });

    const reportPeriod = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // Build PDF content parameters
    const reportData = {
      userName: user.name,
      userEmail: user.email,
      reportPeriod,
      avgStress: count > 0 ? Math.round((totalStress / count) * 10) / 10 : 5,
      avgConfidence: count > 0 ? Math.round((totalConfidence / count) * 10) / 10 : 5,
      avgProductivity: count > 0 ? Math.round((totalProductivity / count) * 10) / 10 : 5,
      moodCounts,
      goals: goals.map((g) => ({ title: g.title, progress: g.progress, status: g.status, description: g.description })),
      habits: habits.map((h) => ({ habitName: h.habitName, streak: h.streak, completedDates: h.completedDates })),
      recommendations: [
        'Build a stronger focus grid: try completing coding or writing tasks during high-productivity streaks.',
        'Anxiety indicators were slightly elevated this month. Consider adding 5 minutes of meditation before bedtime.',
        'Your goal progress is currently scaling positively. Great job completing elements of your path!',
      ],
    };

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="MindDora-Monthly-Growth-Report.pdf"`);

    pdfService.generateMonthlyGrowthPDF(res, reportData);
  } catch (error) {
    console.error('PDF report download error:', error);
    res.status(500).json({ success: false, message: 'Could not generate report' });
  }
};

module.exports = {
  getDashboardData,
  getWeeklyReport,
  downloadMonthlyReport,
};
