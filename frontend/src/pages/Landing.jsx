import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  Sparkles,
  Brain,
  Target,
  Flame,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  Download,
  Lock,
  Globe,
  Smile,
  Activity,
  Award,
  BookOpen,
  Send,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Layers,
  RefreshCw,
} from 'lucide-react';

// Floating AI Energy Particles Component
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 5) + 2, // 2px to 7px
      color: i % 3 === 0 ? '#00D4FF' : i % 3 === 1 ? '#8B5CF6' : '#14F195',
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 10 + 12, // 12s to 22s
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            top: p.top,
            left: p.left,
            boxShadow: `0 0 12px ${p.color}`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.15, 0.85, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();

  // State for interactive Live Dashboard Showcase
  const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'moods' | 'goals'
  const [hoveredNode, setHoveredNode] = useState(null);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const features = [
    {
      icon: Brain,
      title: 'AI Sentiment Engine',
      description: 'Extracts deep emotional spectrums, stress metrics, and personal reflection questions from your written reflections.',
      color: 'from-[#00D4FF] to-[#8B5CF6]',
    },
    {
      icon: Sparkles,
      title: 'Memory Search (RAG)',
      description: 'Retrieves instant contextual memories from your past journal history using high-dimensional vector embeddings.',
      color: 'from-[#8B5CF6] to-[#14F195]',
    },
    {
      icon: Target,
      title: 'Goal Progression',
      description: 'Automatically detects mentioned achievements in daily entries and updates target progress bars seamlessly.',
      color: 'from-[#14F195] to-[#00D4FF]',
    },
    {
      icon: Flame,
      title: 'Habit Tracker',
      description: 'Monitors coding, study, meditation, and fitness activities directly from your natural language entries.',
      color: 'from-[#00D4FF] to-[#14F195]',
    },
    {
      icon: MessageSquare,
      title: 'AI Mentors',
      description: 'Switch between Career Mentor, Study Coach, Productivity Guide, and Wellness Companion tailored to your needs.',
      color: 'from-[#8B5CF6] to-[#00D4FF]',
    },
    {
      icon: Download,
      title: 'Growth Reports',
      description: 'Generates structured weekly digests and executive PDF exports with mood trends and action recommendations.',
      color: 'from-[#14F195] to-[#8B5CF6]',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Write Your Mind',
      desc: 'Journal naturally about your day, challenges, wins, or ideas. Attach images or save drafts anytime.',
    },
    {
      num: '02',
      title: 'AI Processing & Extraction',
      desc: 'MindDora analyzes your emotions, checks active habits, and advances goal progress bars automatically.',
    },
    {
      num: '03',
      title: 'Query Your Memory Vector',
      desc: 'Chat with your selected AI mentor to gain self-clarity and receive personalized growth recommendations.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
      text: 'MindDora transformed how I reflect on my engineering career. The habit auto-check feature saves so much time, and the vector chat memory is mind-blowing!',
      rating: 5,
    },
    {
      name: 'Marcus Vance',
      role: 'Product Designer',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus',
      text: 'The glassmorphism UI is gorgeous, and having a Wellness Mentor that speaks warmly to me after a stressful sprint is pure magic. 10/10 companion.',
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'University Researcher',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena',
      text: 'I use MindDora to track my study goals and research writing. The PDF monthly growth reports look so professional and keep me accountable.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'How does MindDora differ from a traditional diary app?',
      a: 'Traditional diaries are passive text stores. MindDora is an active second brain powered by LLMs and Vector Search. It reads your reflections to calculate stress/confidence metrics, automatically updates active goals and habit streaks, and lets you query your past memories via RAG chatbot.',
    },
    {
      q: 'How does the AI Mentor Chat search my past entries?',
      a: 'Every time you publish an entry, MindDora generates high-dimensional vector embeddings. When you chat with your mentor, it performs semantic similarity search to retrieve exact relevant past entries as context.',
    },
    {
      q: 'Is my personal data secure and private?',
      a: 'Yes! All user entries are secured behind industry-standard JWT authentication and encrypted database collections. Your personal journal data is strictly accessible to your authenticated account.',
    },
    {
      q: 'Can I use MindDora offline or with different LLMs?',
      a: 'Absolutely! MindDora supports ultra-fast Llama-3.3 via Groq, Gemini 2.5, and includes an offline rule-based mock engine if no API keys are configured.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] selection:bg-[#00D4FF] selection:text-[#050816] relative overflow-x-hidden font-sans">
      
      {/* Aurora Animated Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Left Cyan Glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00D4FF]/15 blur-[140px] rounded-full animate-pulse"></div>
        {/* Center Purple Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#8B5CF6]/15 blur-[160px] rounded-full"></div>
        {/* Bottom Right Teal Glow */}
        <div className="absolute bottom-10 -right-40 w-[700px] h-[700px] bg-[#14F195]/15 blur-[150px] rounded-full"></div>
      </div>

      {/* Floating Ambient Particles */}
      <FloatingParticles />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-[#050816]/75 border-b border-[#8B5CF6]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00D4FF] via-[#8B5CF6] to-[#14F195] shadow-lg shadow-[#00D4FF]/25">
              <Sparkles className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
                MindDora
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30">
                AI Growth Platform
              </span>
            </div>
          </div>

          {/* Navigation Links & CTA */}
          <div className="flex items-center gap-5">
            <a href="#features" className="hidden md:block text-xs font-bold text-slate-300 hover:text-[#00D4FF] transition-colors">
              AI Ecosystem
            </a>
            <a href="#how-it-works" className="hidden md:block text-xs font-bold text-slate-300 hover:text-[#14F195] transition-colors">
              Workflow
            </a>

            <ThemeToggle />

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] px-4.5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-[#00D4FF]/20 hover:opacity-95 transition-all active:scale-95"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] px-5 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-[#00D4FF]/25 hover:opacity-95 transition-all active:scale-95"
                  style={{
                    boxShadow: '0 0 20px rgba(0,212,255,0.35), 0 0 35px rgba(139,92,246,0.25)',
                  }}
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Top Aurora Pill */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1026] border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-extrabold shadow-inner">
            <Sparkles className="h-4 w-4 text-[#14F195] animate-pulse" />
            <span>THE AURORA GROWTH PLATFORM 2026</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-5xl mx-auto"
          >
            Your AI Smart Diary &{' '}
            <span className="bg-gradient-to-r from-[#F8FAFC] via-[#8B5CF6] via-[#00D4FF] to-[#14F195] bg-[length:200%_auto] bg-clip-text text-transparent animate-pulse">
              Personal Growth Companion
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Journal your thoughts, unpack emotional insights, track habits automatically, and query your life memory vectors with custom AI Mentors.
          </motion.p>

          {/* CTA Group */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] px-9 py-4.5 text-sm font-black text-white hover:scale-105 active:scale-95 transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(0,212,255,.4), 0 0 40px rgba(139,92,246,.3), 0 0 60px rgba(20,241,149,.2)',
              }}
            >
              <span>Start Free Journey</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-[#8B5CF6]/40 bg-[#0B1026]/80 hover:bg-[#0B1026] px-8 py-4.5 text-sm font-bold text-slate-200 backdrop-blur-md transition-all"
            >
              <span>Explore Demo Account</span>
            </button>
          </motion.div>

          {/* Metric Badges Row */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto"
          >
            <div className="p-4 rounded-2xl bg-[#0B1026]/80 border border-[#00D4FF]/20 backdrop-blur-md hover:border-[#00D4FF]/50 transition-colors">
              <p className="text-3xl font-black text-[#00D4FF]">100%</p>
              <p className="text-xs text-slate-400 mt-1">Automated Habit Detection</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B1026]/80 border border-[#8B5CF6]/20 backdrop-blur-md hover:border-[#8B5CF6]/50 transition-colors">
              <p className="text-3xl font-black text-[#8B5CF6]">4-in-1</p>
              <p className="text-xs text-slate-400 mt-1">AI Mentor Personalities</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B1026]/80 border border-[#14F195]/20 backdrop-blur-md hover:border-[#14F195]/50 transition-colors">
              <p className="text-3xl font-black text-[#14F195]">Vector</p>
              <p className="text-xs text-slate-400 mt-1">RAG Memory Retrieval</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B1026]/80 border border-[#00D4FF]/20 backdrop-blur-md hover:border-[#00D4FF]/50 transition-colors">
              <p className="text-3xl font-black text-white">PDF</p>
              <p className="text-xs text-slate-400 mt-1">Monthly Growth Export</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Live Dashboard Showcase Mockup */}
      <section className="relative z-10 px-6 pb-28 max-w-6xl mx-auto select-none">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-[#8B5CF6]/30 bg-[#0B1026]/90 p-6 md:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
          style={{
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)',
          }}
        >
          {/* Glass Mock Window Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500"></span>
              <span className="h-3 w-3 rounded-full bg-amber-500"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="ml-3 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
                minddora.app/live-workspace
              </span>
            </div>

            {/* Interactive Tab Controls */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'insights' ? 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                AI Companion
              </button>
              <button
                onClick={() => setActiveTab('moods')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'moods' ? 'bg-gradient-to-r from-[#8B5CF6] to-[#14F195] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Cognitive Scores
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'goals' ? 'bg-gradient-to-r from-[#14F195] to-[#00D4FF] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Goals & Habits
              </button>
            </div>
          </div>

          {/* Dynamic Interactive Panel Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel: Active Reflection Card */}
            <div className="lg:col-span-2 rounded-2xl bg-[#050816] p-6 border border-slate-800/80 space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center font-bold">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">AI Companion Reflection</h4>
                      <p className="text-[10px] text-slate-400">Live Synthesis Engine</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#14F195] bg-[#14F195]/10 px-2.5 py-1 rounded-full border border-[#14F195]/20">
                    Confidence 9/10
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed pt-2">
                  "I'm so inspired by how patiently you worked through debugging your React components today! Taking consistent steps with calm focus is exactly how high-level mastery is forged..."
                </p>
              </div>

              {/* Live Sentiment Metrics Bar */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">STRESS</span>
                  <span className="text-sm font-black text-rose-400">2 / 10</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">PRODUCTIVITY</span>
                  <span className="text-sm font-black text-[#14F195]">9 / 10</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">PRIMARY MOOD</span>
                  <span className="text-sm font-black text-[#00D4FF]">Excited</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Goals & Habits Summary */}
            <div className="rounded-2xl bg-[#050816] p-6 border border-slate-800/80 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-[#8B5CF6]" /> Active Goals
                  </span>
                  <span className="text-[10px] font-bold text-[#8B5CF6]">85% Avg</span>
                </div>

                {/* Progress Bar 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Master React Architecture</span>
                    <span className="text-[#00D4FF] font-bold">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] w-[85%]"></div>
                  </div>
                </div>

                {/* Progress Bar 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Daily Meditation Habit</span>
                    <span className="text-[#14F195] font-bold">100%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#14F195] w-[100%]"></div>
                  </div>
                </div>
              </div>

              {/* Habit Streak Counter */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-[#14F195] animate-bounce" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Coding Streak</h5>
                    <p className="text-[10px] text-slate-400">Auto-Detected by AI</p>
                  </div>
                </div>
                <span className="text-sm font-black text-[#14F195]">🔥 14 Days</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Orbit Ecosystem Section (Circular Radial Orbiting Neural Core) */}
      <section id="features" className="relative z-10 py-28 px-6 max-w-7xl mx-auto overflow-hidden select-none">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1026] text-[#00D4FF] text-xs font-extrabold border border-[#00D4FF]/30 shadow-inner"
          >
            <Brain className="h-4 w-4 text-[#14F195] animate-pulse" />
            <span>INTELLIGENT NEURAL ECOSYSTEM</span>
          </motion.div>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight">The MindDora AI Ecosystem</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            A unified neural core continuously processing your reflections into emotional clarity, memory retrieval, habit loops, and personalized mentorship.
          </p>
        </div>

        {/* Neural Ecosystem Stage */}
        <div className="relative min-h-[650px] lg:min-h-[750px] flex items-center justify-center">
          
          {/* Central MindDora AI Core */}
          <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none hidden lg:flex">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-10 rounded-full border border-dashed border-[#00D4FF]/40"
            ></motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-20 rounded-full border border-[#8B5CF6]/30"
            ></motion.div>
            <div className="absolute -inset-12 rounded-full bg-gradient-to-tr from-[#00D4FF]/20 via-[#8B5CF6]/20 to-[#14F195]/20 blur-2xl animate-pulse"></div>
            
            {/* Core Orb */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative h-36 w-36 rounded-full bg-[#050816] border-2 border-[#00D4FF]/80 flex flex-col items-center justify-center p-4 shadow-2xl backdrop-blur-2xl cursor-pointer group pointer-events-auto"
              style={{
                boxShadow: '0 0 30px rgba(0,212,255,0.4), 0 0 50px rgba(139,92,246,0.3)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00D4FF]/10 via-[#8B5CF6]/10 to-[#14F195]/10 animate-spin-slow"></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00D4FF] via-[#8B5CF6] to-[#14F195] shadow-lg mb-1 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
              <span className="text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
                AI CORE
              </span>
              <span className="text-[8px] font-bold text-slate-400">MindDora</span>
            </motion.div>
          </div>

          {/* SVG Connection Lines & Energy Particles (Desktop) */}
          <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="auroraCoreLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#14F195" stopOpacity="0.8" />
              </linearGradient>
              <filter id="auroraLaserGlow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Laser lines connecting center (500, 350) to 6 nodes */}
            {[
              { x: 180, y: 180 },  // Top Left
              { x: 500, y: 120 },  // Top Center
              { x: 820, y: 180 },  // Top Right
              { x: 180, y: 520 },  // Bottom Left
              { x: 500, y: 580 },  // Bottom Center
              { x: 820, y: 520 },  // Bottom Right
            ].map((pt, idx) => {
              const pathD = `M 500 350 L ${pt.x} ${pt.y}`;
              return (
                <g key={idx}>
                  <path d={pathD} stroke="url(#auroraCoreLineGrad)" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.6" />
                  <g>
                    <animateMotion path={pathD} dur={`${3 + (idx % 2)}s`} repeatCount="indefinite" />
                    <circle r="7" fill="#00D4FF" filter="url(#auroraLaserGlow)" opacity="0.9" />
                    <circle r="3" fill="#ffffff" />
                  </g>
                </g>
              );
            })}
          </svg>

          {/* 6 Orbiting Feature Nodes Grid */}
          <div className="w-full h-full relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-40 lg:gap-y-32 max-w-6xl mx-auto py-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.06, y: -6 }}
                  onHoverStart={() => setHoveredNode(idx)}
                  onHoverEnd={() => setHoveredNode(null)}
                  className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 backdrop-blur-2xl hover:border-[#00D4FF]/80 hover:bg-[#0B1026] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: hoveredNode === idx ? '0 0 35px rgba(0,212,255,0.25)' : 'none',
                  }}
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Icon className="h-16 w-16 text-[#00D4FF]" />
                  </div>
                  
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h4 className="text-base font-bold text-slate-100 group-hover:text-[#00D4FF] transition-colors mb-2">{feat.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{feat.description}</p>
                  
                  <div className="pt-4 flex items-center gap-1.5 text-[10px] font-extrabold text-[#14F195] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Active Neural Connection</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-28 px-6 max-w-6xl mx-auto overflow-hidden">
        <div className="text-center space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1026] text-[#14F195] text-xs font-extrabold border border-[#14F195]/30"
          >
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span>AI DATA PIPELINE ENGINE</span>
          </motion.div>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight">How MindDora Works</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">Continuous neural feedback loop transforming daily reflections into structured life growth insights.</p>
        </div>

        <div className="relative">
          {/* Animated Connecting SVG Energy Line (Desktop/Tablet) */}
          <div className="hidden md:block absolute top-28 left-0 w-full h-32 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 900 120" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="auroraWorkflowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#14F195" stopOpacity="0.9" />
                </linearGradient>
                <filter id="auroraOrbGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background dashed connector path */}
              <motion.path
                d="M 150 40 C 300 90, 300 10, 450 40 C 600 90, 600 10, 750 40"
                stroke="url(#auroraWorkflowGrad)"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />

              {/* Continuous Traveling Energy Orb & Light Streak */}
              <g>
                <animateMotion
                  path="M 150 40 C 300 90, 300 10, 450 40 C 600 90, 600 10, 750 40"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
                <circle r="18" fill="#00D4FF" opacity="0.3" filter="url(#auroraOrbGlow)" />
                <circle r="9" fill="#8B5CF6" opacity="0.7" filter="url(#auroraOrbGlow)" />
                <circle r="4" fill="#ffffff" filter="url(#auroraOrbGlow)" />
              </g>

              <g>
                <animateMotion
                  path="M 150 40 C 300 90, 300 10, 450 40 C 600 90, 600 10, 750 40"
                  dur="3.5s"
                  begin="-1.75s"
                  repeatCount="indefinite"
                />
                <circle r="16" fill="#14F195" opacity="0.3" filter="url(#auroraOrbGlow)" />
                <circle r="8" fill="#00D4FF" opacity="0.7" filter="url(#auroraOrbGlow)" />
                <circle r="3.5" fill="#ffffff" filter="url(#auroraOrbGlow)" />
              </g>
            </svg>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.35, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-8 text-center space-y-5 backdrop-blur-2xl hover:border-[#00D4FF]/60 hover:shadow-2xl transition-all group relative overflow-hidden select-none"
              >
                {/* Neon Top Accent Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Pulsing Step Number Header */}
                <div className="relative inline-flex items-center justify-center my-2">
                  <span className="absolute -inset-4 rounded-full bg-[#00D4FF]/10 group-hover:bg-[#14F195]/20 blur-lg transition-colors animate-pulse"></span>
                  <span className="absolute -inset-2 rounded-full border border-[#8B5CF6]/30 group-hover:border-[#00D4FF]/50 animate-ping"></span>
                  <div className="relative text-5xl font-black bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent drop-shadow-sm">
                    {step.num}
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-100 group-hover:text-[#00D4FF] transition-colors">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{step.desc}</p>

                {/* Subtle Status Badge */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#14F195]">
                    <CheckCircle2 className="h-3 w-3" /> Step {step.num} Active
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto select-none">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-extrabold text-[#8B5CF6] uppercase tracking-widest"
          >
            User Stories
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight"
          >
            Loved By Mindful Achievers
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: 'easeOut' }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/60 p-6 backdrop-blur-xl space-y-4 flex flex-col justify-between hover:border-[#00D4FF]/50 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{t.text}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full border border-slate-800 bg-slate-800" />
                <div>
                  <h5 className="text-xs font-bold text-slate-100">{t.name}</h5>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto select-none">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-extrabold text-[#00D4FF] uppercase tracking-widest"
          >
            Questions & Answers
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black tracking-tight"
          >
            Frequently Asked Questions
          </motion.h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/60 overflow-hidden backdrop-blur-xl"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex items-center justify-between font-bold text-sm text-slate-200 hover:text-[#00D4FF] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#00D4FF]' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="rounded-3xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] p-10 md:p-16 text-center text-white shadow-2xl space-y-6 relative overflow-hidden"
          style={{
            boxShadow: '0 0 30px rgba(0,212,255,.4), 0 0 50px rgba(139,92,246,.3)',
          }}
        >
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">Ready to Experience Your AI Second Brain?</h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto font-medium">Join mindful achievers who journal, reflect, and grow with MindDora every single day.</p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#050816] text-white hover:bg-slate-900 px-9 py-4.5 text-sm font-extrabold shadow-xl transition-all active:scale-95"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-4.5 w-4.5 text-[#00D4FF]" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 pt-16 pb-12 px-6 max-w-7xl mx-auto text-slate-400 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00D4FF] via-[#8B5CF6] to-[#14F195]">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">MindDora</span>
            </div>
            <p className="text-[11px] leading-relaxed">AI-powered smart diary, habit tracker, and second brain companion built for self-growth.</p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3">Navigation</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">AI Ecosystem</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Workflow Engine</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3">Legal & Security</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Overview</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white">Subscribe to Growth Tips</h5>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email..." className="w-full bg-[#0B1026] border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#00D4FF] text-white" />
              <button className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] px-3 py-2 rounded-xl text-white font-bold"><Send className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <p>© 2026 MindDora AI. All rights reserved.</p>
          <p>Crafted with modern MERN, Framer Motion & Groq/Gemini LLM.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
