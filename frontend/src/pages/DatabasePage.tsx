import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Database, 
  Search, 
  Phone, 
  CreditCard, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { apiService } from '../services/api';
import { PublicReportItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';

const categories = [
  'All',
  'UPI Payment Fraud',
  'Phishing',
  'Fake Customer Care',
  'OTP Scam',
  'Impersonation',
  'Investment Scam',
  'Job Scam',
  'Shopping Scam',
  'Loan Scam',
  'Other'
];

export const DatabasePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialType = searchParams.get('type') || 'all';

  const [reports, setReports] = useState<PublicReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await apiService.getReports({
        page,
        limit: 8,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        type: selectedType === 'all' ? undefined : selectedType,
        query: searchQuery.trim() || undefined,
        sort: sortBy
      });
      setReports(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to load public reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, selectedCategory, selectedType, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400 mb-2">
            <Database className="w-3.5 h-3.5" /> Public Threat Intelligence Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verified Fraud Reports Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live public ledger of mobile numbers and UPI addresses verified by administrative moderators.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-[#091120] border border-slate-800 px-3.5 py-1.5 rounded-xl self-start md:self-auto font-mono">
          Showing <strong className="text-white">{total}</strong> approved records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#091120] border border-slate-800 space-y-3.5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by masked number, UPI address, reference ID, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
          </form>

          {/* Identifier Type Filter */}
          <div className="flex items-center gap-1 w-full lg:w-auto p-1 bg-slate-950 rounded-xl border border-slate-850">
            <button
              onClick={() => { setSelectedType('all'); setPage(1); }}
              className={`flex-1 lg:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => { setSelectedType('phone'); setPage(1); }}
              className={`flex-1 lg:flex-none px-3 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                selectedType === 'phone'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => { setSelectedType('upi'); setPage(1); }}
              className={`flex-1 lg:flex-none px-3 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                selectedType === 'upi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>UPI ID</span>
            </button>
          </div>

          {/* Sort By Selector */}
          <div className="w-full lg:w-auto flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full lg:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Loss (INR)</option>
              <option value="amount_low">Lowest Loss (INR)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setSelectedCategory(c); setPage(1); }}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Listing Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading verified intelligence records...</p>
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.reference_id}
              className="p-5 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-750 transition-all flex flex-col justify-between space-y-3.5 shadow-md"
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-extrabold text-sm text-white">
                    {report.masked_identifier}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                    {report.identifier_type}
                  </span>
                </div>
                <RiskBadge level={report.status} size="sm" />
              </div>

              {/* Category pill */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-cyan-300">
                  {report.scam_category}
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  {report.reference_id}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {report.description}
              </p>

              {/* Footer info */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  Incident Date: {report.incident_date}
                </span>
                {report.amount_inr && report.amount_inr > 0 ? (
                  <span className="text-rose-400 font-bold">
                    ₹{report.amount_inr.toLocaleString('en-IN')} Reported Loss
                  </span>
                ) : (
                  <span className="text-slate-500">Unsuccessful Attempt</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 p-8 rounded-3xl bg-[#091120]/60 border border-slate-800">
          <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">
              No matching approved records found
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Adjust your category filter or search query. Only reports that have passed administrative moderation appear in this public ledger.
            </p>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400">
            Page <strong className="text-white font-mono">{page}</strong> of <strong className="text-white font-mono">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#091120] border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-[#091120] flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#091120] border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-[#091120] flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
