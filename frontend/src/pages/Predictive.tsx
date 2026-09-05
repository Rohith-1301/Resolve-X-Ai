import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Activity,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldAlert,
  Flame,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { UsageAlertOpportunity } from '../types';

export const Predictive: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [proposalSuccess, setProposalSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getOpportunities(),
      api.getPredictiveInsights()
    ])
      .then(([opps, ins]) => {
        setOpportunities(opps);
        setInsights(ins);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePrepareOffer = (custName: string) => {
    setProposalSuccess(`Personalized Fiber 1 Gbps proposal drafted for ${custName}! Scheduled for outreach after current billing cycle.`);
    setTimeout(() => setProposalSuccess(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/40">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>PREDICTIVE CUSTOMER SUCCESS</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Usage Forecasting & Proactive Opportunities
        </h1>
        <p className="text-xs text-slate-300">
          Anticipates customer expansion needs and capacity bottlenecks before service degradation occurs.
        </p>
      </div>

      {proposalSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{proposalSuccess}</span>
        </div>
      )}

      {/* 40 & 41. USAGE-BASED OPPORTUNITY (Scenario 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>41. Plan Upgrade Predictions (45 Customers Approaching Data Limits)</span>
          </h3>
          <span className="text-[10px] text-slate-500">Demo forecast probability</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {opportunities.map((opp, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${
                opp.customer_id === 'CUS-1001'
                  ? 'bg-gradient-to-b from-blue-950/40 to-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{opp.customer_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {Math.round(opp.opportunity_score * 100)}% Likelihood
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  Current: <strong className="text-slate-200">{opp.plan_name}</strong>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Data Usage: {opp.usage_gb} GB</span>
                    <span className="text-amber-400 font-semibold">{opp.percent_used}% of cap</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" style={{ width: `${opp.percent_used}%` }}></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Recommended Next Tier:</span>
                  <div className="font-bold text-emerald-400">{opp.recommended_plan}</div>
                  <p className="text-[11px] text-slate-400 leading-snug">{opp.trigger}</p>
                </div>
              </div>

              <button
                onClick={() => handlePrepareOffer(opp.customer_name)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition shadow flex items-center justify-center gap-1.5"
              >
                <span>Prepare Personalized Offer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 42. PREDICTIVE INSIGHTS & 43. CAPACITY PLANNING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trending Issues (Col 6) */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              42. Trending Support Inquiries (Next 7 Days)
            </h3>
            <span className="text-[10px] text-slate-500">Demo forecast</span>
          </div>

          <div className="space-y-2.5">
            {(insights?.trending_issues || []).map((issue: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{issue.topic}</div>
                  <div className="text-[10px] text-slate-400">{issue.affected_count} predicted cases</div>
                </div>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  issue.direction === 'up' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {issue.direction === 'up' ? '+' : ''}{issue.change_percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 43. Capacity Planning (Col 6) */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              43. Agent Capacity Planning & Load Balancing
            </h3>
            <span className="text-[10px] text-slate-500">{insights?.capacity_plan?.disclaimer || 'Demo capacity estimate'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="text-slate-400">Peak High-Volume Windows:</span>
              <strong className="text-amber-400">2:00 PM – 5:00 PM & 7:00 PM – 10:00 PM</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Currently Scheduled Agents:</span>
              <span className="font-bold text-white">10 Agents</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Recommended Staffing:</span>
              <span className="font-bold text-emerald-400">12 Agents (+2 for Mumbai area surge)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-700/60">
              {insights?.capacity_plan?.reason || 'High expected support volume driven by evening peak usage and Mumbai area maintenance tickets.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
