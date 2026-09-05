import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Wifi,
  Activity,
  Shield,
  Clock,
  FileText,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Send,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { Customer360Data } from '../types';

export const Customer360: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = id || 'CUS-1001';

  const [data, setData] = useState<Customer360Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newNote, setNewNote] = useState<string>('');

  const loadProfile = () => {
    setLoading(true);
    api.getCustomer360(customerId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, [customerId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await api.addCustomerNote(customerId, 'Agent Demo', newNote.trim());
      setNewNote('');
      loadProfile();
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 p-8 text-center text-slate-400">
        Customer profile not found.
      </div>
    );
  }

  const { profile, accounts, usage, health, journey, team_notes, current_tickets, previous_tickets } = data;

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Unified Customer 360 API Payload
        </span>
      </div>

      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{profile.name}</h1>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                profile.priority === 'VIP' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-300'
              }`}>
                {profile.priority}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {profile.customer_id} • {profile.email} • {profile.phone}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{profile.address}</p>
          </div>
        </div>

        {/* Health Risk Pill */}
        {health && (
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-right space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Health Status
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                health.risk_score >= 8.0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {health.health_status}
              </span>
              <span className="text-sm font-bold text-white">{health.risk_score} / 10 Risk</span>
            </div>
            <div className="text-[10px] text-indigo-300">{health.recommended_action}</div>
          </div>
        )}
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Accounts */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
              Active Subscriptions & Telemetry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map(acc => (
                <div key={acc.id} className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-white text-sm">{acc.plan_name}</strong>
                    <span className="font-mono text-indigo-300 font-bold">₹{acc.monthly_price}/mo</span>
                  </div>
                  <div className="text-slate-400">Account: <span className="font-mono text-slate-200">{acc.account_number}</span></div>
                  {acc.additional_charges > 0 && (
                    <div className="text-amber-400 font-medium">Unbilled Surcharge: +₹{acc.additional_charges} (Roaming)</div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-700 text-[11px]">
                    <span className="text-emerald-400 font-semibold">{acc.billing_status}</span>
                    <span className="text-slate-400">{acc.service_status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Intelligence */}
          {usage && (
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-indigo-400" />
                  <span>Bandwidth & Device Intelligence</span>
                </h3>
                <span className="text-xs text-slate-400">{usage.period}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 text-[10px]">Data Consumed:</span>
                  <div className="text-base font-bold text-white mt-1">{usage.data_usage_gb} GB</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 text-[10px]">Connected Devices:</span>
                  <div className="text-base font-bold text-white mt-1">{usage.connected_devices} units</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 text-[10px]">Peak Time:</span>
                  <div className="text-base font-bold text-indigo-300 mt-1">{usage.peak_usage_start}–{usage.peak_usage_end}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 text-[10px]">Hotspot Profile:</span>
                  <div className="text-base font-bold text-amber-300 mt-1">{usage.hotspot_usage}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tickets History */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
              Customer Support History
            </h3>
            <div className="divide-y divide-slate-800">
              {[...current_tickets, ...previous_tickets].map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded cursor-pointer transition text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-indigo-400 mr-2">{t.ticket_id}</span>
                    <span className="font-medium text-slate-200">{t.subject}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (4): Journey Timeline & Team Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Journey Timeline */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Customer Journey Events</span>
            </h3>
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
              {journey.map((ev, i) => (
                <div key={i} className="relative pl-6 text-xs space-y-0.5">
                  <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    ev.severity === 'danger' ? 'bg-rose-500' :
                    ev.severity === 'warning' ? 'bg-amber-500' :
                    ev.severity === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}></span>
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-200 text-xs">{ev.title}</strong>
                    <span className="text-[10px] text-slate-400">{ev.event_date}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Team Notes */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
              Internal Notes & Specialist Flags
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {team_notes.map((n) => (
                <div key={n.id} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <strong className="text-indigo-300">{n.author}</strong>
                    <span>{n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent'}</span>
                  </div>
                  <p className="text-slate-200">{n.note}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Add team note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
