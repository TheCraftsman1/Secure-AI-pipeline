
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowUpRight, ShieldCheck, Zap, Globe, Cpu, 
  Layers, Layout, MousePointer2, Box, Database, 
  Code2, Fingerprint, Activity, Server, ChevronRight
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

const FEATURED_PROJECTS = [
  {
    title: "Aethelgard OS",
    tag: "FinTech Architecture",
    desc: "A sovereign liquidity orchestration layer built with Rust and React 19. Designed for sub-millisecond settlement across distributed ledgers.",
    metrics: { latency: "14ms", uptime: "99.999%", load: "4.2%" },
    tech: ["Rust", "WASM", "Tailwind", "Postgres"],
    image: "https://images.unsplash.com/photo-1460925895231-311111749553?auto=format&fit=crop&q=80&w=1200",
    color: "from-accent-gold/40"
  },
  {
    title: "Neural Studio",
    tag: "Creative Ecosystem",
    desc: "Real-time generative environment for digital architects. Seamless integration of latent diffusion models with procedural geometry.",
    metrics: { latency: "8ms", uptime: "100%", load: "1.1%" },
    tech: ["Three.js", "Python", "GLSL", "Redis"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    color: "from-accent-teal/40"
  },
  {
    title: "Chronos AI",
    tag: "Temporal Analytics",
    desc: "Predictive engine for high-frequency market shifts. Utilizing quantum-inspired algorithms for non-linear time-series forecasting.",
    metrics: { latency: "2ms", uptime: "99.98%", load: "18.5%" },
    tech: ["Go", "Next.js", "C++", "Cassandra"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    color: "from-indigo-500/40"
  },
  {
    title: "Solis Smart Grid",
    tag: "Renewable Orchestration",
    desc: "Edge-computed energy redistribution platform. Synchronizing thousands of micro-grids through a zero-trust neural network.",
    metrics: { latency: "31ms", uptime: "99.9999%", load: "2.4%" },
    tech: ["Rust", "IoT Core", "Vue", "MQTT"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    color: "from-rose-500/40"
  }
];

export const HighEndDemo: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen w-full bg-[#050507] text-white relative overflow-x-hidden selection:bg-accent-teal/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-gold/5 rounded-full blur-[160px] animate-breath"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-teal/5 rounded-full blur-[160px] animate-breath" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Header Overlay */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all shadow-2xl"
        >
          <Layout size={18} className="text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Exit Exhibition</span>
        </button>
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Masterpiece Mode</div>
            <div className="text-accent-teal text-[10px] font-mono tracking-tighter">RENDER_ID: 0XF992B</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white text-midnight-900 flex items-center justify-center shadow-2xl transition-transform hover:rotate-90">
            <Cpu size={24} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-32 px-10 max-w-[1800px] mx-auto">
        <div className="max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full animate-fade-in">
            <Sparkles size={14} className="text-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold/80">Premium Production Gallery</span>
          </div>
          <h1 className="text-7xl md:text-[11rem] font-display font-bold leading-[0.8] tracking-tighter animate-scale-in">
            Digital <br/>
            <span className="text-gradient-gold">Mastery.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Explore the architectural apex. Nexus synthesizes enterprise-grade environments with precision-tuned aesthetics and zero performance compromise.
          </p>
        </div>
      </section>

      {/* Horizontal Stats Bar */}
      <div className="relative z-10 px-10 mb-20">
        <div className="max-w-[1800px] mx-auto py-12 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Synthesis Rate", value: "0.04s", icon: Zap, color: "text-accent-gold" },
            { label: "Global Reach", value: "24 Regions", icon: Globe, color: "text-accent-teal" },
            { label: "Compute Density", value: "High", icon: Server, color: "text-purple-400" },
            { label: "Security Level", value: "Military", icon: ShieldCheck, color: "text-rose-400" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color} transition-all group-hover:scale-110`}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                <div className="text-xl font-bold font-display">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 px-10 pb-20 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {FEATURED_PROJECTS.map((project, i) => (
          <div 
            key={i} 
            className="group relative h-[850px] rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-1000 animate-scale-in"
            style={{ animationDelay: `${0.1 * i}s` }}
          >
            {/* Background Image with Parallax-ish Effect */}
            <div className={`absolute inset-0 bg-gradient-to-b ${project.color} via-[#050507]/20 to-[#050507] z-10 opacity-60 group-hover:opacity-40 transition-opacity`}></div>
            <img 
              src={project.image} 
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] opacity-40 group-hover:opacity-60"
            />
            
            {/* Overlay Grid lines */}
            <div className="absolute inset-0 z-10 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#050507_90%)]"></div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 z-20 p-12 md:p-16 flex flex-col">
              {/* Header Info */}
              <div className="flex justify-between items-start mb-auto">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"></div>
                    <span className="text-[9px] font-bold text-accent-gold uppercase tracking-[0.3em]">{project.tag}</span>
                  </div>
                  <h2 className="text-6xl md:text-7xl font-display font-bold tracking-tighter group-hover:text-white transition-colors">{project.title}</h2>
                  <p className="text-slate-400 font-light max-w-md text-lg leading-relaxed">{project.desc}</p>
                </div>
                <div className="w-20 h-20 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-midnight-900 transition-all duration-700 shadow-2xl">
                  <ArrowUpRight size={32} />
                </div>
              </div>

              {/* Technical Badges */}
              <div className="flex flex-wrap gap-2 mb-10">
                {project.tech.map((t, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-mono font-bold text-slate-300 group-hover:border-white/20 transition-colors">
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Bottom Metrics Grid */}
              <div className="grid grid-cols-3 gap-10 pt-10 border-t border-white/10">
                {Object.entries(project.metrics).map(([label, val]) => (
                  <div key={label} className="space-y-1">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">{label}</div>
                    <div className="text-2xl font-mono font-bold text-white tabular-nums group-hover:text-accent-teal transition-colors">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle Gradient Shadow at Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050507] to-transparent z-10"></div>
          </div>
        ))}
      </section>

      {/* Performance Matrix Section */}
      <section className="relative z-10 py-32 px-10 max-w-[1800px] mx-auto overflow-hidden">
        <div className="glass-panel p-16 rounded-[4rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-teal/10 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-[2000ms]"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-teal/10 border border-accent-teal/20 rounded-full">
                  <Activity size={14} className="text-accent-teal" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-teal/80">Network Diagnostics</span>
                </div>
                <h3 className="text-7xl font-display font-bold tracking-tighter leading-none">The Neural <br/><span className="text-slate-500">Fabric.</span></h3>
                <p className="text-xl text-slate-400 font-light leading-relaxed max-w-lg">
                  Underneath every masterpiece lies a robust, high-availability architecture. Nexus OS automatically balances load across 42 global POPs, ensuring sub-50ms latency for 98% of the global population.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { label: "Data Integrity", val: 100, color: "bg-accent-gold" },
                  { label: "Neural Fidelity", val: 98, color: "bg-accent-teal" },
                  { label: "Response Speed", val: 99.4, color: "bg-indigo-400" }
                ].map((bar, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <span>{bar.label}</span>
                      <span>{bar.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} transition-all duration-[2000ms] ease-out`} style={{ width: `${bar.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 aspect-square rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-3xl p-10 overflow-hidden group/viz">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
                <div className="h-full w-full relative flex items-center justify-center">
                   {/* Centered Neural Ball */}
                   <div className="w-48 h-48 rounded-full border-4 border-accent-teal/20 flex items-center justify-center animate-breath">
                      <div className="w-32 h-32 rounded-full border-2 border-accent-gold/40 flex items-center justify-center">
                         <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                            <Fingerprint className="text-midnight-900" size={32} />
                         </div>
                      </div>
                   </div>
                   
                   {/* Orbiting Elements */}
                   {[...Array(6)].map((_, i) => (
                     <div 
                      key={i} 
                      className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                      style={{ 
                        transform: `rotate(${i * 60}deg) translateX(140px)`,
                        animationDelay: `${i * 0.4}s`
                      }}
                     ></div>
                   ))}

                   {/* Tech Labels */}
                   <div className="absolute top-10 left-10 text-[9px] font-mono text-slate-500 uppercase tracking-widest">Core_Protocol: Enabled</div>
                   <div className="absolute bottom-10 right-10 text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Status: Nominal</div>
                </div>
              </div>
              
              {/* Floating Decorative Labels */}
              <div className="absolute -top-10 -right-10 px-6 py-4 glass rounded-2xl border border-white/10 text-xs font-bold font-mono tracking-widest animate-float">
                SYNTHESIS_V3.0.SYS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Expansion Map Visual */}
      <section className="relative z-10 py-32 px-10 text-center space-y-12">
        <div className="max-w-4xl mx-auto space-y-6">
           <h4 className="text-5xl font-display font-bold tracking-tighter">Global Deployment Matrix</h4>
           <p className="text-xl text-slate-500 font-light leading-relaxed">
             One-click deployment to 120+ edge locations. NexusBuild architecture is designed to live where your users breathe. No cold starts, no regional bottlenecks.
           </p>
        </div>
        
        <div className="relative w-full max-w-6xl mx-auto h-[400px] flex items-center justify-center overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02]">
           <div className="absolute inset-0 opacity-10 flex items-center justify-center scale-150">
              <Globe size={800} className="text-white" />
           </div>
           <div className="relative z-10 flex flex-wrap justify-center gap-12">
             {[
               { city: "New York", ping: "2ms" },
               { city: "London", ping: "4ms" },
               { city: "Tokyo", ping: "1ms" },
               { city: "Mumbai", ping: "12ms" },
               { city: "Frankfurt", ping: "5ms" }
             ].map((node, i) => (
               <div key={i} className="space-y-2 animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                 <div className="text-3xl font-display font-bold text-white tracking-tight">{node.city}</div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{node.ping}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Action Footer */}
      <footer className="relative z-10 px-10 pb-40 pt-20 text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          <h4 className="text-8xl md:text-[10rem] font-display font-bold tracking-tighter mb-10 opacity-10 select-none">BUILD THE FUTURE.</h4>
          <div className="space-y-8">
            <p className="text-2xl text-slate-500 font-light">Experience the synergy of human vision and neural fabrication.</p>
            <button 
              onClick={onBack}
              className="group px-16 py-8 bg-white text-midnight-900 rounded-[2.5rem] font-bold text-xl flex items-center justify-center space-x-6 mx-auto hover:scale-105 active:scale-95 transition-all shadow-[0_40px_100px_-20px_rgba(255,255,255,0.4)]"
            >
              <span>Initialize Session Now</span>
              <div className="p-2 bg-midnight-900 text-white rounded-xl transition-transform group-hover:rotate-45">
                 <ArrowUpRight size={24} />
              </div>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
