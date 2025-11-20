import React from 'react';
import { ProjectConfig } from '../types';
import { Shield, X, Loader2 } from 'lucide-react';

interface Props {
  config: ProjectConfig;
  generatedCode?: string;
  isFullScreen?: boolean;
  onClose?: () => void;
}

export const GeneratedWebsitePreview: React.FC<Props> = ({ config, generatedCode, isFullScreen = false, onClose }) => {
  const title = config.idea.length > 30 ? config.idea.substring(0, 30) + '...' : config.idea;
  
  // Dynamic classes based on view mode
  const containerClasses = isFullScreen 
    ? "w-full h-full bg-white text-slate-900 flex flex-col font-sans relative animate-fade-in" 
    : "w-full h-full bg-white text-slate-900 rounded-lg overflow-hidden flex flex-col font-sans relative shadow-2xl border border-slate-700/50 animate-fade-in transform transition-all";

  return (
    <div className={containerClasses}>
      {/* Mock Browser Header - Always show unless in strict fullscreen without frame (optional, keeping frame for realism) */}
      <div className={`${isFullScreen ? 'py-3 px-6' : 'py-2 px-4'} bg-slate-100 border-b border-slate-200 flex items-center space-x-4 shrink-0 transition-all z-20`}>
        {/* Window Controls */}
        <div className="flex space-x-1.5">
          <div 
            className="w-3 h-3 rounded-full bg-red-400 cursor-pointer hover:bg-red-500 flex items-center justify-center group"
            onClick={onClose}
            title="Close Preview"
          >
            {isFullScreen && <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />}
          </div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>

        {/* Navigation Bar */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white px-4 py-1.5 rounded-md text-xs md:text-sm text-slate-500 border border-slate-200 w-full max-w-xl text-center truncate flex items-center justify-center shadow-sm">
            <Shield size={12} className="mr-2 text-emerald-500" />
            <span className="hidden md:inline text-slate-400 mr-1">https://</span>
            <span className="text-slate-700 font-medium">{title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}.app</span>
          </div>
        </div>

        {/* Actions */}
        {isFullScreen && (
            <button 
                onClick={onClose}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1 rounded hover:bg-slate-200 transition-colors"
            >
                Exit Preview
            </button>
        )}
      </div>

      {/* Website Content Area */}
      <div className="flex-1 relative bg-white w-full h-full">
        {generatedCode ? (
          <iframe 
            title="Generated Website"
            srcDoc={generatedCode}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          /* Loading / Fallback State */
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
             <div className="text-center p-8">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-slate-900 font-bold text-lg">Generating Web Interface...</h3>
                <p className="text-slate-500 text-sm mt-2">Our AI is coding your "{config.idea}" landing page.</p>
                
                {/* Fallback Preview While Loading */}
                <div className="mt-8 opacity-50 scale-90 blur-sm pointer-events-none select-none">
                   <MockTemplate config={config} />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal template used as fallback visual or loading placeholder
const MockTemplate = ({ config }: { config: ProjectConfig }) => (
    <div className="text-slate-900">
        <nav className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                {config.idea.charAt(0).toUpperCase()}
             </div>
             <span className="font-bold text-lg tracking-tight">{config.idea.substring(0,15)}</span>
          </div>
        </nav>
        <div className="px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{config.idea}</h1>
            <p className="text-lg text-slate-600 mb-8">Built with {config.stack} and {config.database}</p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Get Started</button>
        </div>
    </div>
);
