const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

const getGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;
  return apiKey ? new Groq({ apiKey }) : null;
};

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
};

/**
 * Analyzes journal entry content for emotional stats, goals updates, and habit completion suggestions.
 */
const analyzeJournalEntry = async (content, activeGoals = [], activeHabits = []) => {
  const groq = getGroq();
  const genAI = getGenAI();

  const goalsStr = activeGoals
    .map((g) => `- [ID: ${g._id}] "${g.title}" (current progress: ${g.progress}%)`)
    .join('\n');
  const habitsStr = activeHabits.map((h) => `- ${h.habitName}`).join('\n');

  const prompt = `
You are MindDora, an AI therapist and growth companion. Analyze this journal entry:

Journal entry:
"""
${content}
"""

Active Goals to track:
${goalsStr || 'None'}

Tracked Habits:
${habitsStr || 'None'}

Please return a JSON object with:
1. "summary": A warm, natural, human response written directly to the user (using "you" and "your") responding thoughtfully and empathetically to their reflection like a personal companion (e.g. "I'm so proud of how patiently you worked through those challenges today! Consistent effort really is the key to mastering new skills..."). Do not write an analytical summary in third person.
2. "emotionAnalysis": { "primary": string, "secondary": string }
3. "stressLevel": scale 1 (low) to 10 (high)
4. "confidenceScore": scale 1 (low) to 10 (high)
5. "productivityScore": scale 1 (low) to 10 (high)
6. "keyTopics": string array of main themes
7. "reflectionQuestions": string array of 2 deep reflection questions to help the user grow.
8. "goalUpdates": array of objects: { "goalId": string, "incrementProgress": number (e.g. 10 for +10%), "explanation": string } if you detect completion or progress towards an active goal.
9. "detectedHabits": array of objects: { "habitName": string, "completed": boolean } if you detect the user performed one of the tracked habits (be lenient: "coding", "code", "programming", "studied Java" indicates Coding; "reading", "read", "book" indicates Reading, etc.).

Return ONLY the JSON. Do not include markdown wraps (like \`\`\`json).
`;

  // 1. Try Groq first if available
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating analysis via Groq API:', error.message);
    }
  }

  // 2. Try Gemini fallback
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error with Gemini API:', error.message);
    }
  }

  // 3. Mock fallback
  return getMockAnalysis(content, activeGoals, activeHabits);
};

/**
 * Fallback AI Mentor Mode Chat response generator
 */
const generateMentorResponse = async (userMessage, journalContext = [], mentorPersona = 'wellness') => {
  const personas = {
    career: 'Career Mentor: strategic, encouraging, focused on skill development, resume suggestions, and professional growth.',
    study: 'Study Coach: supportive, academic-oriented, provides test prep strategies, scheduling tips, and learning techniques.',
    productivity: 'Productivity Coach: direct, action-oriented, focused on time management, habits, blocking distractions, and efficiency.',
    wellness: 'Wellness Companion: empathetic, therapeutic, focused on emotional health, stress reduction, mindfulness, and self-acceptance.',
  };

  const selectedPersona = personas[mentorPersona] || personas.wellness;
  const groq = getGroq();
  const genAI = getGenAI();

  const contextText = journalContext.length > 0
    ? `Here are relevant journal entries from the user's past for context:\n${journalContext.map((j) => `- Date: ${new Date(j.date).toLocaleDateString()}, Title: ${j.title}, Content: ${j.content}`).join('\n')}`
    : 'No past journal entries are relevant to this query.';

  const prompt = `
You are the user's personal growth companion acting in the role of: ${selectedPersona}

${contextText}

The user has asked you:
"${userMessage}"

Respond naturally to the user based on their message and the context from their journals. Maintain your specific mentor persona. Keep it concise (1-3 paragraphs) and engaging. Do not use robotic intro/outro phrases. Refer to specific entries if relevant.
`;

  // 1. Try Groq API first
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating mentor chat response via Groq API:', error.message);
    }
  }

  // 2. Try Gemini API fallback
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating mentor chat response via Gemini API:', error.message);
      return `I am having trouble connecting to AI services (${error.message}). Please verify your keys.`;
    }
  }

  return `[Mock AI Mentor - ${mentorPersona.toUpperCase()}] I read your request. As your ${mentorPersona} coach, I suggest you take time to reflect on your goals. Since no active AI API key is configured, I am running in local offline demo mode! You asked: "${userMessage}".`;
};

/**
 * Generate Structured Weekly Report
 */
const generateWeeklySummary = async (journals = []) => {
  const groq = getGroq();
  const genAI = getGenAI();

  const entriesStr = journals
    .map(
      (j) =>
        `Date: ${new Date(j.date).toLocaleDateString()}\nMood: ${j.mood}\nTitle: ${j.title}\nContent: ${j.content}\nEmotion Analysis: Primary: ${j.aiAnalysis?.emotionAnalysis?.primary || 'Neutral'}, Stress: ${j.aiAnalysis?.stressLevel || 5}/10`
    )
    .join('\n\n');

  const prompt = `
You are MindDora, an AI personal growth companion. Summarize the user's week based on these journal entries:

${entriesStr || 'No journal entries recorded this week.'}

Please return a JSON object with:
1. "emotionalSummary": A paragraph summarizing their overall emotional state this week.
2. "achievements": String array of accomplishments or wins you noticed.
3. "challenges": String array of obstacles or difficult emotions they faced.
4. "mostDiscussedTopics": String array of top topics.
5. "recommendations": String array of 3 actionable self-care or productivity recommendations for next week.

Return ONLY the JSON.
`;

  // 1. Try Groq API
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating weekly report via Groq API:', error.message);
    }
  }

  // 2. Try Gemini API
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating weekly report via Gemini API:', error.message);
      const mock = getMockWeeklySummary(journals);
      mock.emotionalSummary = `[Gemini API Error: ${error.message}]. Showing default weekly overview.`;
      return mock;
    }
  }

  return getMockWeeklySummary(journals);
};

