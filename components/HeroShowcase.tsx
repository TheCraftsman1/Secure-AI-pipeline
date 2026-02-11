
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Shield, Zap, Globe, Cpu, Layers, Play, Eye, Monitor, Smartphone, Tablet, Rocket } from 'lucide-react';

interface Props {
  onEnter: () => void;
  onInstantDemo?: () => void;
  onEnterDemo?: () => void;
}

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
        body { background: #050505; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; scrollbar-width: none; }
        ::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Outfit', sans-serif; }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #a5a5a5 50%, var(--accent-gold) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .animate-float { animation: float 10s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
    </style>
</head>
<body class="selection:bg-teal-500/30">
    <nav class="p-6 flex justify-between items-center">
        <div class="text-xl font-display font-bold tracking-tighter uppercase">Aethelgard<span class="text-[var(--accent-gold)]">.sys</span></div>
        <button class="px-4 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest">Tunnel</button>
    </nav>
    <main class="relative z-10 pt-20 px-8 pb-20 text-center">
        <div class="space-y-8 max-w-4xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                <div class="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                <span class="text-[8px] font-bold uppercase tracking-[0.3em] text-teal-400">Synthesis Ready</span>
            </div>
            <h1 class="text-7xl font-display font-bold leading-[0.8] tracking-tighter text-gradient">The Apex <br/> Layer.</h1>
            <p class="text-xl text-slate-400 font-light max-w-lg mx-auto leading-relaxed">Sovereign liquidity protocols synthesized by Nexus AI for the next era of global commerce.</p>
        </div>
        <div class="mt-12 glass p-1 rounded-[3rem] border-white/10 overflow-hidden shadow-2xl max-w-3xl mx-auto">
             <img src="https://images.unsplash.com/photo-1460925895231-311111749553?auto=format&fit=crop&q=80&w=1200" class="w-full h-auto rounded-[2.8rem]" />
        </div>
    </main>
</body>
</html>
`;

export const HeroShowcase: React.FC<Props> = ({ onEnter, onInstantDemo, onEnterDemo }) => {
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const blob = new Blob([ELITE_MASTERPIECE_HTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050507] text-white overflow-x-hidden relative flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-accent-teal/5 rounded-full blur-[140px] animate-breath"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-accent-gold/5 rounded-full blur-[140px] animate-breath" style={{ animationDelay: '3s' }}></div>
      </div>

      <nav className="relative z-50 flex items-center justify-between px-10 py-10 max-w-[1800px] mx-auto w-full">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-white text-midnight-900 rounded-2xl flex items-center justify-center shadow-2xl">
            <Cpu size={22} />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter">NexusBuild<span className="text-accent-teal">.ai</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onEnter}
            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all"
          >
            Manual Mode
          </button>
          <button 
            onClick={onInstantDemo}
            className="px-8 py-3 bg-white text-midnight-900 rounded-2xl text-xs font-bold hover:scale-105 transition-all shadow-xl shadow-white/10"
          >
            Launch Instant Synthesis
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1800px] mx-auto px-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-teal/10 border border-accent-teal/20 rounded-full">
            <Sparkles size={14} className="text-accent-teal" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal/80">Neural Fabrication OS v4.0</span>
          </div>
          
          <h1 className="text-8xl md:text-[9rem] font-display font-bold leading-[0.85] tracking-tighter">
            Build at <br/>
            <span className="text-gradient-gold">the speed of thought.</span>
          </h1>
          
          <p className="text-2xl text-slate-400 font-light max-w-lg leading-relaxed">
            Nexus synthesizes high-end enterprise architecture and Awwwards-winning interfaces in seconds. Experience the future of software fabrication.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <button 
              onClick={onInstantDemo}
              className="px-12 py-6 bg-accent-teal text-midnight-900 rounded-3xl font-bold text-lg flex items-center justify-center space-x-3 hover:scale-105 transition-all shadow-2xl shadow-accent-teal/20 group"
            >
              <Zap size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              <span>Fast-Track Demo</span>
            </button>
            <button 
              onClick={onEnter}
              className="px-12 py-6 glass rounded-3xl font-bold text-lg flex items-center justify-center space-x-3 hover:bg-white/10 transition-all border-white/10"
            >
              <Rocket size={20} className="text-accent-gold" />
              <span>Custom Build</span>
            </button>
          </div>
        </div>

        <div className="relative group perspective-[2000px]">
          <div className="absolute inset-0 bg-accent-teal/10 blur-[150px] opacity-30 animate-pulse"></div>
          
          <div className="relative z-10 glass rounded-[3rem] border-white/10 shadow-2xl overflow-hidden transition-all duration-1000 transform rotate-y-[-10deg] group-hover:rotate-y-0" style={{ height: '700px' }}>
            <div className="absolute top-0 w-full h-12 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center px-6 justify-between z-20">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                </div>
                <div className="text-[10px] font-mono text-accent-teal/60">nexus-synthesis-stream-01.live</div>
            </div>
            
            <iframe 
              src={iframeUrl} 
              className="w-full h-full border-none pt-12"
              title="Elite Masterpiece Preview"
            />
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-16 px-10 max-w-[1800px] mx-auto w-full flex justify-between items-center text-slate-600 font-mono text-[10px] tracking-[0.4em] uppercase">
        <div>System Ready • Latency: 2ms</div>
        <div>NexusBuild AI © 2025</div>
      </footer>
    </div>
  );
};
