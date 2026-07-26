import React from 'react';
import { Search, CheckCircle2, MessageSquare, Clock, Filter, Zap } from 'lucide-react';
import { MonitorStatus } from '../types';

interface StatusCardsProps {
  status: MonitorStatus;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ status }) => {
  const { isRunning, intervalSeconds, nextCheckSeconds, totalScanned, totalMatched, totalNotificationsSent, settings } = status;
  
  // Calculate progress percentage for countdown
  const progressPercent = Math.max(0, Math.min(100, ((intervalSeconds - nextCheckSeconds) / intervalSeconds) * 100));

  return (
    <div className="space-y-4 mb-6">
      {/* 60-Second Scan Countdown Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2 text-slate-300">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sljedeća automatska provjera grupe:</span>
          </div>
          <div className="font-bold text-emerald-400 font-mono text-base tracking-wider">
            {nextCheckSeconds}s
          </div>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
          <div 
            className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_#10b981]"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-mono">
          <span>INTERVAL: {intervalSeconds}s</span>
          <span>CILJANI RANG: <strong className="text-emerald-400 font-mono">{settings.minPrice}€ — {settings.maxPrice}€</strong></span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-slate-800 text-slate-400 rounded-lg border border-slate-700/50">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Pregledano</div>
            <div className="text-xl font-mono font-bold text-white mt-0.5">{totalScanned} <span className="text-xs text-slate-500 font-normal">oglasa</span></div>
          </div>
        </div>

        {/* Matched Range (500-700) */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 shadow-sm flex items-center space-x-3.5 bg-emerald-950/10">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold">U Rangu ({settings.minPrice}-{settings.maxPrice}€)</div>
            <div className="text-xl font-mono font-bold text-emerald-300 mt-0.5">{totalMatched} <span className="text-xs text-emerald-500/80 font-normal">stanova</span></div>
          </div>
        </div>

        {/* WhatsApp Sent */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Poslano Notifikacija</div>
            <div className="text-xl font-mono font-bold text-white mt-0.5">{totalNotificationsSent} <span className="text-xs text-slate-500 font-normal">poruka</span></div>
          </div>
        </div>

        {/* Active AI Filter */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">AI Filter Parser</div>
            <div className="text-xs font-mono font-bold text-purple-300 mt-1 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1.5 animate-pulse"></span>
              {settings.aiFilterEnabled ? 'GEMINI 3.6 FLASH' : 'REGEX PARSER'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
