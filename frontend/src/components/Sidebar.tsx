import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  Radio,
  UserCheck,
  ShieldCheck,
  Sliders
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/queue', label: 'Support Queue', icon: Inbox },
  { to: '/customers', label: 'Customer 360', icon: Users },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/predictive', label: 'Predictive Insights', icon: TrendingUp },
  { to: '/proactive', label: 'Proactive Support', icon: Radio },
  { to: '/specialist', label: 'Specialist Desk', icon: UserCheck },
  { to: '/quality', label: 'Quality & Compliance', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: Sliders },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-57px)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Clean System Status */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center gap-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] font-medium text-slate-300">System Operational</span>
        </div>
      </div>
    </aside>
  );
};
