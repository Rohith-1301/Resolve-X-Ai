import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  User,
  Inbox,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getDashboardAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const kpis = {
    open_tickets: 30,
    resolution_ready: 16,
    needs_information: 9,
    escalation_required: 5,
    avg_resolution_time: '2.8m',
    grounding_accuracy: '96%'
  };

  const priorityCases = [
    {
      id: 'TKT-1042',
      customer: 'Rahul Kumar',
      type: 'VIP Subscriber',
      issue: 'Billing Issue',
      detail: '₹500 international roaming charge disputed on ₹999 plan',
      status: 'Resolution Ready',
      statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      actionPrompt: '1-click grounded response prepared (KB-102)'
    },
    {
      id: 'TKT-1043',
      customer: 'Priya Sharma',
      type: 'Residential Fiber',
      issue: 'Internet Connectivity',
      detail: 'Reports complete connection drop; affected device scope unknown',
      status: 'Needs Information',
      statusColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      actionPrompt: 'Clarification question formulated for customer'
    },
    {
      id: 'TKT-1044',
      customer: 'Arjun Mehta',
      type: 'Residential Fiber',
      issue: 'Internet Outage (3 Days)',
      detail: 'Prior ticket TKT-1031 closed without resolution; optical loss detected',
      status: 'Escalation Required',
      statusColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      actionPrompt: 'Tier-3 Senior Specialist handoff prepared (Amit Sharma)'
    }
  ];

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      {/* 1. Page Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ResolveX Support Intelligence
        </h1>
        <p className="text-xs text-slate-400">
          Understand every customer issue, ground every response in trusted knowledge, and take the right action.
        </p>
      </div>

      {/* 2. Key KPI Cards (6 primary operational metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">Open Tickets</span>
          <div className="text-2xl font-bold text-white">{kpis.open_tickets}</div>
          <span className="text-[10px] text-slate-500">Active in queue</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-[11px] font-medium text-emerald-400 block">Resolution Ready</span>
          <div className="text-2xl font-bold text-emerald-400">{kpis.resolution_ready}</div>
          <span className="text-[10px] text-slate-400">Awaiting agent approval</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
          <span className="text-[11px] font-medium text-amber-400 block">Needs Information</span>
          <div className="text-2xl font-bold text-amber-400">{kpis.needs_information}</div>
          <span className="text-[10px] text-slate-400">Clarification drafted</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-1">
          <span className="text-[11px] font-medium text-rose-400 block">Escalation Required</span>
          <div className="text-2xl font-bold text-rose-400">{kpis.escalation_required}</div>
          <span className="text-[10px] text-slate-400">Specialist handoff ready</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">Avg Resolution Time</span>
          <div className="text-2xl font-bold text-white">{kpis.avg_resolution_time}</div>
          <span className="text-[10px] text-slate-500">First-contact handling</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">AI Grounding Accuracy</span>
          <div className="text-2xl font-bold text-blue-400">{kpis.grounding_accuracy}</div>
          <span className="text-[10px] text-slate-500">Zero unsupported claims</span>
        </div>
      </div>

      {/* 3. PRIORITY CASES (What needs attention now) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Priority Cases Requiring Action
            </h2>
            <span className="text-[11px] text-slate-400">({priorityCases.length} key cases)</span>
          </div>
          <button
            onClick={() => navigate('/queue')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>View All Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorityCases.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/tickets/${c.id}`)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">{c.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${c.statusColor}`}>
                    {c.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{c.customer}</h3>
                  <div className="text-xs font-medium text-blue-400 mt-0.5">{c.issue}</div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{c.detail}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[210px]">{c.actionPrompt}</span>
                <span className="text-blue-400 font-semibold flex items-center gap-1 shrink-0">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Core Resolution Workflow Diagram */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Resolution Workflow
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase block">Step 1</span>
            <div className="font-semibold text-white">Customer Message</div>
            <div className="text-[10px] text-slate-400">Inbound issue</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase block">Step 2</span>
            <div className="font-semibold text-white">Understand Issue</div>
            <div className="text-[10px] text-slate-400">Intent & sentiment</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase block">Step 3</span>
            <div className="font-semibold text-white">Customer 360</div>
            <div className="text-[10px] text-slate-400">Account & history</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase block">Step 4</span>
            <div className="font-semibold text-white">Knowledge Grounding</div>
            <div className="text-[10px] text-slate-400">Verified policies</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase block">Step 5</span>
            <div className="font-semibold text-white">AI Decision</div>
            <div className="text-[10px] text-slate-400">Resolve / Ask / Escalate</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase block">Step 6</span>
            <div className="font-semibold text-emerald-300">Human Approval</div>
            <div className="text-[10px] text-slate-400">Agent executes</div>
          </div>
        </div>
      </div>

      {/* 5. Clean Operational Insight Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sentiment Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Sentiment Tracking
            </span>
            <span className="text-[11px] text-slate-400">Live conversation turns</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Neutral / Inquisitive</span>
                <span className="text-slate-400 font-mono">40%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Frustrated (Billing / Delay)</span>
                <span className="text-amber-400 font-mono">30%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Angry (Prolonged Outage)</span>
                <span className="text-rose-400 font-mono">15%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Operational Activity */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Recent Support Actions
            </span>
            <span className="text-[11px] text-slate-400">Audit log</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-semibold text-white">Resolution Sent (TKT-1042)</span>
                <p className="text-[11px] text-slate-400">Rahul Kumar approved roaming explanation (KB-102)</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">2m ago</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-semibold text-white">Escalation Handoff (TKT-1044)</span>
                <p className="text-[11px] text-slate-400">Assigned to Amit Sharma (Senior Technical Specialist)</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">15m ago</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-semibold text-white">Clarification Dispatched (TKT-1043)</span>
                <p className="text-[11px] text-slate-400">Prompted Priya Sharma for affected device scope</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">24m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
