export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'processing' | 'idle' | 'error';
  tasks: number;
  memory: string;
  uptime: string;
  type: 'adaptive' | 'monitoring' | 'creative' | 'analytical';
  createdAt: Date;
  lastActivity: Date;
}

export interface SystemMetric {
  label: string;
  value: string;
  status: 'optimal' | 'warning' | 'critical';
  timestamp: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  activitiesCompleted: string[];
  progress: number;
  adaptiveSettings: AdaptiveSettings;
}

export interface AdaptiveSettings {
  difficultyLevel: 'easy' | 'medium' | 'hard';
  sensoryPreferences: {
    visualComplexity: 'low' | 'medium' | 'high';
    audioEnabled: boolean;
    animationSpeed: 'slow' | 'medium' | 'fast';
  };
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

export interface Activity {
  id: string;
  name: string;
  type: 'color-recognition' | 'shape-matching' | 'number-game' | 'letter-tracing';
  completed: boolean;
  progress: number;
  adaptiveData: any;
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: 'learning-assessment' | 'behavior-analysis' | 'content-generation' | 'progress-tracking';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  createdAt: Date;
  completedAt?: Date;
}