import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  const handleGoogleDevLogin = async () => {
    setLoading(true);
    const result = await googleLogin(null, 'testuser@minddora.com', 'Alexander growth');
    setLoading(false);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'Google authentication failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] p-4 relative overflow-hidden select-none">
      {/* Aurora Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-[#00D4FF]/15 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-[#8B5CF6]/15 blur-[130px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl bg-[#0B1026]/90 backdrop-blur-2xl border border-slate-800/80 p-8 shadow-2xl relative z-10"
      >
        {/* Brand header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00D4FF] via-[#8B5CF6] to-[#14F195] mx-auto shadow-lg shadow-[#00D4FF]/20">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] bg-clip-text text-transparent">
            Join MindDora
          </h2>
          <p className="text-xs text-slate-400 font-medium">Create your private AI-powered self-growth second brain</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-800/50 p-3.5 mb-6 text-xs text-rose-300"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Alexander Growth"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-3 pl-10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-3 pl-10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-800 bg-[#050816] p-3 pl-10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#14F195] py-3.5 text-xs font-extrabold text-white shadow-lg shadow-[#00D4FF]/20 active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Or Demo Mode</span>
          <div className="flex-1 h-px bg-slate-800"></div>
        </div>

        <button
          onClick={handleGoogleDevLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#050816] hover:bg-slate-900 py-3 text-xs font-bold text-slate-300 transition-colors"
        >
          <span>One-Click Dev OAuth Login</span>
        </button>

        <div className="mt-8 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-extrabold text-[#00D4FF] hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
