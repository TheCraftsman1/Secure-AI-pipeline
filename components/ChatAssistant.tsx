
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, Zap, Terminal } from 'lucide-react';
import { Project, ChatMessage } from '../types';
import { chatWithProjectAgent, getFastSuggestion, refineWebpageCode } from '../services/geminiService';

interface Props {
  project: Project;
  onCodeUpdate: (newCode: string) => void;
}

export const ChatAssistant: React.FC<Props> = ({ project, onCodeUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'ai',
      text: `Hi! I'm Nexus. I can help you build your ${project.config.stack} project. Ask me anything!`,
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickTip, setQuickTip] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for quick tips using Flash Lite
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
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Check for code modification intent (simple heuristic + explicit user instruction later)
    const isModificationRequest = 
      input.toLowerCase().includes('change') || 
      input.toLowerCase().includes('update') || 
      input.toLowerCase().includes('button') ||
      input.toLowerCase().includes('color') ||
      input.toLowerCase().includes('background') ||
      input.toLowerCase().includes('make it');

    if (isModificationRequest && project.generatedCode && (project.currentStage === 4 || project.currentStage === 5)) {
        // Use code refinement pipeline
        const responseMsg = "I'm working on those visual changes for you now...";
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: responseMsg, timestamp: Date.now() }]);
        
        const newCode = await refineWebpageCode(project.generatedCode, userMsg.text, project);
        onCodeUpdate(newCode);
        
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          text: "Done! I've updated the preview with your changes.", 
          timestamp: Date.now(),
          isCodeUpdate: true
        }]);
    } else {
        // Standard Chat
        const response = await chatWithProjectAgent(userMsg.text, project, messages.map(m => ({ role: m.role, text: m.text })));
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: response, timestamp: Date.now() }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-96 h-[600px] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
              <Sparkles className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Nexus Assistant</h3>
              <div className="flex items-center text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Gemini 3 Pro
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tip (Flash Lite) */}
        {quickTip && (
            <div className="bg-blue-900/20 px-4 py-2 text-xs text-blue-300 flex items-center border-b border-blue-900/30">
                <Zap size={12} className="mr-2 text-yellow-400" />
                <span className="font-mono truncate">{quickTip}</span>
            </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-300 rounded-tl-none border border-slate-700'
                }`}
              >
                {msg.text}
                {msg.isCodeUpdate && (
                    <div className="mt-2 flex items-center text-xs text-green-400 bg-green-900/20 p-1 rounded">
                        <Terminal size={10} className="mr-1" /> Code Refactored
                    </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-700">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden focus-within:border-cyan-500 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me to change the UI..."
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-0 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">
            AI can make mistakes. Review generated code.
          </p>
        </div>
      </div>
    </>
  );
};
