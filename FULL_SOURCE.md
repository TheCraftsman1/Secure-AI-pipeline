# NexusBuild AI - Full Source Code

## index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## metadata.json
```json
{
  "name": "NexusBuild AI",
  "description": "An interactive, secure AI pipeline simulator that visualizes the software development lifecycle from planning to live monitoring.",
  "requestFramePermissions": []
}
```

## index.html
```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NexusBuild AI Pipeline</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              mono: ['Fira Code', 'monospace'],
            },
            colors: {
              slate: {
                850: '#151e2e',
                950: '#020617',
              }
            },
            animation: {
              'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              'spin-slow': 'spin 3s linear infinite',
            }
          },
        },
      }
    </script>
    <style>
      body {
        /* Default to light mode basics, overriden by classes */
        background-color: #f8fafc;
        color: #0f172a;
      }
      .dark body {
        background-color: #020617;
        color: #f8fafc;
      }
      
      /* Theme-aware Glass Panel */
      .glass-panel {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      
      .dark .glass-panel {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: none;
      }

      .scrollbar-hide::-webkit-scrollbar {
          display: none;
      }
      .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
      }
      
      /* Custom Animations */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-scale-in {
        animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-slide-in-right {
        animation: slideInRight 0.4s ease-out forwards;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.30.0",
    "lucide-react": "https://aistudiocdn.com/lucide-react@^0.554.0",
    "recharts": "https://aistudiocdn.com/recharts@^3.4.1"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## types.ts
```ts
export enum TechStack {
  ReactNode = 'React + Node.js',
  VuePython = 'Vue + Python',
  NextGo = 'Next.js + Go',
  AngularJava = 'Angular + Java'
}

export enum Database {
  Postgres = 'PostgreSQL',
  Mongo = 'MongoDB',
  MySQL = 'MySQL',
  Redis = 'Redis'
}

export interface ProjectFeatures {
  auth: boolean;
  payments: boolean;
  search: boolean;
  admin: boolean;
  notifications: boolean;
  analytics: boolean;
}

export interface ProjectConfig {
  idea: string;
  stack: TechStack;
  database: Database;
  features: ProjectFeatures;
}

export interface CustomizationOptions {
  theme: 'Modern' | 'Minimal' | 'Dark' | 'Retro' | 'Corporate';
  primaryColor: 'indigo' | 'blue' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'violet';
  borderRadius: 'rounded-none' | 'rounded-lg' | 'rounded-full';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'security';
  message: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export type PipelineStage = 
  | 'planning' 
  | 'codegen' 
  | 'development' 
  | 'testing' 
  | 'deploy' 
  | 'monitor';

// New Types for Admin/Chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  isCodeUpdate?: boolean; // If true, this message contains a code update
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  lastModified?: number;
  status: 'building' | 'live' | 'archived';
  config: ProjectConfig;
  generatedCode?: string;
  currentStage: number;
  blueprint?: string;
  chatHistory?: ChatMessage[];
}
```

## services/geminiService.ts
```ts
import { GoogleGenAI } from "@google/genai";
import { ProjectConfig, CustomizationOptions, Project } from "../types";

const getAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- HTML Generation & Fallbacks ---

