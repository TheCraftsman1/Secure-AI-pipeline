
import React, { useState, useEffect } from 'react';
import { PipelineStepper } from './components/PipelineStepper';
import { StagePlanning } from './components/StagePlanning';
import { StageCodeGen } from './components/StageCodeGen';
import { StageDevelopment } from './components/StageDevelopment';
import { StageTesting } from './components/StageTesting';
import { StageDeploy } from './components/StageDeploy';
import { StageMonitor } from './components/StageMonitor';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { HeroShowcase } from './components/HeroShowcase';
import { HighEndDemo } from './components/HighEndDemo';
import { Project, ProjectConfig, ChatMessage, ProjectFile, TechStack, Database } from './types';
import { Terminal, Sun, Moon, User, Sparkles, Zap, Cpu } from 'lucide-react';
import { generateFullProject } from './services/geminiService';

const STORAGE_KEY = 'nexus_build_projects_v1';
const THEME_KEY = 'nexus_theme_preference';
const SHOWCASE_KEY = 'nexus_showcase_dismissed';

const ELITE_MASTERPIECE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aethelgard | Sovereign Protocol</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Outfit:wght@100;200;400;700&display=swap" rel="stylesheet">
    <style>
        :root { --accent: #2dd4bf; --accent-gold: #d4af37; }
        * { cursor: crosshair; }
        body { background: #050505; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
        .font-display { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #a5a5a5 50%, var(--accent-gold) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .animate-reveal { animation: reveal 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; opacity: 0; transform: translateY(30px); }
        @keyframes reveal { to { opacity: 1; transform: translateY(0); } }
        .mesh-gradient { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.3; background: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%); }
        .bento-card { transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        .bento-card:hover { transform: translateY(-10px) scale(1.02); border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); }
    </style>
</head>
<body class="selection:bg-teal-500/30">
    <div class="mesh-gradient"></div>
    
    <nav class="fixed top-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <div class="text-2xl font-display font-bold tracking-tighter uppercase">Aethelgard<span class="text-[var(--accent-gold)]">.sys</span></div>
        <div class="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
            <a href="#" class="hover:opacity-100 transition-opacity">Protocol</a>
            <a href="#" class="hover:opacity-100 transition-opacity">Architecture</a>
            <a href="#" class="hover:opacity-100 transition-opacity">Nodes</a>
        </div>
        <button class="px-8 py-3 glass rounded-full text-[10px] font-bold hover:bg-white/10 transition-all uppercase tracking-widest">Initialise Tunnel</button>
    </nav>

    <main class="relative z-10 pt-48 px-10">
        <section class="max-w-7xl mx-auto mb-40">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div class="space-y-12 animate-reveal">
                    <div class="inline-flex items-center gap-3 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full">
                        <div class="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                        <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400">Core Synthesis Active</span>
                    </div>
                    <h1 class="text-8xl md:text-[10rem] font-display font-bold leading-[0.8] tracking-tighter text-gradient">The Apex <br/> Layer.</h1>
                    <p class="text-2xl text-slate-400 font-light max-w-md leading-relaxed">Sovereign liquidity protocols synthesized with zero pipeline restriction. Engineered for sub-millisecond settlement.</p>
                    <div class="flex gap-6">
                        <button class="px-12 py-6 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">Enter Protocol</button>
                        <button class="px-12 py-6 glass rounded-full font-bold text-lg hover:bg-white/5 transition-colors">Whitepaper</button>
                    </div>
                </div>
                <div class="relative animate-reveal" style="animation-delay: 0.2s">
                    <div class="glass p-2 rounded-[3.5rem] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(45,212,191,0.1)]">
                         <img src="https://images.unsplash.com/photo-1460925895231-311111749553?auto=format&fit=crop&q=80&w=1200" class="w-full h-auto rounded-[3rem] opacity-80" />
                    </div>
                    <div class="absolute -bottom-10 -left-10 glass p-8 rounded-3xl animate-bounce" style="animation-duration: 4s">
                        <div class="text-[10px] text-slate-500 uppercase font-bold mb-2">Network Load</div>
                        <div class="text-4xl font-display font-bold">14.2<span class="text-sm text-teal-500">TPS</span></div>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto pb-40">
            <div class="text-center mb-24">
                <h2 class="text-6xl font-display font-bold tracking-tighter mb-4">Neural Architecture</h2>
                <p class="text-slate-500 uppercase tracking-[0.4em] text-[10px] font-bold">System Capabilities v4.0</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bento-card md:col-span-2 glass rounded-[3rem] p-12 relative overflow-hidden">
                    <h3 class="text-4xl font-display font-bold mb-4">Liquidity Mesh</h3>
                    <p class="text-slate-400 max-w-sm mb-12">Decentralized order matching across 42 global regions with integrated neural auditing.</p>
                    <div class="flex gap-4">
                        <span class="px-4 py-2 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">0.04ms Latency</span>
                        <span class="px-4 py-2 bg-teal-500/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-teal-500/20 text-teal-400">Encrypted</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" class="absolute right-0 bottom-0 w-1/2 opacity-20 pointer-events-none" />
                </div>
                
                <div class="bento-card glass rounded-[3rem] p-12 flex flex-col justify-between">
                    <div>
                        <h3 class="text-4xl font-display font-bold mb-4">Kernel</h3>
                        <p class="text-slate-400 text-sm">Hardened Rust implementation of the Aethelgard Consensus Engine.</p>
                    </div>
                    <div class="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.4)]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                </div>

                <div class="bento-card glass rounded-[3rem] p-12">
                    <div class="text-6xl font-display font-bold mb-6 text-teal-400">99.9%</div>
                    <h4 class="text-xl font-bold mb-2">Uptime Guarantee</h4>
                    <p class="text-slate-500 text-sm leading-relaxed">Redundant edge clusters ensure your protocol never sleeps.</p>
                </div>

                <div class="bento-card md:col-span-2 glass rounded-[3rem] p-12 relative overflow-hidden flex flex-col justify-center">
                    <h3 class="text-5xl font-display font-bold mb-6">Global Settlement</h3>
                    <div class="grid grid-cols-4 gap-4">
                        ${['NYC', 'LDN', 'TKO', 'SIN'].map(city => `
                            <div class="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div class="text-[10px] text-slate-500 mb-1">${city}</div>
                                <div class="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <footer class="p-20 text-center border-t border-white/5">
        <div class="text-8xl md:text-[12rem] font-display font-bold opacity-[0.02] select-none tracking-tighter mb-10">AETHELGARD</div>
        <p class="text-[10px] text-slate-700 font-mono tracking-[0.5em] uppercase">Built for the future. Generated by NexusBuild AI.</p>
    </footer>
</body>
</html>
`;

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showShowcase, setShowShowcase] = useState(true);
  const [showHighEndDemo, setShowHighEndDemo] = useState(false);
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  const isDashboard = !activeProjectId;

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
    const dismissed = localStorage.getItem(SHOWCASE_KEY);
    if (dismissed === 'true') setShowShowcase(false);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setProjects(JSON.parse(saved)); }
      catch (e) { console.error("Failed to load projects", e); }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects, isLoading]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleEnterApp = () => {
    setShowShowcase(false);
    setShowHighEndDemo(false);
    localStorage.setItem(SHOWCASE_KEY, 'true');
  };

  const createProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'Untitled Project',
      createdAt: Date.now(),
      lastModified: Date.now(),
      status: 'building',
      currentStage: 0,
      chatHistory: [],
      files: [], 
      config: {
        idea: '',
        stack: TechStack.ReactNode, 
        database: Database.Postgres,
        features: { auth: false, payments: false, search: false, admin: false, notifications: false, analytics: false },
        design: { style: 'Glassmorphism', theme: 'Midnight', primaryColor: 'indigo' },
        referenceImages: [] 
      }
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const createInstantDemoProject = () => {
    const newProject: Project = {
      id: `TURBO-${Date.now()}`,
      name: 'Aethelgard OS',
      createdAt: Date.now(),
      lastModified: Date.now(),
      status: 'building',
      currentStage: 1, 
      isTurbo: true, 
      chatHistory: [
        { id: 'turbo-0', role: 'ai', text: "Initializing Turbo Pipeline... Synthesis engine running at 400% capacity.", timestamp: Date.now() }
      ],
      blueprint: "## High-Performance Sovereign Protocol\n\n- Sub-millisecond Settlement Layer\n- Neural Asset Auditing\n- Distributed Edge Ledger",
      generatedCode: ELITE_MASTERPIECE_HTML,
      files: [
        { name: 'index.html', content: ELITE_MASTERPIECE_HTML, language: 'html' },
        { name: 'styles.css', content: '/* High-fidelity styles injected via tailwind */', language: 'css' },
        { name: 'package.json', content: '{"name": "aethelgard-protocol", "version": "1.0.0"}', language: 'json' }
      ],
      config: {
        idea: 'A global sovereign liquidity protocol with sub-millisecond settlement and neural auditing.',
        stack: TechStack.ReactNode, 
        database: Database.Postgres,
        features: { auth: true, payments: true, search: true, admin: true, notifications: true, analytics: true },
        design: { style: 'Luxury', theme: 'Midnight', primaryColor: 'teal' },
        referenceImages: ["https://images.unsplash.com/photo-1460925895231-311111749553?auto=format&fit=crop&q=80&w=1200"] 
      }
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setShowShowcase(false);
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const updateActiveProject = (updates: Partial<Project>) => {
    if (!activeProjectId) return;
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, ...updates, lastModified: Date.now() } : p
    ));
  };

  const handlePlanningComplete = async (cfg: ProjectConfig, bp: string) => {
    updateActiveProject({
      name: cfg.idea.split(' ').slice(0, 3).join(' ') || 'New Project',
      config: cfg,
      blueprint: bp,
      currentStage: 1,
    });

    try {
      const generatedFiles = await generateFullProject(cfg);
      const indexHtml = generatedFiles.find(f => f.name === 'index.html');
      updateActiveProject({ 
          files: generatedFiles,
          generatedCode: indexHtml?.content || '' 
      });
    } catch (e) {
      console.error("Failed to generate website code", e);
    }
  };

  const handleNextStage = () => {
    if (activeProject) {
      updateActiveProject({ currentStage: Math.min(activeProject.currentStage + 1, 5) });
    }
  };

  const handleBackStage = () => {
    if (activeProject) {
      updateActiveProject({ currentStage: Math.max(activeProject.currentStage - 1, 0) });
    }
  };

  const handleCodeUpdate = (newCode: string) => updateActiveProject({ generatedCode: newCode });
  const handleFilesUpdate = (newFiles: ProjectFile[]) => updateActiveProject({ files: newFiles });
  const handleChatUpdate = (newMessages: ChatMessage[]) => updateActiveProject({ chatHistory: newMessages });

  if (isLoading) return null;
  if (showHighEndDemo) return <HighEndDemo onBack={() => { setShowHighEndDemo(false); setShowShowcase(true); }} />;
  if (showShowcase) return <HeroShowcase onEnter={handleEnterApp} onInstantDemo={createInstantDemoProject} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950/0 to-slate-950/0"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveProjectId(null)}>
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Terminal className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              NexusBuild<span className="text-cyan-500">.ai</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
             {activeProject?.isTurbo && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-full text-[10px] font-bold uppercase animate-pulse">
                    <Zap size={10} fill="currentColor" /> Turbo Pipeline
                </div>
             )}
             <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={() => setShowShowcase(true)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white px-4 py-1.5 border border-slate-800 rounded-lg">Help</button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center overflow-hidden border border-white/10">
               <User size={16} className="text-white" />
             </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 px-4 min-h-screen">
        {isDashboard ? (
          <ProjectDashboard 
            projects={projects} 
            onCreateNew={createProject}
            onSelectProject={(p) => setActiveProjectId(p.id)}
            onDeleteProject={deleteProject}
          />
        ) : activeProject ? (
          <div className="max-w-7xl mx-auto pb-20">
            <PipelineStepper currentStage={activeProject.currentStage} />
            <div className="mt-8">
              {activeProject.currentStage === 0 && <StagePlanning onComplete={handlePlanningComplete} />}
              {activeProject.currentStage === 1 && <StageCodeGen onComplete={handleNextStage} blueprint={activeProject.blueprint || ''} config={activeProject.config} isTurbo={activeProject.isTurbo} />}
              {activeProject.currentStage === 2 && <StageDevelopment onComplete={handleNextStage} isTurbo={activeProject.isTurbo} />}
              {activeProject.currentStage === 3 && <StageTesting onComplete={handleNextStage} isTurbo={activeProject.isTurbo} />}
              {activeProject.currentStage === 4 && <StageDeploy onComplete={handleNextStage} onBack={handleBackStage} config={activeProject.config} generatedCode={activeProject.generatedCode} setGeneratedCode={handleCodeUpdate} project={activeProject} files={activeProject.files || []} onFilesUpdate={handleFilesUpdate} />}
              {activeProject.currentStage === 5 && <StageMonitor config={activeProject.config} generatedCode={activeProject.generatedCode} onBack={handleBackStage} />}
            </div>
            <ChatAssistant project={activeProject} onCodeUpdate={handleCodeUpdate} onChatUpdate={handleChatUpdate} />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;
