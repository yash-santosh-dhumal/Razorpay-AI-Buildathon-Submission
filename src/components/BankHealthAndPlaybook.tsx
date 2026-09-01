import React from 'react';
import { 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  BarChart3,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { BankHealthStat, MerchantRuleConfig } from '@/types';

interface BankHealthAndPlaybookProps {
  bankHealth: BankHealthStat[];
  rules: MerchantRuleConfig;
  onUpdateRules: (newRules: Partial<MerchantRuleConfig>) => void;
}

export const BankHealthAndPlaybook: React.FC<BankHealthAndPlaybookProps> = ({
  bankHealth,
  rules,
  onUpdateRules,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Real-time Bank Rail Health Monitor */}
      <div className="bg-[#0b101e] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Issuer Bank Rail Health</h3>
                <p className="text-xs text-slate-400">Live gateway success telemetry used by Smart Routing AI</p>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono">
              6 Rails Monitored
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {bankHealth.map((bank) => (
              <div
                key={bank.bankCode}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f172a]/60 border border-slate-800/80"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200 font-mono">
                    {bank.bankCode.substring(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">{bank.bankName}</span>
                      {bank.status === 'HEALTHY' && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-medium">
                          <CheckCircle className="w-2.5 h-2.5" /> Healthy
                        </span>
                      )}
                      {bank.status === 'DEGRADED' && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-medium animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5" /> Degraded
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Latency: {bank.latencyMs}ms {bank.activeAlert && `• ${bank.activeAlert}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold ${bank.successRate > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {bank.successRate}%
                  </span>
                  <div className="w-16 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bank.successRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${bank.successRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Autonomous Recovery Playbook Configuration */}
      <div className="bg-[#0b101e] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Merchant AI Playbook Rules</h3>
                <p className="text-xs text-slate-400">Control thresholds, discount margins & dunning aggressiveness</p>
              </div>
            </div>
            <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
              Autonomous Policy
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {/* Auto Smart-Retry */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a]/60 border border-slate-800">
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Auto-Retry Technical & Gateway Downtimes</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Silently retry bank failures during low-load windows without customer friction</p>
              </div>
              <input
                type="checkbox"
                checked={rules.autoRetryTechnicalFailures}
                onChange={(e) => onUpdateRules({ autoRetryTechnicalFailures: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Max Discount Threshold */}
            <div className="p-3 rounded-xl bg-[#0f172a]/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Max Autonomous Retention Discount</h4>
                  <p className="text-[10px] text-slate-400">Agent can negotiate up to this margin to salvage checkout drops</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                  {rules.maxDiscountAllowedPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={rules.maxDiscountAllowedPercent}
                onChange={(e) => onUpdateRules({ maxDiscountAllowedPercent: Number(e.target.value) })}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* AI Tone Selection */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a]/60 border border-slate-800">
              <div>
                <h4 className="text-xs font-semibold text-slate-200">AI Concierge Tone</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Personality style for WhatsApp/SMS engagement</p>
              </div>
              <select
                value={rules.aiTone}
                onChange={(e) => onUpdateRules({ aiTone: e.target.value as any })}
                className="bg-[#1e293b] text-xs text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 outline-none focus:border-purple-500"
              >
                <option value="EMPATHETIC_CONCIERGE">Empathetic Concierge (Recommended)</option>
                <option value="PROFESSIONAL">Professional Corporate</option>
                <option value="URGENT_DIRECT">Direct & Urgent</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
