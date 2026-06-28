import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  CheckSquare,
  Plus,
  Trash2,
  Flame,
  CheckCircle,
  Loader2,
} from 'lucide-react';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habitName, setHabitName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [pastDates, setPastDates] = useState([]);

  useEffect(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
        dayNum: d.getDate(),
      });
    }
    setPastDates(dates);
  }, []);

  const fetchHabits = async () => {
    try {
      const { data } = await API.get('/habits');
      if (data.success) {
        setHabits(data.habits);
      }
    } catch (error) {
      console.error('Failed to fetch habits checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!habitName) return;

    setCreateLoading(true);
    try {
      const { data } = await API.post('/habits', { habitName });
      if (data.success) {
        setHabits((prev) => [data.habit, ...prev]);
        setHabitName('');
      }
    } catch (error) {
      console.error('Failed to track habit:', error);
      alert(error.response?.data?.message || 'Failed to add habit.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleDate = async (id, dateStr) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h._id === id) {
          const completedDates = [...h.completedDates];
          const idx = completedDates.indexOf(dateStr);
          
          if (idx > -1) {
            completedDates.splice(idx, 1);
          } else {
            completedDates.push(dateStr);
          }
          
          let streak = h.streak;
          const today = new Date().toISOString().split('T')[0];
          if (dateStr === today) {
            streak = idx > -1 ? Math.max(0, streak - 1) : streak + 1;
          }

          return {
            ...h,
            completedDates,
            streak,
          };
        }
        return h;
      })
    );

    try {
      const { data } = await API.put(`/habits/${id}/toggle`, { date: dateStr });
      if (data.success) {
        setHabits((prev) =>
          prev.map((h) => (h._id === id ? data.habit : h))
        );
      }
    } catch (error) {
      console.error('Failed to toggle habit date:', error);
      fetchHabits();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Stop tracking this habit? Streak logs will be removed.')) return;

    try {
      const { data } = await API.delete(`/habits/${id}`);
      if (data.success) {
        setHabits((prev) => prev.filter((h) => h._id !== id));
      }
    } catch (error) {
      console.error('Failed to stop habit:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
          Habit Companion
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Set habits to log. MindDora AI will auto-check completion based on diary keywords!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Habit Card */}
        <div>
          <form
            onSubmit={handleCreate}
            className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 shadow-xl backdrop-blur-xl space-y-4 sticky top-8"
          >
            <div className="flex items-center gap-2 text-[#14F195] mb-2">
              <CheckSquare className="h-5 w-5" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Add Habit to Track</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase">Habit Title</label>
              <input
                type="text"
                placeholder="e.g. Meditation, Reading, Coding"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#14F195]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createLoading || !habitName}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] py-3 text-xs font-extrabold text-white shadow-lg shadow-[#00D4FF]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Track Habit
            </button>
          </form>
        </div>

        {/* Habits List Grid */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#14F195] border-t-transparent"></div>
            </div>
          ) : habits.length === 0 ? (
            <div className="rounded-3xl bg-[#0B1026]/60 border border-slate-800/80 p-12 text-center space-y-3 backdrop-blur-xl">
              <CheckSquare className="h-10 w-10 text-[#14F195] mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-slate-200">No habits tracked yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Define a habit log target on the left. Write in your diary about your habit activities, and the AI will check the boxes automatically!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => {
                const todayStr = new Date().toISOString().split('T')[0];
                const isLoggedToday = habit.completedDates.includes(todayStr);

                return (
                  <div
                    key={habit._id}
                    className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-5 shadow-xl backdrop-blur-xl space-y-4 hover:border-[#14F195]/50 transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-100 text-sm">
                          {habit.habitName}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] text-[#14F195] font-bold">
                          <Flame className="h-4 w-4 animate-bounce" />
                          <span>{habit.streak} Day Streak</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleDate(habit._id, todayStr)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            isLoggedToday
                              ? 'bg-[#14F195] border-[#14F195] text-slate-950 shadow-md'
                              : 'border-slate-800 text-slate-400 hover:border-[#14F195] hover:text-[#14F195]'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>{isLoggedToday ? 'Done Today' : 'Mark Done'}</span>
                        </button>

                        <button
                          onClick={() => handleDelete(habit._id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Delete Habit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Past 7 days check-in Row */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase mb-3">7-Day Completion Log</p>
                      <div className="grid grid-cols-7 gap-2">
                        {pastDates.map(({ dateStr, dayName, dayNum }) => {
                          const isDone = habit.completedDates.includes(dateStr);
                          const isToday = dateStr === todayStr;

                          return (
                            <button
                              key={dateStr}
                              onClick={() => handleToggleDate(habit._id, dateStr)}
                              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                                isDone
                                  ? 'bg-gradient-to-tr from-[#00D4FF] to-[#8B5CF6] border-[#00D4FF] text-white shadow-md'
                                  : isToday
                                  ? 'border-[#14F195]/40 bg-[#14F195]/10 text-[#14F195]'
                                  : 'border-slate-800 bg-[#050816] hover:border-slate-700 text-slate-400'
                              }`}
                              title={dateStr}
                            >
                              <span className="text-[9px] font-bold opacity-70 uppercase">{dayName}</span>
                              <span className="text-xs font-black mt-0.5">{dayNum}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Habits;
