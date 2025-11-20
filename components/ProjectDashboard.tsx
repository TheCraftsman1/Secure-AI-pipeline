
import React from 'react';
import { Plus, Layout, Clock, ArrowRight, Database, Server } from 'lucide-react';
import { Project } from '../types';

interface Props {
  projects: Project[];
  onCreateNew: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectDashboard: React.FC<Props> = ({ projects, onCreateNew, onSelectProject }) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Dashboard</h1>
          <p className="text-slate-400">Manage your secure AI pipelines</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <Plus className="mr-2" size={20} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border-dashed border-2 border-slate-700">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Layout className="text-slate-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No projects yet</h3>
          <p className="text-slate-500 mb-8">Start your first AI-driven DevOps pipeline today.</p>
          <button
            onClick={onCreateNew}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-all"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="glass-panel p-6 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Server size={100} />
              </div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg
                  ${project.currentStage === 5 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-cyan-400 border border-slate-700'}
                `}>
                  {project.config.idea.charAt(0).toUpperCase()}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border
                  ${project.currentStage === 5 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}
                `}>
                  {project.currentStage === 5 ? 'LIVE' : `STAGE ${project.currentStage}/5`}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 relative z-10">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 relative z-10 h-10">
                {project.config.idea}
              </p>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center text-xs text-slate-500">
                   <Database size={14} className="mr-2 text-slate-600" />
                   {project.config.stack} • {project.config.database}
                </div>
                <div className="flex items-center text-xs text-slate-500">
                   <Clock size={14} className="mr-2 text-slate-600" />
                   Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-sm font-medium text-cyan-400 group-hover:text-cyan-300">
                <span>
                    {project.currentStage === 5 ? 'Open Monitor' : 'Continue Build'}
                </span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
