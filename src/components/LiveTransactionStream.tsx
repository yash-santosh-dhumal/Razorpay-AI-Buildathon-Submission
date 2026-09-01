import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  RefreshCw, 
  ExternalLink,
  Bot,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Transaction } from '@/types';

interface LiveTransactionStreamProps {
  transactions: Transaction[];
  selectedTxId: string | null;
  onSelectTx: (tx: Transaction) => void;
}

export const LiveTransactionStream: React.FC<LiveTransactionStreamProps> = ({
  transactions,
  selectedTxId,
  onSelectTx,
}) => {
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Recovered
          </span>
        );
      case 'ENGAGING_CUSTOMER':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full animate-pulse">
            <MessageSquare className="w-3 h-3" /> Dunning Active
          </span>
        );
      case 'RETRY_SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Smart Retry
          </span>
        );
      case 'ANALYZING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
            <Bot className="w-3 h-3 animate-spin" /> AI Analyzing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live Recovery Pipeline</h3>
            <p className="text-xs text-slate-400">Autonomous multi-agent interventions & status stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400">Live Ingest Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
        {transactions.map((tx) => {
          const isSelected = tx.id === selectedTxId;
          return (
            <div
              key={tx.id}
              onClick={() => onSelectTx(tx)}
              className={`group cursor-pointer rounded-xl p-3 border transition-all duration-200 ${
                isSelected
                  ? 'bg-[#131d35] border-blue-500/70 shadow-md shadow-blue-500/10'
                  : 'bg-[#0f172a]/50 border-slate-800/80 hover:bg-[#111c30] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                      {tx.customer.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({tx.id})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {tx.itemDescription}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-1">{getStatusBadge(tx.status)}</div>
                </div>
              </div>

              {/* Diagnosis snippet */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[80%]">
                  <Bot className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate text-slate-400">
                    {tx.aiDiagnosis.actionTaken}
                  </span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-transform ${isSelected ? 'translate-x-1 text-blue-400' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
