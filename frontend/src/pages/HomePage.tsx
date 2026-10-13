import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Lock, 
  TrendingUp, 
  FileCheck, 
  ShieldAlert, 
  Phone,
  FileSearch,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';
import { PublicStats, PublicReportItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { CyberVisual } from '../components/CyberVisual';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'phone' | 'upi'>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [recentReports, setRecentReports] = useState<PublicReportItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          apiService.getStats(),
          apiService.getReports({ limit: 4, sort: 'newest' })
        ]);
        setStats(statsData);
        setRecentReports(reportsData.items || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?type=${searchType}&query=${encodeURIComponent(searchQuery.trim())}`);
  };

  const scamCategories = [
    {
      title: 'UPI Payment Fraud',
      desc: 'Reverse payment QR codes, fake approval requests, and advance deposit demands.',
      icon: CreditCard,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      badge: 'Payment Risk'
    },
    {
      title: 'Fake Customer Care',
      desc: 'Fraudulent bank or utility helpline numbers published on search engines to trap callers.',
      icon: Smartphone,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badge: 'Impersonation'
    },
    {
      title: 'OTP & KYC Scams',
      desc: 'Urgent threats claiming blocked PAN or electricity disconnection to hijack one-time codes.',
      icon: Lock,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      badge: 'Account Takeover'
    },
    {
      title: 'Job & Task Fraud',
      desc: 'Prepaid Telegram merchant tasks promising high daily returns for rating videos.',
      icon: TrendingUp,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      badge: 'Financial Trap'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section: Two-Column Desktop Layout */}
      <section className="relative pt-6 md:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy & Search Interface */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-750 text-xs font-semibold text-cyan-400 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>India’s Community Anti-Fraud Intelligence Network</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              Stop Scams Before <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">They Start.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Check suspicious phone numbers and UPI IDs, review community evidence, and make more informed decisions before you pay.
            </p>

            {/* Primary Search Panel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091120]/95 border border-slate-800 shadow-2xl space-y-3.5 backdrop-blur-xl">
              {/* Segmented Mode Selector */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-850 w-full sm:w-fit gap-1">
                <button
                  type="button"
                  onClick={() => setSearchType('phone')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    searchType === 'phone'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  <span>Mobile Number (+91)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('upi')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    searchType === 'upi'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-3 h-3" />
                  <span>UPI ID (@handle)</span>
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === 'phone'
                        ? 'Enter 10-digit number (e.g. 9876543210)'
                        : 'Enter UPI address (e.g. refund@okhdfcbank)'
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-600/25 whitespace-nowrap transition-all flex items-center justify-center gap-2 border border-blue-400/20"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify Identifier</span>
                </button>
              </form>

              {/* Privacy note and Secondary Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  Identifiers are masked. We never ask for PINs, passwords, or OTPs.
                </span>
                <Link
                  to="/report"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Report a new scam</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Trust Pill Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Moderator Verified Reports
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Random Forest ML Inference
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                100% Free Public Utility
              </span>
            </div>
          </div>

          {/* Right Column: Lightweight Threat Intelligence Visual */}
          <div className="lg:col-span-5 hidden lg:block">
            <CyberVisual />
          </div>
        </div>
      </section>

      {/* Statistics Section: 4 Compact, Consistent Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Total Reports */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#091120] border border-slate-800 shadow-lg flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Reports</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {loadingStats ? '—' : (stats?.total_reports ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Community submissions</div>
            </div>
          </div>

          {/* Approved Reports */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#091120] border border-slate-800 shadow-lg flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Approved Reports</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                {loadingStats ? '—' : (stats?.approved_reports ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Verified by moderators</div>
            </div>
          </div>

          {/* Pending Verification */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#091120] border border-slate-800 shadow-lg flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Review</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {loadingStats ? '—' : (stats?.pending_reports ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Awaiting investigation</div>
            </div>
          </div>

          {/* Protected Identifiers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#091120] border border-slate-800 shadow-lg flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Reported Identifiers</span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                {loadingStats ? '—' : (stats?.unique_approved_identifiers ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Distinct verified targets</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Process Section: 3-Step Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            How ScamShield Protects You
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Three Steps to Fraud-Free Payments
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A structured, ethical framework combining community vigilance and machine learning analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              01
            </div>
            <h3 className="text-base font-bold text-white">Search a Suspicious Identifier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter any 10-digit Indian phone number or UPI handle before confirming a payment, scanning a buyer QR, or acting on an urgent SMS.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              02
            </div>
            <h3 className="text-base font-bold text-white">Review Approved Community Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine verified community reports, historical financial loss patterns, and Random Forest risk classification signals.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              03
            </div>
            <h3 className="text-base font-bold text-white">Make an Informed Decision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Safeguard your money by declining fraudulent payment links, reporting new scam entities, and calling the official 1930 Helpline if targeted.
            </p>
          </div>
        </div>
      </section>

      {/* Prevalent Digital Fraud Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Threat Intelligence Taxonomy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Common Scam Categories
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Recognize the social engineering techniques frequently deployed across Indian payment systems.
            </p>
          </div>
          <Link
            to="/safety"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 shrink-0"
          >
            <span>Read full safety guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scamCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80">
                  <Link
                    to={`/database?category=${encodeURIComponent(item.title)}`}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Filter database</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recently Approved Community Reports */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Live Verified Feed
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Recently Verified Community Reports
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Community submissions audited and approved by administrative moderators.
            </p>
          </div>
          <Link
            to="/database"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 shrink-0"
          >
            <span>View all public reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentReports.map((report) => (
              <div
                key={report.reference_id}
                className="p-5 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-750 transition-all flex flex-col justify-between space-y-3.5 shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-white">
                      {report.masked_identifier}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                      {report.identifier_type}
                    </span>
                  </div>
                  <RiskBadge level={report.status} size="sm" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-cyan-400">
                    {report.scam_category}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {report.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Incident Date: {report.incident_date}</span>
                  {report.amount_inr && report.amount_inr > 0 ? (
                    <span className="text-rose-400 font-bold">
                      ₹{report.amount_inr.toLocaleString('en-IN')} Loss
                    </span>
                  ) : (
                    <span className="text-slate-500">Unsuccessful attempt</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-[#091120]/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No verified reports found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The community ledger is clean or awaiting initial moderator review.
            </p>
          </div>
        )}
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#0B1426] to-indigo-950/60 border border-blue-900/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Have you encountered a suspicious caller or payment link?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Help protect citizens across India. Your report updates the community ledger and strengthens our machine learning fraud detection models.
            </p>
          </div>
          <Link
            to="/report"
            className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 whitespace-nowrap border border-blue-400/30 transition-all shrink-0"
          >
            File a Scam Report
          </Link>
        </div>
      </section>
    </div>
  );
};
