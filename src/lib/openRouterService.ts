import { Transaction, ChatMessage } from '@/types';

/**
 * Executes a live generative call via OpenRouter (using Gemini 2.5 Flash / Claude / Llama 3)
 * for autonomous fintech dunning, policy guardrails, and dynamic negotiation.
 */
export async function callOpenRouterDunningAgent(
  apiKey: string,
  userMessage: string,
  transaction: Transaction,
  chatHistory: ChatMessage[] = []
): Promise<{ text: string; actionPayload?: ChatMessage['actionPayload']; options?: string[] }> {
  const systemInstruction = `You are Priya, a senior empathetic payment recovery concierge at Razorpay representing "${transaction.merchantName}".
Your mission is to recover a failed transaction or checkout drop gracefully while maintaining high customer loyalty.

TRANSACTION CONTEXT:
- Customer Name: ${transaction.customer.name}
- Customer Tier: ${transaction.customer.tier} (LTV: ₹${transaction.customer.lifetimeValue.toLocaleString('en-IN')})
- Invoice Amount: ₹${transaction.amount.toLocaleString('en-IN')}
- Item: ${transaction.itemDescription}
- Bank: ${transaction.bankName}
- Payment Method: ${transaction.paymentMethod}
- Failure Reason: ${transaction.rawErrorMessage}
- Root Cause Diagnosis: ${transaction.aiDiagnosis.rootCause}

GOVERNANCE RULES & MERCHANT POLICY:
1. Be warm, empathetic, and concise (Indian fintech conversational style).
2. If the customer mentions high price or asks for a discount, you are authorized to offer a MAXIMUM 5% instant retention discount (Final: ₹${Math.round(transaction.amount * 0.95)}).
3. If the customer prefers UPI (GPay/PhonePe/Paytm/QR), provide an instant 1-click Razorpay UPI intent link.
4. If the customer asks for installments or is short on cash, offer 3x 0% interest Cardless EMI / PayLater (₹${Math.round(transaction.amount / 3)}/month).
5. If the customer asks to be reminded tomorrow, confirm a 24-hour price lock with active access protection.

OUTPUT FORMAT INSTRUCTIONS:
You MUST respond with valid raw JSON only, matching this exact structure:
{
  "text": "Your conversational reply here (concise, 1-3 sentences max).",
  "actionType": "PAYMENT_LINK" | "DISCOUNT_OFFER" | "PAYMENT_METHOD_SWITCH" | "NONE",
  "suggestedAmount": number,
  "discountPercent": number,
  "quickOptions": ["Array of 2-3 quick response pill suggestions for the user"]
}`;

  const conversationContext = chatHistory
    .map((msg) => `${msg.sender}: ${msg.text}`)
    .join('\n');

  const prompt = `PAST CHAT HISTORY:
${conversationContext}

LATEST CUSTOMER MESSAGE:
"${userMessage}"

Respond with the required JSON object:`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'https://razorpay-ai-buildathon.local',
        'X-Title': 'RevivePay AI - Razorpay Buildathon',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    let rawContent = data.choices?.[0]?.message?.content || '{}';

    // Strip markdown code fences if present
    rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(rawContent);

    let actionPayload: ChatMessage['actionPayload'] | undefined = undefined;

    if (parsed.actionType === 'DISCOUNT_OFFER' || parsed.discountPercent) {
      actionPayload = {
        type: 'DISCOUNT_OFFER',
        url: `https://rzp.io/l/loyalty-${transaction.id}`,
        amount: parsed.suggestedAmount || Math.round(transaction.amount * 0.95),
        discountPercent: parsed.discountPercent || 5,
      };
    } else if (parsed.actionType === 'PAYMENT_LINK' || parsed.actionType === 'PAYMENT_METHOD_SWITCH') {
      actionPayload = {
        type: 'PAYMENT_LINK',
        url: `https://rzp.io/l/secure-pay-${transaction.id}`,
        amount: parsed.suggestedAmount || transaction.amount,
      };
    }

    return {
      text: parsed.text || 'I understand! Tap below to complete checkout securely in 1-click:',
      actionPayload,
      options: parsed.quickOptions || ['Pay via UPI', 'Other Options'],
    };
  } catch (error: any) {
    console.error('OpenRouter execution error:', error);
    throw error;
  }
}
