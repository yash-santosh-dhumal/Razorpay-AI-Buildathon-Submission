import React from 'react';
import { 
  Play, 
  Sparkles, 
  ServerCrash, 
  CreditCard, 
  UserMinus, 
  SmartphoneNfc,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { SIMULATION_SCENARIOS } from '@/lib/mockData';

interface ScenarioSimulatorProps {
  onTriggerScenario: (scenario: typeof SIMULATION_SCENARIOS[0]) => void;
  isTriggering?: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  onTriggerScenario,
  isTriggering = false,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'BANK_DOWNTIME':
        return <ServerCrash className="w-5 h-5 text-red-400" />;
      case 'INSUFFICIENT_FUNDS':
        return <CreditCard className="w-5 h-5 text-amber-400" />;
      case 'USER_ABANDONED':
        return <UserMinus className="w-5 h-5 text-purple-400" />;
      case 'UPI_APP_TIMEOUT':
        return <SmartphoneNfc className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live AI Failure Recovery Sandbox</h3>
            <p className="text-xs text-slate-400">Trigger real-world Razorpay transaction failure events to test agent responses</p>
          </div>
        </div>
        <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono border border-slate-700">
          Interactive Demo Hub
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SIMULATION_SCENARIOS.map((scenario) => (
          <div
            key={scenario.id}
            className="group relative bg-[#0f172a]/70 hover:bg-[#131d35] border border-slate-800 hover:border-blue-500/50 rounded-xl p-3.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    {getIcon(scenario.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                      {scenario.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {scenario.customerName} • ₹{scenario.amount.toLocaleString('en-IN')} • {scenario.bankName}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed line-clamp-2 bg-black/20 p-2 rounded-lg border border-slate-800/50">
                <span className="text-blue-400 font-semibold">AI Strategy: </span>
                {scenario.explanation}
              </p>
            </div>

            <button
              onClick={() => onTriggerScenario(scenario)}
              disabled={isTriggering}
              className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-blue-600/20 hover:from-blue-600 to-indigo-600/20 hover:to-indigo-600 border border-blue-500/30 hover:border-blue-500 text-blue-300 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Webhook & Launch AI</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
