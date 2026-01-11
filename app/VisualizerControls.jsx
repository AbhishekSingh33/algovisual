'use client';

import React from 'react';

/**
 * @type {React.FC<{onPlay: () => void; onReset: () => void; onShuffle?: () => void; isRunning: boolean; speed: number; setSpeed: (speed: number) => void; children?: React.ReactNode}>}
 */
const VisualizerControls = ({ 
  onPlay, 
  onReset, 
  onShuffle,
  isRunning, 
  speed, 
  setSpeed,
  children 
}) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center gap-6 shadow-2xl backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-3">
        <button
          onClick={onPlay}
          disabled={isRunning}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all transform active:scale-95 ${
            isRunning 
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          {isRunning ? 'Running...' : 'Run Algorithm'}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold transition-all"
        >
          Reset
        </button>
        {onShuffle && (
          <button
            onClick={onShuffle}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-600 transition-all disabled:opacity-50"
          >
            Randomize
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 flex-1 min-w-[200px]">
        <div className="flex items-center gap-2">
           <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Speed</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <span className="text-[10px] text-slate-500 font-mono w-10 text-right">{speed}ms</span>
      </div>

      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
};

export default VisualizerControls;