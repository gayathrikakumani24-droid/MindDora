import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Target,
  CheckSquare,
  MessageSquare,
  Calendar,
  LogOut,
  Sparkles,
  Menu,
  X,
  Compass,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, updateMentorPreference } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [mentorChanging, setMentorChanging] = useState(false);

  const navigation = [
    { name: 'Home', to: '/home', icon: LayoutDashboard },
    { name: 'My Diary', to: '/diary', icon: BookOpen },
    { name: 'New Entry', to: '/entry/new', icon: PlusCircle },
    { name: 'Goal Tracker', to: '/goals', icon: Target },
    { name: 'Habit Tracker', to: '/habits', icon: CheckSquare },
    { name: 'AI Mentor Chat', to: '/chat', icon: MessageSquare },
    { name: 'Weekly AI Report', to: '/weekly-report', icon: Calendar },
  ];

  const mentors = [
    { value: 'wellness', label: 'Wellness Companion', desc: 'Empathetic & Therapeutic' },
    { value: 'productivity', label: 'Productivity Coach', desc: 'Action-Oriented & Direct' },
    { value: 'career', label: 'Career Mentor', desc: 'Strategic & Professional' },
    { value: 'study', label: 'Study Coach', desc: 'Academic & Learning Tips' },
  ];

  const handleMentorChange = async (e) => {
    const selected = e.target.value;
    setMentorChanging(true);
    await updateMentorPreference(selected);
    setMentorChanging(false);
  };

  const getMentorAvatarSeed = (preference) => {
    switch (preference) {
      case 'career': return 'Brian';
      case 'study': return 'Kimberly';
      case 'productivity': return 'Oliver';
      default: return 'Aria'; // wellness
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-[#0B1026] border-r border-[#8B5CF6]/20 backdrop-blur-2xl">
      <div className="space-y-6">
        {/* Header Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00D4FF] via-[#8B5CF6] to-[#14F195] shadow-md shadow-[#00D4FF]/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
                MindDora
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">AI Growth Platform</p>
            </div>
          </div>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] text-white shadow-lg shadow-[#00D4FF]/20 scale-[1.02]'
                      : 'text-slate-400 hover:bg-[#050816] hover:text-white'
                  }`
                }
              >
                <Icon className={`h-4.5 w-4.5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-5 pt-4 border-t border-slate-800/80">
        {/* AI Mentor Selection Panel */}
        <div className="rounded-2xl bg-[#050816]/80 p-3.5 border border-[#00D4FF]/20">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#00D4FF]">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>AI MENTOR PERSONALITY</span>
          </div>
          <select
            value={user?.mentorPreference || 'wellness'}
            onChange={handleMentorChange}
            disabled={mentorChanging}
            className="w-full text-xs rounded-lg border border-slate-800 bg-[#0B1026] p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF] disabled:opacity-50"
          >
            {mentors.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label} ({m.desc})
              </option>
            ))}
          </select>
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${getMentorAvatarSeed(
                  user?.mentorPreference
                )}`
              }
              alt={user?.name || 'User'}
              className="h-10 w-10 rounded-full border border-slate-800 bg-slate-900 shadow-inner"
            />
            <div className="truncate max-w-[100px] lg:max-w-[120px]">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all duration-200"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0B1026] border-b border-slate-800/80 lg:hidden sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#00D4FF] via-[#8B5CF6] to-[#14F195]">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-md font-extrabold bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
            MindDora
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-300"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 select-none">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
