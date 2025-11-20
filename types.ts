
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
export interface Project {
  id: string;
  name: string;
  createdAt: number;
  status: 'building' | 'live' | 'archived';
  config: ProjectConfig;
  generatedCode?: string;
  currentStage: number;
  blueprint?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  isCodeUpdate?: boolean; // If true, this message contains a code update
}
