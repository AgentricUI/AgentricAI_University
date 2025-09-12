// Message Router Agent - Inter-agent message routing for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { ICommunicationAgent } from '../base/AgentInterface';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';

export class MessageRouter extends BaseAgent implements ICommunicationAgent {
  private routingTable: Map<string, string[]> = new Map();
  private messageQueue: Map<string, AgentMessage[]> = new Map();
  private deliveryHistory: Map<string, any> = new Map();
  private agentRegistry: Map<string, any> = new Map();
  private routingRules: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'message-router-001',
      name: 'AgentricAI Message Router',
      type: 'communication-router',
      version: '1.0.0',
      capabilities: [
        'message-routing',
        'agent-discovery',
        'load-balancing',
        'message-queuing',
        'delivery-guarantee',
        'routing-optimization'
      ],
      specialization: 'inter_agent_message_routing',
      neurodiverseOptimized: false,
      priority: 'critical',
      memoryAllocation: '1.0GB',
      status: 'initializing'
    };

    super(config);
    this.initializeRoutingTable();
    this.initializeRoutingRules();
    this.startMessageProcessor();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'route_message':
        return await this.routeMessage(data.message);
      
      case 'register_agent':
        return await this.registerAgent(data.agentId, data.capabilities);
      
      case 'discover_agents':
        return this.discoverAgents(data.capability);
      
      case 'manage_workflow':
        return await this.manageWorkflow(data.workflowId);
      
      case 'coordinate_agents':
        return await this.coordinateAgents(data.agentIds, data.task);
      
      case 'emergency_broadcast':
        return await this.handleEmergencyBroadcast(data.message);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async routeMessage(message: AgentMessage): Promise<void> {
    console.log(`📨 Routing message from ${message.fromAgentId} to ${message.toAgentId}`);
    
    // Validate message
    if (!this.validateMessage(message)) {
      throw new Error('Invalid message format');
    }

    // Check if target agent is registered
    if (message.toAgentId !== 'broadcast' && !this.agentRegistry.has(message.toAgentId)) {
      throw new Error(`Target agent not found: ${message.toAgentId}`);
    }

    // Apply routing rules
    const routingDecision = await this.applyRoutingRules(message);
    
    if (routingDecision.queue) {
      // Queue message for later delivery
      await this.queueMessage(message);
    } else if (routingDecision.route) {
      // Route immediately
      await this.deliverMessage(message);
    } else {
      // Drop message (with logging)
      await this.logDroppedMessage(message, routingDecision.reason);
    }

    this.metrics.tasksCompleted += 1;
  }

  async registerAgent(agentId: string, capabilities: string[]): Promise<void> {
    console.log(`📝 Registering agent: ${agentId} with capabilities: ${capabilities.join(', ')}`);
    
    const registration = {
      agentId,
      capabilities,
      registeredAt: new Date(),
      status: 'active',
      messageCount: 0,
      lastActivity: new Date(),
      loadLevel: 0
    };

    this.agentRegistry.set(agentId, registration);
    
    // Update routing table
    for (const capability of capabilities) {
      if (!this.routingTable.has(capability)) {
        this.routingTable.set(capability, []);
      }
      this.routingTable.get(capability)!.push(agentId);
    }

    // Notify ecosystem of new agent
    await this.emitSystemEvent({
      id: `agent-registered-${Date.now()}`,
      type: 'agent-event',
      source: this.id,
      data: { event: 'agent_registered', agentId, capabilities },
      priority: 'normal',
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
  }

  discoverAgents(capability?: string): string[] {
    if (capability) {
      return this.routingTable.get(capability) || [];
    }
    
    return Array.from(this.agentRegistry.keys());
  }

  async manageWorkflow(workflowId: string): Promise<void> {
    console.log(`🔄 Managing workflow: ${workflowId}`);
    
    const workflow = this.retrieveMemory(`workflow_${workflowId}`, 'short');
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    // Process workflow steps
    for (const step of workflow.steps) {
      await this.executeWorkflowStep(step, workflowId);
    }

    // Mark workflow as completed
    workflow.status = 'completed';
    workflow.completedAt = new Date();
    this.storeMemory(`workflow_${workflowId}`, workflow, 'short');

    this.metrics.tasksCompleted += 1;
  }

  async coordinateAgents(agentIds: string[], task: any): Promise<any> {
    console.log(`🤝 Coordinating agents: ${agentIds.join(', ')} for task: ${task.type}`);
    
    const coordination = {
      coordinationId: `coord-${Date.now()}`,
      agentIds,
      task,
      startTime: new Date(),
      steps: [],
      results: {},
      status: 'in_progress'
    };

    // Validate all agents are available
    for (const agentId of agentIds) {
      if (!this.agentRegistry.has(agentId)) {
        throw new Error(`Agent not available: ${agentId}`);
      }
    }

    // Distribute task among agents
    const taskDistribution = this.distributeTask(task, agentIds);
    
    // Send tasks to agents
    for (const [agentId, subtask] of Object.entries(taskDistribution)) {
      await this.sendMessage(agentId, {
        id: '',
        fromAgentId: this.id,
        toAgentId: agentId,
        type: 'coordinated-task',
        data: { 
          coordinationId: coordination.coordinationId,
          subtask,
          dependencies: subtask.dependencies || []
        },
        priority: task.priority || 'medium',
        timestamp: new Date(),
        requiresResponse: true
      });
    }

    // Store coordination info
    this.storeMemory(`coordination_${coordination.coordinationId}`, coordination, 'short');

    this.metrics.tasksCompleted += 1;
    return coordination;
  }

  async handleEmergencyBroadcast(message: AgentMessage): Promise<void> {
    console.log(`🚨 Handling emergency broadcast: ${message.type}`);
    
    // Set highest priority
    message.priority = 'critical';
    
    // Broadcast to all registered agents
    const allAgents = Array.from(this.agentRegistry.keys());
    
    for (const agentId of allAgents) {
      const emergencyMessage = {
        ...message,
        toAgentId: agentId,
        id: `emergency-${Date.now()}-${agentId}`
      };
      
      await this.deliverMessage(emergencyMessage);
    }

    // Log emergency broadcast
    await this.logEmergencyBroadcast(message);

    this.metrics.tasksCompleted += 1;
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'route-request':
        await this.handleRouteRequest(message);
        break;
      
      case 'agent-registration':
        await this.handleAgentRegistration(message);
        break;
      
      case 'workflow-coordination':
        await this.handleWorkflowCoordination(message);
        break;
      
      case 'emergency-broadcast':
        await this.handleEmergencyBroadcast(message);
        break;
      
      default:
        // Route unknown messages
        await this.routeMessage(message);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm like the mail carrier for all the learning helpers - I make sure messages get delivered! 📬✨",
      "I help all the computer helpers talk to each other so they can help you better! 💬🤖",
      "I'm the communication helper that makes sure everyone works together! 🤝💫",
      "I deliver messages between all the learning helpers super fast! ⚡📨",
      "I'm like the telephone operator for all the smart helpers! ☎️🌟"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private initializeRoutingTable(): void {
    // Initialize routing table with agent capabilities
    this.routingTable.set('learning-assessment', ['learning-coordinator']);
    this.routingTable.set('behavior-analysis', ['behavior-analyst']);
    this.routingTable.set('content-generation', ['content-generator']);
    this.routingTable.set('error-handling', ['error-handler']);
    this.routingTable.set('knowledge-management', ['knowledge-manager']);
    this.routingTable.set('memory-optimization', ['memory-optimizer']);
    this.routingTable.set('data-analysis', ['data-analyst']);
  }

  private initializeRoutingRules(): void {
    this.routingRules.set('priority_routing', {
      critical: { maxDelay: 0, retries: 3 },
      high: { maxDelay: 100, retries: 2 },
      medium: { maxDelay: 500, retries: 1 },
      low: { maxDelay: 2000, retries: 0 }
    });

    this.routingRules.set('load_balancing', {
      enabled: true,
      algorithm: 'round_robin',
      maxLoadPerAgent: 10
    });

    this.routingRules.set('message_filtering', {
      duplicateDetection: true,
      spamPrevention: true,
      contentValidation: true
    });
  }

  private startMessageProcessor(): void {
    // Process queued messages every 100ms
    setInterval(async () => {
      await this.processMessageQueue();
    }, 100);
  }

  private validateMessage(message: AgentMessage): boolean {
    return !!(message.fromAgentId && 
             message.toAgentId && 
             message.type && 
             message.data);
  }

  private async applyRoutingRules(message: AgentMessage): Promise<any> {
    const decision = {
      route: true,
      queue: false,
      drop: false,
      reason: '',
      delay: 0
    };

    // Check priority rules
    const priorityRule = this.routingRules.get('priority_routing')[message.priority];
    if (priorityRule) {
      decision.delay = priorityRule.maxDelay;
    }

    // Check load balancing
    const loadRule = this.routingRules.get('load_balancing');
    if (loadRule.enabled) {
      const targetAgent = this.agentRegistry.get(message.toAgentId);
      if (targetAgent && targetAgent.loadLevel > loadRule.maxLoadPerAgent) {
        decision.queue = true;
        decision.route = false;
        decision.reason = 'target_agent_overloaded';
      }
    }

    // Check message filtering
    const filterRule = this.routingRules.get('message_filtering');
    if (filterRule.duplicateDetection && await this.isDuplicateMessage(message)) {
      decision.drop = true;
      decision.route = false;
      decision.reason = 'duplicate_message';
    }

    return decision;
  }

  private async queueMessage(message: AgentMessage): Promise<void> {
    const targetQueue = message.toAgentId;
    
    if (!this.messageQueue.has(targetQueue)) {
      this.messageQueue.set(targetQueue, []);
    }
    
    this.messageQueue.get(targetQueue)!.push(message);
    
    // Sort queue by priority
    this.messageQueue.get(targetQueue)!.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async deliverMessage(message: AgentMessage): Promise<void> {
    try {
      // Simulate message delivery
      console.log(`📬 Delivering message ${message.id} to ${message.toAgentId}`);
      
      // Update agent load
      const targetAgent = this.agentRegistry.get(message.toAgentId);
      if (targetAgent) {
        targetAgent.messageCount += 1;
        targetAgent.lastActivity = new Date();
        targetAgent.loadLevel = Math.min(10, targetAgent.loadLevel + 1);
      }

      // Log delivery
      this.deliveryHistory.set(message.id, {
        messageId: message.id,
        fromAgent: message.fromAgentId,
        toAgent: message.toAgentId,
        deliveredAt: new Date(),
        deliveryTime: Date.now() - message.timestamp.getTime(),
        status: 'delivered'
      });

      // Emit delivery event
      await this.emitSystemEvent({
        id: `message-delivered-${Date.now()}`,
        type: 'system-event',
        source: this.id,
        data: { 
          event: 'message_delivered',
          messageId: message.id,
          route: `${message.fromAgentId} → ${message.toAgentId}`
        },
        priority: 'low',
        timestamp: new Date()
      });

    } catch (error) {
      console.error(`Failed to deliver message ${message.id}:`, error);
      
      // Log delivery failure
      this.deliveryHistory.set(message.id, {
        messageId: message.id,
        fromAgent: message.fromAgentId,
        toAgent: message.toAgentId,
        failedAt: new Date(),
        error: error.message,
        status: 'failed'
      });
      
      // Retry if appropriate
      if (message.priority === 'critical' || message.priority === 'high') {
        await this.queueMessage(message);
      }
    }
  }

  private async processMessageQueue(): Promise<void> {
    for (const [agentId, queue] of this.messageQueue.entries()) {
      if (queue.length === 0) continue;
      
      const agent = this.agentRegistry.get(agentId);
      if (!agent || agent.loadLevel >= 10) continue; // Agent overloaded
      
      // Process next message in queue
      const message = queue.shift();
      if (message) {
        await this.deliverMessage(message);
      }
    }
  }

  private async executeWorkflowStep(step: any, workflowId: string): Promise<void> {
    console.log(`⚙️ Executing workflow step: ${step.action} for workflow: ${workflowId}`);
    
    // Find appropriate agent for this step
    const capableAgents = this.routingTable.get(step.capability) || [];
    
    if (capableAgents.length === 0) {
      throw new Error(`No agents capable of: ${step.capability}`);
    }

    // Select best agent (load balancing)
    const selectedAgent = this.selectOptimalAgent(capableAgents);
    
    // Send workflow step to agent
    await this.sendMessage(selectedAgent, {
      id: '',
      fromAgentId: this.id,
      toAgentId: selectedAgent,
      type: 'workflow-step',
      data: {
        workflowId,
        step,
        inputData: step.inputData
      },
      priority: 'high',
      timestamp: new Date(),
      requiresResponse: true
    });
  }

  private distributeTask(task: any, agentIds: string[]): any {
    const distribution = {};
    
    // Simple task distribution - can be enhanced with more sophisticated algorithms
    const subtasks = this.breakdownTask(task);
    
    agentIds.forEach((agentId, index) => {
      if (index < subtasks.length) {
        distribution[agentId] = subtasks[index];
      }
    });

    return distribution;
  }

  private breakdownTask(task: any): any[] {
    // Break down task into subtasks based on type
    switch (task.type) {
      case 'learning_assessment':
        return [
          { type: 'analyze_behavior', capability: 'behavior-analysis' },
          { type: 'assess_progress', capability: 'learning-assessment' },
          { type: 'generate_report', capability: 'data-analysis' }
        ];
      
      case 'content_adaptation':
        return [
          { type: 'analyze_preferences', capability: 'behavior-analysis' },
          { type: 'adapt_content', capability: 'content-generation' },
          { type: 'optimize_sensory', capability: 'sensory-optimization' }
        ];
      
      default:
        return [{ type: task.type, capability: 'general' }];
    }
  }

  private selectOptimalAgent(agentIds: string[]): string {
    // Select agent with lowest load
    let optimalAgent = agentIds[0];
    let lowestLoad = Infinity;
    
    for (const agentId of agentIds) {
      const agent = this.agentRegistry.get(agentId);
      if (agent && agent.loadLevel < lowestLoad) {
        lowestLoad = agent.loadLevel;
        optimalAgent = agentId;
      }
    }
    
    return optimalAgent;
  }

  private async isDuplicateMessage(message: AgentMessage): Promise<boolean> {
    // Check recent delivery history for duplicates
    const recentDeliveries = Array.from(this.deliveryHistory.values())
      .filter(d => d.deliveredAt > new Date(Date.now() - 60000)); // Last minute
    
    return recentDeliveries.some(d => 
      d.fromAgent === message.fromAgentId &&
      d.toAgent === message.toAgentId &&
      JSON.stringify(d.data) === JSON.stringify(message.data)
    );
  }

  private async logDroppedMessage(message: AgentMessage, reason: string): Promise<void> {
    console.warn(`📉 Dropped message ${message.id}: ${reason}`);
    
    this.deliveryHistory.set(message.id, {
      messageId: message.id,
      fromAgent: message.fromAgentId,
      toAgent: message.toAgentId,
      droppedAt: new Date(),
      reason,
      status: 'dropped'
    });
  }

  private async logEmergencyBroadcast(message: AgentMessage): Promise<void> {
    console.log(`🚨 Emergency broadcast logged: ${message.type}`);
    
    this.storeMemory(`emergency_${Date.now()}`, {
      messageType: message.type,
      broadcastAt: new Date(),
      agentCount: this.agentRegistry.size,
      priority: message.priority
    }, 'long');
  }

  private async handleRouteRequest(message: AgentMessage): Promise<void> {
    await this.routeMessage(message.data.targetMessage);
  }

  private async handleAgentRegistration(message: AgentMessage): Promise<void> {
    const { agentId, capabilities } = message.data;
    await this.registerAgent(agentId, capabilities);
  }

  private async handleWorkflowCoordination(message: AgentMessage): Promise<void> {
    const { workflowId } = message.data;
    await this.manageWorkflow(workflowId);
  }
}