const Journal = require('../models/Journal');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');
const aiService = require('../services/ai.service');
const vectorService = require('../services/vector.service');
const { isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Get all journals of authenticated user
 * GET /api/journals
 */
const getJournals = async (req, res) => {
  try {
    const { search, tag, mood, status } = req.query;
    const query = { userId: req.user._id };

    if (status) {
      query.status = status;
    }
    if (mood) {
      query.mood = mood;
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      // Standard keyword text search filter
      query.$text = { $search: search };
    }

    const journals = await Journal.find(query)
      .select('-embedding') // Exclude embeddings for list payload optimization
      .sort({ date: -1, createdAt: -1 });

    res.json({ success: true, count: journals.length, journals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Smart Semantic Vector Search
 * GET /api/journals/search
 */
const searchJournals = async (req, res) => {
  const { query, limit } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    const searchLimit = limit ? parseInt(limit, 10) : 5;
    const results = await vectorService.searchSimilarJournals(req.user._id, query, searchLimit);
    res.json({ success: true, count: results.length, journals: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single journal details
 * GET /api/journals/:id
 */
const getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, userId: req.user._id }).select('-embedding');

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    res.json({ success: true, journal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create new journal entry & trigger AI actions
 * POST /api/journals
 */
const createJournal = async (req, res) => {
  const { title, content, mood, tags, images, date, status } = req.body;

  try {
    // 1. Fetch active goals and habits for this user to pass to the AI analyzer
    const activeGoals = await Goal.find({ userId: req.user._id, status: 'active' });
    const activeHabits = await Habit.find({ userId: req.user._id });

    // 2. Run AI Analysis
    const analysis = await aiService.analyzeJournalEntry(content, activeGoals, activeHabits);

    // 3. Generate Vector Embedding for semantic search
    const textToEmbed = `${title}. ${content}`;
    const embedding = await vectorService.generateEmbedding(textToEmbed);

    // 4. Create the entry
    const journal = new Journal({
      userId: req.user._id,
      title,
      content,
      mood: analysis.emotionAnalysis?.primary || mood || 'Neutral',
      tags: tags || [],
      images: images || [],
      date: date || new Date(),
      status: status || 'published',
      aiAnalysis: {
        summary: analysis.summary || '',
        emotionAnalysis: analysis.emotionAnalysis || { primary: 'Neutral', secondary: 'Calm' },
        stressLevel: analysis.stressLevel || 5,
        confidenceScore: analysis.confidenceScore || 5,
        productivityScore: analysis.productivityScore || 5,
        keyTopics: analysis.keyTopics || [],
        reflectionQuestions: analysis.reflectionQuestions || [],
      },
      embedding,
    });

    await journal.save();

    // 5. Update Goals and Habits in the database if entry is published
    const updatedGoals = [];
    const updatedHabits = [];

    if (journal.status === 'published') {
      // Goal progress suggestions
      if (analysis.goalUpdates && analysis.goalUpdates.length > 0) {
        for (const update of analysis.goalUpdates) {
          const goal = await Goal.findOne({ _id: update.goalId, userId: req.user._id });
          if (goal) {
            goal.progress = Math.min(100, goal.progress + (update.incrementProgress || 0));
            if (goal.progress === 100) {
              goal.status = 'completed';
            }
            await goal.save();
            updatedGoals.push({
              title: goal.title,
              increment: update.incrementProgress,
              currentProgress: goal.progress,
              status: goal.status,
              explanation: update.explanation,
            });
          }
        }
      }

      // Habit completion detection
      if (analysis.detectedHabits && analysis.detectedHabits.length > 0) {
        const entryDateStr = new Date(journal.date).toISOString().split('T')[0];

        for (const detHabit of analysis.detectedHabits) {
          if (detHabit.completed) {
            const habit = await Habit.findOne({
              userId: req.user._id,
              habitName: { $regex: new RegExp(`^${detHabit.habitName}$`, 'i') },
            });

            if (habit) {
              if (!habit.completedDates.includes(entryDateStr)) {
                habit.completedDates.push(entryDateStr);
                habit.recalculateStreak();
                await habit.save();
                updatedHabits.push({
                  habitName: habit.habitName,
                  streak: habit.streak,
                  message: `Habit "${habit.habitName}" auto-logged from journal entry! Streak is ${habit.streak} days.`,
                });
              }
            }
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      journal,
      aiUpdates: {
        goals: updatedGoals,
        habits: updatedHabits,
      },
    });
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update existing journal entry
 * PUT /api/journals/:id
 */
const updateJournal = async (req, res) => {
  const { title, content, mood, tags, images, date, status } = req.body;

  try {
    let journal = await Journal.findOne({ _id: req.params.id, userId: req.user._id });

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    // Capture whether content or status has changed to determine if we should rerun AI
    const contentChanged = content && content !== journal.content;
    const titleChanged = title && title !== journal.title;
    const statusChanged = status && status !== journal.status;

    if (title) journal.title = title;
    if (content) journal.content = content;
    if (tags) journal.tags = tags;
    if (images) journal.images = images;
    if (date) journal.date = date;
    if (status) journal.status = status;

    let aiUpdates = { goals: [], habits: [] };

    if (contentChanged || titleChanged) {
      // Re-run AI analysis
      const activeGoals = await Goal.find({ userId: req.user._id, status: 'active' });
      const activeHabits = await Habit.find({ userId: req.user._id });
      const analysis = await aiService.analyzeJournalEntry(journal.content, activeGoals, activeHabits);

      journal.mood = analysis.emotionAnalysis?.primary || mood || journal.mood;
      journal.aiAnalysis = {
        summary: analysis.summary || '',
        emotionAnalysis: analysis.emotionAnalysis || { primary: 'Neutral', secondary: 'Calm' },
        stressLevel: analysis.stressLevel || 5,
        confidenceScore: analysis.confidenceScore || 5,
        productivityScore: analysis.productivityScore || 5,
        keyTopics: analysis.keyTopics || [],
        reflectionQuestions: analysis.reflectionQuestions || [],
      };

      // Re-generate vector embedding
      const textToEmbed = `${journal.title}. ${journal.content}`;
      journal.embedding = await vectorService.generateEmbedding(textToEmbed);

      // Trigger increments only if the state transitioned to published or content was modified in published mode
      if (journal.status === 'published') {
        if (analysis.goalUpdates && analysis.goalUpdates.length > 0) {
          for (const update of analysis.goalUpdates) {
            const goal = await Goal.findOne({ _id: update.goalId, userId: req.user._id });
            if (goal) {
              goal.progress = Math.min(100, goal.progress + (update.incrementProgress || 0));
              if (goal.progress === 100) {
                goal.status = 'completed';
              }
              await goal.save();
              aiUpdates.goals.push({
                title: goal.title,
                increment: update.incrementProgress,
                currentProgress: goal.progress,
                status: goal.status,
                explanation: update.explanation,
              });
            }
          }
        }

        if (analysis.detectedHabits && analysis.detectedHabits.length > 0) {
          const entryDateStr = new Date(journal.date).toISOString().split('T')[0];

          for (const detHabit of analysis.detectedHabits) {
            if (detHabit.completed) {
              const habit = await Habit.findOne({
                userId: req.user._id,
                habitName: { $regex: new RegExp(`^${detHabit.habitName}$`, 'i') },
              });

              if (habit) {
                if (!habit.completedDates.includes(entryDateStr)) {
                  habit.completedDates.push(entryDateStr);
                  habit.recalculateStreak();
                  await habit.save();
                  aiUpdates.habits.push({
                    habitName: habit.habitName,
                    streak: habit.streak,
                    message: `Habit "${habit.habitName}" auto-logged! Current streak: ${habit.streak} days.`,
                  });
                }
              }
            }
          }
        }
      }
    } else if (statusChanged && journal.status === 'published') {
      // Just changed status to published, run analysis without content changes
      const activeGoals = await Goal.find({ userId: req.user._id, status: 'active' });
      const activeHabits = await Habit.find({ userId: req.user._id });
      const analysis = await aiService.analyzeJournalEntry(journal.content, activeGoals, activeHabits);

      // Save analysis & embeddings
      journal.mood = analysis.emotionAnalysis?.primary || mood || journal.mood;
      journal.aiAnalysis = {
        summary: analysis.summary || '',
        emotionAnalysis: analysis.emotionAnalysis || { primary: 'Neutral', secondary: 'Calm' },
        stressLevel: analysis.stressLevel || 5,
        confidenceScore: analysis.confidenceScore || 5,
        productivityScore: analysis.productivityScore || 5,
        keyTopics: analysis.keyTopics || [],
        reflectionQuestions: analysis.reflectionQuestions || [],
      };
      
      const textToEmbed = `${journal.title}. ${journal.content}`;
      journal.embedding = await vectorService.generateEmbedding(textToEmbed);
    }

    await journal.save();

    res.json({
      success: true,
      journal,
      aiUpdates,
    });
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a journal entry
 * DELETE /api/journals/:id
 */
const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    res.json({ success: true, message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Handle Single Image Upload
 * POST /api/journals/upload
 */
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // If Cloudinary is configured, req.file.path holds the HTTPS URL.
  // Else, we return local static path URL.
  const fileUrl = isCloudinaryConfigured 
    ? req.file.path 
    : `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
  });
};

module.exports = {
  getJournals,
  searchJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  uploadImage,
};
