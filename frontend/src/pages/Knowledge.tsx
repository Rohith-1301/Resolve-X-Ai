import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { KnowledgeArticle, KnowledgeGap } from '../types';

export const Knowledge: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  // Draft modal
  const [modalGap, setModalGap] = useState<KnowledgeGap | null>(null);
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftCategory, setDraftCategory] = useState<string>('Connectivity');
  const [draftContent, setDraftContent] = useState<string>('');
  const [draftSuccess, setDraftSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [artList, gapList, anData] = await Promise.all([
        api.getArticles(selectedCategory),
        api.getKnowledgeGaps(),
        api.getKnowledgeAnalytics()
      ]);
      setArticles(artList);
      setGaps(gapList);
      setAnalytics(anData);
      if (artList.length > 0 && !selectedArticle) {
        setSelectedArticle(artList[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    try {
      const results = await api.searchKnowledge(searchQuery, selectedCategory);
      setArticles(results as any);
      if (results.length > 0) {
        setSelectedArticle(results[0] as any);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDraft = (gap: KnowledgeGap) => {
    setModalGap(gap);
    setDraftTitle(gap.recommended_article);
    setDraftCategory(gap.category);
    setDraftContent(`Diagnostic steps for ${gap.topic}:
1. Verify customer profile.
2. Apply localized firmware override.`);
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDraftArticle(draftTitle, draftCategory, draftContent, modalGap?.id);
      setDraftSuccess('Draft article created successfully in approved knowledge queue!');
      setModalGap(null);
      setTimeout(() => {
        setDraftSuccess(null);
        loadData();
      }, 1500);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Knowledge Management & RAG Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified knowledge articles grounded for AI responses, with live effectiveness analytics and knowledge gap detection.
          </p>
        </div>
      </div>

      {draftSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{draftSuccess}</span>
        </div>
      )}

      {/* 44. KNOWLEDGE CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Total Articles</span>
          <div className="text-2xl font-bold text-white">{analytics?.total_articles || 25}+</div>
          <p className="text-[10px] text-slate-500">Verified by engineering</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Used Today</span>
          <div className="text-2xl font-bold text-indigo-400">{analytics?.used_today || 87}</div>
          <p className="text-[10px] text-slate-500">Auto-cited by AI Copilot</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Average Effectiveness</span>
          <div className="text-2xl font-bold text-emerald-400">{Math.round((analytics?.average_effectiveness || 0.91) * 100)}%</div>
          <p className="text-[10px] text-slate-500">Resolution success rate</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Knowledge Gaps</span>
          <div className="text-2xl font-bold text-amber-400">{analytics?.knowledge_gaps_count || 4}</div>
          <p className="text-[10px] text-slate-500">Requiring documentation</p>
        </div>
      </div>

      {/* 47. KNOWLEDGE GAP DETECTION SECTION */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>KNOWLEDGE GAP DETECTION & DRAFT RESOLUTION</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Real-time Cluster Analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {gaps.map((gap) => (
            <div key={gap.id} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {gap.gap_severity} Priority
                  </span>
                  <span className="text-[10px] text-slate-400">{gap.affected_ticket_count} tickets</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{gap.topic}</h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">Recommended: {gap.recommended_article}</p>
              </div>

              <button
                onClick={() => handleOpenDraft(gap)}
                className="mt-2 py-1 px-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                <span>Create Draft Article</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Knowledge Base Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Col: Article List (Col 5) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search articles, keywords, KB-ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition"
            >
              Search
            </button>
          </form>

          {/* Categories bar */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {['All', 'Connectivity', 'Billing', 'Mobile', 'Plan', 'Roaming', 'Payment', 'Account'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {articles.map((art) => (
              <div
                key={art.article_id}
                onClick={() => setSelectedArticle(art)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedArticle?.article_id === art.article_id
                    ? 'bg-indigo-600/15 border-indigo-500/50 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-indigo-400">{art.article_id}</span>
                  <span className="text-[10px] text-slate-400">{art.category}</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-100 mt-1">{art.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>Effectiveness: <strong className="text-emerald-400">{Math.round((art.effectiveness_score || 0.9) * 100)}%</strong></span>
                  <span>Used: {art.usage_count} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Article Detail (Col 7) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          {selectedArticle ? (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-indigo-400">{selectedArticle.article_id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedArticle.category}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{selectedArticle.title}</h2>
                </div>

                {/* 46. KNOWLEDGE EFFECTIVENESS STATS */}
                <div className="text-right text-xs space-y-0.5">
                  <div className="text-slate-400">Effectiveness: <strong className="text-emerald-400">{Math.round((selectedArticle.effectiveness_score || 0.9) * 100)}%</strong></div>
                  <div className="text-slate-400">Success Rate: <strong className="text-white">{Math.round((selectedArticle.success_rate || 0.9) * 100)}%</strong></div>
                  <div className="text-slate-400">Avg Resolution: <strong className="text-white">{selectedArticle.avg_resolution_time} min</strong></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Support Guidance</h4>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 leading-relaxed space-y-2">
                  {selectedArticle.content}
                </div>
              </div>

              {selectedArticle.keywords && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400">Matching Keywords & Tokens:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedArticle.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Select an article to view details
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating draft article */}
      {modalGap && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create Draft Knowledge Article</h3>
            <form onSubmit={handleSaveDraft} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Article Title:</label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400">Category:</label>
                <input
                  type="text"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400">Content / Resolution Procedure:</label>
                <textarea
                  rows={4}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalGap(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
