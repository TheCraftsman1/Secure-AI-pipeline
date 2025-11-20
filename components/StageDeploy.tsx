import React, { useState } from 'react';
import { Rocket, Server, Globe, Check, ExternalLink, ArrowRight, Palette, Layout, RefreshCw, Sparkles } from 'lucide-react';
import { ProjectConfig, CustomizationOptions } from '../types';
import { GeneratedWebsitePreview } from './GeneratedWebsitePreview';
import { generateLandingPageCode } from '../services/geminiService';

interface Props {
  onComplete: () => void;
  config: ProjectConfig;
  generatedCode?: string;
  setGeneratedCode: (code: string) => void;
}

export const StageDeploy: React.FC<Props> = ({ onComplete, config, generatedCode, setGeneratedCode }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    theme: 'Modern',
    primaryColor: 'indigo',
    borderRadius: 'rounded-lg'
  });

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newCode = await generateLandingPageCode(config, customization);
      setGeneratedCode(newCode);
    } catch (error) {
      console.error("Failed to regenerate:", error);
    } finally {
      setIsRegenerating(false);
    }
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

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Visual Editor & Deployment */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Deployment Status Card */}
          <div className="glass-panel p-6 rounded-xl border-l-4 border-emerald-500">
             <div className="flex items-center mb-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mr-3">
                    <Rocket size={20} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-white">Deployment Ready</h2>
                    <p className="text-slate-400 text-sm">Infrastructure provisioned</p>
                 </div>
             </div>
             
             <button 
              onClick={onComplete}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center"
            >
              Launch Live Version <Rocket size={20} className="ml-2" />
            </button>
          </div>

          {/* Visual Customization Panel */}
          <div className="glass-panel p-6 rounded-xl border-l-4 border-cyan-500">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-white flex items-center">
                 <Palette className="mr-2 text-cyan-400" size={20} /> Design Studio
               </h3>
               <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded uppercase font-bold">Beta</span>
            </div>

            <div className="space-y-6">
              {/* Theme Selector */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Visual Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Modern', 'Minimal', 'Dark', 'Corporate', 'Retro'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setCustomization(prev => ({ ...prev, theme: theme as any }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                        customization.theme === theme
                          ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Primary Accent</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCustomization(prev => ({ ...prev, primaryColor: c.id }))}
                      className={`w-8 h-8 rounded-full transition-transform ${c.class} ${
                        customization.primaryColor === c.id 
                          ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_currentColor]' 
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center transition-all border ${
                   isRegenerating 
                   ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed' 
                   : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-600 hover:border-cyan-500/50'
                }`}
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Rebuilding UI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={16} />
                    Update Website Preview
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-500">
                 Updating will trigger AI re-generation.
              </p>
            </div>
          </div>

        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-7 h-[600px] relative group">
           <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-slate-400 font-medium flex items-center">
               <ExternalLink size={16} className="mr-2" /> Staging Environment
             </h3>
             <div className="flex items-center space-x-2 text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${isRegenerating ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-slate-500">{isRegenerating ? 'Compiling...' : 'Live Preview'}</span>
             </div>
           </div>

           <div className="h-full rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden relative transform transition-transform duration-700 hover:scale-[1.01]">
             <div className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center transition-opacity duration-300 ${isRegenerating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center">
                    <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                    <p className="text-white font-bold">Applying Design System...</p>
                    <p className="text-cyan-400 text-sm">Generating optimized HTML/CSS</p>
                </div>
             </div>
             
             <GeneratedWebsitePreview config={config} generatedCode={generatedCode} />
             
             {/* Overlay label */}
             {!isRegenerating && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 pointer-events-none">
                STAGING ENV
                </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};