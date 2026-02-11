
import React, { useState, useRef } from 'react';
import { Database, ProjectConfig, ProjectFeatures, TechStack, DesignStyle, ColorTheme } from '../types';
import { 
    Settings2, Sparkles, ToggleRight, Fingerprint, Cpu, Wand2, Paperclip, X, 
    LayoutTemplate, Briefcase, ShoppingBag, Rocket, Database as DatabaseIcon,
    Palette, Moon, Sun, Monitor, Layers, Zap, Grid, Box, Crown
} from 'lucide-react';
import { generateProjectBlueprint, improveProjectIdea } from '../services/geminiService';

interface Props {
  onComplete: (config: ProjectConfig, blueprint: string) => void;
}

const DESIGN_STYLES: { id: DesignStyle; label: string; desc: string; icon: any }[] = [
    { id: 'Minimal', label: 'Minimal', desc: 'Clean, open whitespace, elegant typography.', icon: LayoutTemplate },
    { id: 'Glassmorphism', label: 'Glass', desc: 'Soft blur, breathable, modern depth.', icon: Layers },
    { id: 'Luxury', label: 'Luxury', desc: 'Warm neutrals, serif fonts, sophisticated.', icon: Crown },
    { id: 'Cyberpunk', label: 'Neo-Tech', desc: 'Clean futuristic, accent glows.', icon: Zap },
    { id: 'Corporate', label: 'Enterprise', desc: 'Trustworthy, solid structure.', icon: Briefcase },
    { id: 'Neo-Brutalism', label: 'Bold', desc: 'High contrast, distinct sections.', icon: Box },
    { id: 'Retro', label: 'Nostalgic', desc: 'Warm tones, grainy textures.', icon: Grid },
];

const COLORS = [
    { id: 'indigo', hex: '#6366f1' },
    { id: 'blue', hex: '#3b82f6' },
    { id: 'cyan', hex: '#06b6d4' },
    { id: 'emerald', hex: '#10b981' },
    { id: 'rose', hex: '#f43f5e' },
    { id: 'amber', hex: '#f59e0b' },
    { id: 'violet', hex: '#8b5cf6' },
];

