import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Shield,
  Radio,
  Save,
  RotateCcw,
  CheckCircle2,
  Key,
  Database,
  Lock,
  Zap,
  Layers,
  AlertCircle
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [provider, setProvider] = useState('mock');
  const [resolutionThreshold, setResolutionThreshold] = useState(85);
  const [escalationThreshold, setEscalationThreshold] = useState(60);
  const [autoEscalateAngry, setAutoEscalateAngry] = useState(true);
  const [strictGrounding, setStrictGrounding] = useState(true);
  const [maskPII, setMaskPII] = useState(true);
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Sliders className="w-3.5 h-3.5" />
            <span>OPERATIONAL PARAMETERS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Configuration & AI Guardrails</h1>
          <p className="text-xs text-slate-400">
            Manage AI model routing, confidence decision thresholds, RAG grounding parameters, and safety policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Configuration updated and synced to ResolveX backend runtime!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Provider & Engine */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>AI Reasoning & Retrieval Engine</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">Active Model Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="mock">ResolveX Deterministic Demo Engine (100% Reliable Hackathon Mode)</option>
                <option value="openai">OpenAI GPT-4o Support Fine-tune (External API)</option>
                <option value="anthropic">Anthropic Claude 3.5 Sonnet (External API)</option>
                <option value="gemini">Google DeepMind Gemini 1.5 Pro (External API)</option>
              </select>
              <span className="text-[11px] text-slate-500">
                Deterministic engine guarantees reproducible, zero-latency execution across the 5 demo scenarios.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">API Key (Optional for External Providers)</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="sk-live-demo-key-masked-for-security"
                  disabled={provider === 'mock'}
                  className="w-full px-3 py-2 pl-8 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs disabled:opacity-50 focus:outline-none focus:border-blue-500"
                />
                <Key className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">RAG Vector Strategy</span>
                <span className="text-cyan-400 font-bold font-mono">Hybrid Semantic + BM25</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Execution Runtime</span>
                <span className="text-emerald-400 font-bold font-mono">High-Throughput Async Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Decision Thresholds */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Confidence & Decision Thresholds</span>
          </div>

          <div className="space-y-5 text-xs">
            {/* Threshold 1 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Resolution Ready Minimum Confidence</span>
                <span className="text-emerald-400 font-mono font-bold">{resolutionThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                value={resolutionThreshold}
                onChange={(e) => setResolutionThreshold(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">
                Responses exceeding this confidence threshold are marked RESOLUTION READY for instant agent approval.
              </div>
            </div>

            {/* Threshold 2 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Escalation Trigger Threshold</span>
                <span className="text-rose-400 font-mono font-bold">{escalationThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="75"
                value={escalationThreshold}
                onChange={(e) => setEscalationThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">
                Cases with confidence below this threshold or multiple unresolved tickets trigger mandatory specialist handoff.
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEscalateAngry}
                  onChange={(e) => setAutoEscalateAngry(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="text-slate-300 font-semibold">
                  Auto-Escalate on High Anger (&gt; 80% negative sentiment with prior ticket)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 3: Safety Guardrails */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Safety, Grounding & Anti-Hallucination Guardrails</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <input
                type="checkbox"
                checked={strictGrounding}
                onChange={(e) => setStrictGrounding(e.target.checked)}
                className="mt-0.5 rounded accent-emerald-500"
              />
              <div className="space-y-0.5">
                <span className="text-white font-bold block">Strict Knowledge Citation Enforcement</span>
                <span className="text-slate-400 text-[11px]">
                  Requires every factual claim to link directly to a verified KB article ID (e.g. KB-102).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <input
                type="checkbox"
                checked={maskPII}
                onChange={(e) => setMaskPII(e.target.checked)}
                className="mt-0.5 rounded accent-emerald-500"
              />
              <div className="space-y-0.5">
                <span className="text-white font-bold block">Automated PII Redaction</span>
                <span className="text-slate-400 text-[11px]">
                  Masks phone numbers, bank accounts, and national IDs before model context ingestion.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <input
                type="checkbox"
                checked={requireHumanApproval}
                onChange={(e) => setRequireHumanApproval(e.target.checked)}
                className="mt-0.5 rounded accent-emerald-500"
              />
              <div className="space-y-0.5">
                <span className="text-white font-bold block">Human-in-the-Loop Financial Guardrail</span>
                <span className="text-slate-400 text-[11px]">
                  Blocks autonomous refunds, plan alterations, or cancellations without human agent authorization.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Telecom Telemetry Integrations */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Telecom OSS/BSS Infrastructure Sync</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">BSS Billing & Plan Database</div>
                <div className="text-[11px] text-slate-400">Syncs subscriber rates, allowances, and roaming charges</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Cell Tower & OLT Telemetry Feed</div>
                <div className="text-[11px] text-slate-400">Mumbai Central, Bandra, Delhi NCR clusters</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                Live (234 affected)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Simulated Broadcast SMS Gateway</div>
                <div className="text-[11px] text-slate-400">Sandbox broadcast testing without actual telecom SMS dispatch</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
                Sandbox Mode
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
