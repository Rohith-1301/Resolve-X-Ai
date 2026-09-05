import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, ChevronRight, Wifi, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Customer } from '../types';

export const CustomersList: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    api.getCustomers()
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_id.toLowerCase().includes(search.toLowerCase()) ||
    (c.plan_name && c.plan_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Customer Intelligence Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete Customer 360 directory with usage profiles, subscription plans, and churn risk scores.
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID, or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Type / Priority</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Monthly Rate</th>
                <th className="py-3 px-4">Billing Status</th>
                <th className="py-3 px-4">Health & Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span>Loading customer profiles...</span>
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr
                  key={c.customer_id}
                  onClick={() => navigate(`/customers/${c.customer_id}`)}
                  className="hover:bg-slate-800/50 cursor-pointer transition group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-white group-hover:text-indigo-400">
                    {c.customer_id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      c.priority === 'VIP' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      c.priority === 'High' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {c.plan_name || 'Broadband'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-mono">
                    ₹{c.monthly_price || 999}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {c.billing_status || 'Paid'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      (c.risk_score || 2.0) >= 8.0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      (c.risk_score || 2.0) >= 5.0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {c.health_status || 'Good'} ({c.risk_score || 2.0}/10)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-xs text-indigo-400 group-hover:text-indigo-300 font-medium flex items-center justify-end gap-1">
                      <span>View 360</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
