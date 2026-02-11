
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Bug, CheckCircle2, Loader2, XCircle, Wand2, Zap } from 'lucide-react';

interface Props {
  onComplete: () => void;
  isTurbo?: boolean;
}

interface TestItem {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail' | 'fixing';
  type: 'unit' | 'integration' | 'security';
}

const TESTS: TestItem[] = [
  { id: 1, name: 'Core Logic Integrity', status: 'pending', type: 'unit' },
  { id: 2, name: 'Security: SQL Injection Scan', status: 'pending', type: 'security' },
  { id: 3, name: 'Neural Fabric Cohesion', status: 'pending', type: 'integration' },
  { id: 4, name: 'Global Asset Verification', status: 'pending', type: 'integration' },
  { id: 5, name: 'Latency Benchmarking', status: 'pending', type: 'unit' },
  { id: 6, name: 'Heap Memory Analysis', status: 'pending', type: 'unit' },
];

export const StageTesting: React.FC<Props> = ({ onComplete, isTurbo }) => {
  const [items, setItems] = useState<TestItem[]>(TESTS);
  
  // Turbo: Super fast sequence. Normal: Paced.
  const stepDelay = isTurbo ? 100 : 800; 
  const completionDelay = isTurbo ? 400 : 1500;

  useEffect(() => {
    let currentIndex = 0;
    
    const runNext = () => {
      if (currentIndex >= items.length) {
        setTimeout(onComplete, completionDelay);
        return;
      }
      
      // Mark current as running
      setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'running' } : item));
      
      // If turbo, maybe run multiple? No, let's just make the ticks extremely fast.
      setTimeout(() => {
        setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'pass' } : item));
        currentIndex++;
        runNext();
      }, stepDelay);
    };

    runNext();
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Panel: Visual Status */}
        <div className="glass-panel p-8 rounded-[2rem] border-t-4 border-purple-500 flex flex-col justify-between relative overflow-hidden">
          {isTurbo && <div className="absolute inset-0 bg-purple-500/5 animate-pulse"></div>}
          
          <div>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <ShieldCheck className="mr-3 text-purple-600 dark:text-purple-400" size={24} /> 
                {isTurbo ? 'Parallel Audit' : 'Rapid Audit'}
                </h3>
                {isTurbo && (
                    <span className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded font-bold uppercase flex items-center gap-1 animate-bounce">
                        <Zap size={10} fill="white" /> Turbo
                    </span>
                )}
            </div>
            
            <div className="space-y-4 font-mono text-xs text-slate-400">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span>Active Threads</span>
                    <span className="text-white font-bold">{isTurbo ? '64' : '4'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span>Coverage</span>
                    <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span>Vulnerabilities</span>
                    <span className="text-white font-bold">0</span>
                </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-[10px] text-slate-400 font-mono h-32 overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 pointer-events-none"></div>
             <div className="space-y-1">
                {items.filter(i => i.status === 'pass').map(i => (
                    <div key={i.id} className="text-emerald-500/80">> Verified: {i.name}</div>
                ))}
                <div className="text-purple-400 animate-pulse">> Neural heuristic scan active...</div>
             </div>
          </div>
        </div>

        {/* Right Panel: Test List */}
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Bug className="mr-3 text-cyan-600 dark:text-cyan-400" size={20} /> Test Matrix
          </h3>
          <div className="space-y-3">
            {items.map((test) => (
              <div 
                key={test.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    test.status === 'pass' 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : test.status === 'running'
                        ? 'bg-white/5 border-white/10 scale-[1.02] shadow-lg'
                        : 'bg-transparent border-transparent opacity-50'
                }`}
              >
                <div className="flex items-center">
                  {test.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-slate-700 mr-4"></div>}
                  {test.status === 'running' && <Loader2 className="w-5 h-5 text-cyan-500 animate-spin mr-4" />}
                  {test.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-4" />}
                  <span className={`text-sm ${test.status === 'running' ? 'text-white font-bold' : 'text-slate-300'}`}>
                      {test.name}
                  </span>
                </div>
                <span className="text-[10px] uppercase text-slate-600 font-bold tracking-widest">{test.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
