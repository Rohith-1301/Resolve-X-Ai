import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  Clock,
  Sparkles,
  Inbox,
  RefreshCw,
  Eye
} from 'lucide-react';
import { api } from '../services/api';
import { TicketListItem } from '../types';

export const Queue: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [aiStatusFilter, setAiStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(querySearch);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      if (aiStatusFilter !== 'All') params.ai_status = aiStatusFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await api.getTickets(params);
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tickets queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, aiStatusFilter, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  const getDecisionBadge = (ai_status: string) => {
    switch (ai_status) {
      case 'RESOLUTION_READY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            <span>Resolution Ready</span>
          </span>
        );
      case 'NEEDS_INFORMATION':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <HelpCircle className="w-3 h-3" />
            <span>Needs Info</span>
          </span>
        );
      case 'ESCALATION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>Escalate</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-slate-400 font-mono">Analyzing</span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-indigo-400" />
            <span>Support Operations Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ticket intelligence triage with AI-assisted resolution and risk indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTickets}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer, ticket ID, or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Customer">Awaiting Customer</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={aiStatusFilter}
            onChange={(e) => setAiStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="All">All AI Decisions</option>
            <option value="RESOLUTION_READY">Resolution Ready</option>
            <option value="NEEDS_INFORMATION">Needs Information</option>
            <option value="ESCALATION_REQUIRED">Escalation Required</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Billing">Billing</option>
            <option value="Connectivity">Connectivity</option>
            <option value="Mobile">Mobile</option>
            <option value="Plan">Plan</option>
            <option value="Roaming">Roaming</option>
            <option value="Payment">Payment</option>
          </select>

          {(statusFilter !== 'All' || priorityFilter !== 'All' || aiStatusFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
                setAiStatusFilter('All');
                setCategoryFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 55. SUPPORT QUEUE TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Category / Issue</th>
                <th className="py-3 px-4">Emotion</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">AI Triage</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Assigned / Specialist</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span>Loading support tickets...</span>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No tickets found matching criteria.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr
                    key={t.ticket_id}
                    onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white group-hover:text-indigo-400">
                      {t.ticket_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{t.customer_name}</div>
                      <div className="text-[10px] text-slate-400">{t.customer_id}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div className="font-medium text-slate-200">{t.subject}</div>
                      <div className="text-[10px] text-slate-400">{t.category} {t.subcategory ? `• ${t.subcategory}` : ''}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        t.latest_emotion === 'Angry' ? 'bg-rose-500/20 text-rose-300' :
                        t.latest_emotion === 'Frustrated' ? 'bg-amber-500/20 text-amber-300' :
                        t.latest_emotion === 'Concerned' ? 'bg-yellow-500/20 text-yellow-300' :
                        t.latest_emotion === 'Happy' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {t.latest_emotion}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        t.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getDecisionBadge(t.ai_status)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {Math.round(t.ai_confidence * 100)}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Likelihood: {Math.round(t.success_probability * 100)}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {t.specialist ? (
                        <div className="text-slate-200 font-medium">{t.specialist}</div>
                      ) : (
                        <span className="text-slate-500 italic">Tier-1 Copilot</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' :
                        t.status === 'Escalated' ? 'bg-rose-500/20 text-rose-300' :
                        t.status === 'Awaiting Customer' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${t.ticket_id}`);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white transition"
                        title="Open in Ticket Workspace"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
