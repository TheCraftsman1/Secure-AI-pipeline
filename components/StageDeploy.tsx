
import React, { useState, useEffect, useRef } from 'react';
import { ProjectConfig, ProjectFile, Project, CustomizationOptions } from '../types';
import { Ide } from './Ide';
import { GeneratedWebsitePreview } from './GeneratedWebsitePreview';
import { generateFullProject } from '../services/geminiService';
import { 
    ArrowLeft, Rocket, Globe, Server, Shield, 
    Settings, Code, Eye, Plus, Trash2, 
    RefreshCw, CheckCircle2, Edit3, Loader2,
    Palette, Download, Sparkles, ExternalLink, Share2, Maximize2,
    Zap, Cpu, Wifi, Terminal, Activity, CloudLightning,
    Crown, Stars, FileCode, ShieldCheck, Fingerprint
} from 'lucide-react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
  config: ProjectConfig;
  generatedCode?: string;
  setGeneratedCode: (code: string) => void;
  project?: Project;
  files?: ProjectFile[];
  onFilesUpdate?: (files: ProjectFile[]) => void;
}

const CodeViewer: React.FC<{ code: string }> = ({ code }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const containerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setDisplayedCode('');
    let i = 0;
    const chunkSize = 20; // Faster render
    const interval = setInterval(() => {
      if (i >= code.length) {
        clearInterval(interval);
        setDisplayedCode(code);
        return;
      }
      setDisplayedCode(code.substring(0, i + chunkSize));
      i += chunkSize;
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 1);

    return () => clearInterval(interval);
  }, [code]);

  const highlightCode = (source: string) => {
    const tokens = source.split(/(<[^>]+>)/g);
    
    return tokens.map((token, index) => {
      if (token.startsWith('<') && token.endsWith('>')) {
        const isClosing = token.startsWith('</');
        const content = token.substring(isClosing ? 2 : 1, token.length - 1);
        const parts = content.split(' ');
        const tagName = parts[0];
        const attrs = parts.slice(1).join(' ');

        return (
          <span key={index} className="text-blue-500">
            &lt;{isClosing && '/'}<span className="text-pink-600">{tagName}</span>
            {attrs && (
               <span className="text-purple-600">
                 {attrs.split(/(\s+|=)/).map((attrPart, i) => {
                    if (attrPart.startsWith('"') || attrPart.startsWith("'")) {
                        return <span key={i} className="text-yellow-600" dangerouslySetInnerHTML={{ __html: attrPart }}></span>;
                    }
                    return <span key={i} dangerouslySetInnerHTML={{ __html: attrPart }}></span>;
                 })}
               </span>
            )}
            &gt;
          </span>
        );
      }
      return <span key={index}>{token}</span>;
    });
  };

  return (
    <div className="w-full h-full bg-[#0d1117] overflow-hidden flex flex-col font-mono text-xs shadow-inner relative group border-l border-slate-800">
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs text-slate-400 select-none">
         <FileCode size={12} className="mr-2 text-blue-500" />
         <span>index.html</span>
         <span className="ml-auto text-slate-600">UTF-8</span>
      </div>
      
      <pre ref={containerRef} className="flex-1 p-4 overflow-auto scrollbar-hide leading-relaxed">
        <code>
          {displayedCode.split('\n').map((line, i) => (
            <div key={i} className="table-row">
               <span className="table-cell text-right pr-4 text-slate-700 select-none min-w-[3rem]">{i + 1}</span>
               <span className="table-cell whitespace-pre-wrap">{highlightCode(line)}</span>
            </div>
          ))}
          <div className="animate-pulse w-2 h-5 bg-blue-500 inline-block align-middle ml-1"></div>
        </code>
      </pre>
    </div>
  );
};

