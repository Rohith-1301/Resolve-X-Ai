# ResolveX — Enterprise AI Customer Resolution Copilot
> **Understand. Resolve. Predict. Prevent.**

[![FastAPI](https://img.shields.io/badge/Backend-100%25%20Python%20FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript%20%2B%20Vite-61DAFB.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com)
[![GitHub](https://img.shields.io/badge/Repository-Rohith--1301%2FResolve--X--Ai-blue.svg)](https://github.com/Rohith-1301/Resolve-X-Ai)

ResolveX is an enterprise AI-powered customer support copilot designed for telecom and broadband operators. It enables frontline agents and senior technical specialists to rapidly understand customer issues, analyze comprehensive Customer 360 data, retrieve grounded knowledge base documentation, draft contextual resolution responses, and manage escalations with guaranteed human-in-the-loop safety.

---

## 🌟 What Problem ResolveX Solves

Traditional enterprise customer support is fragmented:
- **Scattered Data**: Agents spend 4-6 minutes switching across legacy CRM, BSS/OSS billing, and network telemetry portals.
- **Generic Responses & Hallucinations**: Standard chatbots output repetitive, ungrounded troubleshooting steps that frustrate customers.
- **Broken Escalations**: When Tier-1 agents cannot fix complex technical faults (such as fiber optical signal loss or GPON errors), cases are escalated without diagnostic context, forcing customers to repeat their issues.

### 💡 The ResolveX Solution
ResolveX automates the resolution lifecycle while keeping **human support specialists firmly in control**:
1. **Understands Intent & Emotion**: Analyzes customer tone (frustrated, angry, concerned) and urgency.
2. **Aggregates Customer 360**: Pulls subscriber plan, billing status, data quota usage, and historical tickets.
3. **Retrieves Grounded Knowledge**: Matches symptoms to verified technical knowledge articles (RAG).
4. **Delivers Actionable Decisions**: Categorizes cases into RESOLUTION READY, NEEDS INFORMATION, or ESCALATION REQUIRED.
5. **Specialist Desk Copilot**: For escalated cases, the AI generates technical resolution drafts that specialists can review, customize, and send with 1 click.
6. **Live Interactive Simulation**: Automatically simulates realistic customer acknowledgments and responses in real-time.

---

## 🔄 Core Operational Workflow

`
Customer Message
       ↓
Understand Issue (Intent & Emotion Analysis)
       ↓
Customer 360 (Plans, Quotas, Billing, History)
       ↓
Knowledge Base Retrieval (Verified KB Articles)
       ↓
AI Decision Engine
  ├── RESOLUTION READY   → Grounded Response Prepared
  ├── NEEDS INFORMATION  → Targeted Clarification Prompt
  └── ESCALATION REQUIRED → Specialist Handover with Diagnostic Briefing
       ↓
Human Approval & Specialist Review
       ↓
1-Click Send → Real-Time Customer Auto-Reply
`

---

## 🎯 Key Application Modules

### 1. P0 3-Column Support Workspace (/tickets/:id)
- **Customer 360 (Left Column)**: Real-time subscriber details, plan pricing, live data quota progress bar, rule-based risk indicator, past ticket history, and customer journey events.
- **Live Conversation Stream (Center Column)**: Customer vs. agent message bubbles, emotion badges (*Frustrated — 85%*, *Angry — 92%*), and instant message composer.
- **AI Copilot & Guardrails (Right Column)**:
  - Extracted intent, subcategory, emotion, urgency, and confidence score.
  - Financial discrepancy context (e.g., plan ₹999 vs bill ₹1,499 with ₹500 roaming).
  - Verified citations (e.g., **KB-102** with 96% match).
  - Decision banner with 6-point evidence checklist.
  - Grounded editable response draft with **Approve & Send (Customer Auto-Replies)**.

### 2. Specialist Desk & Handover Portal (/specialist)
- **AI-Created Specialist Messages**: The AI generates expert-level, diagnostic-grounded messages addressed to the customer based on telemetry and root-cause analysis.
- **Quick Action Presets**:
  - 🚚 **Field Dispatch Draft**: Dispatches Field Engineer Rajesh Varma (Van #04) with OTDR optical testing equipment.
  - ⚡ **Remote OLT Reset Draft**: Recalibrates GPON OLT laser power on Port 03 / Splitter #4.
  - 💳 **₹500 Goodwill Credit Draft**: Authorizes courtesy credit adjustment for SLA disruptions.
  - 📞 **Senior Callback Draft**: Schedules executive manager consultation.
- **Review & Edit Area**: Editable card with live character count, allowing specialists to fine-tune messages before sending.
- **1-Click Send with Live Customer Auto-Reply**: Delivers the specialist message and automatically triggers a realistic customer acknowledgment in the live transcript.

### 3. Executive SaaS Landing Page (/landing)
- Enterprise product showcase featuring value propositions, 7-stage resolution pipeline, interactive demo launcher, and enterprise feature deep dives.

### 4. Operations & Intelligence Suite
- **Executive Dashboard (/)**: Real-time SLA metrics, resolution rate, average handle time (AHT), and active ticket queues.
- **Proactive Incident Command (/proactive)**: Cell tower and GPON maintenance alerts affecting multiple subscribers.
- **Predictive Upgrades (/predictive)**: Bandwidth quota forecasting and automated plan upgrade recommendations.
- **Knowledge Base & Gap Detection (/knowledge)**: Article repository with gap analysis for unresolved inquiries.
- **Governance & Settings (/settings)**: Configurable confidence thresholds, AI provider routing, and safety guardrails.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+
- **Git**

### 1. Clone the Repository
`ash
git clone https://github.com/Rohith-1301/Resolve-X-Ai.git
cd Resolve-X-Ai
`

### 2. Backend Setup (FastAPI)
`ash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run automated tests
python -m pytest tests/ -v

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
`
*Backend runs on http://127.0.0.1:8000 with Swagger docs at http://127.0.0.1:8000/docs.*

### 3. Frontend Setup (React + Vite)
`ash
cd ../frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
`
*Frontend runs on http://localhost:5173.*

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, SQLite, Uvicorn |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts |
| **AI Architecture** | RAG retrieval, Multi-factor confidence scoring, Deterministic decision trees, Zero-hallucination guardrails |
| **Testing** | Pytest, TypeScript compiler (	sc --noEmit) |

---

## 📄 License
This project is licensed under the MIT License.
