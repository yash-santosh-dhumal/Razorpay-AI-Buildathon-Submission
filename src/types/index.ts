export type FailureCategory = 
  | 'BANK_DOWNTIME'
  | 'INSUFFICIENT_FUNDS'
  | 'USER_ABANDONED'
  | 'CARD_EXPIRED'
  | 'MANDATE_DECLINED'
  | 'UPI_APP_TIMEOUT'
  | 'AUTH_FAILED';

export type RecoveryChannel = 'SMART_RETRY' | 'WHATSAPP_AI' | 'SMS_AI' | 'CARD_UPDATE_FLOW' | 'MANUAL_INTERVENTION';

export type RecoveryStatus = 
  | 'FAILED'
  | 'ANALYZING'
  | 'RETRY_SCHEDULED'
  | 'ENGAGING_CUSTOMER'
  | 'PAYMENT_LINK_OPENED'
  | 'RECOVERED'
  | 'CHURNED';

export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NETBANKING' | 'EMANDATE';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'VIP' | 'ENTERPRISE' | 'STANDARD' | 'NEW';
  churnRiskScore: number; // 0 - 100
  preferredChannel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  lifetimeValue: number;
}

export interface AgentTraceStep {
  id: string;
  agentName: 'DiagnosticsAgent' | 'BankTelemetryAgent' | 'PolicyGuardAgent' | 'DunningOrchestrator' | 'SmartRoutingEngine';
  timestamp: string;
  stepTitle: string;
  thoughtProcess: string;
  toolCall?: {
    toolName: string;
    input: Record<string, any>;
    output: Record<string, any>;
  };
  decision: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FALLBACK';
  executionTimeMs: number;
}

export interface Transaction {
  id: string;
  merchantId: string;
  merchantName: string;
  customer: Customer;
  amount: number;
  currency: 'INR';
  itemDescription: string;
  paymentMethod: PaymentMethod;
  bankName: string;
  errorCode: string;
  rawErrorMessage: string;
  category: FailureCategory;
  timestamp: string;
  status: RecoveryStatus;
  recoveryChannel: RecoveryChannel;
  retryAttempts: number;
  maxRetryAttempts: number;
  nextRetryAt?: string;
  recoveredAmount?: number;
  recoveredAt?: string;
  discountOfferedPercent?: number;
  aiDiagnosis: {
    rootCause: string;
    actionTaken: string;
    confidenceScore: number;
    recommendedPaymentRail?: string;
  };
  chatHistory?: ChatMessage[];
  agentTraces?: AgentTraceStep[];
}

export interface ChatMessage {
  id: string;
  sender: 'AI_AGENT' | 'CUSTOMER' | 'SYSTEM';
  text: string;
  timestamp: string;
  options?: string[];
  actionPayload?: {
    type: 'PAYMENT_LINK' | 'DISCOUNT_OFFER' | 'PAYMENT_METHOD_SWITCH' | 'PLAN_DOWNGRADE';
    url?: string;
    discountPercent?: number;
    targetMethod?: PaymentMethod;
    amount?: number;
  };
}

export interface MerchantRuleConfig {
  autoRetryTechnicalFailures: boolean;
  enableWhatsAppDunning: boolean;
  maxDiscountAllowedPercent: number;
  dynamicDiscountThresholdHours: number;
  vipGracePeriodDays: number;
  allowUPIIntentFallback: boolean;
  aiTone: 'PROFESSIONAL' | 'EMPATHETIC_CONCIERGE' | 'URGENT_DIRECT';
}

export interface BankHealthStat {
  bankCode: string;
  bankName: string;
  successRate: number;
  latencyMs: number;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  activeAlert?: string;
}

export interface RecoveryAnalytics {
  totalLostRevenue: number;
  totalRecoveredRevenue: number;
  recoverySuccessRate: number;
  activeRecoveryCount: number;
  roiMultiplier: number;
  recoveredByChannel: {
    smartRetry: number;
    whatsappAI: number;
    smsAI: number;
    cardLifecycle: number;
  };
}
