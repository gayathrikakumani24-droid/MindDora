import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const fetchGoals = async () => {
    try {
      const { data } = await API.get('/goals');
      if (data.success) {
        setGoals(data.goals);
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;

    setCreateLoading(true);
    try {
      const { data } = await API.post('/goals', {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
      });

      if (data.success) {
        setGoals((prev) => [data.goal, ...prev]);
        setTitle('');
        setDescription('');
        setDeadline('');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleProgressChange = async (id, newProgress) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g._id === id) {
          const completed = newProgress >= 100;
          return {
            ...g,
            progress: newProgress,
            status: completed ? 'completed' : 'active',
          };
        }
        return g;
      })
    );

    try {
      await API.put(`/goals/${id}`, { progress: newProgress });
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      fetchGoals();
    }
  };

  const handleToggleComplete = async (goal) => {
    const isCompleted = goal.status === 'completed';
    const nextStatus = isCompleted ? 'active' : 'completed';
    const nextProgress = isCompleted ? 0 : 100;

    setGoals((prev) =>
      prev.map((g) => {
        if (g._id === goal._id) {
          return { ...g, progress: nextProgress, status: nextStatus };
        }
        return g;
      })
    );

    try {
      await API.put(`/goals/${goal._id}`, { status: nextStatus });
    } catch (error) {
      console.error('Failed to toggle goal completion status:', error);
      fetchGoals();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal tracking node?')) return;

    try {
      const { data } = await API.delete(`/goals/${id}`);
      if (data.success) {
        setGoals((prev) => prev.filter((g) => g._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const getDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return null;
    const diff = new Date(deadlineDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
          Goal Tracker
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          State your targets. MindDora AI will auto-detect progress suggestions in your diary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Goal Form */}
        <div>
          <form
            onSubmit={handleCreate}
            className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 shadow-xl backdrop-blur-xl space-y-4 sticky top-8"
          >
            <div className="flex items-center gap-2 text-[#00D4FF] mb-2">
              <Target className="h-5 w-5" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Define New Goal</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase">Goal Title</label>
              <input
                type="text"
                placeholder="e.g. Master React Hooks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase">Description</label>
              <textarea
                placeholder="Details or resources..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase">Deadline Date</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              />
            </div>

            <button
              type="submit"
              disabled={createLoading || !title}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] py-3 text-xs font-extrabold text-white shadow-lg shadow-[#00D4FF]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Goal
            </button>
          </form>
        </div>

        {/* Goals Checklist List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00D4FF] border-t-transparent"></div>
            </div>
          ) : goals.length === 0 ? (
            <div className="rounded-3xl bg-[#0B1026]/60 border border-slate-800/80 p-12 text-center space-y-3 backdrop-blur-xl">
              <Target className="h-10 w-10 text-[#00D4FF] mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-slate-200">No goals created yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Define a goal on the left to start tracking milestones. MindDora AI suggestion cards will help updates based on journal references.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const daysLeft = getDaysRemaining(goal.deadline);
                const isCompleted = goal.status === 'completed';

                return (
                  <div
                    key={goal._id}
                    className={`rounded-2xl border bg-[#0B1026]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 ${
                      isCompleted
                        ? 'border-[#14F195]/30 bg-[#14F195]/5'
                        : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleComplete(goal)}
                          className={`mt-0.5 rounded-full p-0.5 border transition-all ${
                            isCompleted
                              ? 'bg-[#14F195] border-[#14F195] text-slate-950'
                              : 'border-slate-700 hover:border-[#00D4FF]'
                          }`}
                        >
                          <CheckCircle className={`h-4.5 w-4.5 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                        <div className="space-y-1">
                          <h3
                            className={`font-bold text-sm ${
                              isCompleted
                                ? 'line-through text-slate-500'
                                : 'text-slate-100'
                            }`}
                          >
                            {goal.title}
                          </h3>
                          {goal.description && (
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {goal.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
                        title="Delete Goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Progress Slider block */}
                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400">Progression</span>
                        <span className={isCompleted ? 'text-[#14F195]' : 'text-[#00D4FF]'}>
                          {goal.progress}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={goal.progress}
                        onChange={(e) => handleProgressChange(goal._id, parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#00D4FF] focus:outline-none"
                      />
                    </div>

                    {/* Deadline stats */}
                    {goal.deadline && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Target: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                        {!isCompleted && daysLeft !== null && (
                          <span
                            className={`flex items-center gap-1 ${
                              daysLeft <= 3
                                ? 'text-rose-400 font-bold animate-pulse'
                                : daysLeft <= 7
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Deadline today' : `${Math.abs(daysLeft)} days overdue`}
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[#14F195] flex items-center gap-1 font-bold">
                            <Sparkles className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    )}
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

export default Goals;
