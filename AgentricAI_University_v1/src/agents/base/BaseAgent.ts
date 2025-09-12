// Base agent class for all AgentricAI University agents

import { 
  AgentOSInterface,
  ResourceRequest,
  ResourceAllocation,
  SystemMessage,
  MessageHandler,
  IAgent, 
  AgentConfig, 
  AgentMessage, 
  AgentMemory, 
  AgentMetrics, 
  NeurodiverseProfile,
  AgentEvent 
} from './AgentInterface';

export abstract class BaseAgent implements IAgent, AgentOSInterface {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly version: string;
  public config: AgentConfig;
  public memory: AgentMemory;
  public metrics: AgentMetrics;

  private resourceAllocations: Map<string, ResourceAllocation> = new Map();
  private eventListeners: Map<string, ((event: AgentEvent) => void)[]> = new Map();
  private isRunning: boolean = false;
  private isPaused: boolean = false;

  constructor(config: AgentConfig) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.version = config.version;
    this.config = config;
    
    this.memory = {
      shortTerm: new Map(),
      longTerm: new Map(),
      workingMemory: {},
      lastAccessed: new Date(),
      memorySize: 0
    };

    this.metrics = {
      tasksCompleted: 0,
      averageResponseTime: 0,
      errorRate: 0,
      memoryUsage: 0,
      uptime: 0,
      lastActivity: new Date(),
      performanceScore: 100
    };
  }

  // Lifecycle Methods
  async initialize(): Promise<void> {
    console.log(`🤖 Initializing agent: ${this.name}`);
    await this.loadConfiguration();
    await this.initializeMemory();
    this.emitEvent('agent.initialized', { agentId: this.id });
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    console.log(`▶️ Starting agent: ${this.name}`);
    this.isRunning = true;
    this.isPaused = false;
    await this.onStart();
    this.emitEvent('agent.started', { agentId: this.id });
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    console.log(`⏹️ Stopping agent: ${this.name}`);
    this.isRunning = false;
    await this.onStop();
    this.emitEvent('agent.stopped', { agentId: this.id });
  }

  async pause(): Promise<void> {
    if (!this.isRunning || this.isPaused) return;
    
    console.log(`⏸️ Pausing agent: ${this.name}`);
    this.isPaused = true;
    await this.onPause();
    this.emitEvent('agent.paused', { agentId: this.id });
  }

  async resume(): Promise<void> {
    if (!this.isRunning || !this.isPaused) return;
    
    console.log(`▶️ Resuming agent: ${this.name}`);
    this.isPaused = false;
    await this.onResume();
    this.emitEvent('agent.resumed', { agentId: this.id });
  }

  async shutdown(): Promise<void> {
    console.log(`🔄 Shutting down agent: ${this.name}`);
    await this.stop();
    await this.saveState();
    this.emitEvent('agent.shutdown', { agentId: this.id });
  }

  // Communication Methods
  async sendMessage(targetAgentId: string, message: AgentMessage): Promise<string> {
    if (!this.isRunning || this.isPaused) {
      throw new Error(`Agent ${this.name} is not available for communication`);
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    message.id = messageId;
    message.fromAgentId = this.id;
    message.toAgentId = targetAgentId;
    message.timestamp = new Date();

    // Route through communication system
    await this.routeMessage(message);
    
    this.metrics.lastActivity = new Date();
    return messageId;
  }

  async receiveMessage(message: AgentMessage): Promise<void> {
    if (!this.isRunning || this.isPaused) {
      console.warn(`Agent ${this.name} received message while not available`);
      return;
    }

    try {
      await this.processMessage(message);
      this.metrics.lastActivity = new Date();
    } catch (error) {
      await this.handleError(error as Error, { message });
    }
  }

  async broadcastMessage(message: AgentMessage): Promise<void> {
    message.toAgentId = 'broadcast';
    await this.sendMessage('communication-router', message);
  }

  subscribeToEvents(eventType: string, callback: (event: AgentEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  // Processing Methods
  abstract processTask(taskData: any): Promise<any>;

  async handleError(error: Error, context: any): Promise<void> {
    console.error(`❌ Error in agent ${this.name}:`, error);
    
    this.metrics.errorRate += 1;
    
    const errorEvent: AgentEvent = {
      id: `error-${Date.now()}`,
      type: 'agent.error',
      agentId: this.id,
      data: { error: error.message, context },
      timestamp: new Date(),
      severity: 'error'
    };

    this.emitEvent('agent.error', errorEvent);
    
    // Attempt recovery
    await this.attemptRecovery(error, context);
  }

  validateInput(input: any): boolean {
    // Basic validation - override in specific agents
    return input !== null && input !== undefined;
  }

  formatOutput(output: any): any {
    // Basic formatting - override in specific agents
    return {
      agentId: this.id,
      timestamp: new Date(),
      data: output
    };
  }

  // Memory Management
  storeMemory(key: string, value: any, type: 'short' | 'long' | 'working' = 'short'): void {
    switch (type) {
      case 'short':
        this.memory.shortTerm.set(key, value);
        break;
      case 'long':
        this.memory.longTerm.set(key, value);
        break;
      case 'working':
        this.memory.workingMemory[key] = value;
        break;
    }
    
    this.memory.lastAccessed = new Date();
    this.updateMemorySize();
  }

  retrieveMemory(key: string, type: 'short' | 'long' | 'working' = 'short'): any {
    this.memory.lastAccessed = new Date();
    
    switch (type) {
      case 'short':
        return this.memory.shortTerm.get(key);
      case 'long':
        return this.memory.longTerm.get(key);
      case 'working':
        return this.memory.workingMemory[key];
      default:
        return null;
    }
  }

  clearMemory(type?: 'short' | 'long' | 'working'): void {
    if (!type) {
      this.memory.shortTerm.clear();
      this.memory.longTerm.clear();
      this.memory.workingMemory = {};
    } else {
      switch (type) {
        case 'short':
          this.memory.shortTerm.clear();
          break;
        case 'long':
          this.memory.longTerm.clear();
          break;
        case 'working':
          this.memory.workingMemory = {};
          break;
      }
    }
    
    this.updateMemorySize();
  }

  async optimizeMemory(): Promise<void> {
    // Remove old short-term memories
    const cutoffTime = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    
    for (const [key, value] of this.memory.shortTerm.entries()) {
      if (value.timestamp && value.timestamp < cutoffTime) {
        this.memory.shortTerm.delete(key);
      }
    }
    
    this.updateMemorySize();
  }

  // Neurodiverse Optimization
  async adaptToProfile(profile: NeurodiverseProfile): Promise<void> {
    this.storeMemory('neurodiverse_profile', profile, 'long');
    await this.applyNeurodiverseOptimizations(profile);
  }

  generateChildFriendlyResponse(data: any): string {
    // Default child-friendly response - override in specific agents
    return "Great job! I'm here to help you learn and have fun! 🌟";
  }

  applySensoryOptimizations(content: any): any {
    const profile = this.retrieveMemory('neurodiverse_profile', 'long') as NeurodiverseProfile;
    
    if (!profile) return content;

    // Apply sensory optimizations based on profile
    if (profile.sensoryPreferences.visualComplexity === 'low') {
      content.visualComplexity = 'minimal';
    }
    
    if (!profile.sensoryPreferences.audioEnabled) {
      content.audio = false;
    }
    
    if (profile.sensoryPreferences.animationSpeed === 'slow') {
      content.animationDuration = content.animationDuration * 2;
    }

    return content;
  }

  // Monitoring and Metrics
  getStatus(): string {
    if (!this.isRunning) return 'stopped';
    if (this.isPaused) return 'paused';
    return 'active';
  }

  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }

  getHealth(): { status: string; issues: string[] } {
    const issues: string[] = [];
    
    if (this.metrics.errorRate > 10) {
      issues.push('High error rate detected');
    }
    
    if (this.metrics.memoryUsage > 80) {
      issues.push('High memory usage');
    }
    
    if (this.metrics.averageResponseTime > 5000) {
      issues.push('Slow response times');
    }

    return {
      status: issues.length === 0 ? 'healthy' : 'warning',
      issues
    };
  }

  updateMetrics(metrics: Partial<AgentMetrics>): void {
    this.metrics = { ...this.metrics, ...metrics };
  }

  // Configuration
  async updateConfig(newConfig: Partial<AgentConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.onConfigUpdate();
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }

  isCapable(capability: string): boolean {
    return this.config.capabilities.includes(capability);
  }

  // Safety and Security
  validateSafety(action: any, context: any): boolean {
    // Basic safety validation - override in specific agents
    return true;
  }

  async reportSafetyIssue(issue: any): Promise<void> {
    const safetyEvent: AgentEvent = {
      id: `safety-${Date.now()}`,
      type: 'safety.issue',
      agentId: this.id,
      data: issue,
      timestamp: new Date(),
      severity: 'critical'
    };

    this.emitEvent('safety.issue', safetyEvent);
  }

  async emergencyStop(): Promise<void> {
    console.log(`🚨 Emergency stop triggered for agent: ${this.name}`);
    await this.stop();
    this.emitEvent('agent.emergency_stop', { agentId: this.id });
  }

  // Protected methods for subclasses to override
  protected async onStart(): Promise<void> {
    // Override in subclasses
  }

  protected async onStop(): Promise<void> {
    // Override in subclasses
  }

  protected async onPause(): Promise<void> {
    // Override in subclasses
  }

  protected async onResume(): Promise<void> {
    // Override in subclasses
  }

  protected async onConfigUpdate(): Promise<void> {
    // Override in subclasses
  }

  protected abstract processMessage(message: AgentMessage): Promise<void>;

  protected async applyNeurodiverseOptimizations(profile: NeurodiverseProfile): Promise<void> {
    // Override in subclasses for specific optimizations
  }

  // Private helper methods
  private async loadConfiguration(): Promise<void> {
    // Load agent-specific configuration
  }

  private async initializeMemory(): Promise<void> {
    // Initialize memory structures
  }

  private async saveState(): Promise<void> {
    // Save agent state for recovery
  }

  private async routeMessage(message: AgentMessage): Promise<void> {
    // Route message through communication system
    // This would integrate with the MessageRouter agent
  }

  private async attemptRecovery(error: Error, context: any): Promise<void> {
    // Attempt to recover from error
    console.log(`🔄 Attempting recovery for agent: ${this.name}`);
  }

  private updateMemorySize(): void {
    const shortTermSize = this.memory.shortTerm.size;
    const longTermSize = this.memory.longTerm.size;
    const workingMemorySize = Object.keys(this.memory.workingMemory).length;
    
    this.memory.memorySize = shortTermSize + longTermSize + workingMemorySize;
    this.metrics.memoryUsage = this.memory.memorySize;
  }

  private emitEvent(eventType: string, data: any): void {
    const event: AgentEvent = {
      id: `event-${Date.now()}`,
      type: eventType,
      agentId: this.id,
      data,
      timestamp: new Date(),
      severity: 'info'
    };

    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }

    // Also emit to global event system
    window.dispatchEvent(new CustomEvent('agentEvent', { detail: event }));
  }

  // AgentOSInterface Implementation
  async requestSystemResources(resources: ResourceRequest): Promise<ResourceAllocation> {
    console.log(`🔧 ${this.name} requesting system resources:`, resources);
    
    // In a real implementation, this would communicate with the ResourceAllocator
    // For now, we'll simulate resource allocation
    const allocationId = `alloc-${this.id}-${Date.now()}`;
    const allocation: ResourceAllocation = {
      allocationId,
      expiresAt: resources.duration ? new Date(Date.now() + resources.duration) : undefined
    };

    // Simulate resource allocation based on request
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

    this.resourceAllocations.set(allocationId, allocation);
    return allocation;
  }

  async releaseResources(allocationId: string): Promise<void> {
    console.log(`🧹 ${this.name} releasing resources: ${allocationId}`);
    this.resourceAllocations.delete(allocationId);
  }

  async updateResourceUsage(allocationId: string, usage: any): Promise<void> {
    const allocation = this.resourceAllocations.get(allocationId);
    if (allocation) {
      console.log(`📊 ${this.name} updating resource usage for ${allocationId}:`, usage);
    }
  }

  async registerWithOS(): Promise<void> {
    console.log(`📝 Registering ${this.name} with AgentricAI OS`);
    this.storeMemory('os_registration', {
      registered: true,
      registeredAt: new Date(),
      agentId: this.id,
      capabilities: this.config.capabilities
    }, 'long');
  }

  async unregisterFromOS(): Promise<void> {
    console.log(`📝 Unregistering ${this.name} from AgentricAI OS`);
    this.clearMemory('long');
  }

  async updateRegistration(updates: any): Promise<void> {
    const registration = this.retrieveMemory('os_registration', 'long') || {};
    this.storeMemory('os_registration', { ...registration, ...updates }, 'long');
  }

  async reportHealthToOS(): Promise<void> {
    const health = this.getHealth();
    console.log(`🏥 ${this.name} reporting health to OS:`, health.status);
  }

  async getSystemHealth(): Promise<any> {
    return {
      agent: this.getHealth(),
      metrics: this.getMetrics(),
      status: this.getStatus(),
      resourceAllocations: this.resourceAllocations.size
    };
  }

  subscribeToSystemEvents(): void {
    console.log(`📡 ${this.name} subscribing to system events`);
    // Subscribe to system-wide events
    window.addEventListener('systemEvent', this.handleSystemEvent.bind(this));
  }

  unsubscribeFromSystemEvents(): void {
    console.log(`📡 ${this.name} unsubscribing from system events`);
    window.removeEventListener('systemEvent', this.handleSystemEvent.bind(this));
  }

  async emitSystemEvent(event: SystemMessage): Promise<void> {
    console.log(`📢 ${this.name} emitting system event:`, event.type);
    window.dispatchEvent(new CustomEvent('systemEvent', { detail: event }));
  }

  async discoverServices(): Promise<string[]> {
    return this.config.capabilities;
  }

  async requestService(request: any): Promise<any> {
    return { success: true, data: `Service response from ${this.name}` };
  }

  async registerService(serviceType: string, handler: any): Promise<void> {
    console.log(`📋 ${this.name} registering service: ${serviceType}`);
    this.storeMemory(`service_${serviceType}`, handler, 'long');
  }

  // System event handler
  private handleSystemEvent(event: CustomEvent): void {
    const systemMessage = event.detail as SystemMessage;
    
    // Handle system events relevant to this agent
    if (systemMessage.target === this.id || systemMessage.target === 'broadcast') {
      console.log(`📨 ${this.name} received system event:`, systemMessage.type);
      this.processSystemEvent(systemMessage);
    }
  }

  // Override in subclasses to handle specific system events
  protected processSystemEvent(event: SystemMessage): void {
    // Default implementation - can be overridden by specific agents
  }
}

export { BaseAgent }