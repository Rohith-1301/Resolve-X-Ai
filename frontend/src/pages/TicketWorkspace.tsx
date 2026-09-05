import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Send,
  UserCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  TrendingUp,
  RefreshCw,
  Edit3,
  Check,
  Shield,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  BookOpen,
  Wrench
} from 'lucide-react';
import { api } from '../services/api';
import { TicketDetail, Customer360Data } from '../types';

export const TicketWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = id || 'TKT-1042';

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [customer360, setCustomer360] = useState<Customer360Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [editableDraft, setEditableDraft] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isCustomerTyping, setIsCustomerTyping] = useState<boolean>(false);

  const loadData = async (tid: string) => {
    try {
      setLoading(true);
      setError(null);
      const tData = await api.getTicket(tid);
      setTicket(tData);

      if (tData.customer_id) {
        const c360 = await api.getCustomer360(tData.customer_id);
        setCustomer360(c360);
      }

      if (tData.ai_analysis?.draft_response) {
        setEditableDraft(tData.ai_analysis.draft_response);
      } else if (tData.ai_analysis?.suggested_question) {
        setEditableDraft(tData.ai_analysis.suggested_question);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(ticketId);
  }, [ticketId]);

  // Actions
  const handleApproveAndSend = async () => {
    if (!ticket) return;
    try {
      const msgToSend = editableDraft.trim() || (
        ticket.category === 'Billing'
          ? "Hello Rahul, I have verified your account. The additional ₹500 reflects the International Roaming Pack from Aug 28. (Ref: KB-102)"
          : ticket.ticket_id === 'TKT-1044'
          ? "Hello Arjun, I understand your frustration. Because your line shows physical optical loss after repeated restarts, I have escalated your ticket to Senior Specialist Amit Sharma."
          : "Hello Priya, please disconnect from Wi-Fi, toggle Airplane Mode for 10 seconds, and reconnect your laptop. (Ref: KB-104)"
      );

      setActionSuccess('Response approved and sent! Awaiting customer response...');
      const cited = ticket.ai_analysis?.recommended_articles || ['KB-102'];
      await api.approveResponse(ticket.ticket_id, msgToSend, cited, isEditing);
      
      // Reload ticket data to reflect agent message
      const updatedTicket = await api.getTicket(ticket.ticket_id);
      setTicket(updatedTicket);

      // Trigger automatic customer reply every time
      setIsCustomerTyping(true);
      setTimeout(async () => {
        try {
          const replyRes = await api.customerReply(ticket.ticket_id);
          setIsCustomerTyping(false);

          if (replyRes.new_draft) {
            setEditableDraft(replyRes.new_draft);
          }

          if (replyRes.new_status === 'Escalated' || replyRes.ai_decision === 'ESCALATION_REQUIRED') {
            setActionSuccess('🚨 Customer reports issue persistent → Handed over to Senior Specialist Amit Sharma!');
          } else if (replyRes.new_status === 'Resolved') {
            setActionSuccess('✓ Customer confirmed resolution! Issue successfully resolved.');
          } else {
            setActionSuccess('Customer replied! Next AI response prepared.');
          }

          const freshTicket = await api.getTicket(ticket.ticket_id);
          setTicket(freshTicket);
          setTimeout(() => setActionSuccess(null), 4000);
        } catch (e) {
          setIsCustomerTyping(false);
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAskCustomer = async () => {
    if (!ticket) return;
    try {
      const qText = ticket.ai_analysis?.suggested_question || 'Is the issue affecting all devices connected to your Wi-Fi, or only one device?';
      setActionSuccess('Clarification question sent to customer...');
      await api.askCustomer(ticket.ticket_id, qText);
      const updatedTicket = await api.getTicket(ticket.ticket_id);
      setTicket(updatedTicket);

      // Automatically simulate customer response after 1.5 seconds
      setIsCustomerTyping(true);
      setTimeout(async () => {
        try {
          const replyRes = await api.customerReply(ticket.ticket_id, "It's only affecting my laptop. My phone is working fine on the Wi-Fi.");
          setIsCustomerTyping(false);
          setActionSuccess('Customer responded: single laptop affected. Missing info resolved → RESOLUTION READY.');
          
          if (replyRes.new_draft) {
            setEditableDraft(replyRes.new_draft);
          }

          const freshTicket = await api.getTicket(ticket.ticket_id);
          setTicket(freshTicket);
          setTimeout(() => setActionSuccess(null), 3000);
        } catch (err: any) {
          setIsCustomerTyping(false);
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSendMessageInput = async () => {
    if (!ticket || !replyText.trim()) return;
    try {
      const text = replyText.trim();
      setReplyText('');
      setActionSuccess('Message sent to customer...');
      await api.approveResponse(ticket.ticket_id, text, [], true);
      const updatedTicket = await api.getTicket(ticket.ticket_id);
      setTicket(updatedTicket);

      // Auto-reply
      setIsCustomerTyping(true);
      setTimeout(async () => {
        try {
          const replyRes = await api.customerReply(ticket.ticket_id);
          setIsCustomerTyping(false);
          if (replyRes.new_draft) {
            setEditableDraft(replyRes.new_draft);
          }
          const freshTicket = await api.getTicket(ticket.ticket_id);
          setTicket(freshTicket);
          setActionSuccess('Customer responded automatically!');
          setTimeout(() => setActionSuccess(null), 3000);
        } catch (e) {
          setIsCustomerTyping(false);
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEscalate = async () => {
    if (!ticket) return;
    try {
      const spec = ticket.specialist || 'Amit Sharma';
      const reason = ticket.ai_analysis?.reason || '3-day outage, repeated failed troubleshooting, angry customer.';
      setActionSuccess('Handing over to Senior Specialist ' + spec + ' with executive summary...');
      await api.escalateTicket(ticket.ticket_id, spec, reason, true);
      setActionSuccess('Ticket escalated directly to ' + spec + '! Opening Specialist Desk...');
      const updated = await api.getTicket(ticket.ticket_id);
      setTicket(updated);
      setTimeout(() => {
        navigate('/specialist?ticket=' + ticket.ticket_id);
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegenerate = async () => {
    if (!ticket) return;
    try {
      setRegenerating(true);
      setActionSuccess('Regenerating grounded response from verified knowledge...');
      const result = await api.regenerateAnalysis(ticket.ticket_id);
      if (result.draft_response) {
        setEditableDraft(result.draft_response);
      }
      setActionSuccess('Response regenerated with grounded citations!');
      setTimeout(() => setActionSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono">Loading Ticket {ticketId}...</span>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-slate-950">
        <div className="p-6 max-w-md bg-slate-900 border border-slate-800 rounded-xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Ticket Unavailable</h3>
          <p className="text-xs text-slate-400">{error || 'Unable to locate ticket record'}</p>
          <button
            onClick={() => navigate('/queue')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Return to Support Queue
          </button>
        </div>
      </div>
    );
  }

  const aiAnalysis = ticket.ai_analysis;
  const decision = aiAnalysis?.decision || ticket.ai_status;

  const decisionBadge = {
    RESOLUTION_READY: {
      label: 'Resolution Ready',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      desc: 'Verified context and knowledge matched. Response ready for agent approval.'
    },
    NEEDS_INFORMATION: {
      label: 'Needs Information',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: HelpCircle,
      desc: 'Missing affected device scope. Targeted clarification question prepared.'
    },
    ESCALATION_REQUIRED: {
      label: 'Escalation Required',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: AlertTriangle,
      desc: 'Complex outage with repeated attempts. Specialist handoff prepared.'
    }
  }[decision] || {
    label: decision,
    color: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: HelpCircle,
    desc: 'Analysis in progress.'
  };

  const DecisionIcon = decisionBadge.icon;

  const isBilling = ticket.category === 'Billing' || ticket.ticket_id === 'TKT-1042';
  const isOutage = ticket.ticket_id === 'TKT-1044' || ticket.ai_status === 'ESCALATION_REQUIRED' || ticket.status === 'Escalated';

  const knowledgeInfo = isBilling
    ? {
        id: 'KB-102',
        title: 'Understanding Additional Charges & Roaming Add-ons',
        relevance: '96%',
        excerpt: 'International roaming packs and metered data usage are billed in arrears on subsequent invoices. Standard fiber base rates do not include roaming surcharges.',
        whyMatches: 'Directly explains the ₹500 difference between the base plan and current invoice.',
        lastUpdated: 'Aug 2026'
      }
    : isOutage
    ? {
        id: 'KB-103',
        title: 'Fiber Optical Signal Loss & OLT Fault Diagnostics',
        relevance: '97%',
        excerpt: 'Persistent optical signal loss (LOS) exceeding 48 hours requires physical OLT patch cord inspection and Tier-3 field dispatch.',
        whyMatches: 'Addresses persistent 3-day optical loss after customer rebooted router.',
        lastUpdated: 'Jul 2026'
      }
    : {
        id: 'KB-104',
        title: 'Wi-Fi Device Connectivity Troubleshooting',
        relevance: '94%',
        excerpt: 'When broadband line sync is active, single-device failures indicate local Wi-Fi adapter or DHCP lease stall rather than an optical line fault.',
        whyMatches: 'Provides targeted steps to isolate device vs. line connection issues.',
        lastUpdated: 'Aug 2026'
      };

  // Clean, valid message list with zero empty bubbles
  const validMessages = (ticket.messages || []).filter(
    (m) => m.message_text && m.message_text.trim().length > 0
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Workspace Bar */}
      <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/queue')}
            className="text-xs font-medium text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            ← Queue
          </button>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white font-mono">{ticket.ticket_id}</span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-sm">{ticket.subject}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
              ticket.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
              ticket.status === 'Awaiting Customer' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
              ticket.status === 'Escalated' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
              'bg-blue-500/15 text-blue-300 border-blue-500/30'
            }`}>
              {ticket.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
              Priority: {ticket.priority}
            </span>
          </div>
        </div>

        {/* Demo Jumps & Specialist Link */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => navigate('/specialist?ticket=' + ticket.ticket_id)}
            className="px-2.5 py-1 rounded text-[11px] font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition"
          >
            <UserCheck className="w-3 h-3 text-indigo-400" />
            <span>Specialist Desk</span>
          </button>

          <span className="text-slate-700 mx-1">|</span>
          <span className="text-slate-500 text-[11px] mr-1 hidden sm:inline">Cases:</span>
          <button
            onClick={() => navigate('/tickets/TKT-1042')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
              ticket.ticket_id === 'TKT-1042'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1. Billing (Rahul)
          </button>
          <button
            onClick={() => navigate('/tickets/TKT-1043')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
              ticket.ticket_id === 'TKT-1043'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            2. Missing Info (Priya)
          </button>
          <button
            onClick={() => navigate('/tickets/TKT-1044')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
              ticket.ticket_id === 'TKT-1044'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3. Escalation (Arjun)
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 3-COLUMN WORKSPACE */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* ================= COLUMN 1: CUSTOMER 360 (Col 3) ================= */}
        <div className="col-span-12 lg:col-span-3 border-r border-slate-800/80 bg-slate-950 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer 360</h3>
            <button
              onClick={() => navigate(`/customers/${ticket.customer_id}`)}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <span>Full Profile</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Customer Profile & Plan Summary */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{customer360?.profile?.name || ticket.customer_name}</span>
                  {ticket.customer_priority === 'VIP' && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                      VIP
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: {ticket.customer_id}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                {customer360?.profile?.customer_type || 'Residential Fiber'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Plan</span>
                <span className="font-semibold text-slate-200">{customer360?.accounts?.[0]?.plan_name || 'Fiber 500 Mbps'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Monthly Price</span>
                <span className="font-semibold text-slate-200">₹{customer360?.accounts?.[0]?.monthly_price || 999}/mo</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Billing Status</span>
                <span className="font-semibold text-emerald-400">{customer360?.accounts?.[0]?.billing_status || 'Paid (Auto-debit)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Service Status</span>
                <span className="font-semibold text-blue-400">Active GPON Node</span>
              </div>
            </div>
          </div>

          {/* Relevant Previous Tickets */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Previous Tickets</span>
              <span className="text-slate-500 text-[11px]">
                {customer360?.previous_tickets?.length || (ticket.ticket_id === 'TKT-1044' ? 1 : 0)}
              </span>
            </div>

            {ticket.ticket_id === 'TKT-1044' ? (
              <div
                onClick={() => navigate('/tickets/TKT-1031')}
                className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30 text-xs space-y-1 cursor-pointer hover:border-amber-500 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400">TKT-1031</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-medium">
                    Closed Unresolved
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Fiber outage reported 3 days ago. Field ticket closed without resolution.</p>
              </div>
            ) : customer360?.previous_tickets && customer360.previous_tickets.length > 0 ? (
              <div className="space-y-1.5">
                {customer360.previous_tickets.slice(0, 2).map((pt, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono font-semibold text-slate-300">{pt.ticket_id}</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{pt.subject}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{pt.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 py-1">
                No previous tickets found for this account.
              </div>
            )}
          </div>

          {/* Customer Notes */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">
              Customer Touchpoint Notes
            </span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              {isBilling
                ? 'VIP account in good standing. Customer enrolled in Auto-debit on 1st of every month.'
                : isOutage
                ? 'Customer escalated to Tier-1 twice in past 48 hours. Demanding manager callback and credit adjustment.'
                : 'Account active for 14 months. Standard dual-band Wi-Fi router installed in living room.'}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: CONVERSATION (Col 5) ================= */}
        <div className="col-span-12 lg:col-span-5 border-r border-slate-800/80 bg-slate-950 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Customer Conversation
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Channel: Inbound Support
            </span>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {validMessages.length > 0 ? (
              validMessages.map((msg, idx) => {
                const isCustomer = msg.sender_type === 'customer';
                const isSpecialist = msg.message_text.includes('Specialist');
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-slate-300">
                        {isCustomer
                          ? ticket.customer_name
                          : isSpecialist
                          ? 'Specialist Amit Sharma'
                          : 'ResolveX Copilot (Agent)'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                      {msg.emotion && isCustomer && (
                        <span className={`text-[10px] px-2 py-0.2 rounded font-medium border ${
                          msg.emotion === 'Angry' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                          msg.emotion === 'Frustrated' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {msg.emotion}
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-[88%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        isCustomer
                          ? 'bg-slate-900 text-white rounded-tl-none border border-slate-800 text-[13px] font-medium'
                          : isSpecialist
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}
                    >
                      {msg.message_text}
                    </div>
                  </div>
                );
              })
            ) : (
              /* If conversation had no messages yet, show starter customer problem */
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-slate-300">{ticket.customer_name}</span>
                  <span className="text-[10px] text-slate-500">Just now</span>
                </div>
                <div className="max-w-[88%] rounded-xl px-4 py-3 text-xs leading-relaxed bg-slate-900 text-white rounded-tl-none border border-slate-800 text-[13px] font-medium">
                  {ticket.description || ticket.subject || 'Hello, I need help with my broadband account.'}
                </div>
              </div>
            )}

            {/* Customer Live Typing Indicator */}
            {isCustomerTyping && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-slate-300">{ticket.customer_name}</span>
                  <span className="text-[10px] text-blue-400 font-medium">Customer is replying...</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-tl-none px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-[11px] text-slate-400">{ticket.customer_name} is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Input Bar (Live Chat with Automatic Customer Response) */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type response or ask question (Customer will automatically reply)..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessageInput();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessageInput}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs transition shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3: AI COPILOT & ACTIONS (Col 4) ================= */}
        <div className="col-span-12 lg:col-span-4 bg-slate-950 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                ResolveX Copilot
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Confidence: <strong className="text-emerald-400 font-mono">{Math.round((aiAnalysis?.confidence || 0.94) * 100)}%</strong>
            </span>
          </div>

          {/* 1. AI Analysis */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AI Analysis</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Intent</span>
                <span className="font-semibold text-blue-300">{aiAnalysis?.intent || ticket.category || 'Connectivity'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Issue</span>
                <span className="font-semibold text-slate-200">{aiAnalysis?.subcategory || 'Clarification'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Confidence</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round((aiAnalysis?.confidence || 0.94) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* 2. Customer Context (STRICTLY CONTEXT-AWARE) */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Customer Context (Ticket Relevant)
            </span>

            {isBilling ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Base Plan</span>
                  <span className="font-mono font-semibold text-white">₹999/mo</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Current Bill</span>
                  <span className="font-mono font-semibold text-slate-200">₹1,499</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Surcharge</span>
                  <span className="font-mono font-bold text-rose-400">+₹500 (Roaming)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Billing Status</span>
                  <span className="font-semibold text-emerald-400">Paid (Auto-debit)</span>
                </div>
              </div>
            ) : isOutage ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Line Status</span>
                  <span className="font-semibold text-rose-400">Optical Loss (LOS)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Outage Duration</span>
                  <span className="font-semibold text-amber-300">3 Consecutive Days</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Prior Ticket</span>
                  <span className="font-mono font-semibold text-amber-400">TKT-1031 (Unresolved)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Customer State</span>
                  <span className="font-semibold text-rose-400">Angry (92%)</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Service Status</span>
                  <span className="font-semibold text-emerald-400">Active GPON Node</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Line Optical Power</span>
                  <span className="font-mono font-semibold text-slate-200">-19.2 dBm (Healthy)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 col-span-2">
                  <span className="text-[10px] text-slate-500 block">Device Scope</span>
                  <span className="font-semibold text-amber-300">
                    {decision === 'RESOLUTION_READY'
                      ? 'Single device (laptop only, phone working)'
                      : 'Unknown (Clarification required)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Knowledge Grounding */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Supporting Knowledge Article
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Match: {knowledgeInfo.relevance}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-blue-300 text-xs flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{knowledgeInfo.id} — {knowledgeInfo.title}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                "{knowledgeInfo.excerpt}"
              </p>
              <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-800/80 flex justify-between">
                <span>Why it matches: {knowledgeInfo.whyMatches}</span>
                <span className="text-slate-500">{knowledgeInfo.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* 4. AI Decision Banner */}
          <div className={`p-3 rounded-xl border ${decisionBadge.color} space-y-1`}>
            <div className="flex items-center justify-between font-bold text-xs">
              <div className="flex items-center gap-1.5">
                <DecisionIcon className="w-3.5 h-3.5" />
                <span>{decisionBadge.label}</span>
              </div>
              <span className="text-[10px] font-mono">
                {Math.round((aiAnalysis?.confidence || 0.94) * 100)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {decisionBadge.desc}
            </p>
          </div>

          {/* Scenario 2: Needs Information Prompts */}
          {decision === 'NEEDS_INFORMATION' && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Clarification Question For Customer</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/20 text-xs text-amber-200 italic">
                "Is the issue affecting all devices connected to your Wi-Fi, or only one device?"
              </div>
              <button
                onClick={handleAskCustomer}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask Customer (Customer Will Auto-Reply)</span>
              </button>
            </div>
          )}

          {/* Scenario 3: Specialist Handover Briefing Card */}
          {(decision === 'ESCALATION_REQUIRED' || ticket.status === 'Escalated') && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Executive Specialist Handover Briefing</span>
                </div>
                <span className="text-[10px] font-mono bg-rose-500/20 px-1.5 py-0.5 rounded">97% Match</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Specialist:</span>
                  <strong className="text-white">Amit Sharma (Tier-3 Specialist)</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Failure Diagnostic:</span>
                  <span className="text-rose-300 font-semibold">Physical Line Optical Loss (-28.4 dBm)</span>
                </div>
                <p className="text-[11px] text-slate-300 border-t border-slate-800/80 pt-1">
                  Customer attempted router power-cycle twice. Red LOS light persists. Mandates field technician dispatch and OLT port recalibration.
                </p>
              </div>

              {/* Direct Link into Specialist Portal */}
              <button
                onClick={() => navigate('/specialist?ticket=' + ticket.ticket_id)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Open in Specialist Desk Portal →</span>
              </button>
            </div>
          )}

          {/* 5. Grounded Response (Editable Box) */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Grounded Response Draft</span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                rows={4}
                value={editableDraft}
                onChange={(e) => setEditableDraft(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500 rounded-lg p-2 text-xs text-slate-100 focus:outline-none leading-relaxed"
              />
            ) : (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {editableDraft || (isBilling 
                  ? "Hello Rahul, I have verified your account details. Your plan is Fiber 500 Mbps at ₹999/month. The additional ₹500 reflects the International Roaming Pack activated on Aug 28. As referenced in policy KB-102, roaming charges are billed in arrears on your subsequent invoice."
                  : isOutage
                  ? "Hello Arjun, I apologize for the prolonged disruption you've experienced over the last 3 days. Because your line shows physical optical loss after repeated router restarts, I have escalated your ticket directly to Senior Specialist Amit Sharma for expedited field dispatch."
                  : "Hello Priya, please let us know if the connection drop affects all devices or only one device so we can resolve it immediately.")
                }
              </div>
            )}

            {/* AI Action Buttons (Clean & Always Clickable) */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleApproveAndSend}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Send (Customer Auto-Replies)</span>
              </button>

              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-1"
                title="Regenerate"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleAskCustomer}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask Customer</span>
              </button>

              <button
                onClick={handleEscalate}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Escalate</span>
              </button>
            </div>
          </div>

          {/* 6. Why This Answer? (Evidence-Based Checklist) */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Why This Answer?
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Customer account verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Previous conversation checked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Relevant knowledge article found</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Required information available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Response grounded in approved knowledge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
