import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, ExternalLink, GraduationCap, Lock, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#040810] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Scam<span className="text-cyan-400">Shield</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Community-driven cybersecurity intelligence database to verify suspicious phone numbers, UPI VPAs, and digital payment fraud syndicates.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              B.Tech IT Academic Capstone Project
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              Platform Features
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/search" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Search Phone or UPI
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Report a Scam Identifier
                </Link>
              </li>
              <li>
                <Link to="/database" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Public Verified Database
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Fraud Prevention Guides
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Moderator Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Emergency Hotline */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" /> Official Emergency Help
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2">
              <div className="text-[11px] text-slate-300 font-medium">
                National Cybercrime Reporting Helpline:
              </div>
              <a
                href="tel:1930"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Dial 1930 (Toll-Free)
              </a>
              <p className="text-[10px] text-slate-400 leading-normal">
                Indian Cybercrime Coordination Centre (I4C), Ministry of Home Affairs.
              </p>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:underline pt-0.5"
              >
                cybercrime.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Academic Governance & Ethical Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> Privacy & Verification
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Reports represent allegations subject to multi-factor moderation. Public phone numbers and UPI VPAs are masked to safeguard civil privacy.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Random Forest ML Risk Advisory (RF-v1.0)</span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-5 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} ScamShield. B.Tech IT Semester 7 Academic Demonstration.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-mono text-[10px]">FastAPI • PyMongo • React • Scikit-Learn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