const generateFallbackHtml = (config: ProjectConfig, customization?: CustomizationOptions) => {
  const title = config.idea || "My Project";
  const safeTitle = encodeURIComponent(title);
  
  // Defaults
  const theme = customization?.theme || 'Modern';
  const color = customization?.primaryColor || 'indigo';
  const isDark = theme !== 'Minimal' && theme !== 'Corporate'; // Default to dark for 'Modern', 'Dark', 'Retro'
  
  // Color Mapping
  const colors: Record<string, string> = {
    indigo: '63, 81, 181',
    blue: '59, 130, 246',
    cyan: '6, 182, 212',
    emerald: '16, 185, 129',
    rose: '244, 63, 94',
    amber: '245, 158, 11',
    violet: '139, 92, 246',
  };
  const rgb = colors[color] || '99, 102, 241';

  // Dynamic Image URLs
  const heroImage = `https://image.pollinations.ai/prompt/futuristic%20ui%20interface%20dashboard%20for%20${safeTitle}%20perspective%20isometric%20glassmorphism%20dark%20mode?width=1200&height=800&nologo=true`;

  return `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: { 
              sans: ['Inter', 'sans-serif'],
              display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
              brand: {
                50: 'rgba(${rgb}, 0.05)',
                100: 'rgba(${rgb}, 0.1)',
                500: 'rgb(${rgb})',
                600: 'rgba(${rgb}, 0.8)',
                900: 'rgba(${rgb}, 0.3)',
              }
            },
            animation: {
              'blob': 'blob 7s infinite',
              'marquee': 'marquee 25s linear infinite',
              'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
              blob: {
                '0%': { transform: 'translate(0px, 0px) scale(1)' },
                '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                '100%': { transform: 'translate(0px, 0px) scale(1)' },
              },
              marquee: {
                '0%': { transform: 'translateX(0%)' },
                '100%': { transform: 'translateX(-100%)' },
              },
              float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-20px)' },
              }
            }
          }
        }
      }
    </script>
    <style>
      body {
        background-color: ${isDark ? '#050505' : '#ffffff'};
        color: ${isDark ? '#ffffff' : '#0f172a'};
      }
      .glass {
        background: ${isDark ? 'rgba(20, 20, 20, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
        backdrop-filter: blur(20px);
        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
      }
      .bento-card {
        background: ${isDark ? 'linear-gradient(145deg, rgba(30,30,30,0.6) 0%, rgba(20,20,20,0.4) 100%)' : 'white'};
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .bento-card:hover {
        transform: translateY(-5px) scale(1.01);
        border-color: rgba(${rgb}, 0.5);
        box-shadow: 0 20px 40px -15px rgba(${rgb}, 0.3);
      }
      .mesh-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
        top: 0; left: 0;
      }
      .text-glow {
        text-shadow: 0 0 30px rgba(${rgb}, 0.5);
      }
    </style>
</head>
<body class="antialiased overflow-x-hidden selection:bg-brand-500 selection:text-white">

    <!-- Ambient Mesh Background -->
    <div class="mesh-bg opacity-40">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Nav -->
    <nav class="fixed w-full z-50 top-4 px-4">
        <div class="max-w-7xl mx-auto glass rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl shadow-black/5">
            <div class="font-display font-bold text-xl tracking-tighter flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                ${title.split(' ')[0]}
            </div>
            <div class="hidden md:flex gap-8 text-sm font-medium opacity-80">
                <a href="#" class="hover:text-brand-500 transition-colors">Features</a>
                <a href="#" class="hover:text-brand-500 transition-colors">Pricing</a>
                <a href="#" class="hover:text-brand-500 transition-colors">About</a>
            </div>
            <a href="#" class="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-xl font-medium text-sm transition-all hover:shadow-lg hover:shadow-brand-500/30">
                Get Started
            </a>
        </div>
    </nav>

    <!-- Hero -->
    <section class="relative pt-40 pb-20 px-4 min-h-[90vh] flex flex-col items-center justify-center text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-500 text-xs font-bold tracking-wide uppercase mb-8 animate-fade-in">
            <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            v2.0 Now Live
        </div>
        
        <h1 class="font-display text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]">
            Build the <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 text-glow">Impossible.</span>
        </h1>
        
        <p class="text-lg md:text-xl opacity-70 max-w-2xl mx-auto mb-10 leading-relaxed">
            ${config.idea}. Powered by ${config.stack} and ${config.database}. 
            The future of software is here.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-20 z-10">
             <button class="bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-brand-500/40">
                Start Building Free
             </button>
             <button class="glass px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Watch Demo
             </button>
        </div>

        <!-- 3D Tilted Image -->
        <div class="relative w-full max-w-5xl mx-auto perspective-[2000px] group">
            <div class="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform rotate-x-12 group-hover:rotate-x-0 transition-transform duration-1000 ease-out bg-black/50">
                <img src="${heroImage}" alt="App Interface" class="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                
                <!-- Floating UI Elements -->
                <div class="absolute top-10 right-10 glass p-4 rounded-xl animate-float">
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        <span class="text-xs font-bold">System Online</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Marquee -->
    <div class="py-10 border-y ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-gray-50'} overflow-hidden">
        <div class="flex animate-marquee gap-12 items-center opacity-50 whitespace-nowrap">
            ${[...Array(10)].map(() => `<span class="text-2xl font-display font-bold">TRUSTED BY INNOVATORS</span> <span class="text-brand-500">★</span>`).join(' ')}
        </div>
    </div>

    <!-- Bento Grid Features -->
    <section class="py-32 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <h2 class="text-brand-500 font-bold tracking-widest uppercase text-sm mb-4">Features</h2>
                <h3 class="text-4xl md:text-5xl font-display font-bold">Engineered for Growth</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                <!-- Large Card -->
                <div class="md:col-span-2 bento-card rounded-3xl p-8 relative overflow-hidden group">
                    <div class="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div class="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-500 mb-4">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            </div>
                            <h4 class="text-2xl font-bold mb-2">High Performance Core</h4>
                            <p class="opacity-60 max-w-md">Built on ${config.stack}, ensuring lightning fast response times and infinite scalability.</p>
                        </div>
                    </div>
                    <img src="https://image.pollinations.ai/prompt/abstract%20network%20performance%20graph%20neon?width=600&height=400&nologo=true" class="absolute right-0 bottom-0 w-1/2 opacity-30 group-hover:scale-110 transition-transform duration-700 mix-blend-screen" />
                </div>

                <!-- Tall Card -->
                <div class="md:row-span-2 bento-card rounded-3xl p-8 relative overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-brand-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative z-10">
                         <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <h4 class="text-2xl font-bold mb-2">Enterprise Security</h4>
                        <p class="opacity-60 mb-8">Bank-grade encryption standard.</p>
                        
                        <div class="space-y-3">
                            ${[1,2,3].map(i => `
                            <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                <span class="text-sm font-mono">Shield_Protocol_v${i}.0</span>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Regular Cards -->
                ${Object.keys(config.features).slice(0, 3).map((feature, i) => `
                <div class="bento-card rounded-3xl p-8 group relative overflow-hidden">
                    <h4 class="text-xl font-bold mb-2 capitalize">${feature}</h4>
                    <p class="text-sm opacity-60">Advanced ${feature} module included.</p>
                    <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl group-hover:bg-brand-500/40 transition-colors"></div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-20 border-t ${isDark ? 'border-white/5 bg-black' : 'border-black/5 bg-white'} text-center">
        <h2 class="text-3xl font-display font-bold mb-8">Ready to launch?</h2>
        <p class="opacity-50 text-sm">© 2024 ${title}. Generated by NexusBuild AI.</p>
    </footer>

</body>
</html>`;
}

export const generateProjectBlueprint = async (config: ProjectConfig): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    return `## Architecture Blueprint (Simulation)
    
**Project:** ${config.idea || 'Untitled Project'}
**Stack:** ${config.stack}
**Database:** ${config.database}

### Overview
This system is designed with microservices architecture in mind, utilizing ${config.stack} for optimal performance.

### Core Modules
${Object.entries(config.features).filter(([_, v]) => v).map(([k]) => `- **${k.charAt(0).toUpperCase() + k.slice(1)} Service**: Handles ${k} logic securely.`).join('\n')}

### Security Protocol
- JWT Authentication
- CSRF Protection
- Rate Limiting active
`;
  }

  const prompt = `
    Act as a Senior Solutions Architect. 
    Generate a professional, concise, but highly technical project blueprint for a web application.
    
    Project Idea: "${config.idea}"
    Tech Stack: ${config.stack}
    Database: ${config.database}
    Features Enabled: ${Object.keys(config.features).filter(k => (config.features as any)[k]).join(', ')}
    
    Format the output with clear Markdown. The output must include:
    1. **Executive Summary**: A 2-sentence high-level overview.
    2. **Architecture Diagram (Text Description)**: Describe the data flow.
    3. **Key Technical Components**: List the specific frameworks and libraries to use.
    4. **Database Schema Draft**: List 3-4 key tables/collections and primary fields.
    5. **API Endpoints Strategy**: List 3-4 core REST/GraphQL endpoints.
    6. **Security & Scalability**: Specific measures for this stack.
    
    Keep the tone professional and authoritative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate blueprint.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating blueprint. Please check API Key.";
  }
};

export const improveProjectIdea = async (currentIdea: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return currentIdea;

  const prompt = `
    Act as a Visionary Creative Director & Lead UI Architect.
    Refine the following project idea to be an "Awwwards-winning", visually stunning, and highly ambitious product.
    
    User Input: "${currentIdea}"
    
    Instructions:
    1. Focus heavily on **Visual Aesthetics**. Use keywords like "Glassmorphism", "Neon Glows", "Mesh Gradients", "Bento Grids", "3D Interactive Elements".
    2. Make it sound like a high-end, futuristic SaaS or lifestyle brand.
    3. Mention **Color Palettes** (e.g., "Deep Midnight Blue with Cyber Cyan accents").
    4. Keep the core functionality but describe it in an exciting, persuasive way.
    5. Ensure the description inspires a generated website that is colorful, vibrant, and not "dull" or "corporate".
    6. Output ONLY the improved text, kept to 2-3 sentences max.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || currentIdea;
  } catch (error) {
    console.error("Improve Prompt Error:", error);
    return currentIdea;
  }
};

