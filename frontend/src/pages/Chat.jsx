import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Sparkles,
  Database,
  BookOpen,
  User,
  Loader2,
} from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const mentorDetails = {
    wellness: {
      title: 'Wellness Companion',
      avatarSeed: 'Aria',
      description: 'Your emotional health, stress, and self-acceptance coach.',
      greetings: "Hi, I'm Aria, your Wellness Companion. Let's talk about how you're feeling, or any themes you'd like to unpack from your past reflections.",
    },
    productivity: {
      title: 'Productivity Coach',
      avatarSeed: 'Oliver',
      description: 'Focused on time blocking, habit loops, and action tasks.',
      greetings: "Hey there! I'm Oliver, your Productivity Coach. Ready to audit your habits, optimize your focus, and accelerate your goals?",
    },
    career: {
      title: 'Career Mentor',
      avatarSeed: 'Brian',
      description: 'Career path guidelines, internships, and skill growth.',
      greetings: "Hello! I'm Brian, your Career Mentor. Let's discuss your career progression, professional wins, and how to conquer your workplace challenges.",
    },
    study: {
      title: 'Study Coach',
      avatarSeed: 'Kimberly',
      description: 'Learning techniques, scheduling, and subject mastering.',
      greetings: "Hi! I'm Kimberly, your Study Coach. What topics are we mastering today? We can inspect your learning history and plan your study focus.",
    },
  };

  const activeMentor = mentorDetails[user?.mentorPreference || 'wellness'];

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: activeMentor.greetings,
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  }, [user?.mentorPreference]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { message: currentInput });
      if (data.success) {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isBot: true,
          timestamp: new Date(),
          sources: data.sources || [],
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error('Failed to query mentor:', error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble syncing with your second brain vectors. Please verify your GEMINI_API_KEY or GROQ_API_KEY is configured in the environment.",
        isBot: true,
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const [expandedSources, setExpandedSources] = useState({});

  const toggleSources = (msgId) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  return (
    <div className="flex flex-col h-[82vh] max-w-4xl mx-auto rounded-3xl border border-slate-800/80 bg-[#0B1026]/90 shadow-2xl overflow-hidden select-none backdrop-blur-2xl">
      {/* Mentor Header Info bar */}
      <div className="p-4 bg-[#050816]/60 border-b border-slate-800/80 flex items-center gap-3.5">
        <img
          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activeMentor.avatarSeed}`}
          alt={activeMentor.title}
          className="h-10 w-10 rounded-full border border-slate-800 bg-slate-900 shadow-inner"
        />
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            {activeMentor.title}
            <span className="h-2 w-2 rounded-full bg-[#14F195] animate-ping"></span>
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">{activeMentor.description}</p>
        </div>
      </div>

      {/* Message List Grid viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
            {msg.isBot ? (
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activeMentor.avatarSeed}`}
                alt="AI Mentor Avatar"
                className="h-8.5 w-8.5 rounded-full border border-slate-800 bg-slate-900 shadow-inner shrink-0"
              />
            ) : (
              <div className="h-8.5 w-8.5 rounded-full border border-slate-800 bg-gradient-to-tr from-[#00D4FF] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                <User className="h-4.5 w-4.5" />
              </div>
            )}

            <div className="space-y-2">
              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.isBot
                    ? msg.isError
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-[#050816] text-slate-200 border border-slate-800/80 shadow-md'
                    : 'bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] text-white shadow-lg shadow-[#00D4FF]/20'
                }`}
              >
                {msg.text}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="text-[10px]">
                  <button
                    onClick={() => toggleSources(msg.id)}
                    className="flex items-center gap-1 text-[#00D4FF] hover:text-[#14F195] font-bold focus:outline-none transition-colors"
                  >
                    <Database className="h-3 w-3" />
                    <span>{expandedSources[msg.id] ? 'Hide retrieved memories' : `View retrieved memories (${msg.sources.length})`}</span>
                  </button>

                  <AnimatePresence>
                    {expandedSources[msg.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pl-3 space-y-1.5 border-l-2 border-[#00D4FF]/40"
                      >
                        {msg.sources.map((src, idx) => (
                          <div key={src._id || idx} className="flex items-center gap-1.5 text-slate-400">
                            <BookOpen className="h-3 w-3 text-[#14F195] shrink-0" />
                            <span className="font-semibold text-slate-300 truncate max-w-[150px]">{src.title}</span>
                            <span className="text-[8px] opacity-60">
                              ({new Date(src.date).toLocaleDateString()})
                            </span>
                            {src.score && (
                              <span className="text-[8px] font-bold text-[#00D4FF] bg-[#00D4FF]/10 px-1 rounded border border-[#00D4FF]/20">
                                {Math.round(src.score * 100)}% match
                              </span>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mr-auto items-center">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activeMentor.avatarSeed}`}
              alt="AI Mentor Avatar"
              className="h-8.5 w-8.5 rounded-full border border-slate-800 bg-slate-900 shadow-inner shrink-0"
            />
            <div className="rounded-2xl px-4 py-3 bg-[#050816] border border-slate-800/80 text-slate-300 text-xs flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00D4FF]" />
              <span>Searching memory vectors...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-800/80 bg-[#050816]/80 flex gap-2.5"
      >
        <input
          type="text"
          placeholder={`Ask ${activeMentor.title} about your goals, habits, or mood logs...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-xs rounded-xl border border-slate-800 bg-[#0B1026] px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] p-3 text-white shadow-lg shadow-[#00D4FF]/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
