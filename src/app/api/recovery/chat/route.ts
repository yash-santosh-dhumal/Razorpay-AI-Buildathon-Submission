import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/recoveryEngine';
import { callOpenRouterDunningAgent } from '@/lib/openRouterService';
import { Transaction } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      userMessage, 
      transaction, 
      geminiApiKey, 
      useLiveGemini 
    }: { 
      userMessage: string; 
      transaction: Transaction; 
      geminiApiKey?: string; 
      useLiveGemini?: boolean; 
    } = body;

    if (!userMessage || !transaction) {
      return NextResponse.json(
        { success: false, error: 'Missing userMessage or transaction' },
        { status: 400 }
      );
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const effectiveApiKey = geminiApiKey || process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    // Use live Neural LLM via OpenRouter if requested or if key is configured
    if (useLiveGemini && effectiveApiKey) {
      try {
        const neuralResult = await callOpenRouterDunningAgent(
          effectiveApiKey,
          userMessage,
          transaction,
          transaction.chatHistory || []
        );

        return NextResponse.json({
          success: true,
          modelUsed: 'openrouter/google/gemini-2.5-flash',
          message: {
            id: 'ai_resp_' + Date.now(),
            sender: 'AI_AGENT',
            text: neuralResult.text,
            timestamp: timeStr,
            options: neuralResult.options,
            actionPayload: neuralResult.actionPayload,
          },
        });
      } catch (neuralError: any) {
        console.warn('OpenRouter Live API failed, falling back to autonomous rule engine:', neuralError.message);
        // Fallback gracefully to deterministic engine
      }
    }

    // Default fast deterministic / heuristic agent
    const aiMessage = generateAIResponse(userMessage, transaction);

    return NextResponse.json({
      success: true,
      modelUsed: 'autonomous-policy-orchestrator',
      message: aiMessage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Chat error' },
      { status: 500 }
    );
  }
}
