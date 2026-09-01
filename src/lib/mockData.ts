import { AgentTraceStep, BankHealthStat, MerchantRuleConfig, Transaction } from '@/types';

export const INITIAL_MERCHANT_RULES: MerchantRuleConfig = {
  autoRetryTechnicalFailures: true,
  enableWhatsAppDunning: true,
  maxDiscountAllowedPercent: 5,
  dynamicDiscountThresholdHours: 2,
  vipGracePeriodDays: 3,
  allowUPIIntentFallback: true,
  aiTone: 'EMPATHETIC_CONCIERGE',
};

export const INITIAL_BANK_HEALTH: BankHealthStat[] = [
  { bankCode: 'HDFC', bankName: 'HDFC Bank', successRate: 98.4, latencyMs: 320, status: 'HEALTHY' },
  { bankCode: 'SBI', bankName: 'State Bank of India', successRate: 84.1, latencyMs: 1450, status: 'DEGRADED', activeAlert: 'Core Banking System experiencing periodic spikes' },
  { bankCode: 'ICICI', bankName: 'ICICI Bank', successRate: 99.1, latencyMs: 240, status: 'HEALTHY' },
  { bankCode: 'AXIS', bankName: 'Axis Bank', successRate: 96.8, latencyMs: 410, status: 'HEALTHY' },
  { bankCode: 'UPI_NPCI', bankName: 'NPCI UPI Network', successRate: 97.9, latencyMs: 180, status: 'HEALTHY' },
  { bankCode: 'KOTAK', bankName: 'Kotak Mahindra', successRate: 99.2, latencyMs: 210, status: 'HEALTHY' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'pay_Nz98Klx10a1',
    merchantId: 'acc_merch_01',
    merchantName: 'StreamWave Premium OTT',
    customer: {
      id: 'cust_991',
      name: 'Aarav Sharma',
      phone: '+91 98201 44821',
      email: 'aarav.sharma@example.com',
      tier: 'VIP',
      churnRiskScore: 65,
      preferredChannel: 'WHATSAPP',
      lifetimeValue: 14999
    },
    amount: 1499,
    currency: 'INR',
    itemDescription: 'Annual OTT 4K Family Subscription',
    paymentMethod: 'EMANDATE',
    bankName: 'HDFC Bank',
    errorCode: 'BAD_REQUEST_INSUFFICIENT_FUNDS',
    rawErrorMessage: 'Recurring mandate debit failed: Insufficient balance on account at mandate execution time.',
    category: 'INSUFFICIENT_FUNDS',
    timestamp: '2026-09-01T20:30:00.000Z',
    status: 'ENGAGING_CUSTOMER',
    recoveryChannel: 'WHATSAPP_AI',
    retryAttempts: 1,
    maxRetryAttempts: 3,
    aiDiagnosis: {
      rootCause: 'Low balance on salary account on mandate renewal date (Day 1). High recovery probability via WhatsApp UPI link.',
      actionTaken: 'Triggered empathetic WhatsApp concierge offering 1-click UPI autopay link with a 48-hr grace period.',
      confidenceScore: 0.94,
      recommendedPaymentRail: 'UPI'
    },
    agentTraces: [
      {
        id: 'tr_1',
        agentName: 'DiagnosticsAgent',
        timestamp: '8:30:02 PM',
        stepTitle: 'Error Telemetry & Failure Reason Classification',
        thoughtProcess: 'Parsed Razorpay failure event. Found code BAD_REQUEST_INSUFFICIENT_FUNDS. Not a fatal technical crash; customer funds temporarily lower than ₹1,499 mandate invoice.',
        toolCall: {
          toolName: 'razorpay_error_classifier_v3',
          input: { errorCode: 'BAD_REQUEST_INSUFFICIENT_FUNDS', paymentMethod: 'EMANDATE' },
          output: { classification: 'LIQUIDITY_LIMIT', confidence: 0.95, isRetriable: true }
        },
        decision: 'Classified as Non-Fatal Insufficient Balance. Routed to Dunning Orchestrator.',
        status: 'COMPLETED',
        executionTimeMs: 128
      },
      {
        id: 'tr_2',
        agentName: 'PolicyGuardAgent',
        timestamp: '8:30:03 PM',
        stepTitle: 'Customer Tier & Churn Risk Audit',
        thoughtProcess: 'Aarav Sharma is a VIP subscriber with LTV ₹14,999. Immediate mandate halt will trigger permanent churn. Granting maximum 48-hour service grace shield.',
        toolCall: {
          toolName: 'merchant_guardrail_evaluator',
          input: { customerTier: 'VIP', ltv: 14999, invoiceAmount: 1499 },
          output: { eligibleForGracePeriod: true, gracePeriodHours: 48, enableWhatsAppDunning: true }
        },
        decision: 'Protected subscription access with 48h grace buffer and generated WhatsApp conversational payload.',
        status: 'COMPLETED',
        executionTimeMs: 84
      },
      {
        id: 'tr_3',
        agentName: 'DunningOrchestrator',
        timestamp: '8:30:04 PM',
        stepTitle: 'Dynamic 1-Click Razorpay UPI Link Synthesis',
        thoughtProcess: 'Constructing personalized conversational message with express UPI deep-link.',
        toolCall: {
          toolName: 'generate_razorpay_smart_link',
          input: { amount: 1499, customerId: 'cust_991' },
          output: { linkUrl: 'https://rzp.io/l/streamwave-revive-991' }
        },
        decision: 'Dispatched interactive WhatsApp concierge with 1-click UPI renewal options.',
        status: 'COMPLETED',
        executionTimeMs: 110
      }
    ],
    chatHistory: [
      {
        id: 'msg_1',
        sender: 'AI_AGENT',
        text: 'Hi Aarav! 👋 This is Priya from StreamWave Support. We noticed your annual subscription renewal (₹1,499) could not be processed today via your HDFC Mandate.',
        timestamp: '8:30 PM'
      },
      {
        id: 'msg_2',
        sender: 'AI_AGENT',
        text: 'Your family plan streaming is active with a 48-hour complimentary grace period! Would you like to quickly complete this via UPI or choose a flexible plan?',
        timestamp: '8:31 PM',
        options: ['Pay via UPI now (₹1,499)', 'Switch to Monthly Plan (₹199)', 'Remind me tomorrow'],
        actionPayload: {
          type: 'PAYMENT_LINK',
          url: 'https://rzp.io/l/streamwave-revive-991',
          amount: 1499
        }
      }
    ]
  },
  {
    id: 'pay_Tx88Qpq29x8',
    merchantId: 'acc_merch_01',
    merchantName: 'DevFlow Cloud SaaS',
    customer: {
      id: 'cust_842',
      name: 'Pooja Verma',
      phone: '+91 97112 33499',
      email: 'pooja.verma@techcorp.in',
      tier: 'ENTERPRISE',
      churnRiskScore: 20,
      preferredChannel: 'WHATSAPP',
      lifetimeValue: 84000
    },
    amount: 12500,
    currency: 'INR',
    itemDescription: 'Pro Enterprise Plan (Monthly 50 Seats)',
    paymentMethod: 'CREDIT_CARD',
    bankName: 'SBI',
    errorCode: 'GATEWAY_TIMEOUT_BANK_UNRESPONSIVE',
    rawErrorMessage: 'SBI CBS gateway timed out after 30000ms. No response code returned.',
    category: 'BANK_DOWNTIME',
    timestamp: '2026-09-01T20:15:00.000Z',
    status: 'RETRY_SCHEDULED',
    recoveryChannel: 'SMART_RETRY',
    retryAttempts: 1,
    maxRetryAttempts: 4,
    nextRetryAt: '2026-09-01T21:15:00.000Z',
    aiDiagnosis: {
      rootCause: 'Transient SBI CBS core outage. Customer funds intact. High likelihood of success on off-peak retry window.',
      actionTaken: 'Holding merchant order intact; scheduled intelligent retry at T+60m when SBI gateway load normalizes.',
      confidenceScore: 0.98,
      recommendedPaymentRail: 'CREDIT_CARD'
    },
    agentTraces: [
      {
        id: 'tr_s1',
        agentName: 'DiagnosticsAgent',
        timestamp: '8:15:01 PM',
        stepTitle: 'Gateway Timeout Classification',
        thoughtProcess: 'Detected 30000ms timeout on SBI issuer bridge. Error is transient and non-customer-fault.',
        toolCall: {
          toolName: 'razorpay_error_classifier_v3',
          input: { errorCode: 'GATEWAY_TIMEOUT_BANK_UNRESPONSIVE' },
          output: { classification: 'TRANSIENT_GATEWAY_OUTAGE', isRetriable: true }
        },
        decision: 'Classified as Bank Core Outage. Prevented unnecessary customer notifications.',
        status: 'COMPLETED',
        executionTimeMs: 140
      },
      {
        id: 'tr_s2',
        agentName: 'SmartRoutingEngine',
        timestamp: '8:15:03 PM',
        stepTitle: 'Predictive Success Window Calculation',
        thoughtProcess: 'SBI server load curves indicate stability return at T+45 to T+60 mins. Scheduling auto-retry.',
        toolCall: {
          toolName: 'schedule_predictive_retry',
          input: { targetDeltaMinutes: 60, fallbackRail: 'UPI_INTENT' },
          output: { scheduledAt: '2026-09-01T21:15:00.000Z', successProbability: 0.94 }
        },
        decision: 'Scheduled silent Smart Retry for 9:15 PM with 94% computed success probability.',
        status: 'COMPLETED',
        executionTimeMs: 92
      }
    ]
  }
];