export const generateLandingPageCode = async (config: ProjectConfig, customization?: CustomizationOptions): Promise<string> => {
  const ai = getAI();
  
  // Fallback immediately if no API key
  if (!ai) {
    return generateFallbackHtml(config, customization);
  }

  const safeTitle = encodeURIComponent(config.idea);

  const prompt = `
    Act as an Award-Winning Webflow/Frontend Developer.
    Create a SINGLE-FILE HTML landing page for a new high-end startup.
    
    PROJECT INFO:
    - Idea: "${config.idea}"
    - Stack: ${config.stack}
    
    VISUAL STYLE (CRITICAL):
    - **Aesthetic**: "Awwwards" Site of the Day style. High-end SaaS, dark mode (unless requested otherwise), futuristic.
    - **Layout**: Use a "Bento Grid" layout for the features section (using CSS Grid with varying col-spans).
    - **Typography**: Use 'Space Grotesk' for headings and 'Inter' for body.
    - **Effects**: 
      1. Glassmorphism (backdrop-filter: blur).
      2. Mesh Gradients (animated background blobs).
      3. 3D Transforms (perspective on hero images).
      4. Infinite Marquee for logos.
    - **Images**: YOU MUST USE Pollinations.ai for dynamic images.
      - Hero: \`https://image.pollinations.ai/prompt/futuristic%203d%20render%20of%20${safeTitle}%20web%20interface%20isometric?width=1200&height=800&nologo=true\`
      - B-Roll: \`https://image.pollinations.ai/prompt/abstract%20tech%20${safeTitle}?width=600&height=600&nologo=true\`
    
    TECH REQUIREMENTS:
    - Use Tailwind CSS via CDN.
    - Add custom Tailwind config in a <script> tag for animations (blob, marquee, float).
    - Ensure it is fully responsive (mobile-first).
    
    Output ONLY the raw HTML code.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    let code = response.text || "";
    // Cleanup markdown formatting if present
    code = code.replace(/```html/g, '').replace(/```/g, '');
    
    // If the response is empty or too short, use fallback
    if (!code || code.length < 100) {
        return generateFallbackHtml(config, customization);
    }
    
    return code;
  } catch (error) {
    console.error("Gemini HTML Gen Error:", error);
    return generateFallbackHtml(config, customization);
  }
};

// --- New Chat & Assistant Features ---

export const chatWithProjectAgent = async (
  message: string, 
  project: Project, 
  history: {role: 'user' | 'ai', text: string}[]
): Promise<string> => {
  const ai = getAI();
  if (!ai) return "I am in offline mode. Please check your API key to enable full AI capabilities.";

  // Use Gemini 3 Pro for complex reasoning as requested
  const modelName = 'gemini-3-pro-preview';

  const systemContext = `
    You are Nexus, an advanced AI DevOps assistant helping a user build a software project.
    
    Current Project Context:
    - Name: ${project.name}
    - Idea: ${project.config.idea}
    - Stack: ${project.config.stack}
    - Database: ${project.config.database}
    - Stage: ${project.currentStage}/5
    
    Role:
    - Answer questions about the tech stack, architecture, or pipeline status.
    - If the user wants to CHANGE the visual design or code of the generated website, you must acknowledge it and say "I'm updating the code for you now..."
    - Keep answers concise, professional, and helpful.
  `;

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemContext,
      }
    });
    
    const response = await chat.sendMessage({
      message: message
    });

    return response.text || "I didn't quite catch that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "My communication link is unstable. Please try again.";
  }
};

export const getFastSuggestion = async (project: Project): Promise<string> => {
  const ai = getAI();
  if (!ai) return "System Ready.";

  // Use Flash Lite for low-latency responses as requested
  const modelName = 'gemini-flash-lite-latest'; // Mapping for 2.5 flash lite

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Give a very short (max 10 words) helpful tip or status check for a developer building a ${project.config.stack} app.`,
    });
    return response.text || "System optimized.";
  } catch (e) {
    return "Ready.";
  }
};

