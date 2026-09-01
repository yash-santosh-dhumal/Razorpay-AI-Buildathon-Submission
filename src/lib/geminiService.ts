import { GoogleGenAI } from '@google/genai';
import { Transaction, ChatMessage } from '@/types';

/**
 * Executes a live generative call with Gemini 2.5/3.7 for autonomous fintech dunning & negotiation.
 */
export async function callGeminiDunningAgent(
  apiKey: string,
  userMessage: string,
  transaction: Transaction,
  chatHistory: ChatMessage[] = []
): Promise<{ text: string; actionPayload?: ChatMessage['actionPayload']; options?: string[] }> {
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
You are Priya, a senior empathetic payment concierge at Razorpay representing "${transaction.merchantName}".
Your mission is to recover a failed transaction or payment drop gracefully while maintaining high customer loyalty.

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
1. Be warm, empathetic, and professional (Indian fintech conversational style).
2. If the user mentions price hesitation, high cost, or asks for a discount, you are authorized to offer a MAXIMUM 5% instant retention discount (Final: ₹${Math.round(transaction.amount * 0.95)}).
3. If the user prefers UPI (GPay/PhonePe/Paytm/QR), provide an instant 1-click Razorpay UPI intent link.
4. If the user asks for installments or is short on cash, offer 3x 0% interest Cardless EMI / PayLater (₹${Math.round(transaction.amount / 3)}/month).
5. If the user asks to be reminded tomorrow, confirm a 24-hour price lock with active access protection.

OUTPUT FORMAT REQUIREMENTS:
You must respond with valid JSON matching this exact structure:
{
  "text": "Your conversational reply here (concise, 1-3 sentences max).",
  "actionType": "PAYMENT_LINK" | "DISCOUNT_OFFER" | "PAYMENT_METHOD_SWITCH" | "NONE",
  "suggestedAmount": number (optional, e.g. discounted amount if discount offered),
  "discountPercent": number (optional, e.g. 5),
  "quickOptions": ["Array of 2-3 quick response pill suggestions for the user"]
}
`;

  const conversationContext = chatHistory
    .map((msg) => `${msg.sender}: ${msg.text}`)
    .join('\n');

  const prompt = `
PAST CHAT:
${conversationContext}

LATEST CUSTOMER MESSAGE:
"${userMessage}"

Generate the JSON response following the guidelines.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text?.trim() || '{}';
    const parsed = JSON.parse(rawText);

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
    console.error('Gemini API execution error:', error);
    throw error;
  }
}
