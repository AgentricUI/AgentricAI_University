import { Agent, AgentTask } from '../types';

export class AgentManager {
  private static instance: AgentManager;
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, AgentTask> = new Map();

  private constructor() {
    // Initialize with default agents
    this.initializeDefaultAgents();
  }

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  private initializeDefaultAgents() {
    const defaultAgents: Agent[] = [
      {
        id: 'agent-001',
        name: 'Learning Coordinator',
        status: 'active',
        tasks: 3,
        memory: '2.4GB',
        uptime: '12h 34m',
        type: 'adaptive',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        lastActivity: new Date()
      },
      {
        id: 'agent-002',
        name: 'Behavior Analyst',
        status: 'processing',
        tasks: 1,
        memory: '1.8GB',
        uptime: '8h 22m',
        type: 'monitoring',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: 'agent-003',
        name: 'Content Generator',
        status: 'idle',
        tasks: 0,
        memory: '0.9GB',
        uptime: '15h 7m',
        type: 'creative',
        createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  createAgent(agentData: Omit<Agent, 'id' | 'createdAt' | 'lastActivity'>): string {
    const id = `agent-${Date.now()}`;
    const agent: Agent = {
      ...agentData,
      id,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.agents.set(id, agent);
    return id;
  }

  updateAgentStatus(id: string, status: Agent['status']): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    agent.status = status;
    agent.lastActivity = new Date();
    this.agents.set(id, agent);
    return true;
  }

  assignTask(agentId: string, task: Omit<AgentTask, 'id' | 'createdAt'>): string | null {
    const agent = this.agents.get(agentId);
    if (!agent) return null;

    const taskId = `task-${Date.now()}`;
    const agentTask: AgentTask = {
      ...task,
      id: taskId,
      createdAt: new Date()
    };

    this.tasks.set(taskId, agentTask);
    agent.tasks += 1;
    agent.lastActivity = new Date();
    
    return taskId;
  }

  completeTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    task.status = 'completed';
    task.completedAt = new Date();

    const agent = this.agents.get(task.agentId);
    if (agent) {
      agent.tasks = Math.max(0, agent.tasks - 1);
      agent.lastActivity = new Date();
    }

    return true;
  }

  getAgentTasks(agentId: string): AgentTask[] {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }

  getSystemStats() {
    const agents = this.getAllAgents();
    const totalTasks = Array.from(this.tasks.values()).length;
    const activeTasks = Array.from(this.tasks.values()).filter(t => t.status === 'in-progress').length;

    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      totalTasks,
      activeTasks,
      systemLoad: Math.round((activeTasks / Math.max(1, totalTasks)) * 100)
    };
  }
}

export const agentManager = AgentManager.getInstance();