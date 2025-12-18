
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
    <title>Generation Pending</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>body { font-family: 'Outfit', sans-serif; }</style>
</head>
<body class="flex items-center justify-center min-h-screen bg-slate-50 text-slate-900">
    <div class="text-center p-12">
        <h1 class="text-4xl font-light mb-4">Architecting Vision...</h1>
        <p class="opacity-60">AscendFlow is constructing your digital environment.</p>
    </div>
</body>
</html>`
    },
    { name: 'styles.css', language: 'css', content: `body { background: #fff; }` },
    { name: 'script.js', language: 'javascript', content: `console.log("Init");` }
  ];
};

export const generateProjectBlueprint = async (config: ProjectConfig): Promise<string> => {
  const ai = getAI();
  if (!ai) return "## Blueprint Simulation\n\nAPI Key missing.";
  const promptText = `
    Act as a Senior Solutions Architect. Generate a technical blueprint for: "${config.idea}".
    Context: Style: ${config.design.style}, Tech: ${config.stack}.
    Format as Markdown. Keep it concise, professional, and elegant.
  `;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: promptText });
    return response.text || "Failed to generate blueprint.";
  } catch (error) { return "Error generating blueprint."; }
};

export const improveProjectIdea = async (currentIdea: string): Promise<{refinedIdea: string, visualKeywords: string}> => {
  const ai = getAI();
  if (!ai) return { refinedIdea: currentIdea, visualKeywords: "Modern" };
  const enhancementSchema = { type: Type.OBJECT, properties: { refinedIdea: { type: Type.STRING }, visualKeywords: { type: Type.STRING } }, required: ["refinedIdea", "visualKeywords"] };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Refine: "${currentIdea}". Make it sound like a premium, high-end product. Focus on "open", "breathable", and "calm" aesthetics.`,
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

  const imageInstruction = uploadedImageNames && uploadedImageNames.length > 0 
    ? `Use these local images: ${uploadedImageNames.join(', ')}.` 
    : `Use 'https://image.pollinations.ai/prompt/DESCRIPTION?nologo=true' for images. Use "minimalist architectural", "soft lighting", "premium", "unreal engine 5" in the prompt description. Avoid dark/cyberpunk unless requested.`;

  // FORCE HIGH-END AESTHETICS REGARDLESS OF INPUT
  const designSystem = `
    AESTHETIC MANDATE (MODERN & OPEN):
    1. **Spacious & Breathable**: Use generous padding (p-12, py-24, px-8) and large gaps (gap-12, gap-16). AVOID CRAMPED BOXES.
    2. **Layout Flow**: Avoid rigid grid lines ("prison bars"). Use organic flow, floating elements, and whitespace as a design element.
    3. **Soft Visuals**: Use 'rounded-[2rem]' or 'rounded-3xl' for cards. Use subtle shadows 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]' instead of harsh borders.
    4. **Typography**: Use 'Plus Jakarta Sans' or 'Inter'. HEADINGS must be large, elegant, and tracking-tight. Body text must have relaxed line-height (leading-relaxed).
    5. **Color Palette**: 
       - If Light Mode (preferred for 'Open'): Warm whites, soft creams, pale grays.
       - If Dark Mode: Deep warm charcoal/zinc, NOT pitch black.
    6. **Interactions**: Subtle lifts (hover:-translate-y-1), gentle fades, soft scaling.
    7. **Glass**: Use ultra-clean glass (bg-white/50 backdrop-blur-xl border-white/20) that feels weightless.
  `;

  const promptText = `
    Act as a World-Class Creative Developer (Awwwards Winner). 
    Build a complete, functional SINGLE PAGE APPLICATION for: "${config.idea}".
    
    ${designSystem}
    
    REQUIREMENTS:
    1. **Structure**: Generate 'index.html', 'styles.css', and 'script.js'.
    2. **HTML**: Full HTML5 boilerplate. Include Tailwind CSS CDN. Use semantic tags.
    3. **CSS**: Use 'styles.css' for custom animations (keyframes for floating, glowing, soft fades).
    4. **JS**: Use 'script.js' for scroll animations (IntersectionObserver) and UI logic.
    5. **Images**: ${imageInstruction}
    
    CRITICAL RESTRICTIONS:
    - **NO ES6 MODULES**: Do NOT use 'import' or 'export' in script.js. Browser blob URLs cannot handle relative imports. Use standard ES5/ES6 script syntax.
    - **NO RELATIVE PATHS FOR ASSETS**: CSS and JS will be bundled inline, but assume standard filenames.
    - **NO MARKDOWN**: Do not output markdown ticks (like \`\`\`html) around the files.
    - **NO PRISON BARS**: Do not use heavy borders on every div. Use whitespace separation.
    
    OUTPUT FORMAT (Strictly follow this):
    
    <!-- FILENAME: index.html -->
    <!DOCTYPE html>...
    
    <!-- FILENAME: styles.css -->
    ...
    
    <!-- FILENAME: script.js -->
    ...
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: { role: 'user', parts: [{ text: promptText }] },
      config: { 
          maxOutputTokens: 8192, // Max tokens for full file generation
          temperature: 0.7 
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

export const generateLandingPageCode = async (config: ProjectConfig, customization?: CustomizationOptions): Promise<string> => {
    const files = await generateFullProject(config, customization);
    return files.find(f => f.name === 'index.html')?.content || '';
};

export const applyAgenticEdit = async (files: ProjectFile[], userRequest: string, project: Project): Promise<{ updatedFiles: ProjectFile[], explanation: string }> => {
    const ai = getAI();
    if (!ai) return { updatedFiles: files, explanation: "AI offline." };
    
    const targetFile = files.find(f => f.name === 'index.html') || files[0];
    
    const prompt = `
    Request: "${userRequest}".
    File: ${targetFile.name}
    Current Content:
    ${targetFile.content}
    
    Output the FULL updated content for this file.
    Start with <!-- FILENAME: ${targetFile.name} -->
    `;
    
    try {
        const response = await ai.models.generateContent({ 
            model: 'gemini-2.5-flash', 
            contents: prompt,
            config: { maxOutputTokens: 8192 }
        });
        
        const newFiles = parseDelimitedResponse(response.text || '');
        if (newFiles.length > 0) {
            const updated = files.map(f => f.name === newFiles[0].name ? newFiles[0] : f);
            return { updatedFiles: updated, explanation: "I've updated the code." };
        }
        return { updatedFiles: files, explanation: "Could not apply changes." };
    } catch (e) { return { updatedFiles: files, explanation: "Failed." }; }
};

export const chatWithProjectAgent = async (message: string, project: Project, history: any[]): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Offline.";
  try {
    const chat = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction: `You are Nexus. Concise helper.` } });
    const res = await chat.sendMessage({ message });
    return res.text || "No response.";
  } catch (e) { return "Error."; }
};

export const getFastSuggestion = async (project: Project): Promise<string> => {
  const ai = getAI();
  if (!ai) return "System Ready.";
  try {
    const res = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Short web dev tip.` });
    return res.text || "Optimized.";
  } catch (e) { return "Ready."; }
};

export const refineWebpageCode = async (currentCode: string, userRequest: string, project: Project): Promise<string> => { 
    return currentCode; 
};
