import React, { useState, useEffect } from 'react';
import { Activity, Users, Cpu, Globe, Zap, Shield, ExternalLink, Map, Settings, AlertTriangle, CheckCircle, Server, Sliders, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
  onBack?: () => void;
}

interface ServerRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'active' | 'degraded' | 'maintenance';
  latency: number;
  load: number;
}

// Adjusted coordinates for the detailed map projection
const INITIAL_REGIONS: ServerRegion[] = [
  { id: 'us-east', name: 'N. Virginia (US-EAST-1)', x: 29, y: 36, status: 'active', latency: 24, load: 45 },
  { id: 'us-west', name: 'California (US-WEST-1)', x: 18, y: 38, status: 'active', latency: 45, load: 30 },
  { id: 'eu-cent', name: 'Frankfurt (EU-CENTRAL)', x: 52, y: 28, status: 'active', latency: 88, load: 60 },
  { id: 'india', name: 'Mumbai (AP-SOUTH-1)', x: 70, y: 44, status: 'active', latency: 35, load: 75 }, // Added India
  { id: 'asia-se', name: 'Singapore (AP-SOUTHEAST)', x: 78, y: 58, status: 'degraded', latency: 150, load: 85 },
  { id: 'asia-ne', name: 'Tokyo (AP-NORTHEAST)', x: 88, y: 35, status: 'active', latency: 120, load: 40 },
  { id: 'sa-east', name: 'São Paulo (SA-EAST-1)', x: 34, y: 72, status: 'active', latency: 180, load: 25 },
];