export const refineWebpageCode = async (
  currentCode: string, 
  userRequest: string, 
  project: Project
): Promise<string> => {
  const ai = getAI();
  if (!ai) return currentCode;

  const safeTitle = encodeURIComponent(project.config.idea);

  const prompt = `
    You are a Lead Frontend Engineer. The user wants to modify the specific HTML/Tailwind website code provided below.
    
    User Request: "${userRequest}"
    Project Context: ${project.config.idea}
    
    Instructions:
    1. Analyze the provided HTML carefully.
    2. Apply the user's requested changes (e.g., "change button color to red", "add a contact form section", "make the hero text bigger").
    3. MAINTAIN the rest of the existing design, layout, and responsiveness. Do not completely rewrite the page unless asked.
    4. **CRITICAL**: If you add new images, you MUST use Pollinations.ai URLs: \`https://image.pollinations.ai/prompt/descriptive%20text%20of%20${safeTitle}?nologo=true\`.
    5. Ensure the code remains valid HTML with Tailwind CSS.
    6. Return ONLY the full updated HTML code. No markdown, no explanations.
    
    Current Code:
    ${currentCode}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Efficient for code transformation
      contents: prompt,
    });
    
    let code = response.text || "";
    code = code.replace(/```html/g, '').replace(/```/g, '');
    return code || currentCode;
  } catch (error) {
    console.error("Refine Code Error:", error);
    return currentCode;
  }
};
```

## components/PipelineStepper.tsx
```tsx
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
    <div className="w-full py-6 px-4 mb-8 pt-40">
      <div className="relative flex items-center justify-between w-full max-w-5xl mx-auto">
        
        {/* Floating Robotic Hand Cursor Container */}
        <div 
            className="absolute -top-[9rem] w-48 h-48 z-20 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
            style={{ 
                left: `${(currentStage / (stages.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 40%, black 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 10%, black 40%, black 100%)'
            }}
        >
            <div className="relative w-full h-full animate-float">
                <img 
                    src="https://i.ibb.co/LzxWkr1x/robotic-hand-removebg-preview.png" 
                    alt="Robotic Hand Cursor" 
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    style={{ objectPosition: 'center 85%' }}
                />

                {/* Fingertip Interaction Glow */}
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] shadow-[0_0_15px_#22d3ee]"></div>
                
                {/* Target Reticle on the Icon */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 border border-dashed border-cyan-500/40 rounded-full animate-spin-slow"></div>
            </div>
        </div>

        {/* Connecting Line Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full overflow-hidden transition-colors duration-300">
             <div className="absolute inset-0 bg-slate-300/50 dark:bg-slate-900/50 w-full h-full"></div>
        </div>
        
        {/* Active Progress Line */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-400 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] -z-10 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
        >
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-[2px]"></div>
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
                  relative w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-slate-900
                  ${isActive ? 'border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-white shadow-[0_0_30px_rgba(6,182,212,0.6)] scale-125' : ''}
                  ${isCompleted ? 'border-cyan-500 text-cyan-600 dark:text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30' : 'border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'}
                `}
              >
                {/* Inner Glow for Active State */}
                {isActive && <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-pulse"></div>}
                
                {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
              </div>

              {/* Label */}
              <span 
                className={`
                  mt-4 text-xs md:text-sm font-medium transition-all duration-300 absolute top-14 w-32 text-center tracking-wide
                  ${isActive ? 'text-cyan-600 dark:text-cyan-400 font-bold translate-y-2 text-shadow-glow' : isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'}
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
```

## components/StagePlanning.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { Database, ProjectConfig, ProjectFeatures, TechStack } from '../types';
import { Settings2, Sparkles, ToggleRight, Fingerprint, Cpu, Wand2 } from 'lucide-react';
import { generateProjectBlueprint, improveProjectIdea } from '../services/geminiService';

interface Props {
  onComplete: (config: ProjectConfig, blueprint: string) => void;
}

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleToggle = (key: keyof ProjectFeatures) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImprovePrompt = async () => {
    if (!idea) return;
    setIsEnhancing(true);
    const improved = await improveProjectIdea(idea);
    setIdea(improved);
    setIsEnhancing(false);
  };

  const handleSubmit = async () => {
    if (!idea) return;
    setIsGenerating(true);
    const config: ProjectConfig = { idea, stack, database, features };
    const blueprint = await generateProjectBlueprint(config);
    setIsGenerating(false);
    onComplete(config, blueprint);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Cinematic AI Hero Section */}
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl group bg-slate-900">
        <div className="absolute inset-0 bg-slate-900 animate-pulse"></div>
        <img 
          src="https://image.pollinations.ai/prompt/futuristic%20robotic%20hand%20reaching%20forward%20touching%20a%20glowing%20holographic%20Planning%20step%20icon%20on%20a%20futuristic%20progress%20bar%20interface%20dark%20cyber%20background%20neon%20blue%20high%20detail%208k?width=1200&height=600&nologo=true" 
          alt="AI Planning Interface" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Gradient Overlay for blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3">
          <div className="flex items-center space-x-2 text-cyan-400 mb-2 animate-slide-in-right">
            <Cpu size={20} />
            <span className="text-xs font-mono uppercase tracking-widest">System Initialization</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            Architect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Vision</span>
          </h2>
          <p className="text-slate-300 max-w-lg text-sm md:text-base opacity-90">
            Define the parameters of your next breakthrough. Nexus AI will analyze requirements and construct the optimal pipeline.
          </p>
        </div>

        {/* Holographic Decoration */}
        <div className="absolute top-6 right-6 flex items-center space-x-2 bg-slate-950/50 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-mono">
           <Fingerprint size={12} className="animate-pulse" />
           <span>ID: NEX-PLAN-01</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-xl border-l-4 border-cyan-500 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Settings2 className="mr-2 text-cyan-600 dark:text-cyan-400" /> Project Parameters
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-sm mb-2">What are we building?</label>
                <div className="relative">
                  <textarea 
                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-300 h-24 resize-none placeholder-slate-400 dark:placeholder-slate-600 mb-2 shadow-sm"
                    placeholder="e.g., A decentralized marketplace for digital art using smart contracts..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                  />
                  {idea && (
                    <button
                        onClick={handleImprovePrompt}
                        disabled={isEnhancing}
                        className={`absolute bottom-4 right-4 text-xs flex items-center px-3 py-1.5 rounded-full border transition-all duration-300 ${isEnhancing ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-500/50 text-purple-600 dark:text-purple-300' : 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white hover:scale-105 shadow-lg'}`}
                    >
                        {isEnhancing ? <span className="animate-spin mr-2">✦</span> : <Wand2 size={12} className="mr-2" />}
                        {isEnhancing ? 'Optimizing...' : 'Enhance Prompt'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-sm mb-2">Tech Stack</label>
                  <select 
                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-all shadow-sm"
                    value={stack}
                    onChange={(e) => setStack(e.target.value as TechStack)}
                  >
                    {Object.values(TechStack).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-sm mb-2">Database</label>
                  <select 
                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-all shadow-sm"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value as Database)}
                  >
                    {Object.values(Database).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-sm mb-3">System Modules</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(features).map((f) => {
                    const key = f as keyof ProjectFeatures;
                    const active = features[key];
                    return (
                      <button
                        key={key}
                        onClick={() => handleToggle(key)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 active:scale-95 shadow-sm ${
                          active 
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-500/50 text-cyan-600 dark:text-cyan-400' 
                          : 'bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="capitalize font-medium">{f}</span>
                        <ToggleRight className={`transition-transform duration-300 ${active ? 'text-cyan-600 dark:text-cyan-400 scale-110' : 'text-slate-400 dark:text-slate-600'}`} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={!idea || isGenerating}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.98]
              ${!idea || isGenerating 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25'
              }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Requirements...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Blueprint</span>
              </>
            )}
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-xl h-full p-6 relative overflow-hidden animate-slide-in-right" style={{ animationDelay: '200ms' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse-slow"></div>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
              Live Prompt Preview
            </h3>

            <div className="font-mono text-sm space-y-4 text-slate-600 dark:text-slate-400">
              <div className="flex gap-2">
                <span className="text-blue-500 dark:text-blue-400">{'>'}</span>
                <span className="text-slate-800 dark:text-slate-200">Initializing project spec...</span>
              </div>
              <div className="pl-4 border-l border-slate-300 dark:border-slate-800 space-y-2">
                <p className="transition-all duration-300"><span className="text-purple-600 dark:text-purple-400">TARGET:</span> "{idea || 'Waiting for input...'}"</p>
                <p className="transition-all duration-300"><span className="text-cyan-600 dark:text-cyan-400">STACK:</span> {stack}</p>
                <p className="transition-all duration-300"><span className="text-emerald-600 dark:text-green-400">DB_LAYER:</span> {database}</p>
              </div>
              
              <div className="mt-4">
                <span className="text-slate-500">// Active Modules</span>
                <div className="flex flex-wrap gap-2 mt-2 transition-all duration-300">
                  {Object.entries(features).map(([k, v]) => (
                     v && <span key={k} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 animate-scale-in">
                       {k.toUpperCase()}
                     </span>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs text-slate-500 dark:text-slate-600 text-center border-t border-slate-200 dark:border-slate-800 pt-4">
                  AI Model: Gemini 2.5 Flash • Secure Mode Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## components/StageCodeGen.tsx
```tsx
import React, { useEffect, useState, useRef } from 'react';
import { FileCode, Lock } from 'lucide-react';
import { ProjectConfig, TechStack, Database } from '../types';

interface Props {
  onComplete: () => void;
  blueprint: string;
  config: ProjectConfig;
}

const getFilesForStack = (stack: TechStack): string[] => {
  switch (stack) {
    case TechStack.VuePython:
      return [
        'backend/app.py',
        'backend/requirements.txt',
        'backend/models.py',
        'frontend/src/main.js',
        'frontend/src/App.vue',
        'frontend/package.json',
      ];
    case TechStack.NextGo:
      return [
        'api/main.go',
        'api/go.mod',
        'api/routes/routes.go',
        'web/pages/index.tsx',
        'web/components/Layout.tsx',
        'web/package.json',
      ];
    case TechStack.AngularJava:
      return [
        'src/main/java/com/nexus/App.java',
        'src/main/resources/application.yml',
        'pom.xml',
        'src/app/app.component.ts',
        'src/app/app.module.ts',
        'angular.json',
      ];
    case TechStack.ReactNode:
    default:
      return [
        'src/config/database.ts',
        'src/models/User.ts',
        'src/controllers/authController.ts',
        'src/routes/api.ts',
        'src/middleware/security.ts',
        'package.json',
      ];
  }
};

const getSnippets = (stack: TechStack, db: Database): string[] => {
  const snippets = [];
  if (db === Database.Mongo) {
    snippets.push(`mongoose.connect(process.env.MONGO_URI, {\n  useNewUrlParser: true,\n  useUnifiedTopology: true\n});`);
  } else if (db === Database.Postgres) {
    snippets.push(`const pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  ssl: { rejectUnauthorized: false }\n});`);
  } else {
    snippets.push(`// Initializing ${db} connection pool...\nawait db.connect();`);
  }
  switch (stack) {
    case TechStack.VuePython:
      snippets.push(`@app.route('/api/data', methods=['GET'])\ndef get_data():\n    return jsonify({'status': 'success', 'data': data})`);
      snippets.push(`<template>\n  <div class="dashboard">\n    <h1>{{ title }}</h1>\n  </div>\n</template>`);
      break;
    case TechStack.NextGo:
      snippets.push(`func main() {\n  r := gin.Default()\n  r.GET("/ping", func(c *gin.Context) {\n    c.JSON(200, gin.H{"message": "pong"})\n  })\n  r.Run()\n}`);
      snippets.push(`export default function Home() {\n  return <div>Welcome to Nexus App</div>\n}`);
      break;
    case TechStack.AngularJava:
      snippets.push(`@RestController\n@RequestMapping("/api")\npublic class ApiController {\n    @GetMapping("/status")\n    public ResponseEntity<String> status() {\n        return ResponseEntity.ok("Online");\n    }\n}`);
      snippets.push(`@Component({\n  selector: 'app-root',\n  templateUrl: './app.component.html'\n})\nexport class AppComponent {}`);
      break;
    default:
      snippets.push(`const app = express();\napp.use(cors());\napp.use(express.json());`);
      snippets.push(`export const UserSchema = new Schema({\n  email: { type: String, required: true, unique: true },\n  role: { type: String, default: 'user' }\n});`);
      break;
  }
  return snippets;
};

export const StageCodeGen: React.FC<Props> = ({ onComplete, blueprint, config }) => {
  const [currentFile, setCurrentFile] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [progress, setProgress] = useState(0);
  const codeContainerRef = useRef<HTMLPreElement>(null);

  const MOCK_FILES = getFilesForStack(config.stack);
  const CODE_SNIPPETS = getSnippets(config.stack, config.database);

  useEffect(() => {
    let fileIndex = 0;
    let charIndex = 0;
    let currentSnippet = CODE_SNIPPETS[0];
    
    const fileInterval = setInterval(() => {
      if (fileIndex >= MOCK_FILES.length) {
        clearInterval(fileInterval);
        setTimeout(onComplete, 1000);
        return;
      }

      setCurrentFile(MOCK_FILES[fileIndex]);
      currentSnippet = CODE_SNIPPETS[fileIndex % CODE_SNIPPETS.length];
      setCodeContent('');
      charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex < currentSnippet.length) {
          setCodeContent(prev => prev + currentSnippet.charAt(charIndex));
          charIndex++;
          if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
          }
        } else {
          clearInterval(typeInterval);
        }
      }, 15);

      setProgress(((fileIndex + 1) / MOCK_FILES.length) * 100);
      fileIndex++;

    }, 2200);

    return () => clearInterval(fileInterval);
  }, [config.stack, config.database]);

  return (
    <div className="flex flex-col h-[500px] gap-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900/50 border-l-4 border-blue-500 p-4 rounded-r-lg flex justify-between items-center shadow-sm">
        <div>
          <h3 className="text-blue-500 dark:text-blue-400 text-sm font-bold mb-1">AI ARCHITECT BLUEPRINT</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-1">{blueprint.split('\n')[0] || 'Generating architecture...'}</p>
        </div>
        <div className="text-xs font-mono text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
          {config.stack} • {config.database}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 glass-panel rounded-lg p-4 overflow-hidden flex flex-col">
          <h4 className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-4 uppercase tracking-wider flex items-center">
            Generated Assets
            <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 rounded text-slate-600 dark:text-slate-500">v0.1.0-alpha</span>
          </h4>
          <div className="space-y-2">
            {MOCK_FILES.map((file, idx) => {
               const isActive = file === currentFile;
               const isDone = MOCK_FILES.indexOf(currentFile) > idx || progress === 100;
               
               return (
                 <div key={file} className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${isActive ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/10 rounded p-1' : isDone ? 'text-emerald-600/80 dark:text-emerald-500/80' : 'text-slate-500 dark:text-slate-600'}`}>
                   <FileCode size={14} className="shrink-0" />
                   <span className="truncate">{file}</span>
                   {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
                 </div>
               )
            })}
          </div>
        </div>

        <div className="md:col-span-2 glass-panel rounded-lg p-0 overflow-hidden flex flex-col border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 relative shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
             <div className="flex items-center space-x-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center">
               <Lock size={10} className="mr-1 text-slate-500 dark:text-slate-600" /> {currentFile || 'initializing_environment...'}
             </div>
          </div>
          <pre ref={codeContainerRef} className="flex-1 p-4 font-mono text-sm text-slate-800 dark:text-cyan-300 overflow-y-auto scrollbar-hide leading-relaxed selection:bg-cyan-500/30">
            <code>
              {codeContent}
              <span className="animate-pulse inline-block w-2 h-4 bg-cyan-500 ml-1 align-middle"></span>
            </code>
          </pre>
          
          <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full mt-auto relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## components/StageDevelopment.tsx
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, FolderOpen, Check, Loader2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const BUILD_STEPS = [
  'Installing dependencies (npm install)...',
  'Validating package.json...',
  'Resolving dependency tree...',
  'Fetching @secure/auth-module...',
  'Compiling TypeScript sources...',
  'Optimizing static assets...',
  'Minifying CSS bundles...',
  'Linking modules...',
  'Build successful.'
];

export const StageDevelopment: React.FC<Props> = ({ onComplete }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= BUILD_STEPS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
        return;
      }

      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        level: step === BUILD_STEPS.length - 1 ? 'success' : 'info',
        message: BUILD_STEPS[step]
      };

      setLogs(prev => [...prev, newLog]);
      step++;
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-[500px] grid grid-cols-12 gap-4 animate-fade-in">
      {/* File Tree (Static Mock) */}
      <div className="col-span-4 glass-panel rounded-lg p-4 hidden md:block">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-4 flex items-center">
          <FolderOpen size={14} className="mr-2" /> Project Structure
        </h3>
        <ul className="text-sm space-y-2 font-mono text-slate-600 dark:text-slate-500">
          <li className="text-blue-500 dark:text-blue-400">/src</li>
          <li className="pl-4">/components</li>
          <li className="pl-4">/api</li>
          <li className="pl-4">app.tsx</li>
          <li className="text-yellow-600">package.json</li>
          <li className="text-slate-500 dark:text-slate-600">tsconfig.json</li>
          <li className="text-slate-500 dark:text-slate-600">README.md</li>
          <li className="pl-4 mt-2 text-slate-500 dark:text-slate-600 animate-pulse">...building dist/</li>
        </ul>
      </div>

      {/* Terminal Output */}
      <div className="col-span-12 md:col-span-8 bg-slate-900 dark:bg-slate-950 rounded-lg border border-slate-700 dark:border-slate-800 flex flex-col font-mono text-sm overflow-hidden shadow-2xl">
        <div className="bg-slate-800 dark:bg-slate-900 p-2 border-b border-slate-700 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center text-slate-300 dark:text-slate-400">
            <Terminal size={14} className="mr-2" />
            <span>build_agent@nexus:~</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-2 scrollbar-hide">
          {logs.map(log => (
            <div key={log.id} className="flex items-start space-x-2 animate-fade-in">
              <span className="text-slate-500 dark:text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={`
                ${log.level === 'info' ? 'text-slate-300 dark:text-slate-300' : ''}
                ${log.level === 'success' ? 'text-emerald-400 font-bold' : ''}
              `}>
                {log.level === 'success' ? '✓ ' : '> '}
                {log.message}
              </span>
            </div>
          ))}
          {logs.length < BUILD_STEPS.length && (
             <div className="flex items-center text-cyan-500 mt-2">
               <Loader2 className="animate-spin mr-2" size={14} />
               Processing...
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
```

## components/StageTesting.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Bug } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface TestItem {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  type: 'unit' | 'integration' | 'security';
}

const TESTS: TestItem[] = [
  { id: 1, name: 'Unit Tests: User Authentication', status: 'pending', type: 'unit' },
  { id: 2, name: 'Unit Tests: Payment Gateway Mock', status: 'pending', type: 'unit' },
  { id: 3, name: 'Integration: API Endpoints', status: 'pending', type: 'integration' },
  { id: 4, name: 'Security: SQL Injection Scan', status: 'pending', type: 'security' },
  { id: 5, name: 'Security: Dependency Audit', status: 'pending', type: 'security' },
  { id: 6, name: 'Performance: Load Simulation', status: 'pending', type: 'integration' },
];

export const StageTesting: React.FC<Props> = ({ onComplete }) => {
  const [items, setItems] = useState<TestItem[]>(TESTS);
  
  useEffect(() => {
    let currentIndex = 0;
    
    const runNext = () => {
      if (currentIndex >= items.length) {
        setTimeout(onComplete, 1500);
        return;
      }
      setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'running' } : item));
      setTimeout(() => {
        setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, status: 'pass' } : item));
        currentIndex++;
        runNext();
      }, 1000);
    };

    runNext();
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border-t-4 border-purple-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <ShieldCheck className="mr-2 text-purple-600 dark:text-purple-400" /> Security Audit
            </h3>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs rounded uppercase border border-purple-200 dark:border-purple-500/30">Automated</span>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Vulnerabilities Found</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">0</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Code Coverage</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">94%</span>
             </div>
             <div className="p-4 rounded bg-slate-900/50 dark:bg-slate-800/50 border border-slate-700 text-xs text-slate-300 dark:text-slate-400 font-mono">
                > Scanning dependencies... OK<br/>
                > Checking for hardcoded secrets... OK<br/>
                > Verifying API authorization... OK
             </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Bug className="mr-2 text-cyan-600 dark:text-cyan-400" /> Test Runner
          </h3>
          <div className="space-y-3">
            {items.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 transition-all">
                <div className="flex items-center">
                  {test.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 mr-3"></div>}
                  {test.status === 'running' && <div className="w-4 h-4 rounded-full border-2 border-t-cyan-500 border-slate-300 dark:border-slate-600 animate-spin mr-3"></div>}
                  {test.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3" />}
                  <span className={`text-sm ${test.status === 'running' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{test.name}</span>
                </div>
                <span className="text-xs uppercase text-slate-400 dark:text-slate-600 font-bold tracking-wider">{test.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## components/StageDeploy.tsx
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Rocket, ExternalLink, Palette, RefreshCw, Sparkles, Download, Code, Eye, FileCode } from 'lucide-react';
import { ProjectConfig, CustomizationOptions } from '../types';
import { GeneratedWebsitePreview } from './GeneratedWebsitePreview';
import { generateLandingPageCode } from '../services/geminiService';

interface Props {
  onComplete: () => void;
  config: ProjectConfig;
  generatedCode?: string;
  setGeneratedCode: (code: string) => void;
}

const CodeViewer: React.FC<{ code: string }> = ({ code }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const containerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setDisplayedCode('');
    let i = 0;
    const chunkSize = 5;
    const interval = setInterval(() => {
      if (i >= code.length) {
        clearInterval(interval);
        setDisplayedCode(code);
        return;
      }
      setDisplayedCode(code.substring(0, i + chunkSize));
      i += chunkSize;
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 5);

    return () => clearInterval(interval);
  }, [code]);

  const highlightCode = (source: string) => {
    const tokens = source.split(/(<[^>]+>)/g);
    
    return tokens.map((token, index) => {
      if (token.startsWith('<') && token.endsWith('>')) {
        const isClosing = token.startsWith('</');
        const content = token.substring(isClosing ? 2 : 1, token.length - 1);
        const parts = content.split(' ');
        const tagName = parts[0];
        const attrs = parts.slice(1).join(' ');

        return (
          <span key={index} className="text-blue-500 dark:text-blue-400">
            &lt;{isClosing && '/'}<span className="text-pink-600 dark:text-pink-400">{tagName}</span>
            {attrs && (
               <span className="text-purple-600 dark:text-purple-300">
                 {attrs.split(/(\s+|=)/).map((attrPart, i) => {
                    if (attrPart.startsWith('"') || attrPart.startsWith("'")) {
                        return <span key={i} className="text-yellow-600 dark:text-yellow-300">{attrPart}</span>;
                    }
                    return attrPart;
                 })}
               </span>
            )}
            &gt;
          </span>
        );
      }
      return <span key={index} className="text-slate-800 dark:text-slate-200">{token}</span>;
    });
  };

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-[#0d1117] overflow-hidden flex flex-col font-mono text-sm shadow-inner relative group border-l border-slate-200 dark:border-none">
      <div className="flex items-center px-4 py-2 bg-slate-200 dark:bg-[#161b22] border-b border-slate-300 dark:border-[#30363d] text-xs text-slate-500 dark:text-slate-400 select-none">
         <FileCode size={12} className="mr-2 text-blue-500" />
         <span>index.html</span>
         <span className="ml-auto text-slate-500 dark:text-slate-600">UTF-8</span>
      </div>
      
      <pre ref={containerRef} className="flex-1 p-4 overflow-auto scrollbar-hide leading-relaxed">
        <code>
          {displayedCode.split('\n').map((line, i) => (
            <div key={i} className="table-row">
               <span className="table-cell text-right pr-4 text-slate-400 dark:text-slate-700 select-none">{i + 1}</span>
               <span className="table-cell whitespace-pre-wrap">{highlightCode(line)}</span>
            </div>
          ))}
          <div className="animate-pulse w-2 h-5 bg-blue-500 inline-block align-middle ml-1"></div>
        </code>
      </pre>
      
      <div className="absolute bottom-4 right-4 bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Read-Only View
      </div>
    </div>
  );
};

export const StageDeploy: React.FC<Props> = ({ onComplete, config, generatedCode, setGeneratedCode }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
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

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.idea.replace(/\s+/g, '-').toLowerCase()}-landing.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-xl border-l-4 border-emerald-500 animate-scale-in" style={{ animationDelay: '100ms' }}>
             <div className="flex items-center mb-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mr-3">
                    <Rocket size={20} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Deployment Ready</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Infrastructure provisioned</p>
                 </div>
             </div>
             
             <div className="space-y-3">
                <button 
                  onClick={onComplete}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                >
                  Launch Live Version <Rocket size={20} className="ml-2" />
                </button>
                
                <button 
                  onClick={handleDownload}
                  className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center active:scale-95"
                >
                  <Download size={16} className="mr-2" /> Download Source Code
                </button>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border-l-4 border-cyan-500 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                 <Palette className="mr-2 text-cyan-600 dark:text-cyan-400" size={20} /> Design Studio
               </h3>
               <span className="text-xs bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 px-2 py-1 rounded uppercase font-bold">Beta</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">Visual Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Modern', 'Minimal', 'Dark', 'Corporate', 'Retro'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setCustomization(prev => ({ ...prev, theme: theme as any }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border active:scale-95 ${
                        customization.theme === theme
                          ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">Primary Accent</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCustomization(prev => ({ ...prev, primaryColor: c.id }))}
                      className={`w-8 h-8 rounded-full transition-transform duration-200 ${c.class} ${
                        customization.primaryColor === c.id 
                          ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_currentColor]' 
                          : 'opacity-60 hover:opacity-100 hover:scale-105 active:scale-95'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center transition-all duration-200 active:scale-95 border ${
                   isRegenerating 
                   ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                   : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 border-slate-200 dark:border-slate-600 hover:border-cyan-500/50'
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

        <div className="lg:col-span-7 h-[650px] relative group animate-slide-in-right flex flex-col">
           <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-slate-500 dark:text-slate-400 font-medium flex items-center">
               <ExternalLink size={16} className="mr-2" /> Staging Environment
             </h3>
             
             <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1 border border-slate-300 dark:border-slate-800">
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeTab === 'preview' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Eye size={14} className="mr-1.5" /> Visual Preview
                </button>
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeTab === 'code' 
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Code size={14} className="mr-1.5" /> Source Code
                </button>
             </div>
           </div>

           <div className="flex-1 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden relative bg-slate-100 dark:bg-slate-900/50">
             
             <div className={`absolute inset-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm z-30 flex items-center justify-center transition-opacity duration-300 ${isRegenerating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center animate-scale-in">
                    <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                    <p className="text-slate-900 dark:text-white font-bold text-lg">Applying Design System...</p>
                    <p className="text-cyan-600 dark:text-cyan-400 text-sm mt-1">Generating optimized HTML/CSS</p>
                </div>
             </div>
             
             <div className={`w-full h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                <GeneratedWebsitePreview config={config} generatedCode={generatedCode} />
             </div>

             {activeTab === 'code' && generatedCode && (
                <CodeViewer code={generatedCode} />
             )}
             
             {activeTab === 'code' && !generatedCode && (
               <div className="w-full h-full flex items-center justify-center text-slate-500 flex-col">
                  <RefreshCw className="animate-spin mb-2" />
                  <span>Waiting for code generation...</span>
               </div>
             )}

           </div>
           
           <div className="mt-2 flex items-center justify-between text-xs text-slate-500 px-2 font-mono">
              <span className="flex items-center">
                 <span className={`w-2 h-2 rounded-full mr-2 ${isRegenerating ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                 {isRegenerating ? 'Compiling assets...' : 'System Stable'}
              </span>
              <span>{activeTab === 'code' ? 'READ-ONLY' : 'INTERACTIVE'}</span>
           </div>
        </div>

      </div>
    </div>
  );
};
```

## components/StageMonitor.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { Activity, Users, Cpu, Globe, Zap, Shield, ExternalLink, Map, Settings, AlertTriangle, CheckCircle, Server } from 'lucide-react';
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

const INITIAL_REGIONS: ServerRegion[] = [
  { id: 'us-east', name: 'N. Virginia (US-EAST-1)', x: 26, y: 38, status: 'active', latency: 24, load: 45 },
  { id: 'us-west', name: 'California (US-WEST-1)', x: 16, y: 40, status: 'active', latency: 45, load: 30 },
  { id: 'eu-cent', name: 'Frankfurt (EU-CENTRAL)', x: 53, y: 32, status: 'active', latency: 88, load: 60 },
  { id: 'asia-se', name: 'Singapore (AP-SOUTHEAST)', x: 78, y: 62, status: 'degraded', latency: 150, load: 85 },
  { id: 'asia-ne', name: 'Tokyo (AP-NORTHEAST)', x: 86, y: 38, status: 'active', latency: 120, load: 40 },
  { id: 'sa-east', name: 'São Paulo (SA-EAST-1)', x: 32, y: 75, status: 'active', latency: 180, load: 25 },
];

export const StageMonitor: React.FC<Props> = ({ config, generatedCode }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [regions, setRegions] = useState<ServerRegion[]>(INITIAL_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const [thresholds, setThresholds] = useState({
    cpu: 80,
    latency: 200,
    errors: 2
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
        const spike = Math.random() > 0.9 ? 40 : 0;
        const newItem = {
          time: newTime,
          cpu: Math.min(100, 30 + Math.random() * 20 + spike), 
          requests: 150 + Math.random() * 100,
          memory: 45 + Math.random() * 10
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
  }, [thresholds, stats.avgLatency]);

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

              <div className="flex-1 relative bg-slate-100 dark:bg-[#0f172a] overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20" 
                      style={{ backgroundImage: 'linear-gradient(rgba(51, 65, 85, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 65, 85, 0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                 </div>
                 
                 <div className="absolute inset-0 w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(6,182,212,0.1)_360deg)] animate-[spin_4s_linear_infinite] rounded-full scale-150 opacity-30 pointer-events-none"></div>

                 <div className="relative w-full h-full" style={{ paddingBottom: '50%' }}>
                     <svg 
                        viewBox="0 0 1000 500" 
                        className="absolute inset-0 w-full h-full text-slate-400 dark:text-slate-700/50 fill-current pointer-events-none"
                     >
                        <path d="M167,133c-3,-1 -6,-3 -8,-6c-5,-4 -4,-6 1,-6c4,0 7,2 9,3c7,5 6,5 3,7c-1,1 -3,1 -5,2zM155,108c-3,-2 -6,-7 -5,-9c0,-1 2,-2 4,-1c3,1 5,4 5,8c0,2 -2,3 -4,2zM224,115c-1,-3 -1,-5 1,-7c2,-3 5,-2 5,1c0,2 -2,5 -5,6c-1,0 -1,0 -1,0zM245,85c-3,-4 -3,-8 -1,-11c1,-2 4,-3 6,-1c3,3 2,6 -1,11c-1,2 -3,3 -4,1zM657,364c-3,-2 -6,-6 -6,-8c-1,-2 1,-4 3,-3c3,1 6,5 6,8c-1,3 -2,4 -3,3zM678,358c-2,-2 -2,-4 0,-6c2,-2 5,-2 6,0c2,2 1,4 -2,6c-1,1 -3,1 -4,0zM748,354c-1,-1 -1,-3 1,-4c2,-1 5,0 5,2c0,3 -3,3 -6,2zM854,342c-2,-2 -2,-4 0,-5c2,-1 4,-1 5,1c1,2 0,4 -2,5c-2,1 -3,0 -3,-1zM286,415c-1,-1 -2,-3 0,-4c1,-1 4,0 5,2c0,1 -2,3 -5,2zM167,133c-3,-1 -6,-3 -8,-6c-5,-4 -4,-6 1,-6c4,0 7,2 9,3c7,5 6,5 3,7c-1,1 -3,1 -5,2zM155,108c-3,-2 -6,-7 -5,-9c0,-1 2,-2 4,-1c3,1 5,4 5,8c0,2 -2,3 -4,2zM224,115c-1,-3 -1,-5 1,-7c2,-3 5,-2 5,1c0,2 -2,5 -5,6c-1,0 -1,0 -1,0zM245,85c-3,-4 -3,-8 -1,-11c1,-2 4,-3 6,-1c3,3 2,6 -1,11c-1,2 -3,3 -4,1z" opacity="0.5" />
                        <pattern id="dotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                             <circle cx="2" cy="2" r="1.5" className="text-slate-400 dark:text-slate-700" fill="currentColor" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#dotPattern)" opacity="0.5" />
                     </svg>
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
                          <span className={`absolute w-full h-full rounded-full opacity-75 animate-ping duration-1000 ${region.status === 'degraded' ? 'bg-yellow-500' : 'bg-cyan-500'}`}></span>
                          <span className={`absolute w-full h-full rounded-full opacity-30 animate-pulse duration-2000 ${region.status === 'degraded' ? 'bg-yellow-500' : 'bg-cyan-500'}`}></span>
                          <div className={`relative w-2.5 h-2.5 rounded-full border border-black/50 ${region.status === 'degraded' ? 'bg-yellow-400' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'}`}></div>
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
                <div className="flex items-center"><Settings size={16} className="mr-2 text-slate-400" /> Threshold Config</div>
                {alerts.length > 0 && <span className="text-xs text-red-500 dark:text-red-400 animate-pulse flex items-center"><AlertTriangle size={12} className="mr-1"/> {alerts.length} Alerts</span>}
              </h3>
              
              <div className="flex-1 flex gap-6 overflow-hidden">
                 <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                    <div>
                       <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Max CPU Load</span>
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
                          <span className="text-slate-500 dark:text-slate-400">Latency Tolerance</span>
                          <span className="text-purple-500 dark:text-purple-400">{thresholds.latency}ms</span>
                       </div>
                       <input 
                         type="range" min="50" max="500" value={thresholds.latency}
                         onChange={(e) => setThresholds(p => ({...p, latency: parseInt(e.target.value)}))}
                         className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                       />
                    </div>
                 </div>

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
           
           <div className="glass-panel p-5 rounded-xl h-1/3 flex flex-col min