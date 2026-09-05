import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Activity,
  Award,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export const QualityCompliance: React.FC = () => {
  const [quality, setQuality] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getQualityCompliance()
      .then(setQuality)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const factors = quality?.factors || [
    { name: 'Grounding & Fact Verification', weight: 30.0, score: 29.2, description: 'Zero hallucinations against customer account and policy database' },
    { name: 'Knowledge Citations', weight: 20.0, score: 19.4, description: 'Verified article references attached to every factual claim' },
    { name: 'Account Data Consistency', weight: 20.0, score: 19.6, description: 'Exact reconciliation with customer billing and contract databases' },
    { name: 'Tone & Customer Empathy', weight: 10.0, score: 9.5, description: 'Respectful, professional, de-escalating tone detected' },
    { name: 'Resolution Completeness', weight: 10.0, score: 9.2, description: 'Complete diagnostic instructions and clear follow-up timelines' },
    { name: 'Safety & Human Oversight Guardrails', weight: 10.0, score: 8.9, description: 'Human approval mandated before any simulated dispatch' }
  ];

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>COMPLIANCE & GUARDRAILS AUDIT</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Quality & Safety Governance
          </h1>
          <p className="text-xs text-slate-300">
            Automated verification ensuring zero hallucination, mandatory human approval, and strict knowledge citations.
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-400 font-mono">{quality?.overall_quality || 95.8}%</div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Trust Score</span>
        </div>
      </div>

      {/* 52. QUALITY SCORING 6 PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factors.map((f: any, idx: number) => (
          <div key={idx} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-white">{f.name}</h3>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {f.score} / {f.weight}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(f.score / f.weight) * 100}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{f.description}</p>
          </div>
        ))}
      </div>

      {/* Compliance Metrics */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
          <span className="text-slate-400 text-[11px]">Grounded Response Rate:</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">98.4%</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
          <span className="text-slate-400 text-[11px]">Verified Fact Rate:</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">99.1%</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
          <span className="text-slate-400 text-[11px]">Citations Attached:</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">96.5%</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
          <span className="text-slate-400 text-[11px]">Human-In-The-Loop Approval:</span>
          <div className="text-lg font-bold text-indigo-400 mt-1">100.0%</div>
        </div>
      </div>
    </div>
  );
};
