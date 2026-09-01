import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/recoveryEngine';
import { callGeminiDunningAgent } from '@/lib/geminiService';
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
    const effectiveApiKey = geminiApiKey || process.env.GEMINI_API_KEY;

    // Use live Gemini LLM if requested and an API key is available
    if (useLiveGemini && effectiveApiKey) {
      try {
        const geminiResult = await callGeminiDunningAgent(
          effectiveApiKey,
          userMessage,
          transaction,
          transaction.chatHistory || []
        );

        return NextResponse.json({
          success: true,
          modelUsed: 'gemini-2.5-flash',
          message: {
            id: 'ai_resp_' + Date.now(),
            sender: 'AI_AGENT',
            text: geminiResult.text,
            timestamp: timeStr,
            options: geminiResult.options,
            actionPayload: geminiResult.actionPayload,
          },
        });
      } catch (geminiError: any) {
        console.warn('Gemini Live API failed, falling back to autonomous rule engine:', geminiError.message);
        // Seamless fallback to deterministic engine
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