export const StagePlanning: React.FC<Props> = ({ onComplete }) => {
  const [idea, setIdea] = useState('');
  const [stack, setStack] = useState<TechStack>(TechStack.ReactNode);
  const [database, setDatabase] = useState<Database>(Database.Postgres);
  const [features, setFeatures] = useState<ProjectFeatures>({
    auth: true,
    payments: false,
    search: true,
    admin: false,
    notifications: false,
    analytics: true
  });
  
  // Design State
  const [designStyle, setDesignStyle] = useState<DesignStyle>('Luxury');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('Light');
  const [primaryColor, setPrimaryColor] = useState<string>('amber');

  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = (key: keyof ProjectFeatures) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImprovePrompt = async () => {
    if (!idea) return;
    setIsEnhancing(true);
    const result = await improveProjectIdea(idea);
    if (typeof result === 'object') {
        setIdea(result.refinedIdea);
    } else {
        setIdea(result);
    }
    setIsEnhancing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setReferenceImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const applyTemplate = (type: 'saas' | 'portfolio' | 'ecommerce') => {
      // Immediate submission for templates to skip the "Architecting..." delay
      setIsGenerating(true);
      let config: ProjectConfig = {
          idea: "",
          stack: TechStack.ReactNode,
          database: Database.Postgres,
          features: { auth: true, payments: true, search: true, admin: true, notifications: true, analytics: true },
          design: { style: 'Luxury', theme: 'Midnight', primaryColor: 'amber' },
          referenceImages: []
      };
      
      let mockBlueprint = "";

      if (type === 'saas') {
          config.idea = "A B2B SaaS platform for project management with kanban boards, team collaboration features, and subscription billing.";
          config.stack = TechStack.NextGo;
          config.design = { style: 'Corporate', theme: 'Light', primaryColor: 'blue' };
          mockBlueprint = "## Enterprise SaaS Architecture\n\n- **Core**: Microservices (Go) + Next.js Frontend\n- **Auth**: RBAC / SSO Integration\n- **Data**: Distributed Postgres Shards";
      } else if (type === 'portfolio') {
          config.idea = "A minimalist portfolio website for a senior product designer featuring a case study gallery, about me section, and contact form.";
          config.stack = TechStack.ReactNode;
          config.design = { style: 'Minimal', theme: 'Light', primaryColor: 'indigo' };
          config.features = { auth: false, payments: false, search: false, admin: true, notifications: false, analytics: true };
          mockBlueprint = "## Design Portfolio System\n\n- **Static Generation**: High-performance static assets\n- **CMS**: Headless integration\n- **Asset Delivery**: Global CDN Optimization";
      } else if (type === 'ecommerce') {
          config.idea = "A high-end luxury e-commerce boutique selling rare wines and spirits with a timeline history, sommelier notes, and exclusive membership access.";
          config.stack = TechStack.ReactNode;
          config.design = { style: 'Luxury', theme: 'Midnight', primaryColor: 'amber' };
          mockBlueprint = "## Luxury Commerce Engine\n\n- **Inventory**: Real-time consistency\n- **Payments**: Stripe Connect Integration\n- **Security**: PCI-DSS Compliant Vault";
      }

      setTimeout(() => {
          setIsGenerating(false);
          onComplete(config, mockBlueprint);
      }, 800); // Small artificial delay for UI feedback
  };

  const handleSubmit = async () => {
    if (!idea) return;
    setIsGenerating(true);
    const config: ProjectConfig = { 
        idea, 
        stack, 
        database, 
        features, 
        design: {
            style: designStyle,
            theme: colorTheme,
            primaryColor: primaryColor
        },
        referenceImages: referenceImages || []
    };
    // If it's a manual entry, we still hit the API for accuracy, 
    // unless we want to force speed everywhere. Keeping API for manual to ensure quality.
    const blueprint = await generateProjectBlueprint(config);
    setIsGenerating(false);
    onComplete(config, blueprint);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Cinematic High-Res Hero Section (Unsplash) */}
      <div className="relative w-full h-72 rounded-[2rem] overflow-hidden group">
        <div className="absolute inset-0 bg-midnight-900"></div>
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
          alt="AI Planning Interface" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]"
        />
        
        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-midnight-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-900/60 via-transparent to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 p-10 w-full md:w-2/3">
          <div className="flex items-center space-x-2 text-accent-teal mb-3 animate-slide-in-right">
            <Cpu size={18} />
            <span className="text-xs font-medium uppercase tracking-widest text-accent-teal/80">System Initialization</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-light text-white mb-4 leading-tight tracking-tight">
            Design <span className="text-gradient-gold font-medium">Without Limits</span>
          </h2>
          <p className="text-slate-300 max-w-lg text-lg opacity-90 leading-relaxed font-light">
            Create spaces that breathe. Nexus AI constructs modern, open architectures tailored to your vision.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Concept & Templates */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* 1. Core Concept */}
          <div className="glass-panel p-10 animate-scale-in">
            <h3 className="text-xl font-display font-medium text-white mb-8 flex items-center">
                <Sparkles size={22} className="mr-3 text-accent-teal" /> Core Concept
            </h3>
            
            {/* Quick Templates - NOW INSTANT */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <button 
                    onClick={() => applyTemplate('saas')} 
                    disabled={isGenerating}
                    className="p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all text-left group border border-white/5 hover:border-white/10 hover:-translate-y-1 disabled:opacity-50"
                >
                    <Rocket size={24} className="text-accent-teal mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-medium text-white text-sm">SaaS Platform</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Fast Track</div>
                </button>
                <button 
                    onClick={() => applyTemplate('portfolio')} 
                    disabled={isGenerating}
                    className="p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all text-left group border border-white/5 hover:border-white/10 hover:-translate-y-1 disabled:opacity-50"
                >
                    <Briefcase size={24} className="text-accent-rose mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-medium text-white text-sm">Portfolio</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Fast Track</div>
                </button>
                <button 
                    onClick={() => applyTemplate('ecommerce')} 
                    disabled={isGenerating}
                    className="p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all text-left group border border-white/5 hover:border-white/10 hover:-translate-y-1 disabled:opacity-50"
                >
                    <ShoppingBag size={24} className="text-accent-gold mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-medium text-white text-sm">Luxury Store</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Fast Track</div>
                </button>
            </div>

            <div className="relative group">
                <div className="relative bg-white/5 rounded-3xl border border-white/10 focus-within:bg-white/[0.07] transition-all">
                    <textarea 
                    className="w-full bg-transparent border-none rounded-2xl p-6 text-white placeholder-slate-500 focus:ring-0 outline-none transition-all h-40 resize-none text-lg leading-relaxed font-light"
                    placeholder="Describe your dream application in detail..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    />
                    
                    {/* Thumbnails */}
                    {referenceImages.length > 0 && (
                    <div className="flex gap-4 px-6 pb-6 overflow-x-auto">
                        {referenceImages.map((img, i) => (
                            <div key={i} className="relative group/img shrink-0">
                                <img src={img} alt="reference" className="w-16 h-16 object-cover rounded-2xl border border-white/10" />
                                <button 
                                onClick={() => removeImage(i)}
                                className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                                >
                                <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    )}

                    <div className="flex justify-between items-center px-6 pb-6 border-t border-white/5 pt-4">
                        <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm flex items-center px-4 py-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                        <Paperclip size={16} className="mr-2" />
                        {referenceImages.length > 0 ? `${referenceImages.length} attached` : 'Attach References'}
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />

                        {idea && (
                            <button
                                onClick={handleImprovePrompt}
                                disabled={isEnhancing}
                                className={`text-sm flex items-center px-5 py-2 rounded-full border transition-all duration-500 ${isEnhancing ? 'bg-white/10 border-white/10 text-slate-300' : 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20'}`}
                            >
                                {isEnhancing ? <span className="animate-spin mr-2">✦</span> : <Wand2 size={14} className="mr-2" />}
                                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
          </div>

          {/* 2. Aesthetic & Design */}
          <div className="glass-panel p-10">
             <h3 className="text-xl font-display font-medium text-white mb-8 flex items-center">
                <Palette size={22} className="mr-3 text-accent-rose" /> Aesthetics & Theme
            </h3>
            
            <div className="space-y-10">
                <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Design Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {DESIGN_STYLES.map((style) => {
                            const Icon = style.icon;
                            return (
                                <button
                                    key={style.id}
                                    onClick={() => setDesignStyle(style.id)}
                                    className={`p-5 rounded-3xl border text-left transition-all duration-300 ${designStyle === style.id ? 'bg-accent-rose/10 border-accent-rose text-white shadow-[0_0_20px_-5px_rgba(225,112,85,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:-translate-y-1'}`}
                                >
                                    <div className="flex items-center mb-2">
                                        <Icon size={18} className={`mr-2 ${designStyle === style.id ? 'text-accent-rose' : 'text-slate-500'}`} />
                                        <span className="text-base font-medium">{style.label}</span>
                                    </div>
                                    <div className="text-xs opacity-60 leading-relaxed font-light">{style.desc}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Atmosphere</label>
                        <div className="flex p-1.5 bg-midnight-800 rounded-2xl border border-white/5">
                             {(['Light', 'Midnight', 'Dark'] as ColorTheme[]).map((theme) => (
                                 <button
                                    key={theme}
                                    onClick={() => setColorTheme(theme)}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${colorTheme === theme ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                 >
                                    {theme === 'Light' && <Sun size={14} />}
                                    {theme === 'Midnight' && <Moon size={14} />}
                                    {theme === 'Dark' && <Monitor size={14} />}
                                    {theme}
                                 </button>
                             ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Brand Tint</label>
                        <div className="flex flex-wrap gap-4">
                            {COLORS.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setPrimaryColor(c.id)}
                                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${primaryColor === c.id ? 'border-white scale-110 shadow-[0_0_15px_currentColor]' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
                                    style={{ backgroundColor: c.hex, color: c.hex }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Technical & Action */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* Tech Stack */}
            <div className="glass-panel p-8">
                 <h3 className="text-lg font-display font-medium text-white mb-6 flex items-center">
                    <Settings2 size={20} className="mr-3 text-accent-teal" /> Architecture
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Stack</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-midnight-800 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-accent-teal transition-all text-sm appearance-none cursor-pointer"
                                value={stack}
                                onChange={(e) => setStack(e.target.value as TechStack)}
                            >
                                {Object.values(TechStack).map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                disabled={!idea || isGenerating}
                onClick={handleSubmit}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all duration-500 shadow-xl
                ${!idea || isGenerating 
                    ? 'bg-midnight-800 text-slate-600 cursor-not-allowed border border-white/5' 
                    : 'bg-white text-midnight-900 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]'
                }`}
            >
                {isGenerating ? (
                <>
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-midnight-900 rounded-full animate-spin"></div>
                    <span>Architecting...</span>
                </>
                ) : (
                <>
                    <Sparkles size={20} className="text-accent-rose" />
                    <span>Generate Blueprint</span>
                </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

const ChevronDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
