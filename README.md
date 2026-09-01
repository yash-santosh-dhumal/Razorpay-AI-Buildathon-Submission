# ⚡ RevivePay AI (RazorRecover)
### Autonomous AI Revenue Recovery & Intelligent Dunning Engine for Razorpay

> **Razorpay AI Buildathon 2026** | **Track 3: AI Revenue Recovery**  
> *Turning Failed Transactions & Subscription Churn into Recovered MRR with Zero Merchant Overhead.*

---

## 🎯 The Problem

In India's digital economy, **5% to 15% of payment transactions and recurring subscriptions fail**, costing merchants billions of rupees annually:
* **Technical Downtimes:** Transient bank core banking system (CBS) outages and UPI spikes.
* **Insufficient Funds / Salary Day Timing:** Subscriptions attempted when user balance is temporarily low.
* **Friction & Abandonment:** Complex checkout failures without an immediate intuitive recovery path.
* **Tokenized Card Expiry:** Recurring auto-debits failing due to expired cards without a proactive migration flow.

Traditional dunning methods (sending a cold email hours later) achieve **less than 20% recovery**.

---

## 💡 The Solution: RevivePay AI

**RevivePay AI** is a multi-agent autonomous revenue recovery platform that monitors Razorpay payment telemetry, diagnoses failure root causes in milliseconds, and orchestrates the optimal recovery action:

```
                          ┌────────────────────────┐
                          │  Razorpay Payment API  │
                          │   / Webhook Ingest     │
                          └───────────┬────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │  Diagnostic Multi-Agent │
                          │    Decision Matrix     │
                          └───────────┬────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           ▼                          ▼                          ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  Smart Retry Engine │   │ WhatsApp AI Concierge│   │ Card Lifecycle Flow │
│  (Zero-Friction Bank│   │ (1-Click UPI Intent │   │ (Self-Service Token │
│   Recovery Windows) │   │ + Micro-Discounts)  │   │  & Mandate Update)  │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## 🌟 Key Features

### 1. 🤖 Multi-Agent Diagnostic Engine
* Classifies failure payloads (`GATEWAY_TIMEOUT`, `INSUFFICIENT_FUNDS`, `CARD_EXPIRED`, `USER_ABANDONED`) and selects the optimal recovery channel with high confidence.
* Automatically schedules silent retries for transient outages during optimal off-peak windows.

### 2. 📱 Interactive WhatsApp AI Concierge with 1-Click Pay
* Dispatches conversational, empathetic WhatsApp messages offering 48-hour complimentary grace protection.
* Handles real-time objections: Dynamic split installments (EMI/PayLater), authorized retention discounts, or alternative UPI deep-links.

### 3. 📊 Real-Time Merchant Command Center
* **Live Recovered MRR Ticker & Success Rate:** Live financial counter tracking rescued revenue.
* **Bank Rail Health Monitor:** Live telemetry across HDFC, SBI, ICICI, Axis, and NPCI UPI.
* **Autonomous Policy Config:** Merchant-controlled discount limits, dunning tone, and retry thresholds.

### 4. 🎮 Live Interactive Smartphone Simulator
* Built-in interactive virtual phone interface that allows evaluators and judges to test customer interactions, receive live alerts, chat with the AI, and complete 1-click payments in real-time.

---

## 🚀 Quickstart & Setup

### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher

### Installation & Launch

```bash
# 1. Clone the repository
git clone https://github.com/yash-santosh-dhumal/Razorpay-AI-Buildathon-Submission.git
cd Razorpay-AI-Buildathon-Submission

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS, Lucide Icons, Canvas Confetti
* **Backend:** Next.js API Routes / Edge Handlers
* **AI Architecture:** Multi-Agent Diagnostics, Rule Policy Engine, Dynamic Negotiation Prompts
* **State Management:** Reactive Event Streams, In-Memory State & Sandbox Simulator

---

## 🎬 5-Minute Pitch & Demo Guide (For Judges)

1. **0:00 - 1:00 (The Problem):** Explain how $15B+ in merchant revenue is lost due to dumb, non-contextual failure handling.
2. **1:00 - 2:30 (Live Sandbox Trigger):** Use the Failure Sandbox to trigger an "OTT Subscription Mandate Decline".
3. **2:30 - 4:00 (Virtual Phone AI Chat):** Show the AI message arrive on the Virtual Phone $\rightarrow$ reply asking for a discount $\rightarrow$ AI offers authorized 5% discount $\rightarrow$ Click 1-Click Pay.
4. **4:00 - 5:00 (Merchant Impact & Scalability):** Show the recovered revenue counter tick up, review bank health stats, and explain business ROI.
