import React, { useState, useEffect } from 'react';
import { Activity, Users, Cpu, Globe, Zap, Shield, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ProjectConfig, TechStack, Database } from '../types';
import { GeneratedWebsitePreview } from './GeneratedWebsitePreview';

const INITIAL_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  cpu: 20 + Math.random() * 10,
  requests: 100 + Math.random() * 50,
  memory: 40 + Math.random() * 5
}));

interface Props {
  config: ProjectConfig | null;
  generatedCode?: string;
}

export const StageMonitor: React.FC<Props> = ({ config, generatedCode }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [stats, setStats] = useState({
    activeUsers: 124,
    avgLatency: 45,
    uptime: '99.99%'
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newTime = prev[prev.length - 1].time + 1;
        const newItem = {
          time: newTime,
          cpu: 30 + Math.random() * 20, // slight spike
          requests: 150 + Math.random() * 100,
          memory: 45 + Math.random() * 10
        };
        return [...prev.slice(1), newItem];
      });

      setStats(prev => ({
        activeUsers: Math.floor(prev.activeUsers + (Math.random() - 0.5) * 5),
        avgLatency: Math.floor(40 + Math.random() * 15),
        uptime: '99.99%'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fallback if config is missing (dev mode)
  const safeConfig = config || {
    idea: 'Nexus App',
    stack: TechStack.ReactNode,
    database: Database.Postgres,
    features: { auth: true, payments: true, search: true, admin: false, notifications: true, analytics: true }
  } as ProjectConfig;

  // Full Screen "App Only" Mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black animate-fade-in">
        <GeneratedWebsitePreview 
          config={safeConfig} 
          generatedCode={generatedCode}
          isFullScreen={true} 
          onClose={() => setIsFullScreen(false)} 
        />
      </div>
    );
  }

  // Standard Dashboard Mode
  return (
    <div className="animate-fade-in space-y-6 pb-10 relative">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-2 border-emerald-500">
          <span className="text-slate-400 text-xs uppercase font-bold mb-1">Status</span>
          <div className="flex items-center text-emerald-400 text-lg md:text-xl font-bold">
            <Globe className="mr-2" size={20} /> Online
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-2 border-blue-500">
          <span className="text-slate-400 text-xs uppercase font-bold mb-1">Active Users</span>
          <div className="flex items-center text-white text-lg md:text-xl font-bold">
            <Users className="mr-2 text-blue-400" size={20} /> {stats.activeUsers}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-2 border-purple-500">
          <span className="text-slate-400 text-xs uppercase font-bold mb-1">Avg Latency</span>
          <div className="flex items-center text-white text-lg md:text-xl font-bold">
            <Zap className="mr-2 text-purple-400" size={20} /> {stats.avgLatency}ms
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-2 border-orange-500">
          <span className="text-slate-400 text-xs uppercase font-bold mb-1">Resource Usage</span>
          <div className="flex items-center text-white text-lg md:text-xl font-bold">
            <Cpu className="mr-2 text-orange-400" size={20} /> {Math.floor(data[data.length-1].cpu)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        
        {/* Left Column: Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
           {/* Request Traffic */}
          <div className="glass-panel p-5 rounded-xl flex-1 flex flex-col min-h-0">
            <h3 className="text-white font-bold mb-4 text-sm flex items-center">
              <Activity size={16} className="mr-2 text-cyan-400" /> Live Traffic
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#475569" fontSize={10} width={30} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                    itemStyle={{ color: '#22d3ee' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#06b6d4" fillOpacity={1} fill="url(#colorReq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Resources */}
          <div className="glass-panel p-5 rounded-xl flex-1 flex flex-col min-h-0">
            <h3 className="text-white font-bold mb-4 text-sm flex items-center">
              <Shield size={16} className="mr-2 text-purple-400" /> System Load
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} width={30} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  />
                  <Line type="monotone" dataKey="cpu" stroke="#f97316" strokeWidth={2} dot={false} name="CPU" />
                  <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Memory" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Live App Preview */}
        <div className="lg:col-span-8 h-full flex flex-col">
           <div className="flex items-center justify-between mb-3 px-2">
             <div className="flex items-center space-x-2">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               <h3 className="text-slate-300 font-bold text-sm">LIVE PRODUCTION FEED</h3>
             </div>
             <span className="text-xs text-slate-500 font-mono">v1.0.0-release</span>
           </div>
           
           <div className="flex-1 relative group rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
              {/* Overlay Button */}
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 pointer-events-none">
                 <button 
                    onClick={() => setIsFullScreen(true)}
                    className="pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-slate-900 px-8 py-4 rounded-full font-bold flex items-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 hover:bg-slate-50"
                 >
                    <ExternalLink className="mr-2" size={20} /> Open App Website
                 </button>
              </div>

              <GeneratedWebsitePreview config={safeConfig} generatedCode={generatedCode} />
              
              {/* Interactive Overlay Tip */}
              <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 px-4 py-2 rounded-lg text-xs text-slate-400 shadow-lg z-10 group-hover:opacity-0 transition-opacity pointer-events-none">
                <span className="text-emerald-400">●</span> Hover to Interact
              </div>
           </div>
        </div>

      </div>
      
      <div className="text-center pt-4 border-t border-slate-800/50 mt-4">
        <p className="text-slate-600 text-xs font-mono">NexusBuild AI Secure Monitor • Encrypted Connection • {stats.uptime} Uptime</p>
      </div>
    </div>
  );
};