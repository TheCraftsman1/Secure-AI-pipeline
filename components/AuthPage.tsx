
import React, { useState } from 'react';
import { Fingerprint, Mail, Lock, User, ArrowRight, Github, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export const AuthPage: React.FC<Props> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  // Pre-filling with dummy credentials for "Direct Sign Up/In"
  const [email, setEmail] = useState('architect@nexus.ai');
  const [password, setPassword] = useState('nexus-2025');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to verify credentials
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-midnight-900">
      {/* Ambient Lighting Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-teal/5 rounded-full blur-[120px] animate-breath"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-gold/5 rounded-full blur-[120px] animate-breath" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Auth Card */}
      <div className="glass-panel w-full max-w-xl p-10 md:p-16 relative z-10 animate-scale-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-midnight-800 border border-white/10 mb-8 shadow-2xl relative group">
            <div className="absolute inset-0 bg-accent-teal/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <Fingerprint className="text-accent-teal relative z-10" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tighter">
            {isSignUp ? 'Join the ' : 'Welcome to the '}
            <span className="text-gradient-gold">Collective</span>
          </h1>
          <p className="text-slate-400 font-light text-lg leading-relaxed">
            {isSignUp ? 'Create your neural architect profile.' : 'Resume your creative workspace.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-teal transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-midnight-800/40 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white focus:outline-none focus:border-accent-teal/50 focus:bg-white/5 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          )}

          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-teal transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-midnight-800/40 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white focus:outline-none focus:border-accent-teal/50 focus:bg-white/5 transition-all placeholder:text-slate-600"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-teal transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-midnight-800/40 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white focus:outline-none focus:border-accent-teal/50 focus:bg-white/5 transition-all placeholder:text-slate-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-midnight-900 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] group"
          >
            <span>{isSignUp ? 'Initialize Profile' : 'Enter Workspace'}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-12 flex items-center gap-4 text-slate-700">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Access Protocols</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent-teal/5 border border-accent-teal/20 rounded-full text-[10px] font-mono text-accent-teal/80">
                <ShieldCheck size={12} />
                <span>DEMO MODE ACTIVE • ENCRYPTED TUNNEL</span>
            </div>

            <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-500 hover:text-white transition-colors text-sm font-light tracking-wide"
            >
                {isSignUp ? 'Already identified? ' : "New architect? "}
                <span className="text-accent-teal font-medium ml-1">
                {isSignUp ? 'Resume Workspace' : 'Request Access'}
                </span>
            </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-700 font-mono tracking-[0.4em] uppercase flex items-center gap-3">
        <Sparkles size={12} className="text-accent-gold/50" />
        NexusBuild OS v3.0 • Neural Fabrication Studio
      </div>
    </div>
  );
};
