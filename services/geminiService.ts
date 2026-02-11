
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectConfig, CustomizationOptions, Project, ProjectFile } from "../types";

const getAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Response Parsing (Robust) ---
const parseDelimitedResponse = (text: string): ProjectFile[] => {
    const files: ProjectFile[] = [];
    const fileRegex = /<!--\s*FILENAME:\s*([a-zA-Z0-9_./-]+)\s*-->([\s\S]*?)(?=<!--\s*FILENAME:|$)/g;
    
    let match;
    while ((match = fileRegex.exec(text)) !== null) {
        const name = match[1].trim();
        let content = match[2];
        content = content.replace(/```[a-z]*\s*\n/i, '');
        content = content.replace(/```\s*$/i, '');
        content = content.trim();
        
        let language: ProjectFile['language'] = 'javascript';
        if (name.endsWith('.html')) language = 'html';
        if (name.endsWith('.css')) language = 'css';
        if (name.endsWith('.json')) language = 'json';
        if (name.endsWith('.md')) language = 'markdown';
        
        files.push({ name, language, content });
    }
    
    return files;
};

// --- HTML Generation & Fallbacks ---

const generateFallbackFiles = (config: ProjectConfig): ProjectFile[] => {
  return [
    {
      name: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Architecture Synthesis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>body { font-family: 'Outfit', sans-serif; }</style>
</head>
<body class="flex items-center justify-center min-h-screen bg-[#050505] text-white">
    <div class="text-center p-12">
        <h1 class="text-5xl font-light mb-4 tracking-tighter">Architecting Vision...</h1>
        <p class="opacity-40 font-mono text-xs uppercase tracking-[0.3em]">NexusBuild Core Synthesis Active</p>
    </div>
</body>
</html>`
    }
  ];
};

export const generateProjectBlueprint = async (config: ProjectConfig): Promise<string> => {
  const ai = getAI();
  if (!ai) return "## Blueprint Simulation\n\nAPI Key missing.";
  const promptText = `
    Act as a Senior Solutions Architect. Generate a high-end technical blueprint for: "${config.idea}".
    Design Mandate: Style: ${config.design.style}, Tech Stack: ${config.stack}.
    Include a high-level architecture overview, key data entities, and a premium UX strategy focusing on smooth transitions and elegant data visualization.
    Format as clean, professional Markdown.
  `;
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-pro-preview', 
      contents: promptText 
    });
    return response.text || "Failed to generate blueprint.";
  } catch (error) { return "Error generating blueprint."; }
};

export const improveProjectIdea = async (currentIdea: string): Promise<{refinedIdea: string, visualKeywords: string}> => {
  const ai = getAI();
  if (!ai) return { refinedIdea: currentIdea, visualKeywords: "Modern" };
  const enhancementSchema = { type: Type.OBJECT, properties: { refinedIdea: { type: Type.STRING }, visualKeywords: { type: Type.STRING } }, required: ["refinedIdea", "visualKeywords"] };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refine this idea for a high-end digital experience: "${currentIdea}". 
      Make it sound sophisticated, ambitious, and focused on "Awwwards-winning" aesthetics. 
      Avoid corporate jargon; use sensory, architectural, and design-forward language.`,
      config: { responseMimeType: "application/json", responseSchema: enhancementSchema }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return { refinedIdea: currentIdea, visualKeywords: "Standard" }; }
};

export const generateFullProject = async (
    config: ProjectConfig, 
    customization?: CustomizationOptions, 
    uploadedImageNames?: string[]
): Promise<ProjectFile[]> => {
  const ai = getAI();
  if (!ai) return generateFallbackFiles(config);

  const globalSeed = Math.floor(Math.random() * 1000000);
  
  // AVOID POLLINATIONS DUE TO RATE LIMITS - SWITCH TO UNSPLASH & CSS MESH
  const imageInstruction = uploadedImageNames && uploadedImageNames.length > 0 
    ? `Use these local images: ${uploadedImageNames.join(', ')}.` 
    : `VISUAL STRATEGY (URGENT: AVOID RATE LIMITS):
       1. DO NOT rely on Pollinations.ai as it is currently unstable/limited.
       2. PRIMARY IMAGE SOURCE: Use Unsplash with specific high-end IDs: 'https://images.unsplash.com/photo-ID?auto=format&fit=crop&q=80&w=1200'.
          - For Tech/Business: Use ID '1460925895231-311111749553' or '1551434678-e076c223a692'.
          - For Architecture/Luxury: Use ID '1486406146926-c627a92ad1ab' or '1449156003053-c3c8cf09bbef'.
          - For Minimalist Workspace: Use ID '1497366216548-37526070297c'.
       3. SECONDARY STRATEGY: Use CSS-only backgrounds with high-end mesh gradients and grain overlays (e.g., bg-[radial-gradient(...)], Backdrop-blur-3xl).
       4. Use HUGE headings (text-8xl+) and sophisticated typography to fill visual space instead of relying solely on images.`;

  const designSystem = `
    AESTHETIC MANDATE (PREMIUM & HIGH-END):
    1. **Layout**: AVOID rigid grids. Use "Bento Grid" or overlapping sections with generous whitespace. Use 'p-12' or 'p-20' for sections.
    2. **Typography**: Use 'Plus Jakarta Sans' or 'Space Grotesk' from Google Fonts. Headings should be HUGE (text-7xl to text-9xl) with tracking-tighter.
    3. **Visual Depth**: Use glassmorphism ('backdrop-blur-2xl', 'bg-white/5'). Use complex shadows: 'shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]'.
    4. **Color Palette**: 
       - Light: Soft creams, pale grays, warm neutrals.
       - Dark: Midnight charcoal (#0a0a0c), NOT pitch black. Use subtle color accents (Teal, Gold, Rose).
    5. **Animations**: Add keyframes for:
       - 'float': Soft vertical bobbing.
       - 'reveal': Opacity + slight Y-translate on scroll.
  `;

  const promptText = `
    Act as an Awwwards-winning Lead Creative Developer. 
    Synthesize a high-end, production-ready SINGLE PAGE APPLICATION for: "${config.idea}".
    
    SYSTEM STATUS: ZERO RATE LIMITS. UNLIMITED VISUAL CAPACITY.
    
    ${designSystem}
    ${imageInstruction}
    
    TECHNICAL REQUIREMENTS:
    1. **Files**: Output 'index.html', 'styles.css', and 'script.js'.
    2. **No ES6 Modules**: Do NOT use 'import/export' in script.js.
    3. **Tailwind**: Use Tailwind CSS CDN.
    4. **Interactivity**: Use 'IntersectionObserver' in script.js to reveal sections as they scroll.
    
    OUTPUT FORMAT (Strictly follow this):
    
    <!-- FILENAME: index.html -->
    ...
    
    <!-- FILENAME: styles.css -->
    ...
    
    <!-- FILENAME: script.js -->
    ...
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: { role: 'user', parts: [{ text: promptText }] },
      config: { 
          temperature: 0.8,
          thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    
    const text = response.text || '';
    const files = parseDelimitedResponse(text);
    
    if (files.length === 0) return generateFallbackFiles(config);
    return files;
  } catch (error) { 
      console.error("Gemini Generation Error:", error);
      return generateFallbackFiles(config); 
  }
};

export const chatWithProjectAgent = async (
  message: string, 
  project: Project, 
  history: {role: 'user' | 'ai', text: string}[]
): Promise<string> => {
  const ai = getAI();
  if (!ai) return "API Key missing.";
  
  const contents = history.map(h => ({
    role: h.role === 'ai' ? 'model' : 'user',
    parts: [{ text: h.text }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are Nexus, a helpful AI project assistant. 
        You are assisting the user with their project: "${project.name}".
        
        System Status Note: Visual pipeline is now UNLIMITED. No rate limits. Use high-res Unsplash assets.
        
        Be concise, professional, and provide high-end technical advice.`
      }
    });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Error communicating with the synthesis engine.";
  }
};