export const SIMULATION_SCENARIOS = [
  {
    id: 'sim_hdfc_balance',
    title: 'OTT Subscription Mandate Failed (Insufficient Funds)',
    customerName: 'Kunal Singhal',
    phone: '+91 98920 11445',
    amount: 1999,
    bankName: 'HDFC Bank',
    paymentMethod: 'EMANDATE' as const,
    category: 'INSUFFICIENT_FUNDS' as const,
    itemDescription: 'Annual MasterClass & Skill Pass',
    errorCode: 'BAD_REQUEST_INSUFFICIENT_FUNDS',
    rawErrorMessage: 'Recurring mandate debit failed: Insufficient balance on account.',
    explanation: 'AI diagnoses non-fatal balance issue. Instead of canceling subscription, AI extends 48h grace period and pings WhatsApp with a 1-click Razorpay UPI intent link.'
  },
  {
    id: 'sim_sbi_outage',
    title: 'Enterprise SaaS Checkout (SBI Bank Server Timeout)',
    customerName: 'Vikramaditya Rao',
    phone: '+91 91234 56789',
    amount: 18500,
    bankName: 'SBI',
    paymentMethod: 'CREDIT_CARD' as const,
    category: 'BANK_DOWNTIME' as const,
    itemDescription: 'Team Cloud Storage (100TB Annual)',
    errorCode: 'GATEWAY_TIMEOUT_BANK_UNRESPONSIVE',
    rawErrorMessage: 'SBI CBS gateway timed out after 30000ms. No response code returned.',
    explanation: 'AI classifies as transient gateway downtime. Avoids bothering the customer, schedules a Smart Retry with fallback to ICICI / Axis payment rails.'
  },
  {
    id: 'sim_cart_abandon',
    title: 'E-commerce Checkout Abandonment (Price Hesitation)',
    customerName: 'Sneha Patel',
    phone: '+91 98450 77612',
    amount: 4999,
    bankName: 'ICICI Bank',
    paymentMethod: 'UPI' as const,
    category: 'USER_ABANDONED' as const,
    itemDescription: 'Ergonomic Standing Desk Converter',
    errorCode: 'USER_ABANDONED_CHECKOUT_PRICE_DROP',
    rawErrorMessage: 'User viewed checkout total, initiated UPI intent, then exited application.',
    explanation: 'AI engages customer via WhatsApp, answers questions about warranty, and applies authorized 5% smart discount to recover the cart in real-time.'
  },
  {
    id: 'sim_upi_timeout',
    title: 'UPI App Response Timeout (NPCI Peak Load)',
    customerName: 'Arjun Nambiar',
    phone: '+91 97401 22890',
    amount: 2250,
    bankName: 'UPI_NPCI',
    paymentMethod: 'UPI' as const,
    category: 'UPI_APP_TIMEOUT' as const,
    itemDescription: 'Gourmet Weekly Coffee Subscription',
    errorCode: 'UPI_APP_TIMEOUT_COLLECT_EXPIRED',
    rawErrorMessage: 'UPI collect request expired after 5 minutes without user PIN authentication.',
    explanation: 'AI sends a lightweight interactive prompt offering an instant QR Code or auto-switch to Card / Netbanking.'
  }
];
