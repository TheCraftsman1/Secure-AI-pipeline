import React from 'react';
import { CheckCircle2, BrainCircuit, Code2, Hammer, ShieldCheck, Rocket, Activity, Zap } from 'lucide-react';
import { PipelineStage } from '../types';

interface Props {
  currentStage: number;
}

const stages: { id: PipelineStage; label: string; icon: any }[] = [
  { id: 'planning', label: 'Concept', icon: BrainCircuit },
  { id: 'codegen', label: 'Architect', icon: Code2 },
  { id: 'development', label: 'Build', icon: Hammer },
  { id: 'testing', label: 'Verify', icon: ShieldCheck },
  { id: 'deploy', label: 'Launch', icon: Rocket },
  { id: 'monitor', label: 'Live', icon: Activity },
];

export const PipelineStepper: React.FC<Props> = ({ currentStage }) => {
  return (
    <div className="w-full py-6 px-4 mb-8 pt-32">
      <div className="relative flex items-center justify-between w-full max-w-6xl mx-auto">
        
        {/* Progress Track Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] bg-slate-800 -z-10 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full h-full opacity-50"></div>
        </div>
        
        {/* Active Photon Beam */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] -z-10"
          style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
        >
             {/* Glowing Head */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent to-cyan-400 blur-[2px]"></div>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] animate-pulse"></div>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-cyan-500/20 rounded-full blur-md"></div>
        </div>

        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === currentStage;
          const isCompleted = index < currentStage;

          return (
            <div key={stage.id} className="flex flex-col items-center group relative z-10">
              
              {/* Stage Icon */}
              <div 
                className={`
                  relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700
                  ${isActive 
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-125' 
                    : isCompleted 
                        ? 'bg-slate-900/50 border border-cyan-500/30 text-cyan-400' 
                        : 'bg-slate-950 border border-slate-800 text-slate-600'
                  }
                `}
              >
                {/* Active Inner Glow */}
                {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 animate-pulse"></div>
                )}
                
                {isCompleted ? (
                    <CheckCircle2 size={20} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                ) : (
                    <Icon 
                        size={20} 
                        className={`transition-colors duration-500 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-slate-600'}`} 
                    />
                )}
              </div>

              {/* Label */}
              <div className={`
                absolute -bottom-8 transition-all duration-500 flex flex-col items-center
                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-1'}
              `}>
                <span 
                    className={`
                    text-[10px] font-bold uppercase tracking-widest
                    ${isActive ? 'text-cyan-400 text-shadow-glow' : isCompleted ? 'text-slate-400' : 'text-slate-700'}
                    `}
                >
                    {stage.label}
                </span>
                {isActive && <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};