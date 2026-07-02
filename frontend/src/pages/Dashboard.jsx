import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Download,
  AlertTriangle,
  Smile,
  ShieldAlert,
  Flame,
  BrainCircuit,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/analytics/dashboard');
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await API.get('/analytics/monthly-report/pdf', {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `MindDora-Monthly-Growth-Report.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to download PDF growth report:', error);
      alert('Could not generate PDF. Please ensure you have written journal entries this month.');
    } finally {
      setPdfLoading(false);
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

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D4FF] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400 text-xs font-bold tracking-wider uppercase">Aggregating growth stats...</p>
        </div>
      </div>
    );
  }

  const moodCounts = stats?.moods?.counts || {};
  const hasData = stats?.writing?.totalEntries > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
            Hello, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here is your growth snapshot. AI Mentor: <span className="font-bold text-[#00D4FF] capitalize">{user?.mentorPreference} Companion</span>
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading || !hasData}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] px-4.5 py-2.5 text-xs font-extrabold text-white transition-all shadow-lg shadow-[#00D4FF]/20 active:scale-95 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {pdfLoading ? 'Building PDF...' : 'Export Growth Report'}
        </button>
      </div>

      {!hasData ? (
        <div className="rounded-3xl border border-dashed border-[#8B5CF6]/30 bg-[#0B1026]/60 p-12 text-center max-w-xl mx-auto space-y-4 backdrop-blur-xl">
          <div className="h-12 w-12 rounded-2xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Your Companion is empty</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Set your Goals,Habits! 
            Write your first journal entry to kick off your emotional analytics, habit checking, and goal metrics tracking!
          </p>
          <a
            href="/entry/new"
            className="inline-block rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] px-5 py-2.5 text-xs font-extrabold text-white shadow-lg transition-all active:scale-95"
          >
            Create First Entry
          </a>
        </div>
      ) : (
        <>
          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-4.5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Total Entries</span>
                <BookOpen className="h-4.5 w-4.5 text-[#00D4FF]" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{stats?.writing?.totalEntries || 0}</p>
              <p className="text-[10px] text-slate-400 mt-1">Written in total</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-4.5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Writing Streak</span>
                <Flame className="h-4.5 w-4.5 text-[#14F195] animate-bounce" />
              </div>
              <p className="mt-2 text-2xl font-black text-[#14F195]">{stats?.writing?.streak || 0} days</p>
              <p className="text-[10px] text-slate-400 mt-1">Consecutive logs</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-4.5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Words Written</span>
                <TrendingUp className="h-4.5 w-4.5 text-[#8B5CF6]" />
              </div>
              <p className="mt-2 text-2xl font-black text-[#8B5CF6]">{(stats?.writing?.totalWords || 0).toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 mt-1">Second brain scale</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-4.5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Goal Progress</span>
                <Award className="h-4.5 w-4.5 text-[#00D4FF]" />
              </div>
              <p className="mt-2 text-2xl font-black text-[#00D4FF]">{stats?.goals?.averageProgress || 0}%</p>
              <p className="text-[10px] text-slate-400 mt-1">Average goal completion</p>
            </div>
          </div>

          {/* Emotional Averages Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stress level Card */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-rose-400 mb-4">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">Average Stress</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{stats?.moods?.avgStress ?? 5}</span>
                <span className="text-slate-400 text-xs pb-1">/ 10</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(stats?.moods?.avgStress || 5) * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Confidence Card */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#8B5CF6] mb-4">
                <BrainCircuit className="h-5 w-5" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">Average Confidence</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{stats?.moods?.avgConfidence ?? 5}</span>
                <span className="text-slate-400 text-xs pb-1">/ 10</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden border border-slate-800">
                <div
                  className="bg-[#8B5CF6] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(stats?.moods?.avgConfidence || 5) * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Productivity Card */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0B1026]/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#14F195] mb-4">
                <Smile className="h-5 w-5" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">Average Productivity</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{stats?.moods?.avgProductivity ?? 5}</span>
                <span className="text-slate-400 text-xs pb-1">/ 10</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden border border-slate-800">
                <div
                  className="bg-[#14F195] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(stats?.moods?.avgProductivity || 5) * 10}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Visual Charts and Mood Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline Line Chart */}
            <div className="lg:col-span-2 rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-200">Wellness Metrics Timeline</h3>
                  <p className="text-[10px] text-slate-400">Fluctuations in your mental scores over the last 30 days</p>
                </div>
              </div>
              <div className="h-64 w-full">
                {stats?.timeline && stats.timeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.timeline} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" domain={[0, 10]} fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#050816',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#f8fafc',
                        }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" name="Stress" dataKey="stress" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" name="Confidence" dataKey="confidence" stroke="#8B5CF6" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" name="Productivity" dataKey="productivity" stroke="#14F195" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Not enough logs in this window. Keep writing!
                  </div>
                )}
              </div>
            </div>

            {/* Mood Frequency & Habits Streak Panel */}
            <div className="rounded-3xl border border-slate-800/80 bg-[#0B1026]/80 p-6 shadow-xl backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-200">Emotional Distribution</h3>
                <p className="text-[10px] text-slate-400">Which moods are logged most frequently</p>
              </div>

              {Object.keys(moodCounts).length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">No logs categorized yet.</div>
              ) : (
                <div className="space-y-3.5">
                  {Object.entries(moodCounts).map(([mood, val]) => {
                    const totalEntriesMonth = stats?.writing?.entriesThisMonth || 1;
                    const pct = Math.round((val / totalEntriesMonth) * 100);
                    return (
                      <div key={mood} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="flex items-center gap-1.5">
                            <span>{getMoodEmoji(mood)}</span>
                            <span className="capitalize text-slate-200">{mood}</span>
                          </span>
                          <span className="text-slate-400">{pct}% ({val})</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Habits Summary */}
              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#00D4FF] mb-3">Habits Streaks</h4>
                <div className="space-y-2">
                  {stats?.habits && stats.habits.length > 0 ? (
                    stats.habits.slice(0, 3).map((h) => (
                      <div key={h._id} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{h.habitName}</span>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-[#14F195]" />
                          <span className="font-bold text-[#14F195]">{h.streak} day streak</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center">No habits added. Create a habit track to view streaks.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
