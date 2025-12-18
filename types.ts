
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

export type DesignStyle = 'Minimal' | 'Glassmorphism' | 'Cyberpunk' | 'Corporate' | 'Neo-Brutalism' | 'Retro' | 'Luxury';
export type ColorTheme = 'Light' | 'Dark' | 'Midnight';

export interface ProjectDesign {
  style: DesignStyle;
  theme: ColorTheme;
  primaryColor: string;
}

export interface ProjectConfig {
  idea: string;
  stack: TechStack;
  database: Database;
  features: ProjectFeatures;
  design: ProjectDesign;
  visualIdentity?: string; // Kept for AI suggestions
  referenceImages?: string[];
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

export interface ProjectFile {
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'json' | 'markdown' | 'typescript' | 'image';
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  lastModified?: number;
  status: 'building' | 'live' | 'archived';
  config: ProjectConfig;
  generatedCode?: string; // Legacy single-file support
  files?: ProjectFile[]; // New multi-file support
  currentStage: number;
  blueprint?: string;
  chatHistory?: ChatMessage[];
}
