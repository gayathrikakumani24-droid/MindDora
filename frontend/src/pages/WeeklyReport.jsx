import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Calendar,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Printer,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Brain,
} from 'lucide-react';

const WeeklyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await API.get('/analytics/weekly-report');
        if (data.success) {
          setReport(data.report);
        }
      } catch (error) {
        console.error('Failed to load weekly report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto"></div>
            <Sparkles className="h-5 w-5 text-indigo-500 absolute animate-pulse" />
          </div>
          <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">Synthesizing weekly growth patterns...</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest border border-indigo-500/20 mb-2">
            <Brain className="h-3 w-3" />
            <span>Weekly Executive Digest</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            AI Growth Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            7-day synthesis of emotional momentum, achievements, and behavioral insights • {currentDate}
          </p>
        </div>

        {report && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all self-start sm:self-auto print:hidden"
          >
            <Printer className="h-4 w-4 text-indigo-500" />
            <span>Export Digest</span>
          </button>
        )}
      </div>

      {!report ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-16 text-center space-y-4 max-w-md mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <Calendar className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Growth Digest Pending</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Write journal entries this week to allow MindDora AI to aggregate emotional trends, achievements, and custom recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent dark:bg-slate-900/60 p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles className="h-40 w-40 text-indigo-500" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Emotional State Overview
                </h3>
                <p className="text-[10px] text-slate-400">AI Cognitive Evaluation</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic pl-1 border-l-2 border-indigo-500/60">
              "{report.emotionalSummary}"
            </p>
          </div>

          {/* Achievements & Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Achievements Card */}
            <div className="rounded-3xl border border-emerald-500/20 dark:border-emerald-900/40 bg-white dark:bg-slate-900/80 p-6 space-y-4 shadow-lg hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5 text-emerald-500">
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Achievements & Wins
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  {report.achievements?.length || 0} Milestone{report.achievements?.length === 1 ? '' : 's'}
                </span>
              </div>

              <ul className="space-y-3 pt-1">
                {report.achievements?.length > 0 ? (
                  report.achievements.map((ach, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No direct achievements detected this week. Focus on consistent progress!</p>
                )}
              </ul>
            </div>

            {/* Challenges Card */}
            <div className="rounded-3xl border border-amber-500/20 dark:border-amber-900/40 bg-white dark:bg-slate-900/80 p-6 space-y-4 shadow-lg hover:border-amber-500/40 transition-all group">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5 text-amber-500">
                  <div className="p-2 rounded-xl bg-amber-500/10">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Friction & Challenges
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  {report.challenges?.length || 0} Identified
                </span>
              </div>

              <ul className="space-y-3 pt-1">
                {report.challenges?.length > 0 ? (
                  report.challenges.map((ch, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 leading-relaxed">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{ch}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No friction points logged this week. You are navigating smoothly!</p>
                )}
              </ul>
            </div>
          </div>

          {/* Topics & AI Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Discussion Topics */}
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-6 space-y-4 shadow-lg lg:col-span-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-purple-500 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="p-2 rounded-xl bg-purple-500/10">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Frequent Themes
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {report.mostDiscussedTopics?.length > 0 ? (
                    report.mostDiscussedTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shadow-sm"
                      >
                        <span>{topic}</span>
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Not enough entry volume to cluster themes.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Neural Topic Clustering</span>
                <ArrowUpRight className="h-3 w-3 text-indigo-400" />
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="rounded-3xl border border-indigo-500/20 dark:border-indigo-900/40 bg-white dark:bg-slate-900/80 p-6 space-y-4 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-2.5 text-indigo-500 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="p-2 rounded-xl bg-indigo-500/10">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  AI Actionable Recommendations
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {report.recommendations?.length > 0 ? (
                  report.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 shadow-sm"
                    >
                      <span className="h-6 w-6 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-extrabold text-[11px] shrink-0 shadow-md">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed mt-0.5">{rec}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Continue logging to generate tailored action items for next week.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
