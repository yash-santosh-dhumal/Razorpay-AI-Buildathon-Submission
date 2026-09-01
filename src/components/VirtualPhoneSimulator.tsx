import React, { useState } from 'react';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CreditCard, 
  ShieldAlert, 
  RefreshCw,
  Zap,
  Tag
} from 'lucide-react';
import { Transaction, ChatMessage } from '@/types';

interface VirtualPhoneSimulatorProps {
  transaction: Transaction | null;
  onSendMessage: (msg: string) => void;
  onPaySuccess: (txId: string, finalAmount: number) => void;
  isLoading?: boolean;
}

export const VirtualPhoneSimulator: React.FC<VirtualPhoneSimulatorProps> = ({
  transaction,
  onSendMessage,
  onPaySuccess,
  isLoading = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400 bg-[#0a0f1d]/60 rounded-3xl border border-slate-800/80">
        <Smartphone className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
        <h4 className="text-base font-semibold text-slate-200">Interactive Customer Simulator</h4>
        <p className="text-xs text-slate-400 mt-2 max-w-xs">
          Select any live transaction or trigger a failure scenario to preview real-time AI WhatsApp recovery on this phone.
        </p>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleOptionClick = (option: string) => {
    onSendMessage(option);
  };

  const handleExecutePayment = (amount: number) => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      onPaySuccess(transaction.id, amount);
    }, 1200);
  };

  const isRecovered = transaction.status === 'RECOVERED';

  return (
    <div className="relative mx-auto w-full max-w-[360px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col h-[700px] overflow-hidden">
      {/* Phone Notch & Speaker */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full flex items-center justify-center z-30">
        <div className="w-3 h-3 rounded-full bg-slate-800 mr-2"></div>
        <div className="w-10 h-1.5 bg-slate-800 rounded-full"></div>
      </div>

      {/* Screen Container */}
      <div className="relative flex-1 bg-[#0b141a] rounded-[38px] flex flex-col overflow-hidden pt-6">
        {/* WhatsApp Header */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-[#2a3942] z-20">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                RP
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1f2c34]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100">{transaction.merchantName}</span>
                <span className="inline-flex items-center text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-medium">
                  Verified AI
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">Autonomous Recovery Concierge</p>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {transaction.customer.tier} Tier
          </div>
        </div>

        {/* Failure Context Ribbon */}
        <div className="bg-[#182229] px-3 py-1.5 text-[10px] text-slate-400 flex items-center justify-between border-b border-[#222e35]">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Declined: {transaction.paymentMethod}
          </span>
          <span className="text-amber-400 font-mono font-semibold">₹{transaction.amount.toLocaleString('en-IN')}</span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {transaction.chatHistory && transaction.chatHistory.length > 0 ? (
            transaction.chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                    msg.sender === 'CUSTOMER'
                      ? 'bg-[#005c4b] text-white rounded-tr-none'
                      : msg.sender === 'SYSTEM'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl w-full text-center'
                      : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-[#2d3a43]'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Payment Card Attachment if present */}
                  {msg.actionPayload && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#111b21] border border-blue-500/30 text-left">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                          {msg.actionPayload.type === 'DISCOUNT_OFFER' ? 'Exclusive Recovery Link' : 'Razorpay Express Checkout'}
                        </span>
                        {msg.actionPayload.discountPercent && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                            {msg.actionPayload.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-400">Total Payable:</span>
                        <span className="text-sm font-bold text-white font-mono">
                          ₹{(msg.actionPayload.amount || transaction.amount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {!isRecovered ? (
                        <button
                          onClick={() => handleExecutePayment(msg.actionPayload?.amount || transaction.amount)}
                          disabled={isPaying}
                          className="mt-2.5 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        >
                          {isPaying ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Processing via UPI...</span>
                            </>
                          ) : (
                            <>
                              <span>Pay ₹{(msg.actionPayload.amount || transaction.amount).toLocaleString('en-IN')} in 1-Click</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="mt-2 text-[11px] font-semibold text-emerald-400 flex items-center justify-center gap-1 py-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid & Subscription Recovered</span>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Suggested Quick Options */}
                {msg.options && !isRecovered && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="text-[10px] font-medium bg-[#1f2c34] hover:bg-[#2a3942] text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full shadow transition-all active:scale-95 text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-xs text-slate-500 py-10">
              No chat messages. Recovery action: {transaction.recoveryChannel}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 bg-[#202c33] text-slate-300 p-2.5 rounded-2xl rounded-tl-none max-w-[60%] border border-[#2d3a43]">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] text-slate-400 ml-1">AI replying...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-[#1f2c34] p-2 flex items-center gap-2 border-t border-[#2a3942]">
          <input
            type="text"
            placeholder={isRecovered ? "Payment resolved ✅" : "Type a response or objection..."}
            disabled={isRecovered}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#2a3942] text-xs text-slate-100 placeholder-slate-400 px-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isRecovered}
            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white flex items-center justify-center transition-all shadow"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
