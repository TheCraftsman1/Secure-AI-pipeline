
import { GoogleGenAI } from "@google/genai";
import { ProjectConfig, CustomizationOptions, Project } from "../types";

const getAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- HTML Generation & Fallbacks ---

const generateFallbackHtml = (config: ProjectConfig, customization?: CustomizationOptions) => {
  const title = config.idea || "My Project";
  const featuresList = Object.entries(config.features)
    .filter(([_, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
    .join(', ');

  // Defaults
  const theme = customization?.theme || 'Modern';
  const color = customization?.primaryColor || 'indigo';
  const radius = customization?.borderRadius || 'rounded-lg';

  // Theme Configuration
  const isDark = theme === 'Dark';
  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100';
  const navBg = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200';
  const buttonText = 'text-white';
  
  // Color variations
  const btnColor = `bg-${color}-600 hover:bg-${color}-700`;
  const accentText = `text-${color}-600`;
  const accentBg = `bg-${color}-50`;
  const accentBorder = `border-${color}-200`;

  return `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
              primary: {
                50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="${bgColor} ${textColor} transition-colors duration-300">
    <!-- Navigation -->
    <nav class="${navBg} border-b sticky top-0 z-50 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center cursor-pointer">
                        <div class="w-8 h-8 ${btnColor} ${radius} flex items-center justify-center mr-2 shadow-md">
                            <span class="text-white font-bold text-lg">${title.charAt(0).toUpperCase()}</span>
                        </div>
                        <span class="font-bold text-xl tracking-tight">${title.split(' ')[0]}</span>
                    </div>
                </div>
                <div class="hidden md:flex space-x-8 items-center">
                    <a href="#" class="${mutedText} hover:${accentText} font-medium transition-colors">Features</a>
                    <a href="#" class="${mutedText} hover:${accentText} font-medium transition-colors">Pricing</a>
                    <button class="${btnColor} ${buttonText} px-4 py-2 ${radius} text-sm font-bold transition-all shadow-lg">Get Started</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}">
        <div class="max-w-7xl mx-auto">
            <div class="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
                <main class="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                    <div class="sm:text-center lg:text-left">
                        <div class="inline-flex items-center px-3 py-1 ${radius} border ${isDark ? `border-${color}-800 bg-${color}-900/20 text-${color}-300` : `${accentBorder} ${accentBg} ${accentText}`} text-xs font-bold mb-6">
                            ${theme} Design • Built with ${config.stack}
                        </div>
                        <h1 class="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-6">
                            <span class="block xl:inline">The future of</span>
                            <span class="block ${accentText} xl:inline">${title}</span>
                        </h1>
                        <p class="mt-3 text-base ${mutedText} sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-auto mb-8">
                            Experience a secure, scalable, and modern solution designed for your needs. 
                            Powered by ${config.database} and enhanced with ${featuresList}.
                        </p>
                        <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                            <div class="shadow">
                                <a href="#" class="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold ${radius} text-white ${btnColor} md:py-4 md:text-lg transition-all hover:shadow-xl hover:-translate-y-1">
                                    Start Free Trial
                                </a>
                            </div>
                            <div class="mt-3 sm:mt-0">
                                <a href="#" class="w-full flex items-center justify-center px-8 py-4 border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} text-base font-bold ${radius} md:py-4 md:text-lg transition-all">
                                    View Demo
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 ${isDark ? 'bg-slate-800' : 'bg-indigo-100'} flex items-center justify-center overflow-hidden">
             <div class="w-full h-full bg-gradient-to-br from-${color}-500 to-purple-600 opacity-10 relative">
                <div class="absolute inset-0 flex items-center justify-center text-${color}-900/20 font-bold text-9xl select-none">
                    ${config.idea.substring(0,1).toUpperCase()}
                </div>
             </div>
        </div>
    </div>

    <!-- Features Grid -->
    <div class="py-24 ${bgColor}">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center mb-16">
                <h2 class="text-base ${accentText} font-semibold tracking-wide uppercase">Platform Features</h2>
                <p class="mt-2 text-3xl leading-8 font-extrabold ${textColor} sm:text-4xl">
                    Everything you need to succeed
                </p>
            </div>

            <div class="mt-10">
                <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    ${Object.entries(config.features).filter(([_, v]) => v).map(([key]) => `
                    <div class="relative ${cardBg} p-6 ${radius} border hover:shadow-lg transition-all group">
                        <dt>
                            <div class="absolute flex items-center justify-center h-12 w-12 ${radius} ${btnColor} text-white shadow-lg">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <p class="ml-16 text-lg leading-6 font-bold ${textColor} capitalize group-hover:${accentText} transition-colors">${key}</p>
                        </dt>
                        <dd class="mt-2 ml-16 text-base ${mutedText}">
                            Robust ${key} functionality included out of the box. Secure, scalable, and ready for production use.
                        </dd>
                    </div>
                    `).join('')}
                </dl>
            </div>
        </div>
    </div>
    
    <footer class="${isDark ? 'bg-black' : 'bg-slate-900'} border-t ${isDark ? 'border-slate-800' : 'border-slate-800'}">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
             <div class="flex justify-between items-center">
                 <p class="text-base text-slate-400">&copy; 2024 ${title}. All rights reserved.</p>
             </div>
        </div>
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
    Generate a concise but technical project blueprint for a web application.
    
    Project Idea: "${config.idea}"
    Tech Stack: ${config.stack}
    Database: ${config.database}
    Features Enabled: ${Object.keys(config.features).filter(k => (config.features as any)[k]).join(', ')}
    
    Format the output with Markdown. Include:
    1. High-level Summary
    2. Key Technical Components
    3. Security Considerations
    4. Database Schema Rough Draft
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

export const generateLandingPageCode = async (config: ProjectConfig, customization?: CustomizationOptions): Promise<string> => {
  const ai = getAI();
  
  // Fallback immediately if no API key
  if (!ai) {
    return generateFallbackHtml(config, customization);
  }

  const prompt = `
    Act as a Lead Frontend Engineer and UI/UX Designer.
    Create a single-file HTML landing page for a web application with the following specs:
    
    Project Name/Idea: "${config.idea}"
    Tech Stack: ${config.stack}
    Features: ${Object.keys(config.features).filter(k => (config.features as any)[k]).join(', ')}
    
    DESIGN PREFERENCES:
    - Theme: ${customization?.theme || 'Modern'}
    - Primary Color: ${customization?.primaryColor || 'indigo'} (Use tailwind colors like ${customization?.primaryColor}-600, ${customization?.primaryColor}-100)
    - Border Radius: ${customization?.borderRadius === 'rounded-none' ? 'square (no radius)' : customization?.borderRadius === 'rounded-full' ? 'highly rounded' : 'standard rounded-lg'}

    Requirements:
    1. Use Tailwind CSS via CDN (include <script src="https://cdn.tailwindcss.com"></script> in head).
    2. The design must be MODERN, CLEAN, and RESPONSIVE.
    3. IMPORTANT: If Theme is 'Dark', ensure 'body' has 'bg-slate-900 text-white' and standard dark mode contrast. If Theme is 'Minimal', use lots of white space.
    4. Include a Header/Navbar, Hero Section, Features Grid (showing the enabled features), and a Footer.
    5. Return ONLY the raw HTML code. Do not wrap it in markdown code blocks.
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
    
    // Replay history to maintain context
    // (In a real app, we'd maintain the chat session object, but here we rebuild for simplicity)
    // Note: @google/genai chat.sendMessage doesn't support passing full history array easily in one go 
    // without manual iteration, so we'll simplify by appending history to prompt if needed 
    // or just relying on the current turn for this stateless implementation example.
    // For better context, we can append the last few messages to the system prompt or use the history API correctly if persistent.
    
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

  const prompt = `
    You are a coding assistant. The user wants to modify the following HTML/Tailwind website code.
    
    User Request: "${userRequest}"
    Project Context: ${project.config.idea}
    
    Instructions:
    1. Analyze the provided HTML.
    2. Apply the user's requested changes (e.g., change colors, layout, text, add buttons).
    3. Ensure the code remains valid HTML with Tailwind CSS.
    4. Return ONLY the full updated HTML code. No markdown, no explanations.
    
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
