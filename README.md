# 🧠 MindDora – AI Smart Diary & Personal Growth Companion
  ✨ Live Demo: https://mind-dora.vercel.app/
  
<img width="1366" height="639" alt="Screenshot (406)" src="https://github.com/user-attachments/assets/c3105ded-63f3-4f22-8b83-5ac95108107b" />

MindDora is an AI-powered journaling and self-improvement platform that helps users transform daily thoughts into meaningful insights. It combines intelligent journaling, emotional analysis, habit tracking, goal management, memory retrieval, and personalized AI mentorship into a single growth ecosystem.It automatically tracks Goals and Habit Management from Diary Entries.

## ✨ Features

### 📖 Smart Journaling
- Create and manage daily journal entries
- Rich text support with image attachments using Cloudinary
- Secure cloud-based storage
<img width="1366" height="641" alt="Screenshot (422)" src="https://github.com/user-attachments/assets/8b342409-1e01-49fb-97ae-9ff417ece363" />

### 😊 AI Sentiment Analysis
- Analyze emotions and mood patterns
- Generate personalized reflections and insights
- Track emotional well-being over time
- Stores Diary Entries.
<img width="1366" height="649" alt="Screenshot (415)" src="https://github.com/user-attachments/assets/7d6e5641-b247-4837-8da4-f8199b5a2c6c" />

### 🧠 Memory Search (RAG)
- Retrieve past memories using natural language
- Ask questions about previous experiences
- AI-powered semantic search using vector embeddings (MongoDB Atlas vector search)
  <img width="1366" height="631" alt="Screenshot (424)" src="https://github.com/user-attachments/assets/0472a499-5874-45c8-b9d7-2cdf1b2e3cfd" />

### 🎯 Goal Management
- Create personal and professional goals
- AI-generated milestone breakdowns
- Progress tracking and achievement monitoring
<img width="1366" height="636" alt="Screenshot (416)" src="https://github.com/user-attachments/assets/46b15e36-304a-450e-8827-704127cab964" />

### 🔥 Habit Tracking
- Build positive habits
- Maintain streaks and consistency
- Monitor long-term behavioral growth
<img width="1366" height="633" alt="Screenshot (417)" src="https://github.com/user-attachments/assets/517446f4-3dc2-4cda-ae88-95f2dadbed97" />

### 🤖 Personalized AI Mentors
- Productivity Coach
- Study Mentor
- Career Guide
- Wellness Companion
<img width="1366" height="643" alt="Screenshot (418)" src="https://github.com/user-attachments/assets/96e28dc0-b08d-4f4f-b5a2-16dff3c38ae3" />

### 📊 Growth Analytics
- Mood trend visualization
- Weekly growth reports
- Habit and goal insights
- Downloadable PDF summaries
<img width="1366" height="646" alt="Screenshot (421)" src="https://github.com/user-attachments/assets/697cd3ba-ec58-48e8-b72e-017a1e959b3a" />
<img width="802" height="587" alt="Screenshot (423)" src="https://github.com/user-attachments/assets/56def5cf-46ac-4c69-acb0-454ad73f4217" />

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### AI & Intelligence
- Google Gemini API
- Gemini Embeddings
- MongoDB Atlas Vector Database
- Retrieval-Augmented Generation (RAG)

### Additional Services
- Cloudinary (Image Storage)
- PDFKit (Report Generation)
- JWT Authentication
- Multer (File Uploads)

---

## 📂 Project Structure

```
MindDora/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── config/
│
└── README.md
```
<img width="1366" height="627" alt="Screenshot (408)" src="https://github.com/user-attachments/assets/4cca392f-6aec-48a0-bbc9-9395785b5744" />
---

## 🚀 How It Works

1. User writes a journal entry.
2. AI analyzes emotions and extracts insights.
3. Entry is stored in MongoDB.
4. Embeddings are generated and stored in MongoDB Atlas Vector Database.
5. Habits and goals are automatically updated.
6. AI mentors provide personalized recommendations.
7. Users can query past memories using natural language.

---
<img width="1366" height="622" alt="Screenshot (410)" src="https://github.com/user-attachments/assets/45686e7d-c818-4fc1-b5a3-699da251250f" />


## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/gayathrikakumani24-droid/MindDora.git
cd MindDora
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 Future Enhancements

- Voice Journaling
- AI Mood Prediction
- Calendar-Based Memory Navigation
- Mobile Application
- Social Accountability Features
- Advanced Analytics Dashboard
- AI-Powered Life Planning

---

## 🌟 Vision

MindDora aims to become a user's **Second Brain** — an intelligent AI companion that preserves memories, understands emotions, tracks growth, and provides personalized guidance for lifelong self-improvement.

---

## 📜 License

This project is licensed under the MIT License.

---

### Made with ❤️, AI, and a passion for personal growth.
