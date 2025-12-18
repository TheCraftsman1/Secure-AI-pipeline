import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, Zap, Terminal, ArrowRight } from 'lucide-react';
import { Project, ChatMessage } from '../types';
import { chatWithProjectAgent, getFastSuggestion, refineWebpageCode } from '../services/geminiService';

interface Props {
  project: Project;
  onCodeUpdate: (newCode: string) => void;
  onChatUpdate: (messages: ChatMessage[]) => void;
}

// Quick prompts based on pipeline stage
const STAGE_QUICK_PROMPTS: Record<number, string[]> = {
  0: ["Suggest high-end features", "Refine my project idea", "Explain the tech stack"], // Planning
  1: ["Explain the architecture", "Why this database?", "How scalable is this?"], // Blueprint/CodeGen
  2: ["Explain the folder structure", "Optimize build process", "Add comments to code"], // Build
  3: ["Fix security vulnerabilities", "Improve test coverage", "Explain failed tests"], // Testing
  4: ["Change primary color", "Make it more modern", "Add a contact section"], // Deploy
  5: ["Analyze server load", "Optimize latency", "Suggest scaling strategy"] // Monitor
};

export const ChatAssistant: React.FC<Props> = ({ project, onCodeUpdate, onChatUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickTip, setQuickTip] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = project.chatHistory && project.chatHistory.length > 0 ? project.chatHistory : [
    {
      id: 'init',
      role: 'ai' as const,
      text: `Hi! I'm Nexus. I see we are in the ${getStageName(project.currentStage)} phase. How can I assist you?`,
      timestamp: Date.now()
    }
  ];

  function getStageName(stage: number) {
    switch(stage) {
      case 0: return 'Planning';
      case 1: return 'Architecture';
      case 2: return 'Development';
      case 3: return 'Testing';
      case 4: return 'Deployment';
      case 5: return 'Monitoring';
      default: return 'Development';
    }
  }

  useEffect(() => {
    if (isOpen) {
      const fetchTip = async () => {
        const tip = await getFastSuggestion(project);
        setQuickTip(tip);
      };
      fetchTip();
      const interval = setInterval(fetchTip, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, project]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textInput: string = input) => {
    if (!textInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textInput,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMsg];
    onChatUpdate(newMessages);
    setInput('');
    setIsTyping(true);

    const isModificationRequest = 
      textInput.toLowerCase().includes('change') || 
      textInput.toLowerCase().includes('update') || 
      textInput.toLowerCase().includes('button') ||
      textInput.toLowerCase().includes('color') ||
      textInput.toLowerCase().includes('background') ||
      textInput.toLowerCase().includes('make it');

    if (isModificationRequest && project.generatedCode && (project.currentStage === 4 || project.currentStage === 5)) {
        const tempAiMsg: ChatMessage = { id: 'typing', role: 'ai', text: "I'm working on those visual changes for you now...", timestamp: Date.now() };
        onChatUpdate([...newMessages, tempAiMsg]);
        
        const newCode = await refineWebpageCode(project.generatedCode, userMsg.text, project);
        onCodeUpdate(newCode);
        
        setIsTyping(false);
        const doneMsg: ChatMessage = { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          text: "Done! I've updated the preview with your changes.", 
          timestamp: Date.now(),
          isCodeUpdate: true
        };
        onChatUpdate([...newMessages, doneMsg]);
    } else {
        const response = await chatWithProjectAgent(userMsg.text, project, messages.map(m => ({ role: m.role, text: m.text })));
        setIsTyping(false);
        const aiMsg: ChatMessage = { id: Date.now().toString(), role: 'ai', text: response, timestamp: Date.now() };
        onChatUpdate([...newMessages, aiMsg]);
    }
  };

  const currentPrompts = STAGE_QUICK_PROMPTS[project.currentStage] || STAGE_QUICK_PROMPTS[0];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center hover:scale-110 active:scale-90 group ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-cyan-600 to-blue-600'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white group-hover:animate-pulse" />}
      </button>

      <div
        className={`fixed bottom-24 right-6 w-96 h-[600px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 animate-pulse">
              <Sparkles className="text-cyan-600 dark:text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Nexus Assistant</h3>
              <div className="flex items-center text-xs text-emerald-500 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Gemini 3 Pro • {getStageName(project.currentStage)} Context
              </div>
            </div>
          </div>
        </div>

        {quickTip && (
            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-xs text-blue-600 dark:text-blue-300 flex items-center border-b border-blue-100 dark:border-blue-900/30 animate-slide-in-right">
                <Zap size={12} className="mr-2 text-yellow-500 dark:text-yellow-400 shrink-0" />
                <span className="font-mono truncate">{quickTip}</span>
            </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                {msg.text}
                {msg.isCodeUpdate && (
                    <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 p-1 rounded">
                        <Terminal size={10} className="mr-1" /> Code Refactored
                    </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Prompts */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {currentPrompts.map((prompt, i) => (
                <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors flex items-center"
                >
                    {prompt} <ArrowRight size={10} className="ml-1 opacity-50" />
                </button>
            ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden focus-within:border-cyan-500 transition-colors shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-3 text-cyan-500 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-white dark:hover:bg-cyan-600 transition-colors disabled:opacity-50 active:scale-90 transform"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-600 text-center mt-2">
            AI can make mistakes. Review generated code.
          </p>
        </div>
      </div>
    </>
  );
};