const aiService = require('../services/ai.service');
const vectorService = require('../services/vector.service');

/**
 * Handle AI RAG Chat Query against User Diary Memory
 * POST /api/chat
 */
const queryChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message content is required' });
  }

  try {
    // 1. Retrieve matching journal memories using semantic search
    const similarityLimit = 4;
    const contextEntries = await vectorService.searchSimilarJournals(req.user._id, message, similarityLimit);

    // 2. Fetch mentor preference from authenticated user profile
    const mentorPersona = req.user.mentorPreference || 'wellness';

    // 3. Generate response using AI service
    const responseText = await aiService.generateMentorResponse(message, contextEntries, mentorPersona);

    // 4. Respond with both text and references
    res.json({
      success: true,
      response: responseText,
      sources: contextEntries.map((entry) => ({
        _id: entry._id,
        title: entry.title,
        date: entry.date,
        mood: entry.mood,
        score: entry.score,
      })),
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  queryChat,
};
