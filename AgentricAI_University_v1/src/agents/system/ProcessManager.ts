// Process Manager Agent - OS-level process management for AgentricAI Core

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';
import { AgentOSInterface, ResourceRequest, ResourceAllocation, HealthReport } from '../base/AgentOSInterface';

export interface ProcessInfo {
  pid: string;
  agentId: string;
  name: string;
  status: 'starting' | 'running' | 'paused' | 'stopping' | 'stopped' | 'crashed';
  priority: 'low' | 'normal' | 'high' | 'critical';
  parentPid?: string;
  childPids: string[];
  startTime: Date;
  lastActivity: Date;
  resourceAllocations: ResourceAllocation[];
  healthStatus: 'healthy' | 'degraded' | 'critical';
  restartCount: number;
  maxRestarts: number;
}

export interface ProcessSchedule {
  pid: string;
  scheduledAt: Date;
  action: 'start' | 'stop' | 'restart' | 'pause' | 'resume';
  parameters?: any;
}

export class ProcessManager extends BaseAgent implements AgentOSInterface {
  private processes: Map<string, ProcessInfo> = new Map();
  private processQueue: ProcessSchedule[] = [];
  private resourceAllocations: Map<string, ResourceAllocation> = new Map();
  private healthReports: Map<string, HealthReport> = new Map();
  private systemMetrics: any = {};

