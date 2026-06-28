import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getImageUrl } from '../services/api';
import {
  BookOpen,
  Search,
  Sparkles,
  Trash2,
  Calendar,
  Tag,
  Smile,
  ChevronRight,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';


const Diary = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchMode, setSearchMode] = useState('keyword'); // 'keyword' | 'semantic'
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      let url = '/journals';
      const params = {};

      if (selectedMood) params.mood = selectedMood;
      if (selectedTag) params.tag = selectedTag;

      if (searchText) {
        if (searchMode === 'semantic') {
          url = '/journals/search';
          params.query = searchText;
        } else {
          params.search = searchText;
        }
      }

      const { data } = await API.get(url, { params });
      if (data.success) {
        setJournals(data.journals);

        if (url === '/journals' && !selectedTag && !selectedMood && !searchText) {
          const tags = new Set();
          data.journals.forEach((j) => j.tags?.forEach((t) => tags.add(t)));
          setAllTags(Array.from(tags));
        }
      }
    } catch (error) {
      console.error('Failed to load journals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEntries();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, searchMode, selectedMood, selectedTag]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this journal entry? This will wipe the AI analysis and memory vector.')) {
      return;
    }

    try {
      const { data } = await API.delete(`/journals/${id}`);
      if (data.success) {
        setJournals((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'happy': case 'joyful': return '😊';
      case 'excited': return '🤩';
      case 'anxious': case 'anxiety': return '😰';
      case 'sad': case 'sadness': return '😢';
      case 'angry': case 'frustrated': return '😠';
      case 'tired': case 'stress': return '😫';
      default: return '😐';
    }
  };

  const getMoodBgColor = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'happy': case 'joyful': case 'excited':
        return 'bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/30';
      case 'anxious': case 'anxiety': case 'sad': case 'sadness':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'angry': case 'frustrated': case 'tired': case 'stress':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
            My Journal Entries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            A comprehensive list of your memories and emotional records
          </p>
        </div>
        <button
          onClick={() => navigate('/entry/new')}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] px-4.5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-[#00D4FF]/20 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Write Entry
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#0B1026]/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Search text</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchMode('keyword')}
                className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  searchMode === 'keyword'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Keyword
              </button>
              <button
                onClick={() => setSearchMode('semantic')}
                className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                  searchMode === 'semantic'
                    ? 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white'
                    : 'text-slate-400 hover:text-[#00D4FF]'
                }`}
              >
                <Sparkles className="h-2.5 w-2.5" />
                AI Semantic
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder={searchMode === 'semantic' ? 'e.g. times when I felt anxious...' : 'Search title, content...'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-2.5 pl-9 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
            />
          </div>
        </div>

        {/* Mood filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
            <Smile className="h-3 w-3" />
            Filter Mood
          </label>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
          >
            <option value="">All Moods</option>
            <option value="Happy">Happy</option>
            <option value="Excited">Excited</option>
            <option value="Anxious">Anxious</option>
            <option value="Sad">Sadness</option>
            <option value="Angry">Angry</option>
            <option value="Tired">Tired</option>
            <option value="Stress">Stress</option>
            <option value="Neutral">Neutral</option>
          </select>
        </div>

        {/* Tag filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Filter Tag
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Listing Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00D4FF] border-t-transparent"></div>
        </div>
      ) : journals.length === 0 ? (
        <div className="rounded-3xl bg-[#0B1026]/60 border border-slate-800/80 p-12 text-center space-y-3 backdrop-blur-xl">
          <BookOpen className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No entries found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Try adjusting your search query, selecting different filters, or write a new entry.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journals.map((journal) => (
            <div
              key={journal._id}
              onClick={() => navigate(`/entry/${journal._id}`)}
              className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-5 hover:border-[#00D4FF]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(journal.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <h3 className="font-bold text-slate-100 group-hover:text-[#00D4FF] transition-colors text-sm line-clamp-1">
                      {journal.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full capitalize shrink-0 ${getMoodBgColor(journal.mood)}`}>
                    {getMoodEmoji(journal.mood)} {journal.mood}
                  </span>
                </div>

                {journal.score !== undefined && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[#00D4FF] font-bold bg-[#00D4FF]/10 px-2 py-0.5 rounded-md w-max border border-[#00D4FF]/20">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>Similarity Match: {Math.round(journal.score * 100)}%</span>
                  </div>
                )}

                <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {journal.aiAnalysis?.summary || journal.content}
                </p>

                {journal.images && journal.images.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {journal.images.slice(0, 3).map((img, idx) => (
                      <div key={idx} className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-[#050816]">
                        <img src={getImageUrl(img)} alt="Thumbnail" className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {journal.images.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md">
                        +{journal.images.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>


              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1 max-w-[80%]">
                  {journal.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                  {journal.status === 'draft' && (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(journal._id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Diary;
