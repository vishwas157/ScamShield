import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogIn, Lock, Mail, AlertOctagon, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autofilled, setAutofilled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const detail = err.response?.data?.detail || 'Invalid email or password. Please verify credentials.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@scamshield.org');
    setPassword('Admin@ScamShield2026');
    setAutofilled(true);
    setTimeout(() => setAutofilled(false), 2000);
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-blue-500/10">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to ScamShield
          </h1>
          <p className="text-xs text-slate-400">
            Access citizen incident submissions and moderation clearances
          </p>
        </div>

        {/* Demo Credentials Helper (Controlled for Production Security) */}
        {(import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_CREDENTIALS === 'true') && (
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-blue-900/40 text-xs space-y-2.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-cyan-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Evaluation Credentials (Dev Mode)
              </span>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 font-bold transition-all flex items-center gap-1"
              >
                {autofilled ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                {autofilled ? 'Autofilled' : 'Autofill Admin'}
              </button>
            </div>
            <div className="text-slate-300 font-mono text-[11px] space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-white">admin@scamshield.org</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="text-white">Admin@ScamShield2026</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0a0f1d] border border-slate-800/80 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Sign In
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don’t have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
              Create citizen account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
