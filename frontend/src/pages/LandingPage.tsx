import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  TrendingUp,
  Activity,
  Layers,
  Database,
  Radio,
  Search,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Cpu,
  Lock,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (scenario?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onEnterApp()}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Resolve</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">X</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Understand. Resolve. Predict. Prevent.
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-slate-300">
            <a href="#platform" className="hover:text-blue-400 transition-colors">Platform</a>
            <a href="#workflow" className="hover:text-blue-400 transition-colors">AI Resolution</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">Customer 360</a>
            <a href="#proactive" className="hover:text-blue-400 transition-colors">Proactive Support</a>
            <a href="#predictive" className="hover:text-blue-400 transition-colors">Predictive Intelligence</a>
            <a href="#analytics" className="hover:text-blue-400 transition-colors">Analytics</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEnterApp()}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 rounded-lg transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => setContactModalOpen(true)}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 rounded-lg transition-all"
            >
              Request Demo
            </button>
            <button
              onClick={() => onEnterApp()}
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center gap-1.5"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Gen Enterprise Support Operations Copilot</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Every Customer Issue.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Understood. Resolved.
              </span>{' '}
              Before It Escalates.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              ResolveX gives support teams an AI copilot that understands customer conversations, account history, support knowledge and customer signals to recommend the right next action.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onEnterApp('billing')}
                className="px-6 py-3.5 text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Demo (Live Workspace)</span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('platform');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
              >
                Explore Platform
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Enterprise SLA Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Hallucination Grounding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Human-in-the-Loop Safe</span>
              </div>
            </div>
          </div>

          {/* Right Hero Dashboard Preview Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl shadow-blue-950/80 backdrop-blur-xl ring-1 ring-white/10">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 font-mono text-[11px] text-slate-400">ResolveX Workspace • TKT-1042</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                  ● RESOLUTION READY (94%)
                </span>
              </div>

              {/* Customer Info Row */}
              <div className="py-3 px-3.5 my-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Rahul Kumar</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold">VIP</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Fiber 500 Mbps • ₹999/mo base • ID: CUS-1001</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-200">Current Bill: ₹1,499</div>
                  <div className="text-[10px] text-rose-400 font-semibold">+₹500 Roaming Surcharge</div>
                </div>
              </div>

              {/* Customer Message */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-semibold text-slate-300">Customer Message</span>
                  <span className="px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-semibold text-[10px] border border-rose-500/30">
                    😠 Frustrated — 85%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  "Why is my bill ₹1,499 when my plan is ₹999? I was never informed about this extra charge."
                </div>
              </div>

              {/* AI Understanding & Grounding */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-0.5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">AI Intent</span>
                  <div className="font-bold text-cyan-300">Billing / Unexpected Charge</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-0.5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Knowledge Citation</span>
                  <div className="font-bold text-blue-300 truncate">KB-102: Understanding Roaming Add-ons</div>
                </div>
              </div>

              {/* Grounded AI Draft */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/40 text-xs space-y-2 mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>AI-Generated Grounded Response</span>
                  </div>
                  <span className="font-mono text-emerald-400">94% Confidence</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "Hello Rahul, I have verified your account details. Your plan is Fiber 500 Mbps at ₹999/month. The additional ₹500 reflects the International Roaming Pack activated on Aug 28. As referenced in policy KB-102, this is billed in arrears..."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onEnterApp('billing')}
                  className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-700/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Send</span>
                </button>
                <button
                  onClick={() => onEnterApp('missing')}
                  className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                >
                  Ask Customer
                </button>
                <button
                  onClick={() => onEnterApp('escalation')}
                  className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                >
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section id="platform" className="py-20 px-6 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-rose-400 tracking-wider uppercase">The Problem in Customer Operations</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Support Teams Are Drowning in Fragmented Context
            </h2>
            <p className="text-sm text-slate-400">
              Modern telecom and enterprise support is broken by siloed portals, outdated knowledge bases, and slow, repetitive escalations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Customer information is scattered</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agents jump across 5 different billing portals, telemetry dashboards, and CRMs to find basic plan limits and history.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Agents spend too much time searching knowledge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Finding the right KB policy among thousands of outdated internal wikis delays resolution and increases handling time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Repetitive tickets consume agent time</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard bill inquiries, Wi-Fi password resets, and add-on charges consume 70% of tier-1 support capacity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Complex escalations cause customers to repeat themselves</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a ticket escalates to Tier-3 specialists, context gets lost, forcing angry customers to recount their troubleshooting steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS WORKFLOW */}
      <section id="workflow" className="py-20 px-6 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">End-to-End Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How ResolveX Operates
            </h2>
            <p className="text-sm text-slate-400">
              A transparent, deterministic AI decision loop designed to keep human agents strictly in control.
            </p>
          </div>

          {/* Workflow Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
            {[
              { step: '1', title: 'Customer Message', desc: 'Inbound chat, email or voice transcript' },
              { step: '2', title: 'AI Understands', desc: 'Intent, emotion & urgency extraction' },
              { step: '3', title: 'Customer 360', desc: 'Account plan, usage & ticket history lookup' },
              { step: '4', title: 'Knowledge Search', desc: 'Vector semantic retrieval against 25+ verified KBs' },
              { step: '5', title: 'AI Decision', desc: 'Calculates confidence & selects decision path' },
              { step: '6', title: 'Action Formulation', desc: 'Prepares draft, targeted question, or handoff' },
              { step: '7', title: 'Human Approval', desc: 'Agent reviews, audits and executes with 1-click' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-between space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400 text-blue-300 text-xs font-black flex items-center justify-center">
                  {s.step}
                </div>
                <div className="font-bold text-white text-xs">{s.title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Three AI Decisions Section */}
          <div className="pt-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-white">Three Distinct Deterministic AI Decisions</h3>
              <p className="text-xs text-slate-400">No guesswork. The engine routes every case into one of three clear operational buckets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: RESOLUTION READY */}
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 hover:border-emerald-500/80 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                    🟢 RESOLUTION READY
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Confidence &gt; 85%</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AI has enough verified customer account data, usage telemetry, and policy documentation to prepare a complete, grounded response ready for agent 1-click approval.
                </p>
                <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('billing')}>
                  <span>Try Scenario 1 (Billing Resolution)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: NEEDS INFORMATION */}
              <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 hover:border-amber-500/80 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
                    🟡 NEEDS INFORMATION
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Missing Scope</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AI identifies exactly what information is missing and asks the customer one targeted question instead of guessing or hallucinating troubleshooting advice.
                </p>
                <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('missing')}>
                  <span>Try Scenario 2 (Missing Info Clarification)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: ESCALATION REQUIRED */}
              <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 hover:border-rose-500/80 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/40">
                    🔴 ESCALATION REQUIRED
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Specialist Match</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AI detects a complex, uncertain, or repeated outage issue and automatically prepares a complete structured handoff for the ideal Tier-3 specialist engineer.
                </p>
                <div className="pt-2 text-xs font-semibold text-rose-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('escalation')}>
                  <span>Try Scenario 3 (Complex Outage Handoff)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NINE ENTERPRISE FEATURE SECTIONS */}
      <section id="features" className="py-20 px-6 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">Enterprise Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Built Specifically for Telecom & High-Volume Support
            </h2>
            <p className="text-sm text-slate-400">
              Every tool an agent, supervisor, and customer success manager needs to resolve issues with speed and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">AI Customer Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time copilot assisting agents on live tickets with multi-source contextual analysis and draft generation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Customer 360</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unified timeline consolidating broadband plans, real-time data consumption, rule-based risk scores, and lifetime ticket history.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Knowledge Grounding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict RAG retrieval against 25+ verified articles. Guarantees citations and eliminates hallucinated company policies.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Sentiment Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continuous emotional tracking across conversation turns: detects Neutral, Frustrated, Angry, and Urgent escalations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Intelligent Escalation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated skill-matching routes tickets directly to specialists (like Amit Sharma for L3 fiber faults) with zero repeat briefing.
              </p>
            </div>

            {/* Feature 6 */}
            <div id="proactive" className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Proactive Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitors cell towers and router nodes. Prepares bulk subscriber alerts for 234+ affected users before tickets roll in.
              </p>
            </div>

            {/* Feature 7 */}
            <div id="predictive" className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Predictive Customer Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Forecasting engine flags customers approaching 90% data caps and prepares personalized Fiber 1 Gbps upgrade proposals.
              </p>
            </div>

            {/* Feature 8 */}
            <div id="analytics" className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Executive dashboard tracking first-contact resolution rates, sentiment trends, average handling time, and AI assistance metrics.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Quality & Compliance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated 7-point AI verification audits every response for PII masking, factual grounding, and mandatory human review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-t from-slate-950 via-blue-950/20 to-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ready for Production Support Operations</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Give every support agent an AI copilot that understands the whole customer.
          </h2>

          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Experience the complete 5-scenario demo platform right now. Zero setup required, fully runnable locally.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onEnterApp('billing')}
              className="px-8 py-4 text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setContactModalOpen(true)}
              className="px-8 py-4 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              RX
            </div>
            <div>
              <span className="font-bold text-white text-sm">ResolveX</span>
              <span className="ml-2 text-[11px] text-slate-400">Understand. Resolve. Predict. Prevent.</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-400">© 2026 ResolveX Technologies. All rights reserved.</span>
            <button onClick={() => onEnterApp()} className="text-blue-400 hover:underline font-semibold">
              Enter Platform
            </button>
          </div>
        </div>
      </footer>

      {/* Request Demo Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Request ResolveX Enterprise Demo</h3>
              <button onClick={() => setContactModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-300">
              Interested in deploying ResolveX for your telecom or broadband support operations? Test the live interactive sandbox or contact our enterprise team.
            </p>
            <div className="space-y-3 pt-2">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                defaultValue="Telecom Operations Lead"
              />
              <input
                type="email"
                placeholder="Work Email"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                defaultValue="ops@telecom-enterprise.com"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setContactModalOpen(false);
                  onEnterApp();
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                Launch Live Demo Instead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
