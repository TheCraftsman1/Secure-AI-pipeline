import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, FolderOpen, Loader2, GitCommit, GitBranch, User, Bot, CheckCircle2 } from 'lucide-react';

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

interface Commit {
    id: string;
    message: string;
    author: string;
    time: string;
    isAi: boolean;
}

const FAKE_COMMITS = [
    { msg: "Initial project scaffold", author: "Nexus AI", isAi: true },
    { msg: "Add authentication middleware", author: "DevOps Bot", isAi: true },
    { msg: "Update README.md", author: "John Doe", isAi: false },
    { msg: "Fix memory leak in worker", author: "Nexus AI", isAi: true },
    { msg: "Optimize database queries", author: "Nexus AI", isAi: true },
    { msg: "Update dependencies", author: "Dependabot", isAi: true },
    { msg: "Refactor API routes", author: "John Doe", isAi: false },
];

export const StageDevelopment: React.FC<Props> = ({ onComplete }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const commitsRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // Simulate Git Commits
  useEffect(() => {
    let commitIdx = 0;
    const interval = setInterval(() => {
        if (commitIdx >= FAKE_COMMITS.length) {
            clearInterval(interval);
            return;
        }
        const c = FAKE_COMMITS[commitIdx];
        const newCommit: Commit = {
            id: Math.random().toString(36).substr(2, 7),
            message: c.msg,
            author: c.author,
            time: new Date().toLocaleTimeString(),
            isAi: c.isAi
        };
        setCommits(prev => [newCommit, ...prev]);
        commitIdx++;
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-[500px] grid grid-cols-12 gap-4 animate-fade-in">
      {/* File Tree & Git Activity */}
      <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
        {/* File Tree */}
        <div className="glass-panel rounded-lg p-4 flex-1 overflow-hidden hidden md:block">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-4 flex items-center">
            <FolderOpen size={14} className="mr-2" /> Project Structure
            </h3>
            <ul className="text-sm space-y-2 font-mono text-slate-600 dark:text-slate-500">
            <li className="text-blue-500 dark:text-blue-400">/src</li>
            <li className="pl-4">/components</li>
            <li className="pl-4">/api</li>
            <li className="pl-4">app.tsx</li>
            <li className="text-yellow-600">package.json</li>
            <li className="text-slate-500 dark:text-slate-600">tsconfig.json</li>
            <li className="text-slate-500 dark:text-slate-600">README.md</li>
            <li className="pl-4 mt-2 text-slate-500 dark:text-slate-600 animate-pulse">...building dist/</li>
            </ul>
        </div>

        {/* Live Commits */}
        <div className="glass-panel rounded-lg p-0 flex-1 overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
             <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                <h3 className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase flex items-center">
                    <GitBranch size={14} className="mr-2 text-purple-500" /> Active Branch: main
                </h3>
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">Live</span>
             </div>
             <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide" ref={commitsRef}>
                 {commits.map((commit) => (
                     <div key={commit.id} className="flex gap-3 animate-slide-in-right">
                         <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${commit.isAi ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                             {commit.isAi ? <Bot size={14} /> : <User size={14} />}
                         </div>
                         <div className="flex-1 min-w-0">
                             <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{commit.message}</p>
                             <div className="flex items-center text-[10px] text-slate-500 gap-2 mt-0.5">
                                 <span className="font-mono text-slate-400">{commit.id}</span>
                                 <span>•</span>
                                 <span>{commit.author}</span>
                                 <span>•</span>
                                 <span>{commit.time}</span>
                             </div>
                         </div>
                     </div>
                 ))}
                 {commits.length < FAKE_COMMITS.length && (
                     <div className="flex justify-center py-2">
                         <Loader2 size={16} className="animate-spin text-slate-400" />
                     </div>
                 )}
             </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="col-span-12 md:col-span-8 bg-slate-900 dark:bg-slate-950 rounded-lg border border-slate-700 dark:border-slate-800 flex flex-col font-mono text-sm overflow-hidden shadow-2xl">
        <div className="bg-slate-800 dark:bg-slate-900 p-2 border-b border-slate-700 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center text-slate-300 dark:text-slate-400">
            <Terminal size={14} className="mr-2" />
            <span>build_agent@nexus:~</span>
          </div>
          <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-2 scrollbar-hide">
          {logs.map(log => (
            <div key={log.id} className="flex items-start space-x-2 animate-fade-in">
              <span className="text-slate-500 dark:text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={`
                ${log.level === 'info' ? 'text-slate-300 dark:text-slate-300' : ''}
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