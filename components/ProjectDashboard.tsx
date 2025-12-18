import React from 'react';
import { 
  Plus, Search, Grid, List, Clock, Trash2, 
  Activity, Zap, Box, Sparkles, Server, ArrowRight
} from 'lucide-react';
import { Project } from '../types';

interface Props {
  projects: Project[];
  onCreateNew: () => void;
  onSelectProject: (project: Project) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

export const ProjectDashboard: React.FC<Props> = ({ projects, onCreateNew, onSelectProject, onDeleteProject }) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.config.idea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      
      {/* Decorative Background Elements already in index.html, but we add local flair */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-indigo-500/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>

      <div className="relative w-full max-w-[1600px] mx-auto px-6 py-12 z-10">
        
        {/* Command Center Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                 Nexus OS v3.0
               </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter leading-[0.9] mb-4">
              Command <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">Center</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-light leading-relaxed">
                Orchestrate your AI development pipeline. Deploy scalable architecture in seconds with Gemini 2.5 Flash.
            </p>
          </div>

          {/* Holographic Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full xl:w-auto">
             {[
               { label: 'System Status', value: 'Nominal', icon: Activity, color: 'text-emerald-400' },
               { label: 'Active Nodes', value: projects.length, icon: Server, color: 'text-cyan-400' },
               { label: 'Compute Load', value: '12%', icon: Zap, color: 'text-purple-400' }
             ].map((stat, i) => (
               <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:bg-white/5 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                     <stat.icon size={18} className={`${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                     <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/60"></div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="sticky top-6 z-50 mb-12">
           <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search */}
              <div className="relative w-full md:w-96 group">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Search neural archives..." 
                   className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                 />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 {/* View Toggles */}
                 <div className="bg-slate-950/50 p-1 rounded-xl border border-slate-800 flex">
                    <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-white'}`}><Grid size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-white'}`}><List size={18} /></button>
                 </div>

                 {/* Create Button */}
                 <button 
                    onClick={onCreateNew}
                    className="flex-1 md:flex-none relative overflow-hidden bg-white text-black px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
                 >
                    <span className="relative z-10 flex items-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                        <Plus size={18} className="mr-2" /> 
                        New Project
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </button>
              </div>
           </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
           <div 
             onClick={onCreateNew}
             className="group relative h-96 border border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center bg-slate-950/30 hover:bg-slate-900/50 transition-all cursor-pointer overflow-hidden"
           >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-500/50 border border-slate-800 transition-all shadow-2xl relative z-10">
                 <Plus size={32} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Initialize Workspace</h3>
              <p className="text-slate-500 relative z-10">Begin your first neural architecture sequence.</p>
           </div>
        ) : (
           <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProjects.map((project, idx) => (
                 <div 
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className={`
                      group relative bg-[#0a0a0c] border border-white/5 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]
                      ${viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col'}
                    `}
                 >
                    {/* Glowing Edge on Hover */}
                    <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-cyan-500/20 transition-all pointer-events-none z-20"></div>

                    {/* Preview Image */}
                    <div className={`${viewMode === 'grid' ? 'h-64 w-full' : 'h-24 w-40 rounded-2xl'} relative overflow-hidden bg-[#050505] shrink-0 border-b border-white/5`}>
                        {project.config.referenceImages?.[0] ? (
                             <img 
                                src={project.config.referenceImages[0]} 
                                alt="preview" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                             />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-[#050505] relative">
                              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
                              <div className="z-10 flex flex-col items-center">
                                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                                    <Box className="text-cyan-500" size={32} />
                                 </div>
                              </div>
                           </div>
                        )}
                        
                        <div className="absolute top-4 right-4 z-10">
                           <span className={`
                             px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-xl border
                             ${project.currentStage === 5 
                               ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                               : 'bg-black/60 text-slate-300 border-white/10'}
                           `}>
                              {project.currentStage === 5 ? 'Live' : 'WIP'}
                           </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex items-center justify-between pl-8' : ''}`}>
                       <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-2xl text-white group-hover:text-cyan-400 transition-colors truncate mb-2">
                            {project.name}
                          </h3>
                          {viewMode === 'grid' && (
                            <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-light h-10 leading-relaxed">
                               {project.config.idea}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                             <div className="flex items-center gap-2">
                                <Clock size={12} className="text-purple-500" />
                                <span>{new Date(project.lastModified || project.createdAt).toLocaleDateString()}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Box size={12} className="text-blue-500" />
                                <span className="truncate max-w-[120px]">{project.config.stack}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'ml-8' : 'absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0'}`}>
                          <button 
                             onClick={(e) => onDeleteProject(project.id, e)}
                             className="p-2.5 bg-slate-900/80 backdrop-blur rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>

                    {/* Progress Bar */}
                    {project.currentStage < 5 && viewMode === 'grid' && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" 
                          style={{ width: `${(project.currentStage / 5) * 100}%` }}
                        ></div>
                      </div>
                    )}
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};