  constructor() {
    const config: AgentConfig = {
      id: 'process-manager-001',
      name: 'System Process Manager',
      type: 'system-agent',
      version: '1.0.0',
      capabilities: [
        'process-management',
        'resource-allocation',
        'health-monitoring',
        'process-scheduling',
        'crash-recovery',
        'load-balancing'
      ],
      specialization: 'system_process_management',
      neurodiverseOptimized: false,
      priority: 'critical',
      memoryAllocation: '512MB',
      status: 'initializing'
    };

    super(config);
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'spawn_process':
        return await this.spawnProcess(data.agentId, data.config);
      
      case 'terminate_process':
        return await this.terminateProcess(data.pid);
      
      case 'pause_process':
        return await this.pauseProcess(data.pid);
      
      case 'resume_process':
        return await this.resumeProcess(data.pid);
      
      case 'restart_process':
        return await this.restartProcess(data.pid);
      
      case 'get_process_info':
        return this.getProcessInfo(data.pid);
      
      case 'list_processes':
        return this.listProcesses(data.filter);
      
      case 'monitor_health':
        return await this.monitorProcessHealth();
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  // Process Management Methods
  async spawnProcess(agentId: string, config: any): Promise<string> {
    console.log(`🚀 Spawning process for agent: ${agentId}`);
    
    const pid = `proc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const processInfo: ProcessInfo = {
      pid,
      agentId,
      name: config.name || agentId,
      status: 'starting',
      priority: config.priority || 'normal',
      parentPid: config.parentPid,
      childPids: [],
      startTime: new Date(),
      lastActivity: new Date(),
      resourceAllocations: [],
      healthStatus: 'healthy',
      restartCount: 0,
      maxRestarts: config.maxRestarts || 3
    };

    // Request initial resources
    if (config.resources) {
      try {
        const allocation = await this.requestSystemResources(config.resources);
        processInfo.resourceAllocations.push(allocation);
        this.resourceAllocations.set(allocation.allocationId, allocation);
      } catch (error) {
        console.error(`Failed to allocate resources for process ${pid}:`, error);
        throw new Error(`Resource allocation failed: ${error.message}`);
      }
    }

    // Add to parent's children if specified
    if (config.parentPid) {
      const parent = this.processes.get(config.parentPid);
      if (parent) {
        parent.childPids.push(pid);
      }
    }

    this.processes.set(pid, processInfo);
    
    // Start the process
    await this.startProcess(pid);
    
    this.metrics.tasksCompleted += 1;
    return pid;
  }

  async terminateProcess(pid: string): Promise<void> {
    console.log(`🛑 Terminating process: ${pid}`);
    
    const process = this.processes.get(pid);
    if (!process) {
      throw new Error(`Process not found: ${pid}`);
    }

    // Terminate child processes first
    for (const childPid of process.childPids) {
      await this.terminateProcess(childPid);
    }

    // Update status
    process.status = 'stopping';
    
    // Release resources
    for (const allocation of process.resourceAllocations) {
      await this.releaseResources(allocation.allocationId);
    }

    // Remove from parent's children
    if (process.parentPid) {
      const parent = this.processes.get(process.parentPid);
      if (parent) {
        parent.childPids = parent.childPids.filter(id => id !== pid);
      }
    }

    // Mark as stopped
    process.status = 'stopped';
    
    // Emit termination event
    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'process_terminated', pid, agentId: process.agentId },
      priority: 'normal',
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
  }

  async pauseProcess(pid: string): Promise<void> {
    console.log(`⏸️ Pausing process: ${pid}`);
    
    const process = this.processes.get(pid);
    if (!process) {
      throw new Error(`Process not found: ${pid}`);
    }

    if (process.status !== 'running') {
      throw new Error(`Cannot pause process in ${process.status} state`);
    }

    process.status = 'paused';
    process.lastActivity = new Date();

    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'process_paused', pid, agentId: process.agentId },
      priority: 'normal',
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
  }

  async resumeProcess(pid: string): Promise<void> {
    console.log(`▶️ Resuming process: ${pid}`);
    
    const process = this.processes.get(pid);
    if (!process) {
      throw new Error(`Process not found: ${pid}`);
    }

    if (process.status !== 'paused') {
      throw new Error(`Cannot resume process in ${process.status} state`);
    }

    process.status = 'running';
    process.lastActivity = new Date();

    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'process_resumed', pid, agentId: process.agentId },
      priority: 'normal',
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
  }

  async restartProcess(pid: string): Promise<void> {
    console.log(`🔄 Restarting process: ${pid}`);
    
    const process = this.processes.get(pid);
    if (!process) {
      throw new Error(`Process not found: ${pid}`);
    }

    if (process.restartCount >= process.maxRestarts) {
      throw new Error(`Process ${pid} has exceeded maximum restart attempts`);
    }

    // Stop the process
    process.status = 'stopping';
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start it again
    await this.startProcess(pid);
    
    process.restartCount += 1;
    process.lastActivity = new Date();

    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'process_restarted', pid, agentId: process.agentId, restartCount: process.restartCount },
      priority: 'high',
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
  }

  getProcessInfo(pid: string): ProcessInfo | null {
    return this.processes.get(pid) || null;
  }

  listProcesses(filter?: any): ProcessInfo[] {
    let processes = Array.from(this.processes.values());
    
    if (filter) {
      if (filter.status) {
        processes = processes.filter(p => p.status === filter.status);
      }
      if (filter.priority) {
        processes = processes.filter(p => p.priority === filter.priority);
      }
      if (filter.agentId) {
        processes = processes.filter(p => p.agentId === filter.agentId);
      }
    }
    
    return processes;
  }

  async monitorProcessHealth(): Promise<HealthReport[]> {
    console.log(`🏥 Monitoring process health for ${this.processes.size} processes`);
    
    const healthReports: HealthReport[] = [];
    
    for (const [pid, process] of this.processes.entries()) {
      const health = await this.assessProcessHealth(process);
      this.healthReports.set(pid, health);
      healthReports.push(health);
      
      // Handle critical health issues
      if (health.status === 'critical' || health.status === 'unresponsive') {
        await this.handleCriticalHealth(process, health);
      }
    }
    
    this.metrics.tasksCompleted += 1;
    return healthReports;
  }

  // AgentOSInterface Implementation
  async requestSystemResources(resources: ResourceRequest): Promise<ResourceAllocation> {
    const allocationId = `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const allocation: ResourceAllocation = {
      allocationId,
      expiresAt: resources.duration ? new Date(Date.now() + resources.duration) : undefined
    };

    // Simulate resource allocation
    if (resources.memory) {
      allocation.memory = {
        allocated: resources.memory,
        address: `0x${Math.random().toString(16).substr(2, 8)}`,
        type: 'heap'
      };
    }

    if (resources.compute) {
      const priority = { low: 1, medium: 5, high: 8, critical: 10 }[resources.compute];
      allocation.compute = {
        threads: Math.min(4, priority),
        priority,
        cpuQuota: priority * 10
      };
    }

    if (resources.storage) {
      allocation.storage = {
        path: `/tmp/agent-${allocationId}`,
        size: resources.storage,
        type: 'temporary'
      };
    }

    if (resources.network) {
      allocation.network = {
        bandwidth: '100Mbps',
        connections: 10,
        protocols: ['http', 'websocket']
      };
    }

    this.resourceAllocations.set(allocationId, allocation);
    return allocation;
  }

  async releaseResources(allocationId: string): Promise<void> {
    const allocation = this.resourceAllocations.get(allocationId);
    if (allocation) {
      // Simulate resource cleanup
      console.log(`🧹 Releasing resources: ${allocationId}`);
      this.resourceAllocations.delete(allocationId);
    }
  }

  async updateResourceUsage(allocationId: string, usage: any): Promise<void> {
    const allocation = this.resourceAllocations.get(allocationId);
    if (allocation) {
      // Update usage tracking
      console.log(`📊 Updating resource usage for: ${allocationId}`, usage);
    }
  }

  async registerWithOS(): Promise<void> {
    console.log(`📝 Registering Process Manager with OS`);
    // Register as system service
    this.storeMemory('os_registration', {
      registered: true,
      registeredAt: new Date(),
      services: ['process-management', 'resource-allocation', 'health-monitoring']
    }, 'long');
  }

  async unregisterFromOS(): Promise<void> {
    console.log(`📝 Unregistering Process Manager from OS`);
    this.clearMemory('long');
  }

  async updateRegistration(updates: any): Promise<void> {
    const registration = this.retrieveMemory('os_registration', 'long') || {};
    this.storeMemory('os_registration', { ...registration, ...updates }, 'long');
  }

  async reportHealthToOS(): Promise<void> {
    const health: HealthReport = {
      agentId: this.id,
      status: 'healthy',
      metrics: {
        memoryUsage: this.metrics.memoryUsage,
        cpuUsage: 25, // Simulated
        responseTime: this.metrics.averageResponseTime,
        errorRate: this.metrics.errorRate,
        taskQueueSize: 0
      },
      issues: [],
      lastReported: new Date()
    };

    // Check for issues
    if (this.processes.size > 50) {
      health.issues.push({
        severity: 'medium',
        type: 'high_process_count',
        description: `Managing ${this.processes.size} processes`,
        timestamp: new Date(),
        resolved: false
      });
    }

    console.log(`🏥 Reporting health to OS:`, health.status);
  }

  async getSystemHealth(): Promise<any> {
    return {
      totalProcesses: this.processes.size,
      runningProcesses: Array.from(this.processes.values()).filter(p => p.status === 'running').length,
      healthyProcesses: Array.from(this.healthReports.values()).filter(h => h.status === 'healthy').length,
      resourceAllocations: this.resourceAllocations.size,
      systemLoad: this.calculateSystemLoad()
    };
  }

  subscribeToSystemEvents(): void {
    // Subscribe to system-wide events
    console.log(`📡 Subscribing to system events`);
  }

  unsubscribeFromSystemEvents(): void {
    console.log(`📡 Unsubscribing from system events`);
  }

  async emitSystemEvent(event: any): Promise<void> {
    console.log(`📢 Emitting system event:`, event.type);
    // Emit to system event bus
    window.dispatchEvent(new CustomEvent('systemEvent', { detail: event }));
  }

  async discoverServices(): Promise<string[]> {
    return ['process-management', 'resource-allocation', 'health-monitoring', 'crash-recovery'];
  }

  async requestService(request: any): Promise<any> {
    // Handle service requests
    return { success: true, data: 'Service response' };
  }

  async registerService(serviceType: string, handler: any): Promise<void> {
    console.log(`📋 Registering service: ${serviceType}`);
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'process-spawn-request':
        await this.handleProcessSpawnRequest(message);
        break;
      
      case 'process-terminate-request':
        await this.handleProcessTerminateRequest(message);
        break;
      
      case 'health-check-request':
        await this.handleHealthCheckRequest(message);
        break;
      
      default:
        console.log(`Process Manager received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    return "I'm the system helper that makes sure all the learning helpers work properly! 🔧⚙️";
  }

  // Private helper methods
  private async startProcess(pid: string): Promise<void> {
    const process = this.processes.get(pid);
    if (!process) return;

    process.status = 'running';
    process.lastActivity = new Date();

    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'process_started', pid, agentId: process.agentId },
      priority: 'normal',
      timestamp: new Date()
    });
  }

  private async assessProcessHealth(process: ProcessInfo): Promise<HealthReport> {
    const timeSinceActivity = Date.now() - process.lastActivity.getTime();
    let status: 'healthy' | 'degraded' | 'critical' | 'unresponsive' = 'healthy';
    const issues: any[] = [];

    // Check responsiveness
    if (timeSinceActivity > 300000) { // 5 minutes
      status = 'unresponsive';
      issues.push({
        severity: 'critical',
        type: 'unresponsive',
        description: 'Process has not responded in over 5 minutes',
        timestamp: new Date(),
        resolved: false
      });
    } else if (timeSinceActivity > 60000) { // 1 minute
      status = 'degraded';
      issues.push({
        severity: 'medium',
        type: 'slow_response',
        description: 'Process response time is degraded',
        timestamp: new Date(),
        resolved: false
      });
    }

    // Check restart count
    if (process.restartCount > process.maxRestarts * 0.7) {
      status = status === 'healthy' ? 'degraded' : status;
      issues.push({
        severity: 'high',
        type: 'frequent_restarts',
        description: `Process has restarted ${process.restartCount} times`,
        timestamp: new Date(),
        resolved: false
      });
    }

    return {
      agentId: process.agentId,
      status,
      metrics: {
        memoryUsage: 50, // Simulated
        cpuUsage: 30,    // Simulated
        responseTime: timeSinceActivity,
        errorRate: 0,
        taskQueueSize: 0
      },
      issues,
      lastReported: new Date()
    };
  }

  private async handleCriticalHealth(process: ProcessInfo, health: HealthReport): Promise<void> {
    console.log(`🚨 Critical health issue detected for process ${process.pid}`);
    
    if (health.status === 'unresponsive') {
      // Attempt restart
      try {
        await this.restartProcess(process.pid);
      } catch (error) {
        console.error(`Failed to restart unresponsive process ${process.pid}:`, error);
        // Escalate to system administrator
        await this.emitSystemEvent({
          id: `event-${Date.now()}`,
          type: 'error-event',
          source: this.id,
          data: { 
            event: 'process_restart_failed', 
            pid: process.pid, 
            agentId: process.agentId,
            error: error.message 
          },
          priority: 'critical',
          timestamp: new Date()
        });
      }
    }
  }

  private calculateSystemLoad(): number {
    const runningProcesses = Array.from(this.processes.values()).filter(p => p.status === 'running').length;
    const totalProcesses = this.processes.size;
    return totalProcesses > 0 ? (runningProcesses / totalProcesses) * 100 : 0;
  }

  private async handleProcessSpawnRequest(message: AgentMessage): Promise<void> {
    const { agentId, config } = message.data;
    try {
      const pid = await this.spawnProcess(agentId, config);
      
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'process-spawn-response',
          data: { success: true, pid },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    } catch (error) {
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'process-spawn-response',
          data: { success: false, error: error.message },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    }
  }

  private async handleProcessTerminateRequest(message: AgentMessage): Promise<void> {
    const { pid } = message.data;
    try {
      await this.terminateProcess(pid);
      
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'process-terminate-response',
          data: { success: true },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    } catch (error) {
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'process-terminate-response',
          data: { success: false, error: error.message },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    }
  }

  private async handleHealthCheckRequest(message: AgentMessage): Promise<void> {
    const healthReports = await this.monitorProcessHealth();
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'health-check-response',
      data: { healthReports },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}