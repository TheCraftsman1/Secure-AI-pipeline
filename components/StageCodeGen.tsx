
import React, { useEffect, useState, useRef } from 'react';
import { FileCode, Cpu, Zap, CheckCircle2, Sparkles, Layers, Box, Code2, Database, Layout, Terminal, Activity } from 'lucide-react';
import { ProjectConfig, TechStack } from '../types';

interface Props {
  onComplete: () => void;
  blueprint: string;
  config: ProjectConfig;
  isTurbo?: boolean;
}

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
  "Synthesizing HTML structure...",
  "Optimizing render cycles...",
  "Running accessibility heuristics...",
  "Minifying JavaScript bundles...",
  "Finalizing build artifacts...",
  "Injecting Tailwind utility classes...",
  "Tree-shaking unused modules...",
  "Verifying semantic integrity...",
  "Compiling WebAssembly modules...",
];

const REAL_CODE_SNIPPETS = [
  `import { createSlice, PayloadAction } from '@reduxjs/toolkit';\n\ninterface SystemState {\n  throughput: number;\n  latency: number;\n  status: 'idle' | 'active';\n}\n\nconst initialState: SystemState = { throughput: 0, latency: 0, status: 'idle' };`,
  `export const NeuralEngine = React.memo(({ config }) => {\n  const ref = useRef<HTMLCanvasElement>(null);\n  useEffect(() => {\n    if (!ref.current) return;\n    const ctx = ref.current.getContext('2d');\n    // Matrix transformation logic\n    ctx.setTransform(1, 0, 0, 1, 0, 0);\n  }, [config]);\n  return <canvas ref={ref} />;\n});`,
  `.glass-panel {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\n}\n\n.animate-neural-pulse {\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}`,
  `// Core Settlement Logic\nasync function executeSettlement(tx: Transaction): Promise<Result> {\n  const snapshot = await ledger.getSnapshot(tx.blockHeight);\n  if (!verifySignature(tx, snapshot)) throw new Error('Invalid Sig');\n  return await atomicSwap(tx.from, tx.to, tx.amount);\n}`
];

const getFilesForStack = (stack: TechStack): string[] => {
  return ['package.json', 'README.md', 'index.html', 'styles.css', 'script.js', 'auth.ts', 'database.config.js'];
};

