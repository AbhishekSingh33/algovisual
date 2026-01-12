'use client';

import React from 'react';
import SortingVisualizer from './SortingVisualizer';
import GridVisualizer from './GridVisualizer';
import TreeVisualizer from './TreeVisualizer';

/**
 * @type {React.FC<{algorithm: any}>}
 */
const GenericVisualizer = ({ algorithm }) => {
  switch (algorithm.category) {
    case 'sorting':
    case 'searching':
    case 'other':
      return <SortingVisualizer algorithmId={algorithm.id} />;
    
    case 'graph':
    case 'backtracking':
    case 'dp':
      return <GridVisualizer algorithmId={algorithm.id} />;
    
    case 'tree':
    case 'advanced-ds':
      return <TreeVisualizer algorithmId={algorithm.id} />;
      
    case 'string':
    case 'greedy':
    default:
      return (
        <div className="flex flex-col items-center justify-center h-125 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem] p-12 text-center group transition-all hover:border-indigo-500/30">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-4xl flex items-center justify-center mb-8 border border-indigo-500/10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.428 1.428a2 2 0 001.022.547l2.387.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-.547-1.022l-1.428-1.428z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12V4.5M12 12l4.5 4.5M12 12l-4.5 4.5" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Advanced Visualization Engine v2.5</h3>
          <p className="text-slate-500 max-w-lg text-lg leading-relaxed font-medium">
            This complex algorithm is best understood through our AI-Synthesized Narrative below while we calibrate the specialized visual components.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 border border-slate-700 uppercase tracking-widest">Physics Enabled</div>
            <div className="px-4 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 border border-slate-700 uppercase tracking-widest">Real-time Data</div>
          </div>
        </div>
      );
  }
};

export default GenericVisualizer;