import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  Database, 
  BookOpen, 
  LogIn, 
  LogOut, 
  User, 
  LayoutDashboard,
  Cpu,
  Menu, 
  X,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#060A13]/90 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <div className="w-full h-full bg-[#070D17] rounded-[10px] flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-cyan-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                Scam<span className="text-cyan-400">Shield</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5 hidden sm:block">
                Community Fraud Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-semibold whitespace-nowrap">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/') 
                  ? 'text-cyan-400 bg-blue-500/10 border border-blue-500/20 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isActive('/search') 
                  ? 'text-cyan-400 bg-blue-500/10 border border-blue-500/20 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Search Scams
            </Link>
            <Link
              to="/database"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isActive('/database') 
                  ? 'text-cyan-400 bg-blue-500/10 border border-blue-500/20 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              Database
            </Link>
            <Link
              to="/safety"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isActive('/safety') 
                  ? 'text-cyan-400 bg-blue-500/10 border border-blue-500/20 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Safety Center
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isActive('/admin') 
                      ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30' 
                      : 'text-amber-300/80 hover:text-amber-300 hover:bg-amber-500/10'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  Admin
                </Link>
                <Link
                  to="/admin/ml"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isActive('/admin/ml') 
                      ? 'text-purple-400 bg-purple-500/15 border border-purple-500/30' 
                      : 'text-purple-300/80 hover:text-purple-300 hover:bg-purple-500/10'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  ML Diagnostics
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/my-reports"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isActive('/my-reports')
                      ? 'border-blue-500/60 text-cyan-300 bg-blue-500/15'
                      : 'border-slate-800 text-slate-300 hover:border-slate-700 bg-slate-900/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  My Reports
                </Link>

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="max-w-[110px] truncate font-mono text-[11px]">{user?.email}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                Login
              </Link>
            )}

            {/* Primary Report CTA */}
            <Link
              to="/report"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all border border-blue-400/30"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Report Scam</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/report"
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3 text-amber-300" />
              <span>Report</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#091120] px-4 pt-3 pb-6 space-y-1.5 text-xs font-semibold shadow-2xl">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-xl transition-colors ${
              isActive('/') ? 'text-cyan-400 bg-blue-500/10' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
              isActive('/search') ? 'text-cyan-400 bg-blue-500/10' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400" />
            Search Scams
          </Link>
          <Link
            to="/database"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
              isActive('/database') ? 'text-cyan-400 bg-blue-500/10' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4 text-blue-400" />
            Public Database
          </Link>
          <Link
            to="/safety"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
              isActive('/safety') ? 'text-cyan-400 bg-blue-500/10' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Safety Center
          </Link>

          {isAdmin && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-amber-300 hover:bg-slate-800/60"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                Admin Dashboard
              </Link>
              <Link
                to="/admin/ml"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-purple-300 hover:bg-slate-800/60"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                ML Diagnostics
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-reports"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-cyan-300 hover:bg-slate-800/60"
                >
                  <FileText className="w-4 h-4" />
                  My Reports
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-slate-800/60"
                >
                  <LogOut className="w-4 h-4" />
                  Logout ({user?.email})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-cyan-400 hover:bg-slate-800/60"
              >
                <LogIn className="w-4 h-4" />
                Login to ScamShield
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
