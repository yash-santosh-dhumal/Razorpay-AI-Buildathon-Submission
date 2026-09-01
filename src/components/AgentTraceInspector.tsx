import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Code2, 
  ChevronDown, 
  ChevronRight, 
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  Sliders
} from 'lucide-react';
import { AgentTraceStep } from '@/types';

interface AgentTraceInspectorProps {
  traces?: AgentTraceStep[];
  txId: string;
  confidenceScore: number;
}

export const AgentTraceInspector: React.FC<AgentTraceInspectorProps> = ({
  traces = [],
  txId,
  confidenceScore,
}) => {
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(
    traces.length > 0 ? traces[0].id : null
  );

  const getAgentIcon = (agentName: AgentTraceStep['agentName']) => {
    switch (agentName) {
      case 'DiagnosticsAgent':
        return <Bot className="w-4 h-4 text-blue-400" />;
      case 'BankTelemetryAgent':
        return <Building2 className="w-4 h-4 text-indigo-400" />;
      case 'PolicyGuardAgent':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case 'DunningOrchestrator':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'SmartRoutingEngine':
        return <Zap className="w-4 h-4 text-amber-400" />;
      default:
        return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-[#0b101e] border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gradient-to-tr from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Multi-Agent Chain-of-Thought & Tool Telemetry</h3>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                LangGraph / Agentic Protocol
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Live multi-agent execution pipeline for transaction <span className="text-blue-300 font-bold">{txId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Decision Certainty: {(confidenceScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Trace Timeline Steps */}
      <div className="mt-4 space-y-3">
        {traces && traces.length > 0 ? (
          traces.map((trace, index) => {
            const isExpanded = expandedTraceId === trace.id;
            return (
              <div
                key={trace.id}
                className="bg-[#0f172a]/70 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* Step Header */}
                <div
                  onClick={() => setExpandedTraceId(isExpanded ? null : trace.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#131d35] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-slate-300 border border-slate-700">
                      {index + 1}
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                      {getAgentIcon(trace.agentName)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200 font-mono">
                          [{trace.agentName}]
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          {trace.stepTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {trace.decision}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {trace.executionTimeMs}ms
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details: Thought Process & Tool Call JSON */}
                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-slate-800/80 bg-black/20 space-y-3 text-xs">
                    {/* Inner Thought Process */}
                    <div className="mt-3 p-3 rounded-lg bg-[#070b14] border border-blue-500/20 text-slate-300">
                      <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[10px] uppercase tracking-wider mb-1.5">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Agent Reasoning & Inner Monologue</span>
                      </div>
                      <p className="leading-relaxed font-sans text-xs text-slate-300">
                        {trace.thoughtProcess}
                      </p>
                    </div>

                    {/* Tool Invocation (Function Calling) */}
                    {trace.toolCall && (
                      <div className="p-3 rounded-lg bg-[#070b14] border border-emerald-500/20 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          <span className="flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5" />
                            Tool Invocation: <span className="text-white">{trace.toolCall.toolName}()</span>
                          </span>
                          <span className="text-slate-400 font-normal">HTTP/2 Function Call</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                          <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                            <span className="text-slate-400 block mb-1 font-sans font-bold">Input Arguments:</span>
                            <pre className="text-blue-300 overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(trace.toolCall.input, null, 2)}
                            </pre>
                          </div>
                          <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                            <span className="text-slate-400 block mb-1 font-sans font-bold">Tool Output Returned:</span>
                            <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(trace.toolCall.output, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Final Decision */}
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                      <span className="font-semibold">Synthesized Action:</span>
                      <span className="font-medium text-white">{trace.decision}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No agent trace recorded for this event.
          </div>
        )}
      </div>
    </div>
  );
};