/**
 * Local Rule-based mock generators
 */
const getMockAnalysis = (content, activeGoals = [], activeHabits = []) => {
  const contentLower = content.toLowerCase();
  
  // Basic mood determination
  let primary = 'Neutral';
  let secondary = 'Calm';
  let stress = 4;
  let confidence = 5;
  let productivity = 5;

  if (contentLower.includes('happy') || contentLower.includes('great') || contentLower.includes('glad') || contentLower.includes('excited')) {
    primary = 'Excited';
    secondary = 'Joyful';
    stress = 2;
    confidence = 8;
  } else if (contentLower.includes('sad') || contentLower.includes('cry') || contentLower.includes('lonely') || contentLower.includes('bad')) {
    primary = 'Sadness';
    secondary = 'Disappointment';
    stress = 7;
    confidence = 3;
  } else if (contentLower.includes('anxious') || contentLower.includes('nervous') || contentLower.includes('worried') || contentLower.includes('scared') || contentLower.includes('interview')) {
    primary = 'Anxiety';
    secondary = 'Vulnerability';
    stress = 8;
    confidence = 4;
  } else if (contentLower.includes('busy') || contentLower.includes('tired') || contentLower.includes('stress') || contentLower.includes('work')) {
    primary = 'Stress';
    secondary = 'Fatigue';
    stress = 9;
    productivity = 7;
  }

  if (contentLower.includes('completed') || contentLower.includes('studied') || contentLower.includes('achieved') || contentLower.includes('finished')) {
    productivity = 9;
    confidence = 8;
  }

  // Detect goals
  const goalUpdates = [];
  activeGoals.forEach((goal) => {
    const titleLower = goal.title.toLowerCase();
    if (titleLower.split(' ').some((word) => word.length > 3 && contentLower.includes(word))) {
      goalUpdates.push({
        goalId: goal._id.toString(),
        incrementProgress: 15,
        explanation: `Based on your entry mentioning topics related to "${goal.title}", your goal progress appears 15% closer to completion.`,
      });
    }
  });

  // Detect habits
  const detectedHabits = [];
  activeHabits.forEach((h) => {
    const nameLower = h.habitName.toLowerCase();
    let detected = false;

    if (nameLower === 'reading' && (contentLower.includes('read') || contentLower.includes('book') || contentLower.includes('novel'))) {
      detected = true;
    } else if (nameLower === 'coding' && (contentLower.includes('code') || contentLower.includes('programming') || contentLower.includes('java') || contentLower.includes('react') || contentLower.includes('mern') || contentLower.includes('javascript'))) {
      detected = true;
    } else if (nameLower === 'exercise' && (contentLower.includes('exercise') || contentLower.includes('gym') || contentLower.includes('workout') || contentLower.includes('run') || contentLower.includes('jog'))) {
      detected = true;
    } else if (nameLower === 'meditation' && (contentLower.includes('meditate') || contentLower.includes('meditation') || contentLower.includes('breath') || contentLower.includes('mindful'))) {
      detected = true;
    } else if (nameLower === 'sleep' && (contentLower.includes('sleep') || contentLower.includes('slept') || contentLower.includes('bed'))) {
      detected = true;
    }

    if (detected) {
      detectedHabits.push({
        habitName: h.habitName,
        completed: true,
      });
    }
  });

  const topics = ['Reflections'];
  if (contentLower.includes('interview') || contentLower.includes('career') || contentLower.includes('job')) topics.push('Career');
  if (contentLower.includes('study') || contentLower.includes('learn') || contentLower.includes('react')) topics.push('Learning');
  if (contentLower.includes('health') || contentLower.includes('gym') || contentLower.includes('run')) topics.push('Fitness');

  return {
    summary: `It is wonderful reading your entry today! You are showing clear focus and dedication towards your personal growth. Keep up the consistent effort!`,
    emotionAnalysis: { primary, secondary },
    stressLevel: stress,
    confidenceScore: confidence,
    productivityScore: productivity,
    keyTopics: topics,
    reflectionQuestions: [
      `What helped you navigate your primary emotions of ${primary} today?`,
      `How can you carry the lessons from this entry into tomorrow?`,
    ],
    goalUpdates,
    detectedHabits,
  };
};

const getMockWeeklySummary = (journals = []) => {
  return {
    emotionalSummary: `In this offline demo mode, based on your ${journals.length} journal entry/entries, your emotional state displays steady growth and mindfulness. Add a GROQ_API_KEY or GEMINI_API_KEY to receive deep AI-driven summaries.`,
    achievements: ['Logged journal entries consistently', 'Tracked goals and habit items'],
    challenges: ['Adapting to new routines', 'Managing focus levels'],
    mostDiscussedTopics: ['Self-Reflection', 'Personal Growth'],
    recommendations: [
      'Aim for 10 minutes of journaling daily to build the habit.',
      'Reflect on your active goals during the weekend.',
      'Focus on completing one high-impact task first thing in the morning.',
    ],
  };
};

module.exports = {
  analyzeJournalEntry,
  generateMentorResponse,
  generateWeeklySummary,
};
