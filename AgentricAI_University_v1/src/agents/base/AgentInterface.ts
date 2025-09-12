// Standard interface for all AgentricAI University agents

import { 
  AgentConfig, 
  AgentMessage, 
  AgentMemory, 
  AgentMetrics, 
  NeurodiverseProfile,
  AgentEvent 
} from './AgentTypes';

export interface IAgent {
  // Core Properties
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly version: string;
  config: AgentConfig;
  memory: AgentMemory;
  metrics: AgentMetrics;

  // Lifecycle Methods
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  shutdown(): Promise<void>;

  // Communication Methods
  sendMessage(targetAgentId: string, message: AgentMessage): Promise<string>;
  receiveMessage(message: AgentMessage): Promise<void>;
  broadcastMessage(message: AgentMessage): Promise<void>;
  subscribeToEvents(eventType: string, callback: (event: AgentEvent) => void): void;

  // Processing Methods
  processTask(taskData: any): Promise<any>;
  handleError(error: Error, context: any): Promise<void>;
  validateInput(input: any): boolean;
  formatOutput(output: any): any;

  // Memory Management
  storeMemory(key: string, value: any, type: 'short' | 'long' | 'working'): void;
  retrieveMemory(key: string, type: 'short' | 'long' | 'working'): any;
  clearMemory(type?: 'short' | 'long' | 'working'): void;
  optimizeMemory(): Promise<void>;

  // Neurodiverse Optimization
  adaptToProfile(profile: NeurodiverseProfile): Promise<void>;
  generateChildFriendlyResponse(data: any): string;
  applySensoryOptimizations(content: any): any;

  // Monitoring and Metrics
  getStatus(): string;
  getMetrics(): AgentMetrics;
  getHealth(): { status: string; issues: string[] };
  updateMetrics(metrics: Partial<AgentMetrics>): void;

  // Configuration
  updateConfig(newConfig: Partial<AgentConfig>): Promise<void>;
  getCapabilities(): string[];
  isCapable(capability: string): boolean;

  // Safety and Security
  validateSafety(action: any, context: any): boolean;
  reportSafetyIssue(issue: any): Promise<void>;
  emergencyStop(): Promise<void>;
}

export interface ILearningAgent extends IAgent {
  // Learning-specific methods
  assessLearningProgress(userId: string): Promise<any>;
  adaptContent(content: any, userProfile: any): Promise<any>;
  trackEngagement(userId: string, activityId: string, engagement: any): Promise<void>;
  generateRecommendations(userId: string): Promise<string[]>;
}

export interface IBehaviorAgent extends IAgent {
  // Behavior analysis methods
  analyzeInteractionPattern(interactions: any[]): Promise<any>;
  detectSensoryPreferences(userId: string): Promise<NeurodiverseProfile>;
  monitorEngagement(userId: string, sessionData: any): Promise<any>;
  predictBehavior(userId: string, context: any): Promise<any>;
}

export interface IContentAgent extends IAgent {
  // Content generation methods
  generateContent(requirements: any): Promise<any>;
  adaptDifficulty(content: any, targetLevel: string): Promise<any>;
  optimizeForSensory(content: any, preferences: any): Promise<any>;
  validateContentSafety(content: any): Promise<boolean>;
}

export interface IErrorAgent extends IAgent {
  // Error handling methods
  analyzeError(error: Error, context: any): Promise<any>;
  generateFix(errorAnalysis: any): Promise<any>;
  createChildFriendlyExplanation(error: Error): string;
  implementSafeFix(fix: any): Promise<boolean>;
}

export interface IKnowledgeAgent extends IAgent {
  // Knowledge management methods
  storeKnowledge(category: string, key: string, value: any): Promise<void>;
  retrieveKnowledge(category: string, key?: string): Promise<any>;
  searchKnowledge(query: string): Promise<any[]>;
  updateKnowledge(category: string, key: string, value: any): Promise<void>;
  analyzeKnowledgePatterns(): Promise<any>;
}

export interface ICommunicationAgent extends IAgent {
  // Communication routing methods
  routeMessage(message: AgentMessage): Promise<void>;
  manageWorkflow(workflowId: string): Promise<void>;
  coordinateAgents(agentIds: string[], task: any): Promise<any>;
  handleEmergencyBroadcast(message: AgentMessage): Promise<void>;
}