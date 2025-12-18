
import React, { useState, useEffect, useRef } from 'react';
import { ProjectConfig, ProjectFile } from '../types';
import { Shield, Smartphone, Tablet, Laptop, Maximize2, Minimize2 } from 'lucide-react';
import { sanitizeGeneratedHtml } from '../utils/sanitizer';

interface Props {
  config: ProjectConfig;
  generatedCode?: string;
  files?: ProjectFile[];
  isFullScreen?: boolean;
  onClose?: () => void;
}

export const GeneratedWebsitePreview: React.FC<Props> = ({ config, generatedCode, files, isFullScreen = false, onClose }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [iframeUrl, setIframeUrl] = useState<string>('');

  // Determine if we have content to show
  const hasContent = (files && files.length > 0) || (generatedCode && generatedCode.length > 10);

  useEffect(() => {
    if (!hasContent) return;

    // --- VIRTUAL BUNDLER ---
    // This logic mimics a build server. It takes the index.html and finds references
    // to external files (styles.css, script.js) and injects them INLINE.
    // This allows the browser to render the full app from a single Blob URL.

    const bundlePreview = () => {
        let finalHtml = '';
        let customCss = '';
        let customJs = '';

        // 1. Resolve Source Content
        if (files && files.length > 0) {
            const htmlFile = files.find(f => f.name === 'index.html');
            const cssFile = files.find(f => f.name === 'styles.css');
            const jsFile = files.find(f => f.name === 'script.js');

            if (htmlFile) finalHtml = htmlFile.content;
            if (cssFile) customCss = cssFile.content;
            if (jsFile) customJs = jsFile.content;
        } else if (generatedCode) {
            finalHtml = generatedCode;
        }

        // --- AUTOMATIC ASSET INJECTION (The "8K" Guarantee) ---
        const premiumHead = `
            <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                html { scroll-behavior: smooth; }
                body { font-family: 'Inter', sans-serif; antialiased; -webkit-font-smoothing: antialiased; }
                h1, h2, h3, h4, h5, h6 { font-family: 'Sora', 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
                .font-serif { font-family: 'Playfair Display', serif; }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
            </style>
        `;

        if (finalHtml && !finalHtml.includes('fonts.googleapis.com')) {
            finalHtml = finalHtml.replace('</head>', `${premiumHead}</head>`);
        } else if (finalHtml && !finalHtml.includes('</head>')) {
             finalHtml = `<head>${premiumHead}</head>${finalHtml}`;
        }

        // 2. Inject CSS (Replace <link> or append to head)
        // Regex matches <link href="styles.css" ...> allowing for ./styles.css or quotes variations
        if (customCss) {
            const cssRegex = /<link[^>]*href=["']\.?\/?styles\.css["'][^>]*>/i;
            if (cssRegex.test(finalHtml)) {
                finalHtml = finalHtml.replace(cssRegex, `<style>${customCss}</style>`);
            } else {
                finalHtml = finalHtml.replace('</head>', `<style>${customCss}</style></head>`);
            }
        }

        // 3. Inject JS (Replace <script src> or append to body)
        const safeJs = `
            window.onerror = function(msg, url, line) {
                console.error("Preview Runtime Error: " + msg);
                const errDiv = document.createElement('div');
                errDiv.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#ef4444;color:white;padding:12px;border-radius:6px;z-index:99999;font-family:sans-serif;font-size:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);';
                errDiv.innerText = 'Runtime Error: ' + msg;
                document.body.appendChild(errDiv);
            };
            try {
                ${customJs}
            } catch (e) {
                console.error("Script Injection Error:", e);
            }
        `;

        if (customJs) {
            // Regex matches <script src="script.js" ...></script> allowing for ./, defer, module, etc
            const jsRegex = /<script[^>]*src=["']\.?\/?script\.js["'][^>]*>[\s\S]*?<\/script>/i;
            
            if (jsRegex.test(finalHtml)) {
                finalHtml = finalHtml.replace(jsRegex, `<script defer>${safeJs}</script>`);
            } else {
                finalHtml = finalHtml.replace('</body>', `<script defer>${safeJs}</script></body>`);
            }
        }
        
        // 4. Create Blob
        const blob = new Blob([finalHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setIframeUrl(url);
        
        return () => URL.revokeObjectURL(url);
    };

    const cleanup = bundlePreview();
    return () => {
        if (cleanup) cleanup();
        setIframeUrl('');
    };
  }, [generatedCode, files]);
  
  // Simulated Loading Bar
  useEffect(() => {
    if (iframeUrl) {
        setLoadingProgress(100);
        return;
    }
    const interval = setInterval(() => {
        setLoadingProgress(prev => prev >= 90 ? 90 : prev + 5);
    }, 100);
    return () => clearInterval(interval);
  }, [iframeUrl]);

  const getFrameStyles = () => {
    if (viewMode === 'mobile') {
        return {
            width: '375px',
            height: '100%',
            border: '14px solid #1e293b',
            borderRadius: '40px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 2px #334155'
        }
    }
    if (viewMode === 'tablet') {
         return {
            width: '768px',
            height: '100%',
            border: '12px solid #1e293b',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }
    }
    return {
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '0'
    }
  };

  const containerClasses = isFullScreen ? "fixed inset-0 z-50 bg-slate-950 flex flex-col" : "w-full h-full bg-slate-950 flex flex-col relative";

  return (
    <div className={containerClasses}>
      <div className="py-2 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
           <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400 cursor-pointer" onClick={onClose}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        
        <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
           {['mobile', 'tablet', 'desktop'].map((mode) => (
             <button 
                key={mode}
                onClick={() => setViewMode(mode as any)} 
                className={`p-1.5 rounded transition-all ${viewMode === mode ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
                {mode === 'mobile' && <Smartphone size={14} />}
                {mode === 'tablet' && <Tablet size={14} />}
                {mode === 'desktop' && <Laptop size={14} />}
             </button>
           ))}
        </div>

        <div className="flex items-center">
            <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 flex items-center gap-2">
                <Shield size={10} className="text-emerald-500" />
                <span className="text-[10px] text-slate-400 font-mono">SECURE PREVIEW</span>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-hidden relative">
        {loadingProgress < 100 && (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-950 text-slate-500">
              <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
              <p className="font-mono text-xs animate-pulse">Constructing Virtual Environment...</p>
           </div>
        )}
        
        {iframeUrl && (
          <div style={getFrameStyles()} className="relative transition-all duration-500 bg-white overflow-hidden bg-black">
             {viewMode === 'mobile' && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1e293b] rounded-b-2xl z-50 flex justify-center items-center pointer-events-none">
                     <div className="w-16 h-1 bg-[#0f172a] rounded-full opacity-50"></div>
                 </div>
             )}
             <iframe 
                 title="Preview"
                 src={iframeUrl}
                 className="w-full h-full"
                 sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
             />
          </div>
        )}
      </div>
    </div>
  );
};
