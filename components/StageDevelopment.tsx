import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, FolderOpen, Check, Loader2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const BUILD_STEPS = [
  'Installing dependencies (npm install)...',
  'Validating package.json...',
  'Resolving dependency tree...',
  'Fetching @secure/auth-module...',
  'Compiling TypeScript sources...',
  'Optimizing static assets...',
  'Minifying CSS bundles...',
  'Linking modules...',
  'Build successful.'
];

export const StageDevelopment: React.FC<Props> = ({ onComplete }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= BUILD_STEPS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
        return;
      }

      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        level: step === BUILD_STEPS.length - 1 ? 'success' : 'info',
        message: BUILD_STEPS[step]
      };

      setLogs(prev => [...prev, newLog]);
      step++;
    }, 800);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-[500px] grid grid-cols-12 gap-4 animate-fade-in">
      {/* File Tree (Static Mock) */}
      <div className="col-span-4 glass-panel rounded-lg p-4 hidden md:block">
        <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center">
          <FolderOpen size={14} className="mr-2" /> Project Structure
        </h3>
        <ul className="text-sm space-y-2 font-mono text-slate-500">
          <li className="text-blue-400">/src</li>
          <li className="pl-4">/components</li>
          <li className="pl-4">/api</li>
          <li className="pl-4">app.tsx</li>
          <li className="text-yellow-600">package.json</li>
          <li className="text-slate-600">tsconfig.json</li>
          <li className="text-slate-600">README.md</li>
          <li className="pl-4 mt-2 text-slate-600 animate-pulse">...building dist/</li>
        </ul>
      </div>

      {/* Terminal Output */}
      <div className="col-span-12 md:col-span-8 bg-slate-950 rounded-lg border border-slate-800 flex flex-col font-mono text-sm overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center text-slate-400">
            <Terminal size={14} className="mr-2" />
            <span>build_agent@nexus:~</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-2 scrollbar-hide">
          {logs.map(log => (
            <div key={log.id} className="flex items-start space-x-2 animate-fade-in">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={`
                ${log.level === 'info' ? 'text-slate-300' : ''}
                ${log.level === 'success' ? 'text-emerald-400 font-bold' : ''}
              `}>
                {log.level === 'success' ? '✓ ' : '> '}
                {log.message}
              </span>
            </div>
          ))}
          {logs.length < BUILD_STEPS.length && (
             <div className="flex items-center text-cyan-500 mt-2">
               <Loader2 className="animate-spin mr-2" size={14} />
               Processing...
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};