const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    aiAnalysis: {
      summary: { type: String, default: '' },
      emotionAnalysis: {
        primary: { type: String, default: '' },
        secondary: { type: String, default: '' },
      },
      stressLevel: { type: Number, min: 1, max: 10, default: 5 },
      confidenceScore: { type: Number, min: 1, max: 10, default: 5 },
      productivityScore: { type: Number, min: 1, max: 10, default: 5 },
      keyTopics: [{ type: String }],
      reflectionQuestions: [{ type: String }],
    },
    embedding: {
      type: [Number], // Expecting 768 float array
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for text searching if vector search is fallback or standalone
journalSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Journal = mongoose.model('Journal', journalSchema);
module.exports = Journal;
