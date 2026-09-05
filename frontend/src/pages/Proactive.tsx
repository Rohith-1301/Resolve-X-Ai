import React, { useState, useEffect } from 'react';
import {
  Radio,
  AlertTriangle,
  Send,
  Users,
  Clock,
  CheckCircle2,
  FileText,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { ProactiveAlert } from '../types';

export const Proactive: React.FC = () => {
  const [alert, setAlert] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [simulatedSent, setSimulatedSent] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAlert = async () => {
    try {
      setLoading(true);
      const data = await api.getProactiveAlert('ALT-1001');
      setAlert(data);
      if (data.actions && data.actions.length > 0) {
        setPreviewContent(data.actions[0].content);
        if (data.actions[0].status.includes('Sent')) {
          setSimulatedSent(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlert();
  }, []);

  const handleApproveNotification = async () => {
    try {
      setSuccessMsg('Executing human approval for proactive communication...');
      await api.approveProactiveAction('ALT-1001', alert?.actions?.[0]?.id || 1);
      setSimulatedSent(true);
      setSuccessMsg('Simulated notification broadcast dispatched to all 234 affected subscribers!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE NETWORK TELEMETRY</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {alert?.title || 'Mumbai Tower 3 Maintenance'}
          </h1>
          <p className="text-xs text-slate-300 font-mono">
            Alert ID: {alert?.alert_id} • Location: {alert?.location} • ETR: {alert?.estimated_resolution}
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-purple-400 font-mono">{alert?.affected_customers || 234}</div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Affected Subscribers</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 37. NETWORK ALERT WORKFLOW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Notification & Action Approvals (Col 5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Notification Composer */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>39. Proactive Customer Notification</span>
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                simulatedSent ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {simulatedSent ? 'Sent (Simulated)' : 'Awaiting Human Approval'}
              </span>
            </div>

            <textarea
              rows={4}
              value={previewContent}
              onChange={(e) => setPreviewContent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">Human-in-the-loop mandated</span>
              <button
                onClick={handleApproveNotification}
                disabled={simulatedSent}
                className={`py-2 px-4 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  simulatedSent
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{simulatedSent ? 'Dispatched (Simulated)' : 'Approve & Send Notification'}</span>
              </button>
            </div>
          </div>

          {/* Operational Checklist */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Proactive Action Checklist
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Agent Briefing Broadcast</div>
                  <div className="text-[10px] text-slate-400">Briefing sent to Mumbai queue agents</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">Active</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Compensation Review Matrix</div>
                  <div className="text-[10px] text-slate-400">10% bill credit queue prepared for outages exceeding 4 hours</div>
                </div>
                <span className="text-[10px] font-bold text-indigo-400">Prepared</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Knowledge Base Live Update</div>
                  <div className="text-[10px] text-slate-400">KB-113 & KB-114 updated with ETR 2 hours</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: 38. AFFECTED CUSTOMER ANALYSIS TABLE (Col 7) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>38. Affected Customer Analysis ({alert?.affected_customers || 234} Subscribers)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Cohort Sample</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Ticket</th>
                  <th className="py-2.5 px-3">Emotion</th>
                  <th className="py-2.5 px-3">Risk</th>
                  <th className="py-2.5 px-3">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(alert?.affected_list_preview || []).map((c: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{c.customer_id}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{c.plan_name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        c.priority === 'VIP' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-indigo-400 font-semibold">
                      {c.ticket_id || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        c.emotion === 'Angry' ? 'bg-rose-500/20 text-rose-300' :
                        c.emotion === 'Frustrated' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {c.emotion}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold ${
                        c.risk === 'Critical' ? 'text-rose-400' :
                        c.risk === 'High' ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {c.risk}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      {c.recommended_action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
