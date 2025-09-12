// Core type definitions for AgentricAI University agents

export interface AgentConfig {
  id: string;
  name: string;
  type: AgentType;
  version: string;
  capabilities: string[];
  specialization: string;
  neurodiverseOptimized: boolean;
  priority: AgentPriority;
  memoryAllocation: string;
  status: AgentStatus;
}

export type AgentType = 
  | 'learning-coordinator'
  | 'behavior-analyst' 
  | 'content-generator'
  | 'error-handler'
  | 'knowledge-manager'
  | 'communication-router'
  | 'workflow-orchestrator'
  | 'safety-guard'
  | 'meta-agent';

export type AgentStatus = 
  | 'initializing'
  | 'active' 
  | 'processing'
  | 'idle'
  | 'maintenance'
  | 'error'
  | 'retired';

export type AgentPriority = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'background';

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  type: MessageType;
  data: any;
  priority: AgentPriority;
  timestamp: Date;
  requiresResponse: boolean;
  correlationId?: string;
}

export type MessageType =
  | 'direct-communication'
  | 'knowledge-update'
  | 'workflow-trigger'
  | 'error-report'
  | 'status-update'
  | 'learning-assessment'
  | 'behavior-analysis'
  | 'content-request'
  | 'safety-alert'
  | 'system-command';

export interface AgentMemory {
  shortTerm: Map<string, any>;
  longTerm: Map<string, any>;
  workingMemory: any;
  lastAccessed: Date;
  memorySize: number;
}

export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  neurodiverseOptimized: boolean;
  processingTime: number;
}

export interface AgentMetrics {
  tasksCompleted: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: number;
  uptime: number;
  lastActivity: Date;
  performanceScore: number;
}

export interface NeurodiverseProfile {
  sensoryPreferences: {
    visualComplexity: 'low' | 'medium' | 'high';
    audioEnabled: boolean;
    animationSpeed: 'slow' | 'medium' | 'fast';
    contrastLevel: 'low' | 'medium' | 'high';
  };
  communicationStyle: {
    directLanguage: boolean;
    visualSupports: boolean;
    processingTime: 'standard' | 'extended';
    feedbackFrequency: 'immediate' | 'periodic' | 'minimal';
  };
  learningPreferences: {
    routineImportance: 'low' | 'medium' | 'high';
    changeAdaptation: 'immediate' | 'gradual' | 'structured';
    informationProcessing: 'sequential' | 'parallel' | 'mixed';
  };
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  action: string;
  inputData: any;
  outputData?: any;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  dependencies: string[];
  timeout: number;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'created' | 'running' | 'completed' | 'failed' | 'paused';
  priority: AgentPriority;
  createdAt: Date;
  completedAt?: Date;
}

export interface AgentEvent {
  id: string;
  type: string;
  agentId: string;
  data: any;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface SafetyRule {
  id: string;
  name: string;
  description: string;
  condition: (context: any) => boolean;
  action: (context: any) => void;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}