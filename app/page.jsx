        'use client';

import React, { useState, useEffect } from 'react';
import { ALGORITHMS } from '../constants';
import GenericVisualizer from './GenericVisualizer';

/**
 * @type {React.FC}
 */
const FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS[0]);
  const [history, setHistory] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  /**
   * @type {Array<{label: string; value: string}>}
   */
  const categories = [
    { label: 'Sorting', value: 'sorting' },
    { label: 'Searching', value: 'searching' },
    { label: 'Graph Algorithms', value: 'graph' },
    { label: 'Dynamic Programming', value: 'dp' },
    { label: 'Greedy', value: 'greedy' },
    { label: 'String Manipulation', value: 'string' },
    { label: 'Tree Structures', value: 'tree' },
    { label: 'Advanced DS', value: 'advanced-ds' },
    { label: 'Backtracking', value: 'backtracking' },
    { label: 'Optimization & Techniques', value: 'other' },
  ];

  // Update history when selectedAlgo changes
  useEffect(() => {
    setHistory(prev => {
      const filtered = prev.filter(a => a.id !== selectedAlgo.id);
      return [selectedAlgo, ...filtered].slice(0, 5);
    });
  }, [selectedAlgo]);

  useEffect(() => {
    const fetchExplanation = async () => {
      setIsTutorLoading(true);
      try {
        const res = await fetch(`/api/gemini/explain?name=${encodeURIComponent(selectedAlgo.name)}`);
        const json = await res.json();
        setExplanation(json?.text || 'Welcome to the lab! Select an algorithm to begin.');
      } catch (err) {
        console.error('fetch explanation error', err);
        setExplanation('Unable to load explanation. Please try again.');
      } finally {
        setIsTutorLoading(false);
      }
    };
    fetchExplanation();
  }, [selectedAlgo]);

  const handleSelect = (algo) => {
    setSelectedAlgo(algo);
    // Smooth scroll to main content on mobile after selection
    if (window.innerWidth < 1024) {
      document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900">
      {/* Scrollable Sidebar */}
      <aside className="w-full lg:w-80 bg-slate-950 border-b lg:border-r border-slate-800 flex flex-col shrink-0 lg:h-screen lg:sticky lg:top-0 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AlgoVisual <span className="text-indigo-500">Pro</span></h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar max-h-[50vh] lg:max-h-full">
          {/* Recently Viewed Section */}
          {history.length > 1 && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3 px-3 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recently Viewed
              </h3>
              <div className="flex flex-col gap-0.5">
                {history.map(algo => (
                  <button
                    key={`history-${algo.id}`}
                    onClick={() => handleSelect(algo)}
                    className={`group px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all relative overflow-hidden ${
                      selectedAlgo.id === algo.id 
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                      : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                    }`}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {categories.map((cat) => (
            <div key={cat.value} className="mb-6">
              <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-3 px-3">
                {cat.label}
              </h3>
              <div className="flex flex-col gap-0.5">
                {ALGORITHMS.filter(a => a.category === cat.value).map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => handleSelect(algo)}
                    className={`group px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all relative overflow-hidden ${
                      selectedAlgo.id === algo.id 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-inner shadow-indigo-500/5' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {algo.name}
                    {selectedAlgo.id === algo.id && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden lg:block p-4 bg-slate-900/50 border-t border-slate-800">
           <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 bg-slate-950 p-3 rounded-lg border border-slate-800">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             AI Tutor Online & Ready
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col min-h-screen lg:h-screen lg:overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,#1e293b,transparent)]">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          <header className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {selectedAlgo.category.replace('-', ' ')}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                  <span className="text-xs text-slate-500 font-mono">ID: {selectedAlgo.id}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                {selectedAlgo.name}
              </h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed text-base lg:text-lg font-medium">
                {selectedAlgo.description}
              </p>
            </div>

            <div className="flex gap-4 shrink-0 overflow-x-auto pb-2 lg:pb-0">
              <div className="bg-slate-950/80 backdrop-blur-xl px-5 lg:px-6 py-3 lg:py-4 rounded-2xl border border-slate-800 shadow-2xl min-w-30 lg:min-w-35">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 lg:mb-2 opacity-60">Avg Time</span>
                <span className="text-xl lg:text-2xl font-black font-mono text-indigo-400 tracking-tighter">{selectedAlgo.complexity.time}</span>
              </div>
              <div className="bg-slate-950/80 backdrop-blur-xl px-5 lg:px-6 py-3 lg:py-4 rounded-2xl border border-slate-800 shadow-2xl min-w-30 lg:min-w-35">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 lg:mb-2 opacity-60">Space</span>
                <span className="text-xl lg:text-2xl font-black font-mono text-emerald-400 tracking-tighter">{selectedAlgo.complexity.space}</span>
              </div>
            </div>
          </header>

          <section className="relative">
            <GenericVisualizer algorithm={selectedAlgo} />
          </section>

          {/* AI Insights - Modern glass card */}
          <section className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-emerald-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-slate-950/80 border border-slate-800 backdrop-blur-3xl p-6 lg:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg lg:text-xl font-black text-white tracking-tight">Mastery & Insights</h3>
                    </div>
                    <div className="hidden sm:block px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-500/20">
                        Powered by AI
                    </div>
                </div>

                {isTutorLoading ? (
                    <div className="space-y-4">
                        <div className="h-6 bg-slate-900 rounded-full w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-slate-900 rounded-full w-full animate-pulse"></div>
                        <div className="h-4 bg-slate-900 rounded-full w-5/6 animate-pulse"></div>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-indigo max-w-none">
                        <div className="text-slate-300 text-base lg:text-lg leading-relaxed whitespace-pre-wrap font-medium font-inter">
                            {explanation}
                        </div>
                    </div>
                )} 
            </div>
          </section>

          <footer className="text-center py-10 text-slate-600 text-[10px] font-bold uppercase tracking-widest border-t border-slate-800/50">
            AlgoVisual Pro Core Engine v2.0 // Interactive Learning Platform
          </footer>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default FC;
