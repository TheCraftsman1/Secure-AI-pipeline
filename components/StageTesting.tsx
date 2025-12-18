import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Bug, Wand2, Loader2, XCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface TestItem {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail' | 'fixing';
  type: 'unit' | 'integration' | 'security';
}

const TESTS: TestItem[] = [
  { id: 1, name: 'Unit Tests: User Authentication', status: 'pending', type: 'unit' },
  { id: 2, name: 'Unit Tests: Payment Gateway Mock', status: 'pending', type: 'unit' },
  { id: 3, name: 'Integration: API Endpoints', status: 'pending', type: 'integration' },
  { id: 4, name: 'Security: SQL Injection Scan', status: 'pending', type: 'security' }, // Will fail initially
  { id: 5, name: 'Security: Dependency Audit', status: 'pending', type: 'security' },
  { id: 6, name: 'Performance: Load Simulation', status: 'pending', type: 'integration' },
];

export const StageTesting: React.FC<Props> = ({ onComplete }) => {
  const [items, setItems] = useState<TestItem[]>(TESTS);
  const [healingLog, setHealingLog] = useState<string>('');
  
  useEffect(() => {
    let currentIndex = 0;
    
    const runNext = () => {
      if (currentIndex >= items.length) {
        setTimeout(onComplete, 1500);
        return;
      }
      
      // Start running current test
      setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'running' } : item));
      
      setTimeout(() => {
        // Special logic for test ID 4 (Security Fail -> Auto Fix)
        if (items[currentIndex].id === 4) {
            setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'fail' } : item));
            
            // Start Healing Sequence
            setTimeout(() => {
                setHealingLog('Vulnerability Detected: SQL Injection risk in query builder.');
                setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'fixing' } : item));
                
                setTimeout(() => {
                    setHealingLog('AI Agent: Patching query builder with parameterized inputs...');
                    setTimeout(() => {
                        setHealingLog('Re-running security scan...');
                        setTimeout(() => {
                            setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'pass' } : item));
                            setHealingLog('Vulnerability patched. Test Passed.');
                            currentIndex++;
                            runNext();
                        }, 1000);
                    }, 1500);
                }, 1500);
            }, 1000);

        } else {
            // Normal pass
            setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'pass' } : item));
            currentIndex++;
            runNext();
        }
      }, 1000);
    };

    runNext();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border-t-4 border-purple-500 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <ShieldCheck className="mr-2 text-purple-600 dark:text-purple-400" /> Security Audit
            </h3>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs rounded uppercase border border-purple-200 dark:border-purple-500/30">Automated</span>
          </div>
          
          <div className="space-y-4 mb-4">
             <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Vulnerabilities Found</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">0</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Code Coverage</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">94%</span>
             </div>
          </div>
          
          <div className="flex-1 p-4 rounded bg-slate-900/50 dark:bg-slate-800/50 border border-slate-700 text-xs text-slate-300 dark:text-slate-400 font-mono overflow-y-auto">
             <div>> Scanning dependencies... OK</div>
             <div>> Checking for hardcoded secrets... OK</div>
             <div>> Verifying API authorization... OK</div>
             {healingLog && (
                 <div className="mt-2 pt-2 border-t border-slate-700 animate-fade-in">
                    <span className="text-purple-400"># SELF-HEALING LOG</span>
                    <br/>
                    <span className="text-yellow-400">> {healingLog}</span>
                 </div>
             )}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Bug className="mr-2 text-cyan-600 dark:text-cyan-400" /> Test Runner
          </h3>
          <div className="space-y-3">
            {items.map((test) => (
              <div key={test.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  test.status === 'fail' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50' : 
                  test.status === 'fixing' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/50' :
                  'bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center">
                  {test.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 mr-3"></div>}
                  {test.status === 'running' && <Loader2 className="w-4 h-4 text-cyan-500 animate-spin mr-3" />}
                  {test.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3" />}
                  {test.status === 'fail' && <XCircle className="w-4 h-4 text-red-500 mr-3" />}
                  {test.status === 'fixing' && <Wand2 className="w-4 h-4 text-purple-500 animate-pulse mr-3" />}
                  
                  <span className={`text-sm ${test.status === 'running' || test.status === 'fixing' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                      {test.name}
                      {test.status === 'fixing' && <span className="ml-2 text-purple-500 text-xs">(Auto-patching...)</span>}
                  </span>
                </div>
                <span className="text-xs uppercase text-slate-400 dark:text-slate-600 font-bold tracking-wider">{test.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};