export const StageMonitor: React.FC<Props> = ({ config, generatedCode, onBack }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [regions, setRegions] = useState<ServerRegion[]>(INITIAL_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const [thresholds, setThresholds] = useState({
    cpu: 80,
    latency: 200,
    errors: 2
  });

  const [resources, setResources] = useState({
      cpuCores: 4,
      ramGB: 16
  });
  
  const [alerts, setAlerts] = useState<string[]>([]);
  const [stats, setStats] = useState({
    activeUsers: 124,
    avgLatency: 45,
    uptime: '99.99%'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newTime = prev[prev.length - 1].time + 1;
        
        // Resource scaling math: More cores/RAM = less load/better performance
        const cpuLoadFactor = 8 / resources.cpuCores; 
        
        const spike = Math.random() > 0.9 ? 30 : 0;
        const newItem = {
          time: newTime,
          cpu: Math.min(100, (20 + Math.random() * 20 + spike) * (cpuLoadFactor * 0.5)), 
          requests: 150 + Math.random() * 100,
          memory: Math.min(100, (40 + Math.random() * 10) * (32 / resources.ramGB * 0.5))
        };
        
        const newAlerts: string[] = [];
        if (newItem.cpu > thresholds.cpu) newAlerts.push(`High CPU Usage detected: ${Math.floor(newItem.cpu)}%`);
        if (stats.avgLatency > thresholds.latency) newAlerts.push(`Latency degradation: ${stats.avgLatency}ms`);
        if (newAlerts.length > 0) setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));

        return [...prev.slice(1), newItem];
      });

      setRegions(prev => prev.map(r => ({
        ...r,
        latency: Math.max(10, r.latency + (Math.random() - 0.5) * 10),
        load: Math.min(100, Math.max(0, r.load + (Math.random() - 0.5) * 5)),
        status: r.load > 90 ? 'degraded' : 'active'
      })));

      setStats(prev => ({
        activeUsers: Math.floor(prev.activeUsers + (Math.random() - 0.5) * 5),
        avgLatency: Math.floor(40 + Math.random() * 15),
        uptime: '99.99%'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [thresholds, stats.avgLatency, resources]);

  const safeConfig = config || {
    idea: 'Nexus App',
    stack: TechStack.ReactNode,
    database: Database.Postgres,
    features: { auth: true, payments: true, search: true, admin: false, notifications: true, analytics: true }
  } as ProjectConfig;

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

  const latestCpu = Math.floor(data[data.length-1].cpu);
  const isCpuAlert = latestCpu > thresholds.cpu;

  return (
    <div className="animate-fade-in space-y-6 pb-10 relative">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
               {onBack && (
                   <button 
                      onClick={onBack}
                      className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group shadow-sm"
                      title="Back to Deployment"
                   >
                       <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                   </button>
               )}
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   Live Monitor
                   <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                       Active
                   </span>
               </h2>
          </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-2 border-emerald-500">
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Status</span>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-lg md:text-xl font-bold">
            <Globe className="mr-2" size={20} /> Online
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-2 border-blue-500">
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Active Users</span>
          <div className="flex items-center text-slate-900 dark:text-white text-lg md:text-xl font-bold">
            <Users className="mr-2 text-blue-600 dark:text-blue-400" size={20} /> {stats.activeUsers}
          </div>
        </div>
        <div className={`glass-panel p-4 rounded-xl flex flex-col border-l-2 transition-colors duration-300 ${isCpuAlert ? 'border-red-500 bg-red-100 dark:bg-red-500/10' : 'border-orange-500'}`}>
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">CPU Load</span>
          <div className={`flex items-center text-lg md:text-xl font-bold ${isCpuAlert ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
            <Cpu className={`mr-2 ${isCpuAlert ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'}`} size={20} /> 
            {latestCpu}%
            {isCpuAlert && <AlertTriangle size={16} className="ml-2 text-red-500" />}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-l-2 border-purple-500">
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Global Latency</span>
          <div className="flex items-center text-slate-900 dark:text-white text-lg md:text-xl font-bold">
            <Zap className="mr-2 text-purple-600 dark:text-purple-400" size={20} /> {stats.avgLatency}ms
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px] lg:h-[600px]">
        
        <div className="lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
           
           <div className="glass-panel p-0 rounded-xl flex-1 flex flex-col min-h-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent)] pointer-events-none"></div>
              
              <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm z-10">
                 <h3 className="text-slate-900 dark:text-white font-bold text-sm flex items-center">
                    <Map size={16} className="mr-2 text-cyan-600 dark:text-cyan-400" /> Global Infrastructure
                 </h3>
                 <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span> Healthy</span>
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span> Load</span>
                 </div>
              </div>

              <div className="flex-1 relative bg-slate-100 dark:bg-[#0f172a] overflow-hidden flex items-center justify-center group-hover:bg-[#0f172a]/50 transition-colors">
                 <div className="absolute inset-0 opacity-20" 
                      style={{ backgroundImage: 'linear-gradient(rgba(51, 65, 85, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 65, 85, 0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                 </div>
                 
                 <div className="absolute inset-0 w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(6,182,212,0.1)_360deg)] animate-[spin_4s_linear_infinite] rounded-full scale-150 opacity-30 pointer-events-none"></div>

                 <div className="relative w-full h-full" style={{ paddingBottom: '50%' }}>
                     <svg 
                        viewBox="0 0 1000 500" 
                        className="absolute inset-0 w-full h-full pointer-events-none"
                     >
                        {/* Real World Map Path */}
                        <path 
                          d="M174.4 78.4c-6.2-4.1-13.8-7.8-19.4-11.2-1.6-.9-5.1-5.1-6.6-4.5-5.1 2.2-11.4 1.8-16.7 3.5-2.2.7-3.8 2.7-5.4 4.5-3.3 3.8-10.2 4-13.8 7.3-1.6 1.4-1.8 4-2.7 6-2.5 5.1-2 11.1-2.2 16.7-.2 6.7 2.5 13.1 2.7 19.8.2 4.2-2.5 7.8-2 12 .5 3.8 4.2 6.5 6.2 9.4 3.1 4.2 3.8 10.2 7.1 14.3 3.3 4.2 9.1 4.7 13.2 7.6 2.5 1.8 3.8 5.1 6.5 6.7 4.2 2.5 9.4 1.8 14.3 2 4.2.2 8.7.9 12.3-1.6 2.9-2 4.7-5.8 5.4-9.1 1.4-6.2-1.1-12.7-2.9-18.7-1.1-3.6-2.7-7.1-2.9-10.9-.2-4.5 2.5-8.5 4.5-12.5 2.2-4.2 4.5-8.5 5.6-13.2.7-2.9-.5-6-1.8-8.7zm650 30c-1.8-2.5-4.5-4.2-7.1-5.8-3.6-2-8.3-2-12.3-2.5-4.9-.5-9.6-.2-14.5.5-2.5.4-5.4 1.1-7.1 3.1-2 2.2-2 5.6-2.9 8.3-1.4 4-3.6 7.6-6 11.2-2.2 3.6-5.4 6.7-6.2 10.9-.5 2.5.5 5.1 1.6 7.4 2 4 5.4 7.4 8.7 10.3 3.6 3.1 7.6 5.6 12 7.1 2.2.7 4.9.5 7.1.5 4.5-.2 9.1-.5 13.4-2 3.8-1.4 7.4-3.8 9.8-7.1 2.5-3.1 3.3-7.4 4.5-11.2 1.4-4.5 2.7-9.1 3.6-13.8.7-3.3 1.1-6.9.9-10.3-.2-3.1-2-5.6-4-7.8zm-152-32c-3.1-1.6-6.5-2.7-9.8-3.6-3.8-.9-8-1.1-11.8-.7-3.8.4-7.4 2.2-10.9 3.8-2.9 1.4-5.6 3.3-8 5.4-2.2 2-3.8 4.7-7.6-1.1 3.1-1.1 6.5-1.1 9.8 0 3.3.7 6.5 2.2 9.4 1.6 3.1 4 5.8 6.9 7.6 2.9 1.8 6.2 2.7 9.6 2.9 3.6.2 7.4-.5 10.7-2 3.1-1.4 5.8-3.8 7.8-6.5 2-2.7 3.3-5.8 4-9.1.7-3.3.7-6.7.2-10-.5-3.3-2.2-6.2-4.5-8.7zm-268 220c-3.3-3.1-7.4-5.1-11.6-6.5-4.2-1.4-8.7-1.8-13.2-1.4-3.8.4-7.4 2-10.5 4.2-2.9 2-4.9 5.1-6.2 8.3-1.6 3.6-2 7.8-1.6 11.8.4 3.8 2 7.4 4.7 10.3 2.5 2.7 5.8 4.7 9.4 5.8 3.6 1.1 7.4 1.1 11.2.7 3.8-.4 7.4-2 10.3-4.2 2.9-2.2 4.9-5.4 6-8.7 1.1-3.3 1.4-6.9 1.1-10.3-.2-3.3-1.6-6.5-3.6-9.1zm395 55c-2.5-2.2-5.8-3.6-8.9-4.7-3.3-1.1-6.7-1.6-10-1.6-3.6 0-7.1 1.1-10.3 2.9-2.9 1.6-5.1 4.2-6.5 7.1-1.6 3.1-2 6.7-1.6 10 .4 3.3 1.8 6.5 4 8.9 2.2 2.5 5.1 4.2 8.3 5.1 3.1.9 6.5.9 9.8.4 3.3-.5 6.5-2 9.1-4 2.5-2 4.5-4.9 5.4-8 .9-2.9 1.1-6 .7-9.1-.4-2.9-1.8-5.6-3.6-7.8zM245 320c-4-2.9-8.7-4.7-13.4-5.4-4.5-.7-9.1-.2-13.6 1.4-4 1.4-7.4 4.2-9.8 7.8-2.2 3.3-3.1 7.6-3.1 11.6 0 4 .9 8 3.1 11.4 2 3.1 5.4 5.4 9.1 6.5 3.8 1.1 7.8.9 11.6-.2 3.8-1.1 7.1-3.6 9.6-6.7 2.2-2.9 3.6-6.5 3.8-10.3.2-3.6-.9-7.1-3.1-10-1.1-1.6-2.5-3.1-4.2-4.5zm-50-130c-2.9-1.8-6.2-2.9-9.6-3.3-3.6-.4-7.4.2-10.7 1.8-3.1 1.4-5.8 3.8-7.6 6.7-1.8 2.9-2.7 6.2-2.7 9.6 0 3.6.9 6.9 2.7 9.8 1.8 2.9 4.5 5.1 7.8 6.5 3.3 1.4 6.9 1.8 10.5 1.1 3.6-.7 6.9-2.5 9.4-5.1 2.5-2.5 4.2-5.8 4.9-9.4.7-3.6.2-7.4-1.4-10.7-1.1-2.5-2.9-4.7-5.1-6.2z" 
                          className="fill-current text-slate-400/20 dark:text-slate-600/30 stroke-slate-400/40 dark:stroke-slate-500/40 stroke-[1]"
                        />
                        
                        {/* Dot Pattern Fill Effect */}
                        <defs>
                          <pattern id="techDots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                             <rect x="0" y="0" width="1.5" height="1.5" className="text-slate-500/30 dark:text-slate-500/30" fill="currentColor" />
                          </pattern>
                        </defs>
                        <path d="M174.4 78.4c-6.2-4.1-13.8-7.8-19.4-11.2-1.6-.9-5.1-5.1-6.6-4.5-5.1 2.2-11.4 1.8-16.7 3.5-2.2.7-3.8 2.7-5.4 4.5-3.3 3.8-10.2 4-13.8 7.3-1.6 1.4-1.8 4-2.7 6-2.5 5.1-2 11.1-2.2 16.7-.2 6.7 2.5 13.1 2.7 19.8.2 4.2-2.5 7.8-2 12 .5 3.8 4.2 6.5 6.2 9.4 3.1 4.2 3.8 10.2 7.1 14.3 3.3 4.2 9.1 4.7 13.2 7.6 2.5 1.8 3.8 5.1 6.5 6.7 4.2 2.5 9.4 1.8 14.3 2 4.2.2 8.7.9 12.3-1.6 2.9-2 4.7-5.8 5.4-9.1 1.4-6.2-1.1-12.7-2.9-18.7-1.1-3.6-2.7-7.1-2.9-10.9-.2-4.5 2.5-8.5 4.5-12.5 2.2-4.2 4.5-8.5 5.6-13.2.7-2.9-.5-6-1.8-8.7zm650 30c-1.8-2.5-4.5-4.2-7.1-5.8-3.6-2-8.3-2-12.3-2.5-4.9-.5-9.6-.2-14.5.5-2.5.4-5.4 1.1-7.1 3.1-2 2.2-2 5.6-2.9 8.3-1.4 4-3.6 7.6-6 11.2-2.2 3.6-5.4 6.7-6.2 10.9-.5 2.5.5 5.1 1.6 7.4 2 4 5.4 7.4 8.7 10.3 3.6 3.1 7.6 5.6 12 7.1 2.2.7 4.9.5 7.1.5 4.5-.2 9.1-.5 13.4-2 3.8-1.4 7.4-3.8 9.8-7.1 2.5-3.1 3.3-7.4 4.5-11.2 1.4-4.5 2.7-9.1 3.6-13.8.7-3.3 1.1-6.9.9-10.3-.2-3.1-2-5.6-4-7.8zm-152-32c-3.1-1.6-6.5-2.7-9.8-3.6-3.8-.9-8-1.1-11.8-.7-3.8.4-7.4 2.2-10.9 3.8-2.9 1.4-5.6 3.3-8 5.4-2.2 2-3.8 4.7-7.6-1.1 3.1-1.1 6.5-1.1 9.8 0 3.3.7 6.5 2.2 9.4 1.6 3.1 4 5.8 6.9 7.6 2.9 1.8 6.2 2.7 9.6 2.9 3.6.2 7.4-.5 10.7-2 3.1-1.4 5.8-3.8 7.8-6.5 2-2.7 3.3-5.8 4-9.1.7-3.3.7-6.7.2-10-.5-3.3-2.2-6.2-4.5-8.7zm-268 220c-3.3-3.1-7.4-5.1-11.6-6.5-4.2-1.4-8.7-1.8-13.2-1.4-3.8.4-7.4 2-10.5 4.2-2.9 2-4.9 5.1-6.2 8.3-1.6 3.6-2 7.8-1.6 11.8.4 3.8 2 7.4 4.7 10.3 2.5 2.7 5.8 4.7 9.4 5.8 3.6 1.1 7.4 1.1 11.2.7 3.8-.4 7.4-2 10.3-4.2 2.9-2.2 4.9-5.4 6-8.7 1.1-3.3 1.4-6.9 1.1-10.3-.2-3.3-1.6-6.5-3.6-9.1zm395 55c-2.5-2.2-5.8-3.6-8.9-4.7-3.3-1.1-6.7-1.6-10-1.6-3.6 0-7.1 1.1-10.3 2.9-2.9 1.6-5.1 4.2-6.5 7.1-1.6 3.1-2 6.7-1.6 10 .4 3.3 1.8 6.5 4 8.9 2.2 2.5 5.1 4.2 8.3 5.1 3.1.9 6.5.9 9.8.4 3.3-.5 6.5-2 9.1-4 2.5-2 4.5-4.9 5.4-8 .9-2.9 1.1-6 .7-9.1-.4-2.9-1.8-5.6-3.6-7.8zM245 320c-4-2.9-8.7-4.7-13.4-5.4-4.5-.7-9.1-.2-13.6 1.4-4 1.4-7.4 4.2-9.8 7.8-2.2 3.3-3.1 7.6-3.1 11.6 0 4 .9 8 3.1 11.4 2 3.1 5.4 5.4 9.1 6.5 3.8 1.1 7.8.9 11.6-.2 3.8-1.1 7.1-3.6 9.6-6.7 2.2-2.9 3.6-6.5 3.8-10.3.2-3.6-.9-7.1-3.1-10-1.1-1.6-2.5-3.1-4.2-4.5zm-50-130c-2.9-1.8-6.2-2.9-9.6-3.3-3.6-.4-7.4.2-10.7 1.8-3.1 1.4-5.8 3.8-7.6 6.7-1.8 2.9-2.7 6.2-2.7 9.6 0 3.6.9 6.9 2.7 9.8 1.8 2.9 4.5 5.1 7.8 6.5 3.3 1.4 6.9 1.8 10.5 1.1 3.6-.7 6.9-2.5 9.4-5.1 2.5-2.5 4.2-5.8 4.9-9.4.7-3.6.2-7.4-1.4-10.7-1.1-2.5-2.9-4.7-5.1-6.2z" fill="url(#techDots)" opacity="0.8" />
                     </svg>
                     
                     {/* Special Highlight for India as requested */}
                     <div className="absolute left-[70%] top-[44%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse pointer-events-none z-0"></div>
                     <div className="absolute left-[70%] top-[44%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full blur-sm animate-ping pointer-events-none z-0 duration-1000"></div>
                 </div>

                 {regions.map((region) => (
                    <div 
                      key={region.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group/node z-20"
                      style={{ left: `${region.x}%`, top: `${region.y}%` }}
                      onMouseEnter={() => setSelectedRegion(region.id)}
                      onMouseLeave={() => setSelectedRegion(null)}
                    >
                       <div className={`relative flex items-center justify-center w-6 h-6`}>
                          <span className={`absolute w-full h-full rounded-full opacity-75 animate-ping duration-1000 ${region.status === 'degraded' ? 'bg-yellow-500' : region.id === 'india' ? 'bg-orange-500' : 'bg-cyan-500'}`}></span>
                          <span className={`absolute w-full h-full rounded-full opacity-30 animate-pulse duration-2000 ${region.status === 'degraded' ? 'bg-yellow-500' : region.id === 'india' ? 'bg-orange-500' : 'bg-cyan-500'}`}></span>
                          <div className={`relative w-2.5 h-2.5 rounded-full border border-black/50 ${region.status === 'degraded' ? 'bg-yellow-400' : region.id === 'india' ? 'bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)]' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'}`}></div>
                       </div>
                       
                       <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/90 backdrop-blur border border-cyan-500/30 p-3 rounded-lg shadow-xl z-30 min-w-[160px] pointer-events-none transition-all duration-200 origin-bottom ${selectedRegion === region.id ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                          <div className="text-xs font-bold text-slate-900 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap flex items-center justify-between">
                             {region.name}
                             <div className={`w-2 h-2 rounded-full ${region.status === 'degraded' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                             <span className="text-slate-500 dark:text-slate-400">Latency</span>
                             <span className={`font-mono ${region.latency > 100 ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{Math.floor(region.latency)}ms</span>
                             <span className="text-slate-500 dark:text-slate-400">Load</span>
                             <span className={`font-mono ${region.load > 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-cyan-600 dark:text-cyan-400'}`}>{Math.floor(region.load)}%</span>
                             <span className="text-slate-500 dark:text-slate-400">Status</span>
                             <span className="text-slate-900 dark:text-white capitalize">{region.status}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-5 rounded-xl h-1/3 flex flex-col overflow-hidden">
              <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm flex items-center justify-between">
                <div className="flex items-center"><Sliders size={16} className="mr-2 text-slate-400" /> Resource Control</div>
                <div className="flex items-center"><Settings size={16} className="mr-2 text-slate-400" /> Thresholds</div>
              </h3>
              
              <div className="flex-1 flex gap-6 overflow-hidden">
                 {/* Resource Allocation Sliders */}
                 <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide border-r border-slate-200 dark:border-slate-700/50 mr-2">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 dark:text-slate-400">Simulated vCPUs</span>
                            <span className="text-cyan-500 dark:text-cyan-400">{resources.cpuCores} Cores</span>
                        </div>
                        <input 
                            type="range" min="1" max="16" step="1" value={resources.cpuCores}
                            onChange={(e) => setResources(p => ({...p, cpuCores: parseInt(e.target.value)}))}
                            className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 dark:text-slate-400">Memory Allocation</span>
                            <span className="text-blue-500 dark:text-blue-400">{resources.ramGB} GB</span>
                        </div>
                        <input 
                            type="range" min="4" max="64" step="4" value={resources.ramGB}
                            onChange={(e) => setResources(p => ({...p, ramGB: parseInt(e.target.value)}))}
                            className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                 </div>

                 {/* Threshold Config */}
                 <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                    <div>
                       <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Alert CPU %</span>
                          <span className="text-orange-500 dark:text-orange-400">{thresholds.cpu}%</span>
                       </div>
                       <input 
                         type="range" min="50" max="95" value={thresholds.cpu}
                         onChange={(e) => setThresholds(p => ({...p, cpu: parseInt(e.target.value)}))}
                         className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                       />
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Latency Max</span>
                          <span className="text-purple-500 dark:text-purple-400">{thresholds.latency}ms</span>
                       </div>
                       <input 
                         type="range" min="50" max="500" value={thresholds.latency}
                         onChange={(e) => setThresholds(p => ({...p, latency: parseInt(e.target.value)}))}
                         className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                       />
                    </div>
                 </div>

                 {/* System Log */}
                 <div className="flex-1 border-l border-slate-200 dark:border-slate-700/50 pl-4 flex flex-col min-w-[150px]">
                    <span className="text-xs text-slate-500 font-bold uppercase mb-2">System Log</span>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide text-[10px] font-mono">
                       {alerts.length === 0 ? (
                          <div className="text-emerald-600/50 dark:text-emerald-500/50 flex items-center mt-2">
                             <CheckCircle size={12} className="mr-1.5" /> All systems nominal
                          </div>
                       ) : (
                          alerts.map((alert, i) => (
                             <div key={i} className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/10 p-1.5 rounded border border-red-200 dark:border-red-900/20 animate-slide-in-right">
                                {alert}
                             </div>
                          ))
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-7 h-full flex flex-col gap-6 min-h-0">
           
           <div className="glass-panel p-5 rounded-xl h-1/3 flex flex-col min-h-0">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-900 dark:text-white font-bold text-sm flex items-center">
                  <Activity size={16} className="mr-2 text-cyan-600 dark:text-cyan-400" /> Live Traffic
                </h3>
                <span className="text-xs text-slate-500">Last 20s</span>
             </div>
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
                   <YAxis stroke="#94a3b8" fontSize={10} width={30} tickLine={false} axisLine={false} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                     itemStyle={{ color: '#22d3ee' }}
                   />
                   <Area type="monotone" dataKey="requests" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" animationDuration={500} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="flex-1 flex flex-col min-h-0">
             <div className="flex items-center justify-between mb-3 px-2">
               <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                 <h3 className="text-slate-800 dark:text-slate-300 font-bold text-sm">LIVE PRODUCTION FEED</h3>
               </div>
               <div className="flex items-center space-x-2">
                 <Server size={12} className="text-slate-500" />
                 <span className="text-xs text-slate-500 font-mono">cluster-alpha-1</span>
               </div>
             </div>
             
             <div className="flex-1 relative group rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 pointer-events-none">
                   <button 
                      onClick={() => setIsFullScreen(true)}
                      className="pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-slate-900 px-8 py-4 rounded-full font-bold flex items-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 hover:bg-slate-50"
                   >
                      <ExternalLink className="mr-2" size={20} /> Open App Website
                   </button>
                </div>

                <GeneratedWebsitePreview config={safeConfig} generatedCode={generatedCode} />
                
                <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs text-slate-500 dark:text-slate-400 shadow-lg z-10 group-hover:opacity-0 transition-opacity pointer-events-none">
                  <span className="text-emerald-500 dark:text-emerald-400">●</span> Hover to Interact
                </div>
             </div>
           </div>
        </div>

      </div>
      
      <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800/50 mt-4">
        <p className="text-slate-500 dark:text-slate-600 text-xs font-mono">NexusBuild AI Secure Monitor • Encrypted Connection • {stats.uptime} Uptime</p>
      </div>
    </div>
  );
};