export const StageDeploy: React.FC<Props> = ({ onComplete, onBack, config, generatedCode, setGeneratedCode, project, files, onFilesUpdate }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'ide'>('preview');
  const [isAuditing, setIsAuditing] = useState(project?.isTurbo || false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    theme: 'Modern',
    primaryColor: 'indigo',
    borderRadius: 'rounded-lg'
  });

  useEffect(() => {
    if (isAuditing) {
        // Significantly faster audit for turbo mode
        const interval = setInterval(() => {
            setAuditProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsAuditing(false), 300);
                    return 100;
                }
                return prev + 5; // Faster increment
            });
        }, 20); // Faster tick
        return () => clearInterval(interval);
    }
  }, [isAuditing]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const files = await generateFullProject(config, customization);
      if (onFilesUpdate) onFilesUpdate(files);
      const indexHtml = files.find(f => f.name === 'index.html');
      if (indexHtml) setGeneratedCode(indexHtml.content);
    } catch (error) {
      console.error("Failed to regenerate:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-10">
      {isAuditing && project?.isTurbo && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center animate-fade-in">
              <div className="max-w-md w-full p-10 text-center space-y-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-[2rem] border-2 border-teal-500/30 flex items-center justify-center animate-spin-slow">
                        <ShieldCheck size={40} className="text-teal-500" />
                    </div>
                    <div className="absolute inset-0 border-2 border-teal-500 rounded-[2rem] animate-ping opacity-20"></div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">Elite Security Audit</h2>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Neural Verification Stage: {auditProgress}%</p>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 transition-all duration-100 shadow-[0_0_15px_rgba(45,212,191,0.5)]" style={{ width: `${auditProgress}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left font-mono text-[8px] text-slate-600 uppercase">
                      <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${auditProgress > 20 ? 'bg-teal-500' : 'bg-slate-700'}`}></div> Kernel Hash: OK</div>
                      <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${auditProgress > 40 ? 'bg-teal-500' : 'bg-slate-700'}`}></div> Logic Proof: Verified</div>
                      <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${auditProgress > 60 ? 'bg-teal-500' : 'bg-slate-700'}`}></div> UX Fidelity: Elite</div>
                      <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${auditProgress > 80 ? 'bg-teal-500' : 'bg-slate-700'}`}></div> Edge Deploy: Global</div>
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-panel p-8 rounded-[2rem] border-l-4 border-accent-gold animate-scale-in">
             <div className="flex items-center mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mr-4 shadow-xl">
                    <Crown size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-display font-bold text-white">Elite Staging</h2>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Synthesis Finalised</p>
                 </div>
             </div>
             
             <div className="space-y-4">
                <button 
                  onClick={onComplete}
                  className="w-full py-5 bg-white text-midnight-900 rounded-2xl font-bold text-lg shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center"
                >
                  Verify & Deploy <ArrowLeft className="ml-2 rotate-180" size={20} />
                </button>
                
                <div className="pt-4 border-t border-white/5 space-y-3">
                    <p className="text-[10px] text-slate-500 text-center italic">Project synthesized with zero pipeline restriction. Infinite visual throughput active.</p>
                </div>
             </div>
          </div>

          {/* Design Tuning */}
          <div className="glass-panel p-8 rounded-[2rem] border-l-4 border-accent-teal animate-scale-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-display font-bold text-white flex items-center">
                 <Palette className="mr-2 text-accent-teal" size={20} /> Neural Tuner
               </h3>
               <span className="text-[10px] bg-accent-teal/10 text-accent-teal px-2 py-1 rounded-full font-bold tracking-widest uppercase">AI-Powered</span>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Architecture Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Modern', 'Minimal', 'Luxury', 'Corporate'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setCustomization(prev => ({ ...prev, theme: theme as any }))}
                      className={`py-3 px-3 rounded-xl text-xs font-bold transition-all duration-300 border ${
                        customization.theme === theme
                          ? 'bg-accent-teal/10 border-accent-teal text-white shadow-lg'
                          : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center transition-all duration-500 border ${
                   isRegenerating 
                   ? 'bg-slate-900 border-white/5 text-slate-600 cursor-not-allowed' 
                   : 'bg-white/5 hover:bg-white/10 text-accent-teal border-accent-teal/30 hover:border-accent-teal'
                }`}
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Synthesizing UI...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2" size={16} />
                    Refactor Synthesis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="lg:col-span-8 h-[800px] flex flex-col gap-4 animate-scale-in" style={{ animationDelay: '200ms' }}>
           
           <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h3 className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">
                  Production Viewport
                </h3>
             </div>
             
             <div className="flex bg-slate-900/80 backdrop-blur rounded-2xl p-1.5 border border-white/5">
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'preview' 
                    ? 'bg-slate-800 text-white shadow-xl' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Eye size={14} className="mr-2" /> Live Preview
                </button>
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'code' 
                    ? 'bg-slate-800 text-accent-teal shadow-xl' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Code size={14} className="mr-2" /> Source
                </button>
                <button 
                  onClick={() => setActiveTab('ide')}
                  className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'ide' 
                    ? 'bg-slate-800 text-purple-400 shadow-xl' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Terminal size={14} className="mr-2" /> Architect IDE
                </button>
             </div>
           </div>

           <div className="flex-1 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden relative bg-[#050507]">
             
             {/* Loader Overlay */}
             <div className={`absolute inset-0 bg-[#050507]/90 backdrop-blur-xl z-[60] flex items-center justify-center transition-opacity duration-700 ${isRegenerating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center animate-scale-in">
                    <RefreshCw className="w-12 h-12 text-accent-teal animate-spin mb-4" />
                    <p className="text-white font-display font-bold text-2xl tracking-tight">Re-Synthesizing Experience</p>
                    <p className="text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">NO RATE LIMITS • NEURAL OPTIMIZATION</p>
                </div>
             </div>
             
             <div className={`w-full h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                <GeneratedWebsitePreview config={config} generatedCode={generatedCode} />
             </div>

             {activeTab === 'code' && (
                <div className="h-full">
                  {generatedCode ? <CodeViewer code={generatedCode} /> : <div className="p-20 text-center text-slate-600">No code generated yet...</div>}
                </div>
             )}

             {activeTab === 'ide' && project && (
                 <Ide 
                   project={project} 
                   files={files || []} 
                   onFilesUpdate={onFilesUpdate || (() => {})} 
                 />
             )}
             
           </div>
           
           <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono px-4 py-2">
              <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                     SSL ENCRYPTED
                  </span>
                  <span className="flex items-center gap-2">
                     <Wifi size={10} />
                     PRODUCTION GRADE
                  </span>
              </div>
              <div className="flex items-center gap-4">
                  <span className="text-accent-teal font-bold uppercase tracking-widest">Unlimited Throughput Active</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
