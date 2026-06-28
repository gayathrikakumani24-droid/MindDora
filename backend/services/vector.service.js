const { GoogleGenerativeAI } = require('@google/generative-ai');
const Journal = require('../models/Journal');

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
};

/**
 * Generate 768-dimension vector embedding for input text
 */
const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string') {
    return new Array(768).fill(0);
  }

  const genAI = getGenAI();
  if (!genAI) {
    // Generate deterministic dummy embedding for local testing
    return getDeterministicMockEmbedding(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding with Gemini API:', error);
    return getDeterministicMockEmbedding(text);
  }
};

/**
 * Basic Cosine Similarity
 */
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Semantic vector search for journal entries
 */
const searchSimilarJournals = async (userId, queryText, limit = 5) => {
  try {
    const queryEmbedding = await generateEmbedding(queryText);

    // 1. Attempt Atlas Vector Search
    try {
      const results = await Journal.aggregate([
        {
          $vectorSearch: {
            index: 'default', // Name of Atlas vector search index
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: limit * 10,
            limit: limit,
          },
        },
        {
          $match: {
            userId: userId,
            status: 'published',
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            mood: 1,
            tags: 1,
            images: 1,
            aiAnalysis: 1,
            date: 1,
            score: { $meta: 'searchScore' },
          },
        },
      ]);

      if (results && results.length > 0) {
        console.log('Atlas Vector Search returned results.');
        return results;
      }
    } catch (err) {
      // Log warning and fall back to local JS memory search
      console.warn('Atlas Vector search index not found/configured. Falling back to local cosine similarity search.');
    }

    // 2. Fallback: Local Cosine Similarity Search in JS Memory
    const userJournals = await Journal.find({
      userId,
      status: 'published',
      embedding: { $exists: true, $ne: [] },
    }).select('title content mood tags images aiAnalysis date embedding');

    if (!userJournals || userJournals.length === 0) {
      // If no embeddings exist, fallback to regex search
      console.log('No embeddings found. Falling back to regex keyword search.');
      return await Journal.find({
        userId,
        status: 'published',
        $or: [
          { title: { $regex: queryText, $options: 'i' } },
          { content: { $regex: queryText, $options: 'i' } },
          { tags: { $regex: queryText, $options: 'i' } },
        ],
      })
        .select('title content mood tags images aiAnalysis date')
        .limit(limit);
    }

    // Map journals and compute similarity score
    const scoredJournals = userJournals.map((journal) => {
      const journalObj = journal.toObject();
      const similarity = cosineSimilarity(queryEmbedding, journalObj.embedding);
      
      // Remove embedding array from output to save bandwidth
      delete journalObj.embedding;
      
      return {
        ...journalObj,
        score: similarity,
      };
    });

    // Sort descending and return top matches
    return scoredJournals
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error executing vector search:', error);
    // Absolute fallback: standard text search
    return await Journal.find({
      userId,
      status: 'published',
    })
      .select('title content mood tags images aiAnalysis date')
      .limit(limit);
  }
};

/**
 * Generate a repeatable mock embedding for offline use
 * Hash the words to get relative similarity
 */
function getDeterministicMockEmbedding(text) {
  const embedding = new Array(768).fill(0);
  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const words = cleanText.split(/\s+/).filter(Boolean);

  if (words.length === 0) return embedding;

  // Distribute weights across vector dimensions based on characters of the words
  words.forEach((word) => {
    let wordWeight = 0;
    for (let charIdx = 0; charIdx < word.length; charIdx++) {
      wordWeight += word.charCodeAt(charIdx);
    }

    // Distribute weights across dimensions
    for (let dim = 0; dim < 768; dim++) {
      const component = (wordWeight * (dim + 1)) % 100;
      embedding[dim] += (component / 100) * (1 / words.length);
    }
  });

  // Normalize vector to unit length (L2 norm)
  let sumSq = 0;
  for (let i = 0; i < 768; i++) {
    sumSq += embedding[i] * embedding[i];
  }
  const magnitude = Math.sqrt(sumSq);
  if (magnitude > 0) {
    for (let i = 0; i < 768; i++) {
      embedding[i] = embedding[i] / magnitude;
    }
  }

  return embedding;
}

module.exports = {
  generateEmbedding,
  cosineSimilarity,
  searchSimilarJournals,
};
