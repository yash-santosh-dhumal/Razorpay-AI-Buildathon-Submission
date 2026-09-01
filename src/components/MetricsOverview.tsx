import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { RecoveryAnalytics } from '@/types';

interface MetricsOverviewProps {
  analytics: RecoveryAnalytics;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Recovered */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1527] to-[#070b14] border border-[#1e293b] p-5 shadow-lg group hover:border-[#3b82f6]/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#3b82f6]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#3b82f6]/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Recovered MRR</span>
          <div className="p-2 rounded-xl bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">
            ₹{analytics.totalRecoveredRevenue.toLocaleString('en-IN')}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +18.4%
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Out of ₹{analytics.totalLostRevenue.toLocaleString('en-IN')} at-risk volume</span>
        </p>
      </div>

      {/* Recovery Success Rate */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1527] to-[#070b14] border border-[#1e293b] p-5 shadow-lg group hover:border-emerald-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recovery Rate</span>
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">
            {analytics.recoverySuccessRate.toFixed(1)}%
          </span>
          <span className="text-xs text-emerald-400 font-medium">Industry Avg: 22%</span>
        </div>
        <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" 
            style={{ width: `${Math.min(analytics.recoverySuccessRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Active Autonomous Interventions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1527] to-[#070b14] border border-[#1e293b] p-5 shadow-lg group hover:border-amber-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active In-Flight AI</span>
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">
            {analytics.activeRecoveryCount}
          </span>
          <span className="text-xs text-amber-400/90 font-medium">Auto-Dunned / Scheduled</span>
        </div>
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Avg. resolution time: ~4.8 mins</span>
        </p>
      </div>

      {/* ROI & Merchant Multiplier */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1527] to-[#070b14] border border-[#1e293b] p-5 shadow-lg group hover:border-purple-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ROI Multiplier</span>
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">
            {analytics.roiMultiplier}x
          </span>
          <span className="text-xs text-purple-400 font-medium">Net Value Saved</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Saved ₹0 in gateway churn penalties
        </p>
      </div>
    </div>
  );
};
