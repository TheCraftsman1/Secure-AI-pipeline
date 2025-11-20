import React from 'react';
import { CheckCircle2, Circle, BrainCircuit, Code2, Hammer, ShieldCheck, Rocket, Activity } from 'lucide-react';
import { PipelineStage } from '../types';

interface Props {
  currentStage: number;
}

const stages: { id: PipelineStage; label: string; icon: any }[] = [
  { id: 'planning', label: 'Planning', icon: BrainCircuit },
  { id: 'codegen', label: 'Code Gen', icon: Code2 },
  { id: 'development', label: 'Build', icon: Hammer },
  { id: 'testing', label: 'Testing', icon: ShieldCheck },
  { id: 'deploy', label: 'Deploy', icon: Rocket },
  { id: 'monitor', label: 'Live', icon: Activity },
];

export const PipelineStepper: React.FC<Props> = ({ currentStage }) => {
  return (
    <div className="w-full py-6 px-4 mb-8">
      <div className="relative flex items-center justify-between w-full max-w-5xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-800 -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-cyan-500 transition-all duration-700 ease-in-out -z-10"
          style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
        ></div>

        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === currentStage;
          const isCompleted = index < currentStage;

          return (
            <div key={stage.id} className="flex flex-col items-center group">
              <div 
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${isActive ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110' : ''}
                  ${isCompleted ? 'bg-slate-900 border-cyan-500 text-cyan-500' : 'bg-slate-900 border-slate-700 text-slate-500'}
                `}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
              </div>
              <span 
                className={`
                  mt-3 text-xs md:text-sm font-medium transition-colors duration-300
                  ${isActive ? 'text-cyan-400' : isCompleted ? 'text-slate-400' : 'text-slate-600'}
                `}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};