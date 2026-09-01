'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  Bot, 
  Smartphone,
  CreditCard,
  Cpu,
  Zap,
  Terminal,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MetricsOverview } from '@/components/MetricsOverview';
import { VirtualPhoneSimulator } from '@/components/VirtualPhoneSimulator';
import { LiveTransactionStream } from '@/components/LiveTransactionStream';
import { ScenarioSimulator } from '@/components/ScenarioSimulator';
import { BankHealthAndPlaybook } from '@/components/BankHealthAndPlaybook';
import { AgentTraceInspector } from '@/components/AgentTraceInspector';
import { INITIAL_BANK_HEALTH, INITIAL_MERCHANT_RULES, INITIAL_TRANSACTIONS, SIMULATION_SCENARIOS } from '@/lib/mockData';
import { BankHealthStat, MerchantRuleConfig, RecoveryAnalytics, Transaction } from '@/types';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(INITIAL_TRANSACTIONS[0].id);
  const [bankHealth, setBankHealth] = useState<BankHealthStat[]>(INITIAL_BANK_HEALTH);
  const [rules, setRules] = useState<MerchantRuleConfig>(INITIAL_MERCHANT_RULES);
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  // Selected Transaction reference
  const selectedTx = transactions.find((t) => t.id === selectedTxId) || transactions[0] || null;

  // Calculate dynamic analytics
  const analytics: RecoveryAnalytics = {
    totalLostRevenue: transactions.reduce((acc, curr) => acc + curr.amount, 0),
    totalRecoveredRevenue: transactions
      .filter((t) => t.status === 'RECOVERED')
      .reduce((acc, curr) => acc + (curr.recoveredAmount || curr.amount), 0),
    recoverySuccessRate:
      transactions.length > 0
        ? (transactions.filter((t) => t.status === 'RECOVERED').length / transactions.length) * 100
        : 0,
    activeRecoveryCount: transactions.filter((t) => t.status === 'ENGAGING_CUSTOMER' || t.status === 'RETRY_SCHEDULED').length,
    roiMultiplier: 12.8,
    recoveredByChannel: {
      smartRetry: transactions.filter((t) => t.status === 'RECOVERED' && t.recoveryChannel === 'SMART_RETRY').length,
      whatsappAI: transactions.filter((t) => t.status === 'RECOVERED' && t.recoveryChannel === 'WHATSAPP_AI').length,
      smsAI: transactions.filter((t) => t.status === 'RECOVERED' && t.recoveryChannel === 'SMS_AI').length,
      cardLifecycle: transactions.filter((t) => t.status === 'RECOVERED' && t.recoveryChannel === 'CARD_UPDATE_FLOW').length,
    },
  };

  // Handler for customer sending a message in the phone simulator
  const handleSendMessage = async (userText: string) => {
    if (!selectedTx) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append customer message immediately
    const updatedHistory = [
      ...(selectedTx.chatHistory || []),
      {
        id: 'msg_cust_' + Date.now(),
        sender: 'CUSTOMER' as const,
        text: userText,
        timestamp: timeStr,
      },
    ];

    setTransactions((prev) =>
      prev.map((t) => (t.id === selectedTx.id ? { ...t, chatHistory: updatedHistory } : t))
    );

    setIsAiReplying(true);

    try {
      const res = await fetch('/api/recovery/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userText, transaction: selectedTx }),
      });
      const data = await res.json();

      if (data.success && data.message) {
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === selectedTx.id
              ? { ...t, chatHistory: [...(t.chatHistory || []), data.message] }
              : t
          )
        );
      }
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsAiReplying(false);
    }
  };

  // Handler for completing payment in the virtual phone
  const handlePaySuccess = (txId: string, finalAmount: number) => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'RECOVERED' as const,
              recoveredAmount: finalAmount,
              recoveredAt: new Date().toISOString(),
              chatHistory: [
                ...(t.chatHistory || []),
                {
                  id: 'msg_sys_' + Date.now(),
                  sender: 'SYSTEM' as const,
                  text: `✅ Payment of ₹${finalAmount.toLocaleString('en-IN')} successfully captured via Razorpay UPI. Subscription restored without churn!`,
                  timestamp: timeStr,
                },
              ],
            }
          : t
      )
    );
  };

  // Handler for triggering a failure simulation scenario
  const handleTriggerScenario = async (scenario: typeof SIMULATION_SCENARIOS[0]) => {
    setIsTriggering(true);
    try {
      const res = await fetch('/api/recovery/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'pay_' + Math.random().toString(36).substring(2, 9),
          merchant_name: 'Razorpay SaaS / OTT',
          customer_name: scenario.customerName,
          customer_phone: scenario.phone,
          amount: scenario.amount,
          bank: scenario.bankName,
          method: scenario.paymentMethod,
          error_code: scenario.errorCode,
          error_description: scenario.rawErrorMessage,
          description: scenario.itemDescription,
        }),
      });
      const data = await res.json();

      if (data.success && data.transaction) {
        setTransactions((prev) => [data.transaction, ...prev]);
        setSelectedTxId(data.transaction.id);
      }
    } catch (e) {
      console.error('Trigger error:', e);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050811] text-slate-100 font-sans pb-16 selection:bg-blue-600 selection:text-white">
      {/* Header & Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#050811]/85 border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-400 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#070d1e] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-300">
                  RevivePay AI
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Razorpay Buildathon Track 3
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Autonomous Multi-Agent AI Revenue Recovery & Dunning Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#0c1324] border border-slate-800 px-3 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-slate-300">Razorpay Ingest: </span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Executive Metrics */}
        <MetricsOverview analytics={analytics} />

        {/* Interactive Scenario Trigger */}
        <ScenarioSimulator
          onTriggerScenario={handleTriggerScenario}
          isTriggering={isTriggering}
        />

        {/* Primary Interactive Workspace: Live Feed + Virtual Phone Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Live Recovery Pipeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <LiveTransactionStream
              transactions={transactions}
              selectedTxId={selectedTxId}
              onSelectTx={(tx) => setSelectedTxId(tx.id)}
            />

            {/* Visual Multi-Agent Chain-of-Thought & Tool Call Inspector */}
            {selectedTx && (
              <AgentTraceInspector
                traces={selectedTx.agentTraces}
                txId={selectedTx.id}
                confidenceScore={selectedTx.aiDiagnosis.confidenceScore}
              />
            )}
          </div>

          {/* Right Column: Virtual Phone WhatsApp Simulator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-[#0d1527] to-[#070b14] border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col items-center">
              <div className="flex items-center justify-between w-full px-2 mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">Live Customer WhatsApp Simulator</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Interactive Demo</span>
              </div>

              <VirtualPhoneSimulator
                transaction={selectedTx}
                onSendMessage={handleSendMessage}
                onPaySuccess={handlePaySuccess}
                isLoading={isAiReplying}
              />
            </div>
          </div>
        </div>

        {/* Bank Rail Health & Merchant AI Playbook */}
        <BankHealthAndPlaybook
          bankHealth={bankHealth}
          rules={rules}
          onUpdateRules={(newRules) => setRules((prev) => ({ ...prev, ...newRules }))}
        />
      </div>
    </main>
  );
}
