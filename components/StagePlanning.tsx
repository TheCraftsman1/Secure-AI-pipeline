import React, { useState, useEffect } from 'react';
import { Database, ProjectConfig, ProjectFeatures, TechStack } from '../types';
import { Settings2, Sparkles, ToggleRight } from 'lucide-react';
import { generateProjectBlueprint } from '../services/geminiService';

interface Props {
  onComplete: (config: ProjectConfig, blueprint: string) => void;
}

export const StagePlanning: React.FC<Props> = ({ onComplete }) => {
  const [idea, setIdea] = useState('');
  const [stack, setStack] = useState<TechStack>(TechStack.ReactNode);
  const [database, setDatabase] = useState<Database>(Database.Postgres);
  const [features, setFeatures] = useState<ProjectFeatures>({
    auth: true,
    payments: false,
    search: true,
    admin: false,
    notifications: false,
    analytics: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggle = (key: keyof ProjectFeatures) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!idea) return;
    setIsGenerating(true);
    const config: ProjectConfig = { idea, stack, database, features };
    const blueprint = await generateProjectBlueprint(config);
    setIsGenerating(false);
    onComplete(config, blueprint);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Configuration Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-cyan-500">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Settings2 className="mr-2 text-cyan-400" /> Project Parameters
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">What are we building?</label>
              <textarea 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all h-24 resize-none"
                placeholder="e.g., A decentralized marketplace for digital art..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Tech Stack</label>
                <select 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none"
                  value={stack}
                  onChange={(e) => setStack(e.target.value as TechStack)}
                >
                  {Object.values(TechStack).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Database</label>
                <select 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value as Database)}
                >
                  {Object.values(Database).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-3">System Modules</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(features).map((f) => {
                  const key = f as keyof ProjectFeatures;
                  const active = features[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleToggle(key)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        active 
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                        : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      <span className="capitalize font-medium">{f}</span>
                      <ToggleRight className={active ? 'text-cyan-400' : 'text-slate-600'} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={!idea || isGenerating}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all
            ${!idea || isGenerating 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25'
            }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Requirements...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Blueprint</span>
            </>
          )}
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="lg:col-span-5">
        <div className="glass-panel rounded-xl h-full p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <h3 className="text-lg font-semibold text-slate-300 mb-6 border-b border-slate-700 pb-2">
            Live Prompt Preview
          </h3>

          <div className="font-mono text-sm space-y-4 text-slate-400">
            <div className="flex gap-2">
              <span className="text-blue-400">{'>'}</span>
              <span className="text-slate-200">Initializing project spec...</span>
            </div>
            <div className="pl-4 border-l border-slate-800 space-y-2">
              <p><span className="text-purple-400">TARGET:</span> "{idea || 'Waiting for input...'}"</p>
              <p><span className="text-cyan-400">STACK:</span> {stack}</p>
              <p><span className="text-green-400">DB_LAYER:</span> {database}</p>
            </div>
            
            <div className="mt-4">
              <span className="text-slate-500">// Active Modules</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(features).map(([k, v]) => (
                   v && <span key={k} className="px-2 py-1 rounded bg-slate-800 text-xs text-cyan-300 border border-slate-700">
                     {k.toUpperCase()}
                   </span>
                ))}
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs text-slate-600 text-center">
                AI Model: Gemini 2.5 Flash • Secure Mode Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};