import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserCheck,
  AlertTriangle,
  Wrench,
  RefreshCw,
  CreditCard,
  PhoneCall,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Edit3,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { TicketListItem, TicketDetail } from '../types';

export const SpecialistDesk: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTicketId = searchParams.get('ticket') || 'TKT-1044';

  const [activeSpecialist, setActiveSpecialist] = useState<string>('Amit Sharma');
  const [escalatedTickets, setEscalatedTickets] = useState<TicketListItem[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(initialTicketId);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // AI-generated specialist draft state
  const [aiSpecialistDraft, setAiSpecialistDraft] = useState<string>('');
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState<boolean>(false);

  const specialists = [
    {
      name: 'Amit Sharma',
      role: 'Senior Technical Specialist',
      dept: 'Tier-3 Network Operations & GPON Infrastructure',
      avatar: 'AS',
      badge: 'Tier-3 Tech',
      activeCount: 3,
      domain: 'Fiber Optics, OLT Ports, Signal Loss (LOS), Gateway Breakage'
    },
    {
      name: 'Neha Gupta',
      role: 'Senior Billing Specialist',
      dept: 'Tariff Escalations & Financial Adjustments',
      avatar: 'NG',
      badge: 'Billing Lead',
      activeCount: 1,
      domain: 'Roaming Disputes, Metered Overages, Goodwill Waivers'
    },
    {
      name: 'Priya Nair',
      role: 'VIP Retention Manager',
      dept: 'Executive Customer Experience',
      avatar: 'PN',
      badge: 'VIP Retention',
      activeCount: 2,
      domain: 'SLA Breach Mitigation, Corporate Subscribers'
    }
  ];

  const currentSpecObj = specialists.find((s) => s.name === activeSpecialist) || specialists[0];

  // Helper to generate AI specialist draft based on ticket and intent
  const generateAIDraft = (ticket: TicketDetail | null, specialistName: string, templateType = 'default') => {
    if (!ticket) return '';
    const custName = ticket.customer_name || 'Customer';

    if (templateType === 'dispatch') {
      return `Hello ${custName}, I am ${specialistName} from Tier-3 Engineering. Based on our optical diagnostics showing line attenuation, I have dispatched Field Engineer Rajesh Varma (Van #04) equipped with OTDR fiber testing equipment. He will arrive at your premises within 45 minutes to inspect the physical feeder drop. Please let me know if this arrival window works for you.`;
    }

    if (templateType === 'olt_reset') {
      return `Hello ${custName}, Senior Specialist ${specialistName} here. I have executed an automated remote OLT laser recalibration and GPON frame resynchronization on Port 03 / Splitter #4. Your optical line power has stabilized to healthy -18.9 dBm. Please check if your router's LOS light has turned solid green.`;
    }

    if (templateType === 'credit') {
      return `Hello ${custName}, as Senior Specialist, I have reviewed your account and ticket history. Given the disruption you experienced, I have authorized a courtesy goodwill credit of ₹500 to be applied to your active invoice under our SLA guarantee.`;
    }

    if (templateType === 'callback') {
      return `Hello ${custName}, Senior Specialist ${specialistName} here. I have scheduled an outbound priority phone consultation for today at 5:00 PM. A senior engineering manager will call your registered mobile number to discuss your connectivity restoration and ensure permanent stability.`;
    }

    // Default contextual AI drafts
    if (ticket.ticket_id === 'TKT-1044' || ticket.category === 'Connectivity') {
      return `Hello ${custName}, I have personally taken ownership of your escalation. Our telemetry confirms physical optical loss (LOS) with -28.4 dBm attenuation on Splitter #4. I have scheduled an immediate remote OLT port recalibration, and Tier-3 Field Engineer Rajesh Varma (Van #04) is en route with OTDR testing gear (ETA: 45 mins) to inspect your physical fiber drop. I will monitor your connection until fully stable.`;
    }

    if (ticket.ticket_id === 'TKT-1042' || ticket.category === 'Billing') {
      return `Hello ${custName}, Senior Billing Specialist ${specialistName} here. I have reviewed your invoice details. While the ₹500 charge corresponds to international roaming data used on Aug 28, I understand this was unexpected. As a valued VIP subscriber, I have authorized a one-time ₹500 goodwill credit on your account, which will appear on your next statement.`;
    }

    return `Hello ${custName}, I am ${specialistName}. I have reviewed your case history and taken personal ownership of this escalation. Our engineering team is actively investigating the root cause, and I will keep you updated every step of the way until your service is 100% restored.`;
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const allTickets = await api.getTickets();
      const escalated = allTickets.filter(
        (t) =>
          t.status === 'Escalated' ||
          t.ai_status === 'ESCALATION_REQUIRED' ||
          t.ticket_id === 'TKT-1044' ||
          t.priority === 'Critical' ||
          t.priority === 'High'
      );
      setEscalatedTickets(escalated.length > 0 ? escalated : allTickets.slice(0, 4));

      const targetId = selectedTicketId || (escalated[0]?.ticket_id || 'TKT-1044');
      setSelectedTicketId(targetId);
      const detail = await api.getTicket(targetId);
      setSelectedTicket(detail);

      // Generate initial AI specialist draft
      const draft = generateAIDraft(detail, activeSpecialist);
      setAiSpecialistDraft(draft);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSelectTicket = async (tid: string) => {
    setSelectedTicketId(tid);
    try {
      const detail = await api.getTicket(tid);
      setSelectedTicket(detail);
      const draft = generateAIDraft(detail, activeSpecialist);
      setAiSpecialistDraft(draft);
      setIsEditingDraft(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchSpecialist = (specName: string) => {
    setActiveSpecialist(specName);
    if (selectedTicket) {
      const draft = generateAIDraft(selectedTicket, specName);
      setAiSpecialistDraft(draft);
    }
  };

  const handleApplyTemplate = (templateType: string) => {
    if (selectedTicket) {
      const draft = generateAIDraft(selectedTicket, activeSpecialist, templateType);
      setAiSpecialistDraft(draft);
      setActionNotice('AI specialist response generated: ' + templateType.replace('_', ' ').toUpperCase());
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // The primary action: Specialist checks, edits, and clicks to send to customer!
  const handleSendSpecialistMessage = async () => {
    if (!selectedTicket || !aiSpecialistDraft.trim()) return;
    try {
      setActionLoading(true);
      setActionNotice('Sending approved specialist message to customer...');

      const textToSend = aiSpecialistDraft.trim();

      const res = await api.specialistAction(
        selectedTicket.ticket_id,
        'specialist_reply',
        activeSpecialist,
        textToSend
      );

      // Refresh ticket messages
      const updated = await api.getTicket(selectedTicket.ticket_id);
      setSelectedTicket(updated);

      // Show typing indicator for customer
      setIsCustomerTyping(true);
      setTimeout(async () => {
        setIsCustomerTyping(false);
        const fresh = await api.getTicket(selectedTicket.ticket_id);
        setSelectedTicket(fresh);
        setActionNotice('Message delivered! Customer confirmed with acknowledgment: "' + (res.customer_reply || 'Thank you!') + '"');
        setTimeout(() => setActionNotice(null), 5000);
      }, 1500);

    } catch (err: any) {
      setActionNotice('Error sending message: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Quick action buttons (Dispatch, OLT reset, Credit, Callback, Resolve)
  const handleQuickAction = async (actionType: string) => {
    if (!selectedTicket) return;
    try {
      setActionLoading(true);
      setActionNotice('Executing specialist intervention (' + actionType + ')...');

      await api.specialistAction(
        selectedTicket.ticket_id,
        actionType,
        activeSpecialist
      );

      const updated = await api.getTicket(selectedTicket.ticket_id);
      setSelectedTicket(updated);

      setIsCustomerTyping(true);
      setTimeout(async () => {
        setIsCustomerTyping(false);
        const fresh = await api.getTicket(selectedTicket.ticket_id);
        setSelectedTicket(fresh);
        setActionNotice('Specialist intervention completed and verified with customer!');
        setTimeout(() => setActionNotice(null), 4000);
      }, 1500);
    } catch (err: any) {
      setActionNotice('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !selectedTicket) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono">Loading Specialist Desk & Escalations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Specialist Desk & Handover Portal</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Tier-2 / Tier-3 Escalations
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              AI creates specialist messages • Review, edit, and click to send directly to the customer.
            </p>
          </div>
        </div>

        {/* Specialist Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Specialist:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1">
            {specialists.map((s) => (
              <button
                key={s.name}
                onClick={() => handleSwitchSpecialist(s.name)}
                className={'px-2.5 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 ' + (
                  activeSpecialist === s.name
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                )}
              >
                <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px]">
                  {s.avatar}
                </span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="px-6 py-2 bg-indigo-500/15 border-b border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* COLUMN 1: ESCALATED CUSTOMER QUEUE (Col 3) */}
        <div className="col-span-12 lg:col-span-3 border-r border-slate-800/80 bg-slate-950 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Escalated Cases ({escalatedTickets.length})
            </span>
            <span className="text-[10px] text-rose-400 font-medium">Needs Specialist</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {escalatedTickets.map((t) => {
              const isSelected = t.ticket_id === selectedTicketId;
              return (
                <div
                  key={t.ticket_id}
                  onClick={() => handleSelectTicket(t.ticket_id)}
                  className={'p-3.5 rounded-xl border transition cursor-pointer space-y-2 ' + (
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-white">{t.ticket_id}</span>
                        <span className="text-xs font-semibold text-slate-200">{t.customer_name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                        {t.subject}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {t.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{t.ticket_id === 'TKT-1044' ? '3 Days Outage' : 'Priority: ' + t.priority}</span>
                    </span>
                    <span className="text-indigo-400 font-medium">{t.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: CUSTOMER QUERIES & LIVE TRANSCRIPT (Col 4) */}
        <div className="col-span-12 lg:col-span-4 border-r border-slate-800/80 bg-slate-950 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Customer Query Transcript: {selectedTicket?.ticket_id}
              </h3>
            </div>
            <button
              onClick={() => navigate('/tickets/' + selectedTicket?.ticket_id)}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Agent Workspace</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {selectedTicket?.messages && selectedTicket.messages.filter(m => m.message_text && m.message_text.trim().length > 0).length > 0 ? (
              selectedTicket.messages
                .filter((m) => m.message_text && m.message_text.trim().length > 0)
                .map((msg, idx) => {
                  const isCustomer = msg.sender_type === 'customer';
                  const isSpecialist = msg.message_text.includes('Specialist');
                  return (
                    <div
                      key={idx}
                      className={'flex flex-col ' + (isCustomer ? 'items-start' : 'items-end')}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-slate-300">
                          {isCustomer
                            ? selectedTicket.customer_name
                            : isSpecialist
                            ? 'Specialist ' + activeSpecialist
                            : 'Tier-1 Copilot'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Just now'}
                        </span>
                        {isCustomer && msg.emotion && (
                          <span className={'text-[10px] px-1.5 py-0.2 rounded border font-medium ' + (
                            msg.emotion === 'Angry'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          )}>
                            {msg.emotion}
                          </span>
                        )}
                      </div>
                      <div
                        className={'max-w-[88%] rounded-xl px-4 py-3 text-xs leading-relaxed ' + (
                          isCustomer
                            ? 'bg-slate-900 text-white rounded-tl-none border border-slate-800 font-medium'
                            : isSpecialist
                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                            : 'bg-blue-600 text-white rounded-tr-none'
                        )}
                      >
                        {msg.message_text}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <p className="text-xs font-semibold text-white">
                  Customer Problem: "{selectedTicket?.subject}"
                </p>
                <p className="text-[11px] text-slate-400">
                  {selectedTicket?.description || 'Subscriber reported service failure. No previous messages recorded.'}
                </p>
              </div>
            )}

            {/* Customer Live Typing Animation */}
            {isCustomerTyping && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-slate-300">{selectedTicket?.customer_name}</span>
                  <span className="text-[10px] text-indigo-400 font-medium">Customer is replying...</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-tl-none px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-[11px] text-slate-400">{selectedTicket?.customer_name} is typing acknowledgment...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Messages sent from the right panel appear in this customer stream in real-time.</span>
            </span>
          </div>
        </div>

        {/* COLUMN 3: AI-GENERATED SPECIALIST MESSAGE REVIEW & SEND (Col 5) */}
        <div className="col-span-12 lg:col-span-5 bg-slate-950 overflow-y-auto p-4 space-y-4">
          
          {/* AI SPECIALIST MESSAGE REVIEW & EDIT BOX (User Requested Feature) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 shadow-lg space-y-3 ring-1 ring-indigo-500/20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    AI-Prepared Specialist Message
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Review, edit if needed, and click to send directly to customer.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditingDraft(!isEditingDraft)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-300 font-medium flex items-center gap-1 transition"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingDraft ? 'Done Editing' : 'Edit Text'}</span>
              </button>
            </div>

            {/* Quick AI Template Switcher */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Generate Targeted AI Draft By Action:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleApplyTemplate('dispatch')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-medium transition flex items-center gap-1 border border-slate-700"
                >
                  <Wrench className="w-3 h-3 text-indigo-400" />
                  <span>Field Dispatch</span>
                </button>
                <button
                  onClick={() => handleApplyTemplate('olt_reset')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-medium transition flex items-center gap-1 border border-slate-700"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>Remote OLT Reset</span>
                </button>
                <button
                  onClick={() => handleApplyTemplate('credit')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-medium transition flex items-center gap-1 border border-slate-700"
                >
                  <CreditCard className="w-3 h-3 text-amber-400" />
                  <span>₹500 Goodwill Credit</span>
                </button>
                <button
                  onClick={() => handleApplyTemplate('callback')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-medium transition flex items-center gap-1 border border-slate-700"
                >
                  <PhoneCall className="w-3 h-3 text-blue-400" />
                  <span>Senior Callback</span>
                </button>
                <button
                  onClick={() => handleApplyTemplate('default')}
                  className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded text-[11px] font-medium transition flex items-center gap-1 border border-indigo-500/30"
                  title="Regenerate Default AI Draft"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Editable Specialist Draft Textarea */}
            <div className="relative">
              <textarea
                rows={5}
                value={aiSpecialistDraft}
                onChange={(e) => setAiSpecialistDraft(e.target.value)}
                placeholder="AI specialist response draft will appear here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 pt-1">
                <span>Sending as: <strong className="text-white font-medium">{activeSpecialist} ({currentSpecObj.role})</strong></span>
                <span className="text-slate-500">{aiSpecialistDraft.length} characters</span>
              </div>
            </div>

            {/* SEND BUTTON: Specialist checks & clicks to send */}
            <button
              disabled={actionLoading || !aiSpecialistDraft.trim()}
              onClick={handleSendSpecialistMessage}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Click & Send Message to Customer (Customer Auto-Replies)</span>
            </button>
          </div>

          {/* AI Executive Handover Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Executive Handover Briefing
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">97% Match</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/20 space-y-1.5">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Why Tier-1 Could Not Resolve</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Persistent physical optical loss (LOS) detected. Line signal attenuation is <strong className="text-rose-400">-28.4 dBm</strong> (critical threshold -25 dBm). Customer performed router power-cycle twice with zero recovery. Requires field technician splice test and OLT port recalibration.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-indigo-300 block">AI Recommended Intervention</span>
              <p className="text-[11px] text-indigo-100">
                1) Dispatch Tier-3 field engineer with OTDR meter to verify last-mile fiber split. 2) Reset OLT port binding to refresh GPON frame synchronization.
              </p>
            </div>
          </div>

          {/* One-Click Technical Execution Shortcuts */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Quick Specialist Hardware & SLA Actions
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={actionLoading}
                onClick={() => handleQuickAction('dispatch_tech')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left text-xs transition space-y-1"
              >
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Dispatch Van #04</span>
                </div>
                <p className="text-[10px] text-slate-400">ETA 45m with OTDR</p>
              </button>

              <button
                disabled={actionLoading}
                onClick={() => handleQuickAction('reset_port')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left text-xs transition space-y-1"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recalibrate OLT</span>
                </div>
                <p className="text-[10px] text-slate-400">Port 03 Reset</p>
              </button>

              <button
                disabled={actionLoading}
                onClick={() => handleQuickAction('apply_credit')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left text-xs transition space-y-1"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>₹500 SLA Credit</span>
                </div>
                <p className="text-[10px] text-slate-400">Goodwill Waiver</p>
              </button>

              <button
                disabled={actionLoading}
                onClick={() => handleQuickAction('resolve')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-emerald-500/30 text-left text-xs transition space-y-1"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Close & Resolve</span>
                </div>
                <p className="text-[10px] text-slate-400">Sign off escalation</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
