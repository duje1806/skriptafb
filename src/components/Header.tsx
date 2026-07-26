import React from 'react';
import { Play, Pause, RefreshCw, ExternalLink, ShieldCheck, BellRing, Settings } from 'lucide-react';
import { MonitorStatus } from '../types';

interface HeaderProps {
  status: MonitorStatus;
  onToggle: () => void;
  onCheckNow: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  onToggle,
  onCheckNow,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
          
          {/* Title & Live Status Badge */}
          <div className="flex items-center space-x-3.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
                  ZAGREB-SCRAPER
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  v2.1 Real-time
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                  status.isRunning 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                  {status.isRunning ? `ONLINE (${status.intervalSeconds}s)` : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center mt-0.5 font-sans">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Target:</span>
                <a 
                  href={status.settings.targetGroupUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center font-mono font-medium"
                >
                  /groups/najamzagreb
                  <ExternalLink className="w-3 h-3 ml-1 text-slate-500" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onCheckNow}
              className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-wider rounded-lg border border-slate-800 transition shadow-sm active:scale-95 cursor-pointer font-mono"
              title="Ručno provjeri nove objave odmah"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2 text-emerald-400" />
              Scan Now
            </button>

            <button
              onClick={onToggle}
              className={`inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-md active:scale-95 cursor-pointer font-mono ${
                status.isRunning
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              }`}
            >
              {status.isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 mr-2 fill-current" />
                  Pause Scraper
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                  Start (60s)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-1 border-t border-slate-800/80 pt-2 pb-1 scrollbar-none">
          {[
            { id: 'dashboard', label: '🎯 Pronađeni Stanovi (500€—700€)' },
            { id: 'all-posts', label: '📋 Live Feed Monitor' },
            { id: 'notifications', label: '💬 WhatsApp & Telegram' },
            { id: 'settings', label: '⚙️ Postavke & AI Filter' },
            { id: 'code-export', label: '💻 Samostalna Skripta' },
            { id: 'post-tester', label: '🧪 Testirno Polje' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer font-sans ${
                activeTab === tab.id
                  ? 'bg-slate-800/80 text-emerald-400 border border-slate-700 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
