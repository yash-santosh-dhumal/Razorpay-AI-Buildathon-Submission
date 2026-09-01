import { AgentTraceStep, FailureCategory, PaymentMethod, RecoveryChannel, Transaction, ChatMessage } from '@/types';

export interface DiagnosisResult {
  rootCause: string;
  actionTaken: string;
  confidenceScore: number;
  category: FailureCategory;
  recoveryChannel: RecoveryChannel;
  recommendedPaymentRail?: PaymentMethod;
  initialMessage?: string;
  suggestedOptions?: string[];
  actionPayload?: ChatMessage['actionPayload'];
  agentTraces: AgentTraceStep[];
}

/**
 * RevivePay Multi-Agent Diagnostic Engine
 * Generates transparent Chain-of-Thought agent traces and tool invocations.
 */
export function diagnoseAndOrchestrate(
  tx: Partial<Transaction>,
  customPrompt?: string
): DiagnosisResult {
  const errorCode = tx.errorCode || '';
  const errorMsg = tx.rawErrorMessage || '';
  const amount = tx.amount || 0;
  const customerName = tx.customer?.name || 'Valued Customer';
  const customerTier = tx.customer?.tier || 'STANDARD';
  const ltv = tx.customer?.lifetimeValue || 15000;
  const bank = tx.bankName || 'HDFC Bank';
  const paymentMethod = tx.paymentMethod || 'UPI';

  const traces: AgentTraceStep[] = [];
  const now = new Date();

  // STEP 1: DiagnosticsAgent
  traces.push({
    id: 'trace_diag_' + Date.now(),
    agentName: 'DiagnosticsAgent',
    timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    stepTitle: 'Error Payload & Root Cause Decomposition',
    thoughtProcess: `Inspected transaction ${tx.id || 'new'}. Raw error code '${errorCode}' with message '${errorMsg}'. Analyzing whether failure is transient technical vs. user intent vs. liquidity drop.`,
    toolCall: {
      toolName: 'razorpay_error_classifier_v3',
      input: { errorCode, rawErrorMessage: errorMsg, paymentMethod },
      output: {
        classification: errorCode.includes('TIMEOUT') ? 'TRANSIENT_GATEWAY_OUTAGE' : errorCode.includes('INSUFFICIENT') ? 'LIQUIDITY_LIMIT' : 'USER_FRICTION',
        confidence: 0.96,
        isRetriable: !errorCode.includes('CARD_EXPIRED')
      }
    },
    decision: `Classified as ${errorCode.includes('TIMEOUT') ? 'Bank Gateway Downtime' : errorCode.includes('INSUFFICIENT') ? 'Insufficient Balance / Mandate Timing' : 'Cart Abandonment'} with 96% model certainty.`,
    status: 'COMPLETED',
    executionTimeMs: 142
  });

  // STEP 2: BankTelemetryAgent
  traces.push({
    id: 'trace_bank_' + Date.now(),
    agentName: 'BankTelemetryAgent',
    timestamp: new Date(Date.now() + 150).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    stepTitle: 'Live Issuer Rail Health & Latency Telemetry Probe',
    thoughtProcess: `Querying NPCI UPI / ${bank} CBS health. Detecting current success rate and median latency on ${paymentMethod} rail.`,
    toolCall: {
      toolName: 'bank_rail_health_check',
      input: { bankName: bank, rail: paymentMethod },
      output: {
        successRate: bank === 'SBI' ? 84.1 : 98.4,
        latencyMs: bank === 'SBI' ? 1450 : 320,
        status: bank === 'SBI' ? 'DEGRADED' : 'HEALTHY'
      }
    },
    decision: bank === 'SBI' 
      ? 'SBI CBS core is currently degraded. Synchronous retries blocked to avoid customer penalty. Recommending deferred off-peak scheduling or fallback rail.'
      : `${bank} rail is healthy. Issue is isolated to client authentication/balance. Routing to Agentic Concierge.`,
    status: 'COMPLETED',
    executionTimeMs: 118
  });

  // STEP 3: PolicyGuardAgent
  const maxDiscountAllowed = customerTier === 'VIP' || customerTier === 'ENTERPRISE' ? 10 : 5;
  const isHighValue = amount > 2500 || ltv > 10000;

  traces.push({
    id: 'trace_guard_' + Date.now(),
    agentName: 'PolicyGuardAgent',
    timestamp: new Date(Date.now() + 280).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    stepTitle: 'Merchant Governance & LTV Risk Evaluation',
    thoughtProcess: `Evaluating merchant risk boundaries. Customer tier: ${customerTier}, LTV: ₹${ltv.toLocaleString('en-IN')}, Amount: ₹${amount.toLocaleString('en-IN')}. Checking authorized discount and grace period policy.`,
    toolCall: {
      toolName: 'merchant_guardrail_evaluator',
      input: { customerTier, ltv, invoiceAmount: amount, maxMerchantDiscountCap: 5 },
      output: {
        eligibleForGracePeriod: true,
        gracePeriodDurationHours: 48,
        authorizedDiscountPercent: isHighValue ? 5 : 0,
        enableWhatsAppDunning: true
      }
    },
    decision: `Approved 48-Hour complimentary grace period to prevent immediate churn + Authorized 5% retention discount headroom if needed.`,
    status: 'COMPLETED',
    executionTimeMs: 89
  });

  // 1. Technical / Gateway Outage
  if (
    errorCode.includes('GATEWAY_TIMEOUT') ||
    errorCode.includes('BANK_UNRESPONSIVE') ||
    errorCode.includes('500') ||
    errorCode.includes('502') ||
    errorCode.includes('504')
  ) {
    traces.push({
      id: 'trace_route_' + Date.now(),
      agentName: 'SmartRoutingEngine',
      timestamp: new Date(Date.now() + 380).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stepTitle: 'Zero-Friction Smart Retry Optimization',
      thoughtProcess: `Calculating optimal mathematical retry window for ${bank}. Expected CBS recovery at T+45 mins.`,
      toolCall: {
        toolName: 'schedule_predictive_retry',
        input: { targetTimeDeltaMinutes: 45, fallbackRail: 'UPI_INTENT' },
        output: { scheduledAt: new Date(Date.now() + 45 * 60000).toISOString(), priority: 'HIGH' }
      },
      decision: `Scheduled autonomous background retry for T+45m. Zero merchant manual work required.`,
      status: 'COMPLETED',
      executionTimeMs: 64
    });

    return {
      category: 'BANK_DOWNTIME',
      recoveryChannel: 'SMART_RETRY',
      confidenceScore: 0.98,
      rootCause: `Transient gateway timeout detected with ${bank}. Customer funds are unaffected.`,
      actionTaken: `Automated zero-friction Smart Retry scheduled at optimal network load window (T+45m) with automatic fallback rail switch.`,
      recommendedPaymentRail: paymentMethod === 'UPI' ? 'CREDIT_CARD' : 'UPI',
      agentTraces: traces
    };
  }

  // 2. Insufficient Funds / Salary Account Mandate Failure
  if (
    errorCode.includes('INSUFFICIENT_FUNDS') ||
    errorCode.includes('LOW_BALANCE') ||
    errorMsg.toLowerCase().includes('insufficient')
  ) {
    traces.push({
      id: 'trace_dunn_' + Date.now(),
      agentName: 'DunningOrchestrator',
      timestamp: new Date(Date.now() + 380).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stepTitle: 'Agentic WhatsApp Dunning Payload Synthesis',
      thoughtProcess: `Constructing conversational WhatsApp hook. Combining empathetic tone, 48-hour grace reassurance, and dynamic 1-click Razorpay UPI link.`,
      toolCall: {
        toolName: 'generate_razorpay_smart_link',
        input: { amount, customerId: tx.customer?.id, expiryMinutes: 2880 },
        output: { linkUrl: `https://rzp.io/l/revive-${tx.id || 'new'}`, expiresAt: '48h' }
      },
      decision: `Dispatched interactive WhatsApp concierge with 1-click UPI autopay link.`,
      status: 'COMPLETED',
      executionTimeMs: 104
    });

    return {
      category: 'INSUFFICIENT_FUNDS',
      recoveryChannel: 'WHATSAPP_AI',
      confidenceScore: 0.95,
      rootCause: `Account balance below required invoice amount (₹${amount.toLocaleString('en-IN')}) during scheduled auto-debit. High probability of recovery via multi-channel grace period.`,
      actionTaken: `Activated AI WhatsApp Concierge. Offered 48-hour service grace protection + 1-click Razorpay UPI link.`,
      recommendedPaymentRail: 'UPI',
      initialMessage: `Hi ${customerName.split(' ')[0]}! 👋 We noticed your subscription renewal for ₹${amount.toLocaleString('en-IN')} couldn't be processed today due to an account limit.\n\n✨ Good news: We've enabled a 48-hour complimentary grace period so your access remains uninterrupted! Would you like to quickly renew via UPI or an alternative card?`,
      suggestedOptions: [`Pay via UPI (₹${amount.toLocaleString('en-IN')})`, 'Switch to Split / Monthly Plan', 'Remind me tomorrow'],
      actionPayload: {
        type: 'PAYMENT_LINK',
        url: `https://rzp.io/l/revive-${tx.id || 'new'}`,
        amount: amount,
      },
      agentTraces: traces
    };
  }

  // 3. User Abandoned / Price Resistance / Cart Drop
  if (
    errorCode.includes('USER_ABANDONED') ||
    errorCode.includes('PRICE_DROP') ||
    errorMsg.toLowerCase().includes('abandoned') ||
    errorMsg.toLowerCase().includes('exited')
  ) {
    const discount = amount > 2000 ? 5 : 0;
    const finalAmount = Math.round(amount * (1 - discount / 100));

    traces.push({
      id: 'trace_dunn_' + Date.now(),
      agentName: 'DunningOrchestrator',
      timestamp: new Date(Date.now() + 380).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stepTitle: 'Dynamic Cart Retention & Incentive Injector',
      thoughtProcess: `Analyzing hesitation pattern. User viewed checkout page for 45s before exiting. Injecting authorized 5% loyalty coupon.`,
      toolCall: {
        toolName: 'generate_dynamic_loyalty_coupon',
        input: { baseAmount: amount, discountPercent: discount },
        output: { finalAmount, couponCode: 'RECOVER5' }
      },
      decision: `Generated 5% discount incentive (₹${finalAmount.toLocaleString('en-IN')}) to close checkout drop.`,
      status: 'COMPLETED',
      executionTimeMs: 95
    });

    return {
      category: 'USER_ABANDONED',
      recoveryChannel: 'WHATSAPP_AI',
      confidenceScore: 0.92,
      rootCause: `Customer dropped off at final payment step. High probability of checkout hesitation or pricing friction.`,
      actionTaken: discount > 0 
        ? `Engaged AI Concierge with an authorized ${discount}% instant checkout retention discount.`
        : `Engaged AI Concierge with express 1-click UPI checkout link.`,
      recommendedPaymentRail: 'UPI',
      initialMessage: `Hey ${customerName.split(' ')[0]}! 😊 We noticed you left items in your cart. Was there any issue with the payment page?\n\n${discount > 0 ? `🎁 As a gesture, I've unlocked an exclusive ${discount}% instant discount for you (Final: ₹${finalAmount.toLocaleString('en-IN')})!` : 'Tap below to complete in 1-click via Razorpay UPI:'}`,
      suggestedOptions: [
        discount > 0 ? `Pay with ${discount}% off (₹${finalAmount.toLocaleString('en-IN')})` : `Complete Payment (₹${amount.toLocaleString('en-IN')})`,
        'Need EMI / PayLater option',
        'Have a product question'
      ],
      actionPayload: {
        type: discount > 0 ? 'DISCOUNT_OFFER' : 'PAYMENT_LINK',
        url: `https://rzp.io/l/revive-cart-${tx.id || 'new'}`,
        amount: finalAmount,
        discountPercent: discount,
      },
      agentTraces: traces
    };
  }

  // 4. Tokenized Card Expired
  traces.push({
    id: 'trace_card_' + Date.now(),
    agentName: 'SmartRoutingEngine',
    timestamp: new Date(Date.now() + 380).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    stepTitle: 'Mandate Token Migration Pipeline',
    thoughtProcess: `Detected expired card token. Token migration requires customer authentication. Deploying self-service mandate migration widget.`,
    toolCall: {
      toolName: 'generate_token_migration_session',
      input: { customerId: tx.customer?.id, preferredRail: 'UPI_AUTOPAY' },
      output: { sessionUrl: `https://rzp.io/l/update-mandate-${tx.id || 'new'}` }
    },
    decision: `Dispatched self-service mandate token update link via WhatsApp.`,
    status: 'COMPLETED',
    executionTimeMs: 78
  });

  return {
    category: 'CARD_EXPIRED',
    recoveryChannel: 'CARD_UPDATE_FLOW',
    confidenceScore: 0.96,
    rootCause: `Card token expired on issuer registry. Mandate renewal failed validation.`,
    actionTaken: `Sent secure self-service Card & UPI Autopay migration flow via WhatsApp.`,
    recommendedPaymentRail: 'UPI',
    initialMessage: `Hi ${customerName.split(' ')[0]}, your registered payment card has expired. To keep your plan active, please update your payment method or switch to seamless UPI Autopay.`,
    suggestedOptions: ['Update Card Details', 'Switch to UPI Autopay (Recommended)'],
    actionPayload: {
      type: 'PAYMENT_METHOD_SWITCH',
      url: `https://rzp.io/l/update-mandate-${tx.id || 'new'}`,
      targetMethod: 'UPI',
    },
    agentTraces: traces
  };
}