export const StageCodeGen: React.FC<Props> = ({ onComplete, config, isTurbo }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeFile, setActiveFile] = useState<string>('');
  const [codeStream, setCodeStream] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [filesGenerated, setFilesGenerated] = useState<string[]>([]);
  const [linesCount, setLinesCount] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  const codeRef = useRef<HTMLDivElement>(null);
  const logsRef = useRef<HTMLDivElement>(null);

  // Turbo speed: 100x faster (0.01 multiplier).
  const speedMultiplier = isTurbo ? 0.01 : 1; 
  const TARGET_FILES = getFilesForStack(config.stack);

  useEffect(() => {
    let phaseIdx = 0;
    let logIdx = 0;
    let fileIdx = 0;
    let snippetCharIdx = 0;
    let currentSnippet = REAL_CODE_SNIPPETS[0];
    let isMounted = true;

    // Phase transition timer
    const phaseInterval = setInterval(() => {
      if (!isMounted) return;
      if (phaseIdx < PHASES.length - 1) {
        phaseIdx++;
        setCurrentPhase(phaseIdx);
        if (isTurbo) setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 50); 
      } else {
        clearInterval(phaseInterval);
        setTimeout(onComplete, isTurbo ? 200 : 2000); 
      }
    }, 3500 * speedMultiplier); 

    // Log generation timer
    const logInterval = setInterval(() => {
      if (!isMounted) return;
      const log = LOG_MESSAGES[logIdx % LOG_MESSAGES.length];
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      setLogs(prev => [...prev.slice(-8), `[${timestamp}] ${log}`]); 
      setLinesCount(prev => prev + Math.floor(Math.random() * (isTurbo ? 1500 : 50)) + 10);
      logIdx++;
      if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }, (isTurbo ? 20 : 300) * speedMultiplier);

    // Code typing timer
    const typeInterval = setInterval(() => {
      if (!isMounted) return;

      setCodeStream(prev => {
        // Turbo: Chunk 500 chars at a time. Normal: 1 char.
        const charCount = isTurbo ? 500 : 1; 
        let newChars = '';
        for(let i=0; i<charCount; i++) {
            newChars += currentSnippet[(snippetCharIdx + i) % currentSnippet.length];
        }
        snippetCharIdx += charCount;
        
        // Keep buffer manageable
        if (prev.length > 2500) return prev.slice(800) + newChars;
        return prev + newChars;
      });

      if (codeRef.current) codeRef.current.scrollTop = codeRef.current.scrollHeight;

      // Switch files rapidly
      if (snippetCharIdx % (isTurbo ? 500 : 100) === 0) {
        const file = TARGET_FILES[fileIdx % TARGET_FILES.length];
        if (!filesGenerated.includes(file)) {
            setFilesGenerated(prev => [...prev, file]);
        }
        setActiveFile(file);
        currentSnippet = REAL_CODE_SNIPPETS[fileIdx % REAL_CODE_SNIPPETS.length];
        fileIdx++;
      }
    }, isTurbo ? 1 : 4); 

    return () => {
      isMounted = false;
      clearInterval(phaseInterval);
      clearInterval(logInterval);
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <div className={`relative w-full h-[650px] rounded-3xl overflow-hidden bg-[#020617] border border-slate-800 shadow-2xl animate-fade-in group ${glitchActive ? 'brightness-150 contrast-125' : ''}`}>
      <div className="absolute inset-0 pointer-events-none">
         <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] ${isTurbo ? 'animate-pulse' : 'animate-pulse-slow'}`}></div>
         <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] ${isTurbo ? 'animate-pulse' : 'animate-pulse-slow'}`}></div>
         {isTurbo && (
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay"></div>
         )}
      </div>

      <div className="relative z-10 h-full flex flex-col p-8">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                 <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                 </div>
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    {isTurbo ? 'Neural Overdrive' : 'Neural Synthesis'}
                 </span>
                 {isTurbo && (
                     <span className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded-md ml-4 font-mono font-bold flex items-center gap-1 animate-bounce">
                        <Zap size={10} fill="white" /> 100Gb/s
                     </span>
                 )}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {isTurbo ? 'Direct-to-Core injection. Latency < 0.1ms.' : `Fabricating ${config.stack} Core`}
              </p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md">
                 <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Total Lines</div>
                 <div className={`text-2xl font-mono ${isTurbo ? 'text-orange-400' : 'text-cyan-400'} font-bold tabular-nums`}>
                    {linesCount.toLocaleString()}
                 </div>
              </div>
           </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
           <div className="col-span-4 flex flex-col gap-4">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/30 rounded-3xl p-6 relative overflow-hidden flex-shrink-0">
                 <div className="space-y-6 relative">
                    {PHASES.map((phase, idx) => {
                       const isActive = idx === currentPhase;
                       const isDone = idx < currentPhase;
                       return (
                          <div key={phase.id} className={`flex items-center gap-4 transition-all duration-100 ${isActive ? 'translate-x-0 opacity-100' : 'opacity-40'}`}>
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${isActive ? `${phase.bg} ${phase.color} ${phase.border} scale-110` : isDone ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800'}`}>
                                {isDone ? <CheckCircle2 size={18} /> : <phase.icon size={18} />}
                             </div>
                             <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{phase.label}</div>
                          </div>
                       )
                    })}
                 </div>
              </div>
              
              <div className="flex-1 bg-black/40 border border-white/5 rounded-3xl p-4 overflow-hidden font-mono text-[10px] text-slate-500">
                  <div className="mb-2 flex items-center gap-2 border-b border-white/5 pb-2">
                      <Terminal size={12} />
                      <span className="uppercase tracking-widest">Live Kernel Log</span>
                  </div>
                  <div ref={logsRef} className="h-full overflow-y-auto scrollbar-hide space-y-1.5">
                      {logs.map((log, i) => <div key={i} className="animate-reveal truncate">{log}</div>)}
                  </div>
              </div>
           </div>

           <div className="col-span-8 flex flex-col gap-4 min-h-0">
              <div className={`flex-1 relative bg-[#0b0f1a]/80 backdrop-blur-xl rounded-3xl border ${isTurbo ? 'border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.1)]' : 'border-slate-700/50 shadow-2xl'} overflow-hidden flex flex-col`}>
                 <div className="h-12 bg-[#161b27]/80 border-b border-slate-800 flex items-center px-6 justify-between">
                    <span className={`text-xs font-mono ${isTurbo ? 'text-orange-400' : 'text-cyan-400'} flex items-center bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20`}>
                       <Code2 size={12} className="mr-2" /> {activeFile || 'synthesis.sys'}
                    </span>
                    {isTurbo && (
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" style={{ animationDelay: `${i*0.05}s` }}></div>)}
                        </div>
                    )}
                 </div>
                 <div ref={codeRef} className="flex-1 p-6 overflow-hidden font-mono text-sm leading-relaxed text-slate-300/90 relative">
                    <div className={`whitespace-pre-wrap break-all relative z-10 ${isTurbo ? 'text-orange-100/90 blur-[0.5px] scale-[1.01]' : ''}`}>
                       {codeStream}
                       <span className={`inline-block w-2 h-5 ${isTurbo ? 'bg-orange-500' : 'bg-cyan-500'} align-middle ml-1 animate-pulse`}></span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