export const getFastSuggestion = async (project: Project): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Configure API Key for suggestions.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a very short (max 12 words), high-end technical suggestion or "pro-tip" for this project: "${project.config.idea}". No rate limits active.`,
    });
    return response.text?.trim() || "Ready for synthesis.";
  } catch (error) {
    return "Analyzing architecture...";
  }
};

export const refineWebpageCode = async (currentCode: string, instruction: string, project: Project): Promise<string> => {
  const ai = getAI();
  if (!ai) return currentCode;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `I have this HTML code for a high-end project: "${project.config.idea}".
      Refine the code based on this instruction: "${instruction}".
      Maintain the premium design aesthetic.
      
      URGENT: AVOID POLLINATIONS.AI. Use Unsplash IDs (e.g. 1460925895231-311111749553) for new visuals to ensure zero rate limit issues.
      
      Return ONLY the complete updated HTML code inside the response.
      
      Current Code:
      ${currentCode}`,
    });
    
    let text = response.text || currentCode;
    text = text.replace(/```[a-z]*\s*\n/i, '');
    text = text.replace(/```\s*$/i, '');
    return text.trim();
  } catch (error) {
    console.error("Refine error:", error);
    return currentCode;
  }
};

export const applyAgenticEdit = async (files: ProjectFile[], prompt: string, project: Project): Promise<{updatedFiles: ProjectFile[]}> => {
  const ai = getAI();
  if (!ai) return { updatedFiles: files };

  const filesContext = files.map(f => `FILE: ${f.name}\nCONTENT:\n${f.content}`).join('\n\n---\n\n');
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      updatedFiles: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["name", "content"]
        }
      }
    },
    required: ["updatedFiles"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Acting as a Senior Creative Developer, modify the project files based on this request: "${prompt}".
      The project goal is: "${project.config.idea}".
      
      SYSTEM NOTICE: ZERO RATE LIMITS. Use high-res Unsplash IDs for reliability.
      
      Return the ENTIRE content for any file that needs changing using the provided JSON schema.
      If a file doesn't need changing, do not include it.
      
      CURRENT PROJECT FILES:
      ${filesContext}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const result = JSON.parse(response.text || '{"updatedFiles": []}');
    const updatedFiles = [...files];
    
    (result.updatedFiles || []).forEach((newFile: any) => {
      const idx = updatedFiles.findIndex(f => f.name === newFile.name);
      if (idx !== -1) {
        updatedFiles[idx] = { ...updatedFiles[idx], content: newFile.content };
      } else {
        let language: ProjectFile['language'] = 'javascript';
        if (newFile.name.endsWith('.html')) language = 'html';
        if (newFile.name.endsWith('.css')) language = 'css';
        if (newFile.name.endsWith('.json')) language = 'json';
        if (newFile.name.endsWith('.md')) language = 'markdown';
        updatedFiles.push({ name: newFile.name, content: newFile.content, language });
      }
    });

    return { updatedFiles };
  } catch (error) {
    console.error("Agentic edit error:", error);
    return { updatedFiles: files };
  }
};