/**
 * Simulates intelligent AI dynamic conversation responses
 */
export function generateAIResponse(
  userMessage: string,
  tx: Transaction
): ChatMessage {
  const lower = userMessage.toLowerCase();
  const amount = tx.amount;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Objections on price / discount request
  if (
    lower.includes('discount') ||
    lower.includes('expensive') ||
    lower.includes('cheaper') ||
    lower.includes('offer') ||
    lower.includes('less')
  ) {
    const discount = 5;
    const finalAmount = Math.round(amount * 0.95);
    return {
      id: 'ai_resp_' + Date.now(),
      sender: 'AI_AGENT',
      text: `I completely understand! I've gone ahead and applied our maximum authorized 5% merchant loyalty discount for you. Your updated total is ₹${finalAmount.toLocaleString('en-IN')}.\n\nHere is your discounted 1-click Razorpay link:`,
      timestamp: timeStr,
      actionPayload: {
        type: 'DISCOUNT_OFFER',
        url: `https://rzp.io/l/loyalty-${tx.id}`,
        amount: finalAmount,
        discountPercent: discount,
      },
      options: [`Pay ₹${finalAmount.toLocaleString('en-IN')} via UPI Now`, 'Show other payment options']
    };
  }

  // Request for UPI / GPay / PhonePe / Paytm
  if (
    lower.includes('upi') ||
    lower.includes('gpay') ||
    lower.includes('phonepe') ||
    lower.includes('paytm') ||
    lower.includes('qr')
  ) {
    return {
      id: 'ai_resp_' + Date.now(),
      sender: 'AI_AGENT',
      text: `Great choice! UPI is the fastest and has a 99.4% success rate. Tap the button below to open directly in Google Pay, PhonePe, or Paytm:`,
      timestamp: timeStr,
      actionPayload: {
        type: 'PAYMENT_LINK',
        url: `https://rzp.io/l/upi-${tx.id}`,
        targetMethod: 'UPI',
        amount: tx.recoveredAmount || tx.amount,
      },
      options: ['Click to Authorize UPI Pay']
    };
  }

  // Request for EMI or Split
  if (
    lower.includes('emi') ||
    lower.includes('split') ||
    lower.includes('later') ||
    lower.includes('monthly')
  ) {
    const monthlyAmt = Math.round(amount / 3);
    return {
      id: 'ai_resp_' + Date.now(),
      sender: 'AI_AGENT',
      text: `We can definitely make this easier! You can split this into 3 easy monthly installments of ₹${monthlyAmt.toLocaleString('en-IN')}/mo with 0% interest via Razorpay Cardless EMI / PayLater:`,
      timestamp: timeStr,
      actionPayload: {
        type: 'PAYMENT_LINK',
        url: `https://rzp.io/l/emi-${tx.id}`,
        amount: monthlyAmt,
      },
      options: [`Pay in 3x ₹${monthlyAmt.toLocaleString('en-IN')}/mo`, 'Pay Full Amount via UPI']
    };
  }

  // Request for delay / reminder
  if (
    lower.includes('tomorrow') ||
    lower.includes('later') ||
    lower.includes('remind') ||
    lower.includes('busy')
  ) {
    return {
      id: 'ai_resp_' + Date.now(),
      sender: 'AI_AGENT',
      text: `No problem at all! I have locked in your price and your active subscription access for the next 24 hours. I'll send you a gentle ping tomorrow morning. Have a wonderful day! 🌟`,
      timestamp: timeStr,
      options: ['Change to pay right now']
    };
  }

  // Default empathetic response
  return {
    id: 'ai_resp_' + Date.now(),
    sender: 'AI_AGENT',
    text: `Got it! I am here to help you get this resolved without any disruption. You can complete the checkout securely using any preferred payment method (UPI, Cards, Netbanking) right here:`,
    timestamp: timeStr,
    actionPayload: {
      type: 'PAYMENT_LINK',
      url: `https://rzp.io/l/secure-pay-${tx.id}`,
      amount: tx.recoveredAmount || tx.amount,
    },
    options: ['Pay via UPI', 'Switch Payment Method', 'Ask a question']
  };
}
