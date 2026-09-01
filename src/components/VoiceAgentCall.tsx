import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { Transaction } from '@/types';

interface VoiceAgentCallProps {
  transaction: Transaction;
  onPaySuccess: (txId: string, finalAmount: number) => void;
}

export const VoiceAgentCall: React.FC<VoiceAgentCallProps> = ({
  transaction,
  onPaySuccess,
}) => {
  const [callState, setCallState] = useState<'RINGING' | 'CONNECTED' | 'ENDED'>('RINGING');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [audioWaves, setAudioWaves] = useState<number[]>([40, 65, 80, 50, 90, 70, 30, 85, 60, 45]);

  const customerFirstName = transaction.customer.name.split(' ')[0] || 'there';
  const amountStr = `₹${transaction.amount.toLocaleString('en-IN')}`;

  const speechScript = [
    {
      speaker: 'AI_AGENT',
      text: `Hello ${customerFirstName}! This is Priya from ${transaction.merchantName} Priority Care.`,
      duration: 3500
    },
    {
      speaker: 'AI_AGENT',
      text: `I noticed your renewal of ${amountStr} for ${transaction.itemDescription} couldn't be processed today due to an issuer bank timeout.`,
      duration: 4500
    },
    {
      speaker: 'AI_AGENT',
      text: `To ensure your service is not interrupted, we've extended a complimentary 48-hour grace period and sent a secure 1-click UPI authorization link directly to your screen.`,
      duration: 5000
    },
    {
      speaker: 'AI_AGENT',
      text: `Would you like to complete this now via UPI to lock in your subscription?`,
      duration: 4000
    }
  ];

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'CONNECTED') {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Audio wave animation
  useEffect(() => {
    let waveInterval: NodeJS.Timeout;
    if (callState === 'CONNECTED' && isSpeaking) {
      waveInterval = setInterval(() => {
        setAudioWaves([
          Math.floor(Math.random() * 60) + 30,
          Math.floor(Math.random() * 70) + 25,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 90) + 10,
          Math.floor(Math.random() * 75) + 25,
          Math.floor(Math.random() * 85) + 15,
          Math.floor(Math.random() * 65) + 30,
        ]);
      }, 180);
    }
    return () => clearInterval(waveInterval);
  }, [callState, isSpeaking]);

  // Progress speech script
  useEffect(() => {
    let scriptTimer: NodeJS.Timeout;
    if (callState === 'CONNECTED' && currentSpeechIndex < speechScript.length) {
      setIsSpeaking(true);
      scriptTimer = setTimeout(() => {
        if (currentSpeechIndex < speechScript.length - 1) {
          setCurrentSpeechIndex((prev) => prev + 1);
        } else {
          setIsSpeaking(false);
        }
      }, speechScript[currentSpeechIndex].duration);
    }
    return () => clearTimeout(scriptTimer);
  }, [callState, currentSpeechIndex]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = () => {
    setCallState('CONNECTED');
    setSeconds(0);
    setCurrentSpeechIndex(0);
  };

  const handleEndCall = () => {
    setCallState('ENDED');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a1128] via-[#050814] to-black p-4 text-slate-100 justify-between">
      {/* Caller Info */}
      <div className="text-center pt-4">
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-1 shadow-2xl mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-[#070b1a] rounded-full flex items-center justify-center">
              <Bot className="w-9 h-9 text-blue-400" />
            </div>
          </div>
          {callState === 'CONNECTED' && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050814] animate-pulse" />
          )}
        </div>

        <h3 className="text-base font-bold text-white tracking-wide">
          {transaction.merchantName}
        </h3>
        <p className="text-xs text-blue-400 font-mono mt-0.5">
          RevivePay Autonomous AI Voice Agent
        </p>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          {callState === 'RINGING' && 'Incoming Priority Dunning Call...'}
          {callState === 'CONNECTED' && formatTime(seconds)}
          {callState === 'ENDED' && 'Call Completed'}
        </p>
      </div>

      {/* Dynamic Audio Waveform & Real-time Transcription */}
      {callState === 'CONNECTED' && (
        <div className="my-auto space-y-4">
          {/* Audio Wave Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-14 px-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            {audioWaves.map((height, idx) => (
              <div
                key={idx}
                className="w-1.5 bg-gradient-to-t from-blue-600 to-teal-400 rounded-full transition-all duration-150"
                style={{ height: isSpeaking ? `${height}%` : '15%' }}
              />
            ))}
          </div>

          {/* Live Transcript Box */}
          <div className="p-3.5 rounded-2xl bg-[#0f172a]/90 border border-blue-500/30 shadow-lg text-left">
            <div className="flex items-center justify-between text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-emerald-400" />
                Live Speech Synthesis
              </span>
              <span className="text-slate-400 font-mono font-normal">ElevenLabs / Gemini TTS</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "{speechScript[currentSpeechIndex]?.text}"
            </p>

            {/* Instant In-Call Payment Action Card */}
            {currentSpeechIndex >= 2 && transaction.status !== 'RECOVERED' && (
              <div className="mt-3 pt-2.5 border-t border-slate-800">
                <button
                  onClick={() => onPaySuccess(transaction.id, transaction.amount)}
                  className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize 1-Click UPI Payment ({amountStr})</span>
                </button>
              </div>
            )}

            {transaction.status === 'RECOVERED' && (
              <div className="mt-2 text-center text-xs font-bold text-emerald-400 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                ✅ Payment Captured & Subscription Restored!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call State: Ringing Screen */}
      {callState === 'RINGING' && (
        <div className="my-auto text-center p-4 bg-slate-900/30 rounded-2xl border border-slate-800 space-y-2">
          <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
          <p className="text-xs font-semibold text-slate-200">
            Failed Mandate Recovery Intervention
          </p>
          <p className="text-[11px] text-slate-400">
            AI Voice Agent will explain the failure reason, extend 48h grace protection, and offer direct UPI settlement.
          </p>
        </div>
      )}

      {/* Call State: Ended Screen */}
      {callState === 'ENDED' && (
        <div className="my-auto text-center p-4 bg-slate-900/30 rounded-2xl border border-slate-800 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-xs font-semibold text-slate-200">
            Dunning Call Concluded
          </p>
          <button
            onClick={handleAcceptCall}
            className="mt-2 text-xs text-blue-400 underline font-medium"
          >
            Replay AI Voice Call
          </button>
        </div>
      )}

      {/* Call Controls Toolbar */}
      <div className="pb-4">
        {callState === 'RINGING' ? (
          <div className="flex items-center justify-around">
            <button
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <button
              onClick={handleAcceptCall}
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 active:scale-95 transition-all animate-pulse"
            >
              <PhoneCall className="w-6 h-6" />
            </button>
          </div>
        ) : callState === 'CONNECTED' ? (
          <div className="flex items-center justify-around bg-slate-900/60 p-3 rounded-3xl border border-slate-800">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-all ${
                isMuted ? 'bg-rose-600/20 text-rose-400' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleEndCall}
              className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
