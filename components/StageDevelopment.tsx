
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, FolderOpen, Loader2, GitBranch, User, Bot, Zap, Package, Server } from 'lucide-react';

interface Props {
  onComplete: () => void;
  isTurbo?: boolean;
}

const REALISTIC_BUILD_LOGS = [
  "Resolving packages... [248ms]",
  "Fetching @google/genai... [cached]",
  "Fetching react@19.2.0... [cached]",
  "Linking dependencies... [12ms]",
  "Validating tsconfig.json...",
  "Running ESLint on /src...",
  "Compiling layout.tsx... [8ms]",
  "Compiling page.tsx... [12ms]",
  "Optimizing Tailwind CSS classes... [45ms]",
  "Minifying bundle (terser)...",
  "Generating static assets (32 files)...",
  "Hash generation: 9f8a2b3c...",
  "Uploading to edge nodes (region: us-east-1)...",
  "Verifying SSL certificates...",
  "Build complete. Ready for deployment."
];

export const StageDevelopment: React.FC<Props> = ({ onComplete, isTurbo }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Turbo speed: 50x faster.
  const speedMultiplier = isTurbo ? 0.02 : 1; 

  useEffect(() => {
    let step = 0;
    const LOG_SOURCE = REALISTIC_BUILD_LOGS; 
    
    const interval = setInterval(() => {
      if (step >= LOG_SOURCE.length) {
        clearInterval(interval);
        setTimeout(onComplete, isTurbo ? 200 : 1500);
        return;
      }

      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        // Cast options to any to support fractionalSecondDigits in older TS libs
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 } as any),
        level: step === LOG_SOURCE.length - 1 ? 'success' : 'info',
        message: LOG_SOURCE[step]
      };

      setLogs(prev => [...prev, newLog]);
      step++;
    }, 400 * speedMultiplier); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-[500px] grid grid-cols-12 gap-4 animate-fade-in">
      <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-6 flex-1 overflow-hidden hidden md:flex flex-col border border-white/5">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-6 flex items-center">
               <Package size={14} className="mr-2" /> Asset Pipeline
            </h3>
            
            <div className="space-y-6">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                        <span>COMPILATION</span>
                        <span className={isTurbo ? 'text-orange-400' : 'text-cyan-400'}>
                            {Math.min(100, Math.floor((logs.length / REALISTIC_BUILD_LOGS.length) * 100))}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${isTurbo ? 'bg-orange-500 shadow-[0_0_10px_orange]' : 'bg-cyan-500'}`} 
                            style={{ width: `${(logs.length / REALISTIC_BUILD_LOGS.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-500 mb-1">Bundle Size</div>
                        <div className="text-lg font-mono font-bold text-white">42.8 KB</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-500 mb-1">Time</div>
                        <div className="text-lg font-mono font-bold text-white">
                            {isTurbo ? '0.4s' : '2.1s'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-auto pt-6 flex items-center text-xs text-slate-500 border-t border-white/5">
                <Server size={12} className="mr-2" />
                <span>worker-node-alpha-4 connected</span>
            </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-8 bg-[#0a0a0c] rounded-2xl border border-slate-800 flex flex-col font-mono text-sm overflow-hidden shadow-2xl relative">
        {isTurbo && <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Zap size={120} /></div>}
        
        <div className="bg-[#121214] p-3 border-b border-slate-800 flex items-center justify-center relative z-10">
          <div className="flex items-center text-slate-400 absolute left-4">
            <Terminal size={14} className="mr-2" />
            <span>nexus-builder:~</span>
          </div>
          {isTurbo && <span className="text-[9px] bg-orange-900/50 text-orange-400 px-2 rounded border border-orange-800/50 uppercase tracking-widest animate-pulse">Turbo Build Active</span>}
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-1.5 scrollbar-hide z-10">
          {logs.map(log => (
            <div key={log.id} className="flex items-start space-x-3 animate-fade-in text-xs md:text-sm">
              <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={log.level === 'success' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                {log.level === 'success' ? '✓ ' : '> '}
                {log.message}
              </span>
            </div>
          ))}
          {logs.length < REALISTIC_BUILD_LOGS.length && (
             <div className="flex items-center text-cyan-500 mt-2 pl-24">
               <Loader2 className="animate-spin mr-2" size={14} />
               <span className="animate-pulse">Processing artifact...</span>
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
