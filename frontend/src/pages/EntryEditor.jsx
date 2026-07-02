import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API, { getImageUrl } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Tag,
  Sparkles,
  Smile,
  Loader2,
  Brain,
  Target,
  Flame,
  CheckCircle,
  HelpCircle,
  X,
  Maximize2,
  Mic,
  MicOff,
} from 'lucide-react';

const EntryEditor = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('Neutral');
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('published');
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [goalFeedback, setGoalFeedback] = useState([]);
  const [habitFeedback, setHabitFeedback] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Voice Input States & Ref
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = React.useRef(null);

  // Check browser support and cleanup on unmount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!speechSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setContent((prev) => {
            const needsSpace = prev.length > 0 && !prev.endsWith(' ') && !prev.endsWith('\n');
            return prev + (needsSpace ? ' ' : '') + finalTranscript;
          });
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone permission is required for voice journaling. Please enable it in your browser settings.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchEntry = async () => {
        setLoading(true);
        try {
          const { data } = await API.get(`/journals/${id}`);
          if (data.success) {
            const entry = data.journal;
            setTitle(entry.title);
            setContent(entry.content);
            setDate(new Date(entry.date).toISOString().split('T')[0]);
            setMood(entry.mood);
            setTagInput(entry.tags?.join(', ') || '');
            setImages(entry.images || []);
            setStatus(entry.status);
            setAiAnalysis(entry.aiAnalysis);
          }
        } catch (error) {
          console.error('Failed to fetch journal entry:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchEntry();
    }
  }, [id, isEditMode]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadLoading(true);
    setUploadProgress(0);

    try {
      const { data } = await API.post('/journals/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      if (data.success) {
        setImages((prev) => [...prev, data.url]);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      const msg = error.response?.data?.message || 'Could not upload image. Please try again.';
      alert(msg);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSave = async (saveStatus = 'published') => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content before saving.');
      return;
    }

    setSaveLoading(true);
    setStatus(saveStatus);

    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      content,
      date,
      mood,
      tags: tagsArray,
      images,
      status: saveStatus,
    };

    try {
      let response;
      if (isEditMode) {
        response = await API.put(`/journals/${id}`, payload);
      } else {
        response = await API.post('/journals', payload);
      }

      const { data } = response;
      if (data.success) {
        if (data.journal.aiAnalysis) {
          setAiAnalysis(data.journal.aiAnalysis);
        }

        if (data.goalUpdates && data.goalUpdates.length > 0) {
          setGoalFeedback(data.goalUpdates);
        }
        if (data.habitUpdates && data.habitUpdates.length > 0) {
          setHabitFeedback(data.habitUpdates);
        }

        setTimeout(() => {
          navigate('/diary');
        }, 1200);
      }
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      alert(error.response?.data?.message || 'Could not save journal entry.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D4FF] border-t-transparent mx-auto"></div>
          <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">Loading Entry Vector...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/diary')}
            className="p-2 rounded-xl border border-slate-800 bg-[#0B1026] hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
              {isEditMode ? 'Edit Journal Entry' : 'Create Reflection'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Write freely. MindDora AI auto-calculates stress, habits, and goal milestones.</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 self-start sm:self-auto">
          <button
            onClick={() => handleSave('draft')}
            disabled={saveLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-[#0B1026] hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saveLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] text-xs font-extrabold text-white shadow-lg shadow-[#00D4FF]/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isEditMode ? 'Update & Sync AI' : 'Publish Reflection'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Surface */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Title & Mood inputs */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <input
              type="text"
              placeholder="Entry Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg sm:text-xl font-black bg-transparent border-b border-slate-800 pb-3 text-white focus:outline-none focus:border-[#00D4FF] placeholder:text-slate-600"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Reflection Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Primary Mood State</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
                >
                  <option value="Neutral">Neutral 😐</option>
                  <option value="Happy">Happy 😊</option>
                  <option value="Excited">Excited 🤩</option>
                  <option value="Anxious">Anxious 😰</option>
                  <option value="Sadness">Sadness 😢</option>
                  <option value="Angry">Angry 😠</option>
                  <option value="Stress">Stress 😫</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Diary Narrative</span>
              
              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {isListening && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#14F195] font-semibold bg-[#14F195]/5 px-2.5 py-1 rounded-lg border border-[#14F195]/20 animate-pulse"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#14F195]"></span>
                      <span>Listening... Speak now</span>
                      {/* Premium Sound wave animation using Framer Motion */}
                      <div className="flex gap-0.5 items-end h-3 ml-1">
                        {[0.1, 0.3, 0.2].map((delay, index) => (
                          <motion.div
                            key={index}
                            className="w-0.5 bg-[#14F195] rounded-full"
                            animate={{
                              height: ["4px", "12px", "4px"]
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: delay,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button
                  type="button"
                  onClick={toggleListening}
                  title={!speechSupported ? "Speech recognition not supported in this browser" : isListening ? "Stop voice input" : "Start voice input"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all duration-200 ${
                    !speechSupported
                      ? 'border border-slate-800 bg-slate-900/40 text-slate-500 cursor-not-allowed'
                      : isListening
                      ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white animate-pulse shadow-lg shadow-rose-500/20 active:scale-95'
                      : 'border border-slate-800 bg-[#050816] text-[#00D4FF] hover:bg-[#00D4FF]/10 hover:border-[#00D4FF]/40 active:scale-95'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3.5 w-3.5 text-white" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3.5 w-3.5" />
                      <span>Voice Input</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              placeholder="What is on your mind today? Write about challenges, achievements, coding tasks, workouts, or reflections..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="w-full text-xs sm:text-sm bg-transparent text-slate-200 leading-relaxed focus:outline-none resize-none placeholder:text-slate-600 font-sans"
            />

            {/* Images & Tags bar */}
            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#8B5CF6]" />
                <input
                  type="text"
                  placeholder="Tags comma separated (e.g. coding, reflections, career)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 text-xs rounded-xl border border-slate-800 bg-[#050816] px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                />
              </div>

              {/* Uploaded image previews */}
              <div className="flex flex-wrap items-center gap-3">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-800 group shadow-md bg-[#050816]">
                    <img
                      src={getImageUrl(imgUrl)}
                      alt={`Upload ${idx}`}
                      className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setPreviewImage(imgUrl)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700"
                      title="Remove image"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                    <div
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity"
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                ))}

                <label className="h-16 w-16 rounded-xl border border-dashed border-slate-800 hover:border-[#00D4FF] flex flex-col items-center justify-center text-slate-400 hover:text-[#00D4FF] cursor-pointer transition-colors bg-[#050816]/60">
                  {uploadLoading ? (
                    <div className="text-center">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto text-[#00D4FF]" />
                      <span className="text-[8px] mt-1 font-bold block">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-[9px] font-bold mt-1">Add Img</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadLoading} />
                </label>
              </div>

            </div>
          </div>

          {/* Real-Time AI Goal / Habit Feedbacks */}
          <AnimatePresence>
            {(goalFeedback.length > 0 || habitFeedback.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-3xl border border-[#14F195]/30 bg-[#14F195]/5 p-6 space-y-3 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 text-[#14F195]">
                  <Sparkles className="h-5 w-5 animate-bounce" />
                  <h4 className="text-xs font-black uppercase tracking-wider">AI Automated Sync Update</h4>
                </div>
                {goalFeedback.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <Target className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#00D4FF]">Goal Progress +{g.incrementProgress}%: </span>
                      <span>{g.explanation}</span>
                    </div>
                  </div>
                ))}
                {habitFeedback.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <Flame className="h-4 w-4 text-[#14F195] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#14F195]">Habit Check [{h.habitName}]: </span>
                      <span>Auto-marked completion based on journal text!</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Analysis Pane */}
        <div>
          <div className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 shadow-xl backdrop-blur-xl space-y-6 sticky top-8">
            <div className="flex items-center gap-2 text-[#00D4FF]">
              <Brain className="h-5 w-5 animate-pulse" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">AI Growth Analytics</h3>
            </div>

            {aiAnalysis ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-extrabold text-[#00D4FF] uppercase flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Companion Reflection
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-[#050816] p-3 rounded-xl border border-slate-800/80">
                    "{aiAnalysis.summary}"
                  </p>
                </div>

                {/* Emotions */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase">Emotion Profile</h4>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-[#00D4FF]/10 text-[#00D4FF] rounded-lg border border-[#00D4FF]/30">
                      Primary: {aiAnalysis.emotionAnalysis?.primary}
                    </span>
                    {aiAnalysis.emotionAnalysis?.secondary && (
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg border border-[#8B5CF6]/30">
                        Secondary: {aiAnalysis.emotionAnalysis?.secondary}
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid Scores */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-[#050816] p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Stress</p>
                    <p className="text-lg font-black text-rose-400 mt-1">{aiAnalysis.stressLevel}/10</p>
                  </div>
                  <div className="bg-[#050816] p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Confidence</p>
                    <p className="text-lg font-black text-[#8B5CF6] mt-1">{aiAnalysis.confidenceScore}/10</p>
                  </div>
                  <div className="bg-[#050816] p-2.5 rounded-xl border border-slate-800">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Productive</p>
                    <p className="text-lg font-black text-[#14F195] mt-1">{aiAnalysis.productivityScore}/10</p>
                  </div>
                </div>

                {/* Topics */}
                {aiAnalysis.keyTopics?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase">Key Themes</h4>
                    <div className="flex flex-wrap gap-1">
                      {aiAnalysis.keyTopics.map((topic, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-slate-300 bg-[#050816] px-2 py-0.5 rounded border border-slate-800">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reflection questions */}
                {aiAnalysis.reflectionQuestions?.length > 0 && (
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                    <h4 className="text-[10px] font-extrabold text-[#00D4FF] uppercase flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Reflections to Ponder
                    </h4>
                    <ul className="space-y-2">
                      {aiAnalysis.reflectionQuestions.map((q, idx) => (
                        <li key={idx} className="text-xs text-slate-300 italic bg-[#050816] p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          "{q}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 space-y-2">
                <CheckCircle className="h-8 w-8 text-slate-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-300">Analysis Pending</h4>
                <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                  Publish this entry. MindDora AI will read it, extract goals progress, update streaks, and calculate emotional metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Image Preview */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1026] p-2 shadow-2xl">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={getImageUrl(previewImage)}
                alt="Enlarged view"
                className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain mx-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntryEditor;

