import React from 'react';
import { Terminal, Shield, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { LogEntry } from '../types';

interface LogsDrawerProps {
  logs: LogEntry[];
}

export const LogsDrawer: React.FC<LogsDrawerProps> = ({ logs }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-xl space-y-4 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Dnevnik Rada (Terminal Logs)</h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{logs.length} EVENTS</span>
      </div>

      <div className="bg-slate-950/90 rounded-lg p-3.5 border border-slate-800/80 font-mono text-xs max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-center py-4 text-xs font-mono">[ COLD START - CEKA SE PRVI SCAN ]</div>
        ) : (
          logs.map((log, index) => (
            <div key={log.id ? `${log.id}-${index}` : index} className="flex items-start space-x-2 leading-relaxed">
              <span className="text-slate-600 text-[10px] select-none font-mono">[{log.timestamp}]</span>
              
              {log.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />}
              {log.type === 'info' && <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />}
              {log.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
              {log.type === 'error' && <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />}

              <span className={`flex-1 text-[11px] ${
                log.type === 'success' ? 'text-emerald-300 font-semibold' :
                log.type === 'warning' ? 'text-amber-300' :
                log.type === 'error' ? 'text-red-300' :
                'text-slate-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
