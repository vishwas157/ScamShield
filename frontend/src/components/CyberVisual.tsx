import React from 'react';
import { Shield, ShieldAlert, CheckCircle2, Lock, Smartphone, CreditCard, Activity, Radio, Cpu } from 'lucide-react';

export const CyberVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-3xl blur-2xl opacity-75" />

      {/* Main Glassmorphic Threat Radar Card */}
      <div className="relative rounded-3xl bg-[#091120]/90 border border-slate-800/90 shadow-2xl p-6 backdrop-blur-xl overflow-hidden space-y-5">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

        {/* Top telemetry bar */}
        <div className="relative flex items-center justify-between border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-300 uppercase">
              Threat Intelligence Engine
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-cyan-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>NODE ACTIVE</span>
          </div>
        </div>

        {/* Center Scanner & Shield Graphic */}
        <div className="relative py-4 flex items-center justify-center">
          {/* Circular radar rings */}
          <div className="w-44 h-44 rounded-full border border-slate-800/60 flex items-center justify-center relative">
            <div className="w-32 h-32 rounded-full border border-blue-500/20 flex items-center justify-center relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <Shield className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
              </div>
            </div>

            {/* Orbiting pulse badge 1 */}
            <div className="absolute top-0 right-4 px-2 py-1 rounded-lg bg-rose-950/80 border border-rose-800/60 shadow-lg flex items-center gap-1.5 text-[10px] text-rose-300 font-mono">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>HIGH RISK (94%)</span>
            </div>

            {/* Orbiting pulse badge 2 */}
            <div className="absolute bottom-1 left-3 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 shadow-lg flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>UPI VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Cards (Multi-factor evidence feed) */}
        <div className="relative space-y-2.5">
          {/* Incident 1 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono font-bold text-white tracking-wide">+91 98****3210</div>
                <div className="text-[10px] text-slate-400">Electricity Bill Cutoff Threat</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
              3 Complaints
            </span>
          </div>

          {/* Incident 2 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono font-bold text-white tracking-wide">refund***@okhdfcbank</div>
                <div className="text-[10px] text-slate-400">QR Code Reversal Fraud</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
              ₹15,000 Loss
            </span>
          </div>
        </div>

        {/* Bottom micro telemetry status */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>Random Forest (RF-v1.0)</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Lock className="w-3 h-3" />
            <span>End-to-End Masked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
