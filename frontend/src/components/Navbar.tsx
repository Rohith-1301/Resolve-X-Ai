import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  HelpCircle,
  AlertTriangle,
  Radio,
  TrendingUp,
  LayoutDashboard,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  X
} from 'lucide-react';

interface NavbarProps {
  onSearch?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResultsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scenarios = [
    {
      id: 'sc1',
      title: 'Case 1: Billing Resolution',
      desc: 'Rahul Kumar • ₹1,499 bill vs ₹999 plan • Cites KB-102 • Resolution Ready',
      badge: 'Resolution Ready',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: ShieldCheck,
      action: () => navigate('/tickets/TKT-1042')
    },
    {
      id: 'sc2',
      title: 'Case 2: Missing Information',
      desc: 'Priya Sharma • "My internet isn\'t working" • Scope query • Needs Information',
      badge: 'Needs Info',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: HelpCircle,
      action: () => navigate('/tickets/TKT-1043')
    },
    {
      id: 'sc3',
      title: 'Case 3: Outage Escalation',
      desc: 'Arjun Mehta • 3-day outage • 92% Angry • Amit Sharma handoff • Escalation Required',
      badge: 'Escalation Required',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: AlertTriangle,
      action: () => navigate('/tickets/TKT-1044')
    },
    {
      id: 'sc4',
      title: 'Case 4: Proactive Outage Alert',
      desc: 'Mumbai Tower 3 Maintenance • 234 Affected Customers • Broadcast Approval',
      badge: '234 Affected',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: Radio,
      action: () => navigate('/proactive')
    },
    {
      id: 'sc5',
      title: 'Case 5: Predictive Upgrade',
      desc: 'Data usage at 90% cap • Fiber 1 Gbps proposal • Demo Forecast: 73%',
      badge: '73% Forecast',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      icon: TrendingUp,
      action: () => navigate('/predictive')
    }
  ];

  const notifications = [
    {
      id: 'n1',
      icon: Radio,
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: 'Network Incident: Mumbai Tower 3',
      desc: '234 subscribers in Bandra West impacted. Estimated resolution: 2h.',
      time: 'Just now',
      action: () => navigate('/proactive')
    },
    {
      id: 'n2',
      icon: AlertTriangle,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Escalation Alert: Ticket TKT-1044',
      desc: 'Arjun Mehta down 3 days. Recommended: Amit Sharma (Senior Specialist).',
      time: '3m ago',
      action: () => navigate('/tickets/TKT-1044')
    },
    {
      id: 'n3',
      icon: BookOpen,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      title: 'Knowledge Base Draft Ready',
      desc: '5G Troubleshooting draft article suggested from 14 similar inquiries.',
      time: '18m ago',
      action: () => navigate('/knowledge')
    },
    {
      id: 'n4',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Resolution Sent: Ticket TKT-1042',
      desc: 'Rahul Kumar roaming billing explanation approved and sent.',
      time: '35m ago',
      action: () => navigate('/tickets/TKT-1042')
    }
  ];

  const searchIndex = [
    { type: 'Customer', label: 'Rahul Kumar (CUS-1001)', sub: 'VIP • Fiber 500 Mbps • Mumbai', path: '/customers/CUS-1001' },
    { type: 'Customer', label: 'Priya Sharma (CUS-1002)', sub: 'Home Broadband • Delhi', path: '/customers/CUS-1002' },
    { type: 'Customer', label: 'Arjun Mehta (CUS-1003)', sub: 'Fiber 300 Mbps • 3-Day Outage', path: '/customers/CUS-1003' },
    { type: 'Ticket', label: 'TKT-1042: Unexpected ₹500 Surcharge', sub: 'Billing • Resolution Ready', path: '/tickets/TKT-1042' },
    { type: 'Ticket', label: 'TKT-1043: Internet Down Clarification', sub: 'Connectivity • Needs Information', path: '/tickets/TKT-1043' },
    { type: 'Ticket', label: 'TKT-1044: Prolonged Optical Line Outage', sub: 'Escalation • Escalation Required', path: '/tickets/TKT-1044' },
    { type: 'Knowledge', label: 'KB-102: Understanding Additional Charges', sub: 'Billing & Roaming Policies', path: '/knowledge' },
    { type: 'Knowledge', label: 'KB-104: Wi-Fi Device Connectivity Troubleshooting', sub: 'Local Device Setup', path: '/knowledge' },
    { type: 'Knowledge', label: 'KB-103: Fiber Optical Signal Loss & OLT', sub: 'Technical Diagnostics', path: '/knowledge' },
    { type: 'Specialist', label: 'Amit Sharma (Senior Technical Specialist)', sub: 'Level 3 Escalations', path: '/team' },
    { type: 'Alert', label: 'ALT-1001: Mumbai Tower 3 Maintenance', sub: '234 affected subscribers', path: '/proactive' },
  ];

  const filteredSearch = searchTerm.trim() 
    ? searchIndex.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sub.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between">
      {/* Brand & Clean Status */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 group-hover:bg-blue-500 transition-all">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-0.5">
                <span>Resolve</span>
                <span className="text-blue-400">X</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Understand. Resolve. Predict. Prevent.
            </p>
          </div>
        </div>

        {/* Clean, modest operational indicator (No engineering jargon) */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2 text-xs text-slate-400 border-l border-slate-800 pl-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] text-slate-300 font-medium">System Operational</span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div ref={searchRef} className="relative hidden md:block max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tickets, customers, knowledge articles..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSearchResultsOpen(false);
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResultsOpen && filteredSearch.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 flex justify-between">
              <span>Matching Results</span>
              <span>{filteredSearch.length} found</span>
            </div>
            <div className="divide-y divide-slate-800/60">
              {filteredSearch.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    setSearchResultsOpen(false);
                    setSearchTerm('');
                  }}
                  className="px-3 py-2 hover:bg-slate-800 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        item.type === 'Customer' ? 'bg-blue-500/20 text-blue-300' :
                        item.type === 'Ticket' ? 'bg-indigo-500/20 text-indigo-300' :
                        item.type === 'Knowledge' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs font-semibold text-white">{item.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Landing Page Button */}
        <button
          onClick={() => navigate('/landing')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
          <span>Landing Page</span>
        </button>

        {/* Demo Scenarios Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDemoOpen(!demoOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Scenarios</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${demoOpen ? 'rotate-180' : ''}`} />
          </button>

          {demoOpen && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
              <div className="px-3.5 py-1.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Demo Scenario
                </span>
                <span className="text-[10px] text-blue-400 font-semibold">5 Scenarios</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-[380px] overflow-y-auto">
                {scenarios.map((sc) => {
                  const Icon = sc.icon;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => {
                        sc.action();
                        setDemoOpen(false);
                      }}
                      className="p-3 hover:bg-slate-800/80 cursor-pointer transition flex items-start gap-3 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-blue-400 border border-slate-800 group-hover:border-blue-500 shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-blue-300 truncate">
                            {sc.title}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${sc.badgeColor}`}>
                            {sc.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {sc.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold flex items-center justify-center text-white ring-2 ring-slate-950">
              4
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-slate-400">4 active</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        n.action();
                        setNotifOpen(false);
                      }}
                      className="p-3 hover:bg-slate-800/80 cursor-pointer transition flex items-start gap-3"
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${n.iconColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{n.title}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Support Agent Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
            AD
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-slate-200">Agent Demo</div>
            <div className="text-[10px] text-slate-400">Customer Support</div>
          </div>
        </div>
      </div>
    </header>
  );
};
