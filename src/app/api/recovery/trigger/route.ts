import { NextRequest, NextResponse } from 'next/server';
import { diagnoseAndOrchestrate } from '@/lib/recoveryEngine';
import { Transaction } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, payload } = body;

    const payment = payload?.payment?.entity || body;

    const rawTx: Partial<Transaction> = {
      id: payment.id || 'pay_' + Math.random().toString(36).substring(2, 9),
      merchantId: payment.merchant_id || 'acc_merch_01',
      merchantName: payment.merchant_name || 'Razorpay Merchant',
      customer: payment.customer || {
        id: 'cust_' + Math.floor(Math.random() * 1000),
        name: payment.customer_name || 'Customer',
        phone: payment.customer_phone || '+91 99999 88888',
        email: payment.customer_email || 'customer@example.com',
        tier: 'STANDARD',
        churnRiskScore: 50,
        preferredChannel: 'WHATSAPP',
        lifetimeValue: payment.amount || 1000,
      },
      amount: payment.amount ? (payment.amount > 10000 && !payment.is_rupees ? payment.amount / 100 : payment.amount) : 1999,
      currency: 'INR',
      itemDescription: payment.description || 'Subscription / Order Checkout',
      paymentMethod: payment.method?.toUpperCase() || 'UPI',
      bankName: payment.bank || 'HDFC Bank',
      errorCode: payment.error_code || 'BAD_REQUEST_INSUFFICIENT_FUNDS',
      rawErrorMessage: payment.error_description || 'Transaction declined by issuer bank.',
      timestamp: new Date().toISOString(),
      retryAttempts: 1,
      maxRetryAttempts: 3,
    };

    const diagnosis = diagnoseAndOrchestrate(rawTx);

    const initialChat = diagnosis.initialMessage ? [
      {
        id: 'msg_init_1',
        sender: 'AI_AGENT' as const,
        text: diagnosis.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: diagnosis.suggestedOptions,
        actionPayload: diagnosis.actionPayload,
      }
    ] : [];

    const fullTx: Transaction = {
      ...(rawTx as Transaction),
      category: diagnosis.category,
      recoveryChannel: diagnosis.recoveryChannel,
      status: diagnosis.recoveryChannel === 'SMART_RETRY' ? 'RETRY_SCHEDULED' : 'ENGAGING_CUSTOMER',
      nextRetryAt: diagnosis.recoveryChannel === 'SMART_RETRY' ? new Date(Date.now() + 45 * 60000).toISOString() : undefined,
      aiDiagnosis: {
        rootCause: diagnosis.rootCause,
        actionTaken: diagnosis.actionTaken,
        confidenceScore: diagnosis.confidenceScore,
        recommendedPaymentRail: diagnosis.recommendedPaymentRail,
      },
      chatHistory: initialChat,
      agentTraces: diagnosis.agentTraces,
    };

    return NextResponse.json({
      success: true,
      transaction: fullTx,
      diagnosis,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing recovery trigger' },
      { status: 500 }
    );
  }
}
