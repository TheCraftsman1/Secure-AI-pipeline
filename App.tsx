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
import { Project, ProjectConfig, ChatMessage, ProjectFile, TechStack, Database } from './types';
import { Terminal, LayoutGrid, Sun, Moon } from 'lucide-react';
import { generateFullProject } from './services/geminiService';

const STORAGE_KEY = 'nexus_build_projects_v1';
const THEME_KEY = 'nexus_theme_preference';

const App: React.FC = () => {
  // Global State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Derived State
  const activeProject = projects.find(p => p.id === activeProjectId);
  const isDashboard = !activeProjectId;

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light';
    if (savedTheme) {
        setTheme(savedTheme);
    }
  }, []);

  // Apply Theme Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Load projects
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save projects
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isLoading]);

  // Actions
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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
        visualIdentity: '',
        referenceImages: [] 
      }
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
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
    // 1. Create Project Files for uploaded images
    const initialFiles: ProjectFile[] = [];
    if (cfg.referenceImages && cfg.referenceImages.length > 0) {
        cfg.referenceImages.forEach((imgBase64, idx) => {
            initialFiles.push({
                name: `asset_${idx}.png`, // Standardized name for AI to reference
                content: imgBase64,
                language: 'image'
            });
        });
    }

    updateActiveProject({
      name: cfg.idea.split(' ').slice(0, 3).join(' ') || 'New Project',
      config: cfg,
      blueprint: bp,
      currentStage: 1,
      files: initialFiles // Save images immediately
    });

    try {
      // 2. Generate Code, passing the names of the uploaded images so AI knows they exist
      const uploadedImageNames = initialFiles.map(f => f.name);
      
      const generatedFiles = await generateFullProject(cfg, undefined, uploadedImageNames);
      
      // 3. Merge generated files with image files
      const mergedFiles = [...initialFiles, ...generatedFiles];
      const indexHtml = generatedFiles.find(f => f.name === 'index.html');
      
      updateActiveProject({ 
          files: mergedFiles,
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

  const handleCodeUpdate = (newCode: string) => {
    updateActiveProject({ generatedCode: newCode });
  };

  const handleFilesUpdate = (newFiles: ProjectFile[]) => {
      updateActiveProject({ files: newFiles });
  };

  const handleChatUpdate = (newMessages: ChatMessage[]) => {
    updateActiveProject({ chatHistory: newMessages });
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950/0 to-slate-950/0"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar */}
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
             {activeProject && (
                 <div className="hidden md:flex items-center text-xs font-mono text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    {activeProject.id}
                 </div>
             )}
             <button 
               onClick={toggleTheme}
               className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
               <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
                 <span className="text-xs font-bold">AI</span>
               </div>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
              {activeProject.currentStage === 0 && (
                <StagePlanning onComplete={handlePlanningComplete} />
              )}
              {activeProject.currentStage === 1 && (
                <StageCodeGen 
                  onComplete={handleNextStage} 
                  blueprint={activeProject.blueprint || ''} 
                  config={activeProject.config} 
                />
              )}
              {activeProject.currentStage === 2 && (
                <StageDevelopment onComplete={handleNextStage} />
              )}
              {activeProject.currentStage === 3 && (
                <StageTesting onComplete={handleNextStage} />
              )}
              {activeProject.currentStage === 4 && (
                <StageDeploy 
                  onComplete={handleNextStage}
                  onBack={handleBackStage}
                  config={activeProject.config}
                  generatedCode={activeProject.generatedCode}
                  setGeneratedCode={handleCodeUpdate}
                  project={activeProject}
                  files={activeProject.files || []}
                  onFilesUpdate={handleFilesUpdate}
                />
              )}
              {activeProject.currentStage === 5 && (
                <StageMonitor 
                   config={activeProject.config} 
                   generatedCode={activeProject.generatedCode}
                   onBack={handleBackStage}
                />
              )}
            </div>

            <ChatAssistant 
              project={activeProject} 
              onCodeUpdate={handleCodeUpdate}
              onChatUpdate={handleChatUpdate}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;