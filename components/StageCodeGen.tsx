
import React, { useEffect, useState, useRef } from 'react';
import { FileCode, Cpu, Zap, CheckCircle2, Sparkles, Layers, Box, Code2, Database, Layout, Terminal, Activity } from 'lucide-react';
import { ProjectConfig, TechStack } from '../types';

interface Props {
  onComplete: () => void;
  blueprint: string;
  config: ProjectConfig;
}

// --- Data & Helpers ---

const PHASES = [
  { id: 'scaffold', label: 'Neural Scaffolding', icon: Layout, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/50' },
  { id: 'logic', label: 'Logic Injection', icon: Cpu, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/50' },
  { id: 'data', label: 'Data Optimization', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50' },
  { id: 'ui', label: 'Visual Polishing', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/50' },
];

const LOG_MESSAGES = [
  "Initializing neural pathways...",
  "Parsing architectural blueprint...",
  "Resolving dependency graph...",
  "Allocating virtual memory heaps...",
  "Synthesizing HTML structure...",
  "Optimizing render cycles...",
  "Injecting Tailwind utility classes...",
  "Configuring event listeners...",
  "Establishing responsive grid...",
  "Running accessibility heuristics...",
  "Minifying JavaScript bundles...",
  "Compressing static assets...",
  "Finalizing build artifacts...",
];

const getFilesForStack = (stack: TechStack): string[] => {
  return [
      'package.json',
      'README.md',
      'index.html',
      'styles.css',
      'script.js',
      '.gitignore',
      'tailwind.config.js'
  ];
};

const SNIPPETS = [
  `<!-- Hero Section -->\n<div className="relative overflow-hidden">\n  <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">\n    Nexus AI\n  </h1>\n</div>`,
  `document.addEventListener('DOMContentLoaded', () => {\n  const observer = new IntersectionObserver((entries) => {\n    entries.forEach(entry => {\n      if (entry.isIntersecting) entry.target.classList.add('animate-in');\n    });\n  });\n});`,
  `.glass-panel {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n}`,
  `{
  "name": "nexus-project",
  "version": "1.0.0",
  "scripts": {
    "start": "vite",
    "build": "vite build"
  }
}`
];

export const StageCodeGen: React.FC<Props> = ({ onComplete, config }) => {
  // State
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeFile, setActiveFile] = useState<string>('');
  const [codeStream, setCodeStream] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [filesGenerated, setFilesGenerated] = useState<string[]>([]);
  const [linesCount, setLinesCount] = useState(0);

  // Refs for auto-scrolling
  const codeRef = useRef<HTMLDivElement>(null);
  const logsRef = useRef<HTMLDivElement>(null);

  const TARGET_FILES = getFilesForStack(config.stack);

  // --- Animation Loop ---
  useEffect(() => {
    let phaseIdx = 0;
    let logIdx = 0;
    let fileIdx = 0;
    let snippetCharIdx = 0;
    let currentSnippet = SNIPPETS[0];
    let isMounted = true;

    // 1. Phase Progression
    const phaseInterval = setInterval(() => {
      if (!isMounted) return;
      if (phaseIdx < PHASES.length - 1) {
        phaseIdx++;
        setCurrentPhase(phaseIdx);
      } else {
        clearInterval(phaseInterval);
        setTimeout(onComplete, 2000); 
      }
    }, 3500); 

    // 2. High-speed Logger
    const logInterval = setInterval(() => {
      if (!isMounted) return;
      const log = LOG_MESSAGES[logIdx % LOG_MESSAGES.length];
      setLogs(prev => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${log}`]); 
      setLinesCount(prev => prev + Math.floor(Math.random() * 25) + 5);
      logIdx++;
      if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }, 300);

    // 3. Code Stream & File Generation
    const typeInterval = setInterval(() => {
      if (!isMounted) return;

      setCodeStream(prev => {
        const char = currentSnippet[snippetCharIdx % currentSnippet.length];
        snippetCharIdx++;
        if (prev.length > 1000) return prev.slice(200) + char;
        return prev + char;
      });

      if (codeRef.current) {
        codeRef.current.scrollTop = codeRef.current.scrollHeight;
      }

      if (snippetCharIdx % 120 === 0 && fileIdx < TARGET_FILES.length) {
        const file = TARGET_FILES[fileIdx];
        setFilesGenerated(prev => {
             if (prev.includes(file)) return prev;
             return [...prev, file];
        });
        setActiveFile(file);
        currentSnippet = SNIPPETS[fileIdx % SNIPPETS.length];
        fileIdx++;
      }
    }, 4); 

    return () => {
      isMounted = false;
      clearInterval(phaseInterval);
      clearInterval(logInterval);
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[650px] rounded-3xl overflow-hidden bg-[#020617] border border-slate-800 shadow-2xl animate-fade-in group selection:bg-cyan-500/30">
      
      {/* --- Dreamy Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }}></div>
         <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] animate-float mix-blend-screen"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col p-6 md:p-8">
        
        {/* Header: Stats & Active Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
              <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3 tracking-tight">
                 <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                 </div>
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 text-shadow-glow">
                    Neural Fabrication
                 </span>
              </h2>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                 <Cpu size={14} className="text-violet-400" />
                 Synthesizing {config.stack} Architecture
              </p>
           </div>

           {/* Live Stats */}
           <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md shadow-lg">
                 <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Lines Generated</div>
                 <div className="text-2xl font-mono text-cyan-400 font-bold tabular-nums drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    {linesCount.toLocaleString()}
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md shadow-lg">
                 <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Modules</div>
                 <div className="text-2xl font-mono text-emerald-400 font-bold tabular-nums drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                    {filesGenerated.length} <span className="text-slate-600 text-lg">/ {TARGET_FILES.length}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
           
           {/* Left: Phase & Files */}
           <div className="lg:col-span-4 flex flex-col gap-4">
              
              {/* Active Phase Card */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/30 rounded-3xl p-6 shadow-xl relative overflow-hidden flex-shrink-0">
                 <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-slate-800"></div>
                 <div className="space-y-6 relative">
                    {PHASES.map((phase, idx) => {
                       const isActive = idx === currentPhase;
                       const isDone = idx < currentPhase;
                       const Icon = phase.icon;
                       
                       return (
                          <div key={phase.id} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'opacity-40'}`}>
                             <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg transition-all duration-500 z-10
                                ${isActive ? `${phase.bg} ${phase.color} ${phase.border} scale-110 shadow-[0_0_15px_rgba(6,182,212,0.3)]` : isDone ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-500'}
                             `}>
                                {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                             </div>
                             <div>
                                <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{phase.label}</div>
                                {isActive && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                        <span className="text-[10px] text-cyan-400 font-mono">PROCESSING</span>
                                    </div>
                                )}
                             </div>
                          </div>
                       )
                    })}
                 </div>
              </div>

              {/* File List */}
              <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-slate-700/30 rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col min-h-0">
                 <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                    <Box size={12} className="mr-2" /> File System
                 </h3>
                 <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-hide">
                    {TARGET_FILES.map((file) => {
                       const isCreated = filesGenerated.includes(file);
                       return (
                          <div key={file} className={`flex items-center gap-3 text-xs font-mono p-2.5 rounded-lg transition-all duration-500 ${isCreated ? 'text-slate-300 bg-white/5' : 'text-slate-700 opacity-50'}`}>
                             <FileCode size={14} className={isCreated ? 'text-cyan-400' : 'text-slate-700'} />
                             <span className={isCreated ? 'opacity-100' : 'blur-[2px]'}>{file}</span>
                             {isCreated && file === activeFile && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]"></span>
                             )}
                          </div>
                       )
                    })}
                 </div>
              </div>
           </div>

           {/* Right: Code Hologram & Logs */}
           <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
              
              {/* The "Holographic" Editor */}
              <div className="flex-1 relative bg-[#0b0f1a]/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden group/editor flex flex-col">
                 <div className="scan-line"></div> {/* Holographic Scan Line */}
                 
                 <div className="h-12 bg-[#161b27]/80 border-b border-slate-800 flex items-center px-6 justify-between z-20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                       <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                       </div>
                       <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
                       <span className="text-xs font-mono text-cyan-400 flex items-center bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                          <Code2 size={12} className="mr-2" />
                          {activeFile || 'kernel_init.sys'}
                       </span>
                    </div>
                 </div>

                 <div ref={codeRef} className="flex-1 p-6 overflow-hidden font-mono text-sm leading-relaxed text-slate-300/90 select-none relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
                    <div className="whitespace-pre-wrap break-all relative z-10">
                       {codeStream}
                       <span className="inline-block w-2 h-5 bg-cyan-500 align-middle ml-1 animate-pulse shadow-[0_0_15px_#06b6d4]"></span>
                    </div>
                 </div>
              </div>

              {/* Terminal Logs */}
              <div className="h-40 bg-black/40 backdrop-blur-2xl rounded-3xl border border-slate-800 p-5 font-mono text-xs overflow-hidden flex flex-col shadow-inner relative">
                 <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Terminal size={48} />
                 </div>
                 <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5 relative z-10">
                    <Terminal size={12} className="text-slate-400" />
                    <span className="text-slate-400 font-bold uppercase tracking-wider">System Output</span>
                 </div>
                 <div ref={logsRef} className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide relative z-10">
                    {logs.map((log, i) => (
                       <div key={i} className="text-slate-400 truncate animate-slide-in-right flex items-center">
                          <span className="text-violet-500 mr-2 opacity-80">➜</span>
                          <span className="opacity-90">{log.split(']')[0]}]</span>
                          <span className="text-slate-300 ml-2">{log.split(']')[1]}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
