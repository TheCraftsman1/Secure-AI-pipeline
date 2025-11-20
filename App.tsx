
import React, { useState } from 'react';
import { PipelineStepper } from './components/PipelineStepper';
import { StagePlanning } from './components/StagePlanning';
import { StageCodeGen } from './components/StageCodeGen';
import { StageDevelopment } from './components/StageDevelopment';
import { StageTesting } from './components/StageTesting';
import { StageDeploy } from './components/StageDeploy';
import { StageMonitor } from './components/StageMonitor';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Project, ProjectConfig } from './types';
import { Terminal, LayoutGrid } from 'lucide-react';
import { generateLandingPageCode } from './services/geminiService';

const App: React.FC = () => {
  // Global State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Derived State
  const activeProject = projects.find(p => p.id === activeProjectId);
  const isDashboard = !activeProjectId;

  // Actions
  const createProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'Untitled Project',
      createdAt: Date.now(),
      status: 'building',
      currentStage: 0,
      config: {
        idea: '',
        stack: null as any, // Will be set in planning
        database: null as any,
        features: { auth: false, payments: false, search: false, admin: false, notifications: false, analytics: false }
      }
    };
    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
  };

  const updateActiveProject = (updates: Partial<Project>) => {
    if (!activeProjectId) return;
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, ...updates } : p));
  };

  const handlePlanningComplete = async (cfg: ProjectConfig, bp: string) => {
    updateActiveProject({
      name: cfg.idea.split(' ').slice(0, 3).join(' ') || 'New Project',
      config: cfg,
      blueprint: bp,
      currentStage: 1
    });

    // Start background code generation
    try {
      const code = await generateLandingPageCode(cfg);
      updateActiveProject({ generatedCode: code });
    } catch (e) {
      console.error("Failed to generate website code", e);
    }
  };

  const handleNextStage = () => {
    if (activeProject) {
      updateActiveProject({ currentStage: Math.min(activeProject.currentStage + 1, 5) });
    }
  };

  const handleCodeUpdate = (newCode: string) => {
    updateActiveProject({ generatedCode: newCode });
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-cyan-500/30 bg-slate-950 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-3xl"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveProjectId(null)}
          >
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Terminal className="text-cyan-400" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Nexus<span className="text-cyan-400">Build</span> AI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isDashboard && (
              <button 
                onClick={() => setActiveProjectId(null)}
                className="flex items-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <LayoutGrid size={16} className="mr-2" /> Dashboard
              </button>
            )}
            <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
              System Operational
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
        
        {isDashboard ? (
          <ProjectDashboard 
            projects={projects} 
            onCreateNew={createProject} 
            onSelectProject={(p) => setActiveProjectId(p.id)}
          />
        ) : (
          activeProject && (
            <div className="max-w-7xl mx-auto">
              {/* Pipeline Header */}
              <div className="mb-8 text-center animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {activeProject.currentStage === 0 && "Define Your Vision"}
                  {activeProject.currentStage === 1 && "Architecting Solution"}
                  {activeProject.currentStage === 2 && "Constructing Core Modules"}
                  {activeProject.currentStage === 3 && "Verifying Integrity"}
                  {activeProject.currentStage === 4 && "Deployment Staging"}
                  {activeProject.currentStage === 5 && "Mission Control"}
                </h1>
                <p className="text-slate-400">
                   Project: <span className="text-cyan-400 font-semibold">{activeProject.name}</span>
                </p>
              </div>

              <PipelineStepper currentStage={activeProject.currentStage} />

              <div className="mt-8 min-h-[500px]">
                {activeProject.currentStage === 0 && (
                  <StagePlanning onComplete={handlePlanningComplete} />
                )}
                {activeProject.currentStage === 1 && activeProject.blueprint && (
                  <StageCodeGen onComplete={handleNextStage} blueprint={activeProject.blueprint} />
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
                    config={activeProject.config} 
                    generatedCode={activeProject.generatedCode} 
                    setGeneratedCode={handleCodeUpdate}
                  />
                )}
                {activeProject.currentStage === 5 && (
                  <StageMonitor 
                    config={activeProject.config} 
                    generatedCode={activeProject.generatedCode} 
                  />
                )}
              </div>

              {/* Persistent Chat Assistant for Active Project */}
              <ChatAssistant 
                project={activeProject} 
                onCodeUpdate={handleCodeUpdate}
              />
            </div>
          )
        )}
      </main>

      {/* Footer decoration */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-50"></div>
    </div>
  );
};

export default App;
