import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  MessageSquare,
  Shield,
  Clock,
  Send,
  CheckCircle2,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { Specialist } from '../types';

export const Team: React.FC = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [question, setQuestion] = useState<string>('Customer reports 3-day outage in Mumbai. Are there known network issues?');
  const [consultReply, setConsultReply] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getSpecialists(),
      api.getWorkload()
    ])
      .then(([specs, wload]) => {
        setSpecialists(specs);
        setWorkload(wload);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    try {
      const res = await api.consultSpecialist(question);
      setConsultReply(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <span>Tier-2 Specialists & Team Collaboration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time specialist capacity, active escalations, and expert consultation queries.
          </p>
        </div>
      </div>

      {/* 48. SPECIALISTS ROSTER (Spec 11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialists.map((s) => (
          <div key={s.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{s.name}</h3>
                <div className="text-xs font-semibold text-indigo-400">{s.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{s.department}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                s.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {s.status}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Specialist Domain:</span>
              <div className="text-slate-200 mt-0.5 font-medium">{s.expertise}</div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Queue:</span>
              <strong className="text-white font-mono">{s.active_tickets} / {s.max_capacity} tickets</strong>
            </div>
          </div>
        ))}
      </div>

      {/* 49. ASK EXPERT CONSULTATION */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>49. Internal Specialist Consultation (Ask Expert)</span>
          </h3>
          <span className="text-[10px] text-slate-500">Demo consultation</span>
        </div>

        <form onSubmit={handleConsult} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask specialist question regarding network or policy..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consult Specialist</span>
          </button>
        </form>

        {consultReply && (
          <div className="p-4 rounded-xl bg-slate-800/80 border border-indigo-500/40 space-y-1.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="font-bold text-indigo-300">
                Response from {consultReply.specialist_name}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{consultReply.timestamp}</span>
            </div>
            <p className="text-slate-200 leading-relaxed italic">
              "{consultReply.response}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
