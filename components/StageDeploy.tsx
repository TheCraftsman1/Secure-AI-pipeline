
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
    Zap, Cpu, Wifi, Terminal, Activity, CloudLightning
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

export const StageDeploy: React.FC<Props> = ({ 
    onComplete, 
    onBack,
    config, 
    generatedCode, 
    setGeneratedCode, 
    project, 
    files, 
    onFilesUpdate 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'editor'>('settings');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  
  // Deployment State (Replaced Timer with Progress)
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  
  const effectiveProject: Project = project || {
    id: 'temp',
    name: config.idea,
    createdAt: Date.now(),
    status: 'building',
    currentStage: 4,
    config: config,
    generatedCode: generatedCode
  };

  const [localFiles, setLocalFiles] = React.useState<ProjectFile[]>(files || []);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    theme: 'Modern',
    primaryColor: 'indigo',
    borderRadius: 'rounded-lg'
  });

  const [deployConfig, setDeployConfig] = useState({
      name: config.idea.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20) || 'my-app',
      region: 'us-east-1',
      domain: '',
      replicas: 1
  });

  // Initial Load (Short)
  useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      if (files && files.length > 0) {
          setLocalFiles(files);
      }
  }, [files]);

  // Fast Deployment Logic (Accelerated)
  useEffect(() => {
      let interval: any;
      if (isDeploying) {
          setDeployLogs(prev => [`[${new Date().toLocaleTimeString()}] Initializing deployment pipeline...`]);
          
          interval = setInterval(() => {
              setDeployProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      setTimeout(() => {
                          setIsDeploying(false);
                          setIsDeployed(true);
                      }, 500);
                      return 100;
                  }
                  
                  // Increased increment speed (was +2) to represent pre-cached artifacts
                  const newProgress = prev + 4; 
                  
                  if (newProgress % 15 === 0) { // More frequent logs
                       const logs = [
                          "Pre-compiled artifacts detected...",
                          "Optimizing assets (Brotli/Gzip)...",
                          "Verifying SSL certificates...",
                          "Allocating edge nodes in US-EAST-1...",
                          "Minifying JavaScript bundles...",
                          "Checking DNS propagation...",
                          "Warming up serverless functions...",
                          "Running health checks...",
                          "Syncing database migrations...",
                          "Configuring load balancer...",
                          "Finalizing deployment handshake..."
                      ];
                      const randomLog = logs[Math.floor(Math.random() * logs.length)];
                      setDeployLogs(prevLogs => [`[${new Date().toLocaleTimeString()}] ${randomLog}`, ...prevLogs].slice(0, 6));
                  }
                  
                  return newProgress;
              });
          }, 60); // fast tick
      }
      return () => clearInterval(interval);
  }, [isDeploying]);

  const handleFilesUpdate = (newFiles: ProjectFile[]) => {
      setLocalFiles(newFiles);
      if (onFilesUpdate) {
          onFilesUpdate(newFiles);
      }
      const indexHtml = newFiles.find(f => f.name === 'index.html');
      if (indexHtml) {
          setGeneratedCode(indexHtml.content);
      }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newFiles = await generateFullProject(config, customization);
      setLocalFiles(newFiles);
      if (onFilesUpdate) onFilesUpdate(newFiles);
      const indexHtml = newFiles.find(f => f.name === 'index.html');
      if (indexHtml) setGeneratedCode(indexHtml.content);
    } catch (error) {
      console.error("Failed to regenerate:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDeploy = () => {
      setIsDeploying(true);
      setDeployProgress(0);
  };

  const getDeployStatusText = (progress: number) => {
      if (progress < 20) return "Handshake...";
      if (progress < 40) return "Bundling...";
      if (progress < 60) return "Optimizing...";
      if (progress < 80) return "Distributing...";
      return "Going Live...";
  };

  const colors: {id: CustomizationOptions['primaryColor'], class: string}[] = [
    { id: 'indigo', class: 'bg-indigo-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'cyan', class: 'bg-cyan-500' },
    { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'rose', class: 'bg-rose-500' },
    { id: 'amber', class: 'bg-amber-500' },
    { id: 'violet', class: 'bg-violet-500' },
  ];

  if (isDeployed) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in text-center relative z-10 px-4">
              <div className="confetti absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(20)].map((_,i) => (
                      <div key={i} className="absolute w-2 h-2 bg-brand-pink rounded-full animate-pulse" style={{ left: `${Math.random()*100}%`, top: `-10px`, animationDuration: `${2+Math.random()*3}s`, animationDelay: `${Math.random()}s` }}></div>
                  ))}
              </div>
              
              <div className="glass-panel p-6 md:p-12 rounded-3xl border-brand-indigo/30 shadow-[0_0_100px_rgba(99,102,241,0.2)] max-w-2xl w-full relative overflow-hidden bg-slate-900/80 backdrop-blur-xl">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink"></div>
                  
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl animate-float">
                      <Rocket size={40} className="text-brand-indigo md:w-12 md:h-12" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Deployment Successful!</h2>
                  <p className="text-slate-400 mb-8 text-base md:text-lg font-light">Your project has been compiled, optimized, and pushed to the global edge network.</p>
                  
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-700 flex flex-col md:flex-row items-center justify-between mb-8 group cursor-pointer hover:border-brand-indigo/50 transition-colors gap-4 md:gap-0">
                      <div className="flex items-center space-x-3 overflow-hidden w-full md:w-auto">
                          <Globe className="text-emerald-400 shrink-0" size={20} />
                          <span className="text-white font-mono text-sm truncate">https://{deployConfig.name}.nexus.app</span>
                      </div>
                      <ExternalLink size={16} className="text-slate-500 group-hover:text-white transition-colors hidden md:block" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <button 
                        onClick={onComplete}
                        className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-white/10 flex items-center justify-center"
                      >
                          <Activity size={18} className="mr-2" />
                          View Live Monitor
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto animate-fade-in pb-10">
       
       {/* Top Navigation Bar */}
       <div className="mb-6 flex flex-col gap-4">
           <div className="flex items-center gap-4">
               <button 
                  onClick={onBack}
                  className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all group shadow-sm active:scale-95"
               >
                   <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
               </button>
               <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                      Deploy
                      <span className="text-xs px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 font-mono tracking-wide hidden md:inline-block">
                          STAGE_04
                      </span>
                  </h2>
               </div>
           </div>

           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
                 <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     <Settings size={16} /> Configure
                 </button>
                 <button 
                    onClick={() => setActiveTab('editor')}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     <Code size={16} /> Editor
                 </button>
             </div>
             
             <button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className={`w-full md:w-auto group relative px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all active:scale-95 flex items-center justify-center overflow-hidden ${isDeploying ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-950'}`}
             >
                <span className="relative z-10 flex items-center">
                  {isDeploying ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Rocket size={18} className="mr-2 group-hover:-translate-y-0.5 transition-transform" />} 
                  {isDeploying ? 'Launching...' : 'Publish to Edge'}
                </span>
             </button>
           </div>
       </div>

       {activeTab === 'editor' ? (
           <div className="animate-fade-in h-[600px] md:h-[850px]">
               <Ide 
                 project={effectiveProject} 
                 files={localFiles} 
                 onFilesUpdate={handleFilesUpdate} 
               />
           </div>
       ) : (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in h-auto lg:h-[850px]">
               {/* Left Column: Configuration */}
               <div className="lg:col-span-3 space-y-6 h-auto lg:h-full lg:overflow-y-auto lg:pr-2 scrollbar-hide">
                   <div className="glass-panel p-6 rounded-2xl border-l-4 border-brand-indigo relative overflow-hidden">
                       <h3 className="text-lg font-bold text-white mb-6 flex items-center relative z-10">
                           <Palette size={18} className="mr-2 text-brand-indigo" /> Aesthetics
                       </h3>
                       <div className="space-y-4 relative z-10">
                           <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Theme Style</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {['Modern', 'Minimal', 'Dark', 'Cyber'].map((theme) => (
                                    <button
                                      key={theme}
                                      onClick={() => setCustomization(prev => ({ ...prev, theme: theme as any }))}
                                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                                        customization.theme === theme
                                          ? 'bg-brand-indigo border-brand-indigo text-white'
                                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                      }`}
                                    >
                                      {theme}
                                    </button>
                                  ))}
                                </div>
                           </div>
                           <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Accent Color</label>
                                <div className="flex flex-wrap gap-2">
                                  {colors.map((c) => (
                                    <button
                                      key={c.id}
                                      onClick={() => setCustomization(prev => ({ ...prev, primaryColor: c.id }))}
                                      className={`w-6 h-6 rounded-full ${c.class} ${customization.primaryColor === c.id ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                                    />
                                  ))}
                                </div>
                           </div>
                           <button 
                                onClick={handleRegenerate}
                                disabled={isRegenerating}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center transition-all mt-2"
                           >
                                {isRegenerating ? <RefreshCw className="animate-spin mr-2" size={14} /> : <Sparkles className="mr-2" size={14} />}
                                Auto-Enhance & Rebuild
                           </button>
                       </div>
                   </div>
                   
                   <div className="glass-panel p-6 rounded-2xl">
                       <h3 className="text-sm font-bold text-white mb-4">Deployment Config</h3>
                       <div className="space-y-4 text-xs">
                           <div>
                               <label className="block text-slate-500 mb-1">Domain</label>
                               <input type="text" value={`${deployConfig.name}.nexus.app`} disabled className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300" />
                           </div>
                           <div>
                               <label className="block text-slate-500 mb-1">Region</label>
                               <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300">
                                   <option>US East (N. Virginia)</option>
                                   <option>EU Central (Frankfurt)</option>
                                   <option>Asia Pacific (Mumbai)</option>
                               </select>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Right Column: Preview */}
               <div className="lg:col-span-9 flex flex-col gap-6 h-[500px] lg:h-full">
                   <div className="glass-panel p-1 rounded-2xl flex-1 flex flex-col shadow-2xl relative overflow-hidden group border border-slate-700/50">
                       <div className="bg-slate-900/95 backdrop-blur px-4 py-3 border-b border-slate-800 flex justify-between items-center rounded-t-xl z-10">
                           <div className="flex items-center gap-2 max-w-[70%]">
                               <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 hidden md:block"></div>
                               <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 hidden md:block"></div>
                               <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50 hidden md:block"></div>
                               <div className="ml-0 md:ml-4 px-3 py-1 bg-black rounded text-xs text-slate-400 font-mono border border-slate-800 flex items-center w-full md:min-w-[300px]">
                                   <Shield size={10} className="mr-2 text-emerald-500 shrink-0" />
                                   <span className="truncate">https://{deployConfig.name}.nexus.app</span>
                               </div>
                           </div>
                           <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 flex items-center">
                                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${isDeploying ? 'bg-yellow-500' : 'bg-emerald-500'}`}></div>
                                    <span className="hidden md:inline">{isDeploying ? 'Deploying...' : 'Live Preview'}</span>
                                </span>
                           </div>
                       </div>
                       
                       <div className="flex-1 bg-slate-950 relative overflow-hidden">
                           {isLoading ? (
                               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20">
                                   <div className="relative w-20 h-20 mb-4">
                                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-brand-indigo rounded-full animate-spin"></div>
                                   </div>
                                   <p className="text-slate-400 text-sm animate-pulse font-mono">Initializing Environment...</p>
                               </div>
                           ) : isDeploying ? (
                               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl z-50 overflow-hidden">
                                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
                                   
                                   {/* Hyper-Speed Background Effect */}
                                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                                   <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0)_50%,rgba(99,102,241,0.05)_50%,rgba(0,0,0,0)_51%)] bg-[length:100%_4px] animate-[scan_0.5s_linear_infinite] pointer-events-none"></div>

                                   {/* Central Progress Visualizer */}
                                   <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
                                        <div className="w-full relative h-1 bg-slate-800 rounded-full overflow-hidden mb-6">
                                            <div 
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                                                style={{ width: `${deployProgress}%`, transition: 'width 0.1s linear' }}
                                            >
                                                <div className="absolute right-0 top-0 bottom-0 w-10 bg-white/50 blur-[5px]"></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full mb-2">
                                            <div className="flex items-center space-x-2">
                                                <CloudLightning className="text-cyan-400 animate-pulse" size={20} />
                                                <span className="text-xl md:text-2xl font-bold text-white tracking-tight">{getDeployStatusText(deployProgress)}</span>
                                            </div>
                                            <span className="text-2xl md:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{deployProgress}%</span>
                                        </div>

                                        <div className="flex items-center space-x-2 text-slate-400 text-xs md:text-sm font-mono mb-8 self-start">
                                            <Zap className="text-yellow-400" size={14} />
                                            <span>Allocating resources on Edge Network...</span>
                                        </div>

                                        {/* Live Deployment Logs */}
                                        <div className="w-full bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden relative shadow-2xl h-32">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo via-purple-500 to-brand-pink"></div>
                                            <div className="space-y-2">
                                                {deployLogs.map((log, i) => (
                                                    <div key={i} className={`flex items-start ${i === 0 ? 'text-white font-bold' : 'text-slate-500'} transition-all duration-300`}>
                                                        <span className="mr-3 opacity-50 hidden sm:inline">{log.split(']')[0]}]</span>
                                                        <span className="truncate">{log.split(']')[1]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                   </div>
                               </div>
                           ) : (
                               <>
                                <GeneratedWebsitePreview config={config} files={localFiles} generatedCode={generatedCode} />
                                {isRegenerating && (
                                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center">
                                        <div className="text-center">
                                            <Sparkles className="w-12 h-12 text-brand-indigo animate-spin mx-auto mb-4" />
                                            <p className="text-white font-bold text-lg">AI Re-Architecting...</p>
                                        </div>
                                    </div>
                                )}
                               </>
                           )}
                           
                           {!isLoading && !isDeploying && (
                            <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-30">
                                <button 
                                    onClick={() => setActiveTab('editor')}
                                    className="bg-black/80 backdrop-blur text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center border border-white/10"
                                >
                                    <Code size={16} className="mr-2" /> Edit Source
                                </button>
                            </div>
                           )}
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
