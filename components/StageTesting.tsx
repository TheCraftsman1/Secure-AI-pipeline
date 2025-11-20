import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Bug } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface TestItem {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  type: 'unit' | 'integration' | 'security';
}

const TESTS: TestItem[] = [
  { id: 1, name: 'Unit Tests: User Authentication', status: 'pending', type: 'unit' },
  { id: 2, name: 'Unit Tests: Payment Gateway Mock', status: 'pending', type: 'unit' },
  { id: 3, name: 'Integration: API Endpoints', status: 'pending', type: 'integration' },
  { id: 4, name: 'Security: SQL Injection Scan', status: 'pending', type: 'security' },
  { id: 5, name: 'Security: Dependency Audit', status: 'pending', type: 'security' },
  { id: 6, name: 'Performance: Load Simulation', status: 'pending', type: 'integration' },
];

export const StageTesting: React.FC<Props> = ({ onComplete }) => {
  const [items, setItems] = useState<TestItem[]>(TESTS);
  
  useEffect(() => {
    let currentIndex = 0;
    
    const runNext = () => {
      if (currentIndex >= items.length) {
        setTimeout(onComplete, 1500);
        return;
      }

      // Set running
      setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'running' } : item));

      // Set done
      setTimeout(() => {
        setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'pass' } : item));
        currentIndex++;
        runNext();
      }, 1000);
    };

    runNext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Dashboard */}
        <div className="glass-panel p-6 rounded-xl border-t-4 border-purple-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <ShieldCheck className="mr-2 text-purple-400" /> Security Audit
            </h3>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded uppercase border border-purple-500/30">Automated</span>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <span className="text-slate-400 text-sm">Vulnerabilities Found</span>
                <span className="text-emerald-400 font-bold">0</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <span className="text-slate-400 text-sm">Code Coverage</span>
                <span className="text-blue-400 font-bold">94%</span>
             </div>
             <div className="p-4 rounded bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono">
                > Scanning dependencies... OK<br/>
                > Checking for hardcoded secrets... OK<br/>
                > Verifying API authorization... OK
             </div>
          </div>
        </div>

        {/* Test Runner */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Bug className="mr-2 text-cyan-400" /> Test Runner
          </h3>
          <div className="space-y-3">
            {items.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-800 transition-all">
                <div className="flex items-center">
                  {test.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-600 mr-3"></div>}
                  {test.status === 'running' && <div className="w-4 h-4 rounded-full border-2 border-t-cyan-500 border-slate-600 animate-spin mr-3"></div>}
                  {test.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3" />}
                  <span className={`text-sm ${test.status === 'running' ? 'text-white' : 'text-slate-400'}`}>{test.name}</span>
                </div>
                <span className="text-xs uppercase text-slate-600 font-bold tracking-wider">{test.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};