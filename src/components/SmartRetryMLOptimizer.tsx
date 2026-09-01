import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  ReferenceDot, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface RetryProbabilityData {
  timeOffset: string;
  minutes: number;
  sbiProbability: number;
  hdfcProbability: number;
  iciciProbability: number;
  npciUpiProbability: number;
  cbsLoadPercent: number;
  insight: string;
}

const RETRY_CURVE_DATA: RetryProbabilityData[] = [
  { timeOffset: 'Immediate (T+0m)', minutes: 0, sbiProbability: 18, hdfcProbability: 35, iciciProbability: 40, npciUpiProbability: 25, cbsLoadPercent: 94, insight: 'CBS Core Peak Congestion - Retries almost certainly fail & trigger penalties' },
  { timeOffset: 'T+15m', minutes: 15, sbiProbability: 32, hdfcProbability: 54, iciciProbability: 62, npciUpiProbability: 48, cbsLoadPercent: 78, insight: 'Queue drain commencing' },
  { timeOffset: 'T+30m', minutes: 30, sbiProbability: 58, hdfcProbability: 76, iciciProbability: 80, npciUpiProbability: 71, cbsLoadPercent: 55, insight: 'Traffic normalization threshold' },
  { timeOffset: 'T+45m (Optimal Window)', minutes: 45, sbiProbability: 89, hdfcProbability: 96, iciciProbability: 98, npciUpiProbability: 95, cbsLoadPercent: 28, insight: '🎯 ML Optimal Window: Lowest CBS Latency + 89-98% Success Probability' },
  { timeOffset: 'T+60m', minutes: 60, sbiProbability: 86, hdfcProbability: 94, iciciProbability: 96, npciUpiProbability: 92, cbsLoadPercent: 32, insight: 'High stability window maintained' },
  { timeOffset: 'T+120m', minutes: 120, sbiProbability: 79, hdfcProbability: 91, iciciProbability: 93, npciUpiProbability: 88, cbsLoadPercent: 45, insight: 'Next cyclical traffic surge starting' },
  { timeOffset: 'Next Day 10:15 AM', minutes: 900, sbiProbability: 94, hdfcProbability: 98, iciciProbability: 99, npciUpiProbability: 97, cbsLoadPercent: 22, insight: '☀️ Post-Salary / Morning Liquidity Peak - Optimal for Mandates' },
];

export const SmartRetryMLOptimizer: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<'sbi' | 'hdfc' | 'icici' | 'npciUpi'>('sbi');

  const bankMeta = {
    sbi: { name: 'State Bank of India', key: 'sbiProbability', color: '#60a5fa', peakRate: 89, baseRate: 18 },
    hdfc: { name: 'HDFC Bank', key: 'hdfcProbability', color: '#34d399', peakRate: 96, baseRate: 35 },
    icici: { name: 'ICICI Bank', key: 'iciciProbability', color: '#a78bfa', peakRate: 98, baseRate: 40 },
    npciUpi: { name: 'NPCI UPI Network', key: 'npciUpiProbability', color: '#f59e0b', peakRate: 95, baseRate: 25 },
  };

  const currentBank = bankMeta[selectedBank];

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Predictive ML Smart-Retry Probability Optimizer</h3>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Bayesian Retry Curve
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mathematical Success Probability vs. Retry Delay ($\Delta t$) across Indian Core Banking Systems (CBS)
            </p>
          </div>
        </div>

        {/* Bank Selector Pills */}
        <div className="flex items-center bg-[#070b14] border border-slate-800 p-1 rounded-xl text-xs">
          {(['sbi', 'hdfc', 'icici', 'npciUpi'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBank(b)}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                selectedBank === b
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-3 rounded-xl bg-[#0f172a]/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Immediate Retry (T+0):</span>
            <span className="text-base font-bold text-rose-400">{currentBank.baseRate}% Success</span>
          </div>
          <AlertCircle className="w-5 h-5 text-rose-400/80" />
        </div>

        <div className="p-3 rounded-xl bg-[#0f172a]/70 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ML Optimal Window (T+45m):
            </span>
            <span className="text-base font-bold text-emerald-300">{currentBank.peakRate}% Success</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
            +{currentBank.peakRate - currentBank.baseRate}% Lift
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#0f172a]/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Scheduled Execution Rail:</span>
            <span className="text-xs font-bold text-blue-400">{currentBank.name} CBS Bridge</span>
          </div>
          <Building2 className="w-5 h-5 text-blue-400" />
        </div>
      </div>

      {/* Probability Curve Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={RETRY_CURVE_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentBank.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentBank.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="timeOffset" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              unit="%" 
              domain={[0, 100]}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as RetryProbabilityData;
                  return (
                    <div className="bg-[#0b141a] border border-slate-700 p-3 rounded-xl shadow-xl text-xs font-sans max-w-xs">
                      <p className="font-bold text-slate-200">{data.timeOffset}</p>
                      <p className="text-emerald-400 font-mono font-bold mt-1">
                        Recovery Success: {payload[0].value}%
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Bank Core Load: <span className="text-amber-400 font-mono">{data.cbsLoadPercent}%</span>
                      </p>
                      <p className="text-blue-300 text-[11px] mt-2 pt-1 border-t border-slate-800">
                        {data.insight}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x="T+45m (Optimal Window)" stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Optimal ML Peak (89%)', fill: '#34d399', fontSize: 10, position: 'top' }} />
            <Area
              type="monotone"
              dataKey={currentBank.key}
              stroke={currentBank.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#probGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Model Rationale Box */}
      <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-blue-300">Why naive immediate retries fail:</strong> When an Indian bank gateway drops a transaction due to high concurrency, re-trying within 5 seconds results in an 82% failure loop. RevivePay AI models CBS queue clearing latencies and automatically executes the retry at <span className="text-emerald-400 font-semibold font-mono">T+45m</span>, boosting recovery conversion from <span className="text-rose-400 font-mono">18%</span> $\rightarrow$ <span className="text-emerald-400 font-mono font-bold">89%</span>.
        </p>
      </div>
    </div>
  );
};
