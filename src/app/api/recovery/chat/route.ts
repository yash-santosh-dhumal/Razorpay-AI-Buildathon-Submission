import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/recoveryEngine';
import { Transaction } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMessage, transaction }: { userMessage: string; transaction: Transaction } = body;

    if (!userMessage || !transaction) {
      return NextResponse.json(
        { success: false, error: 'Missing userMessage or transaction' },
        { status: 400 }
      );
    }

    const aiMessage = generateAIResponse(userMessage, transaction);

    return NextResponse.json({
      success: true,
      message: aiMessage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Chat error' },
      { status: 500 }
    );
  }
}
