// Workflow Orchestrator Agent - Workflow coordination for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage, AgentWorkflow, WorkflowStep } from '../base/AgentTypes';

export class WorkflowOrchestrator extends BaseAgent {
  private activeWorkflows: Map<string, AgentWorkflow> = new Map();
  private workflowTemplates: Map<string, any> = new Map();
  private executionHistory: Map<string, any> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'workflow-orchestrator-001',
      name: 'AgentricAI Workflow Orchestrator',
      type: 'communication-router',
      version: '1.0.0',
      capabilities: [
        'workflow-orchestration',
        'dependency-management',
        'parallel-execution',
        'error-recovery',
        'workflow-optimization',
        'template-management'
      ],
      specialization: 'workflow_coordination',
      neurodiverseOptimized: false,
      priority: 'high',
      memoryAllocation: '1.5GB',
      status: 'initializing'
    };

    super(config);
    this.initializeWorkflowTemplates();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'create_workflow':
        return await this.createWorkflow(data.template, data.parameters);
      
      case 'execute_workflow':
        return await this.executeWorkflow(data.workflowId);
      
      case 'pause_workflow':
        return await this.pauseWorkflow(data.workflowId);
      
      case 'resume_workflow':
        return await this.resumeWorkflow(data.workflowId);
      
      case 'cancel_workflow':
        return await this.cancelWorkflow(data.workflowId);
      
      case 'get_workflow_status':
        return this.getWorkflowStatus(data.workflowId);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async createWorkflow(templateName: string, parameters: any): Promise<string> {
    console.log(`🔧 Creating workflow from template: ${templateName}`);
    
    const template = this.workflowTemplates.get(templateName);
    if (!template) {
      throw new Error(`Workflow template not found: ${templateName}`);
    }

    const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const workflow: AgentWorkflow = {
      id: workflowId,
      name: template.name,
      description: template.description,
      steps: this.instantiateWorkflowSteps(template.steps, parameters),
      status: 'created',
      priority: parameters.priority || 'medium',
      createdAt: new Date()
    };

    // Build dependency graph
    this.buildDependencyGraph(workflow);
    
    // Store workflow
    this.activeWorkflows.set(workflowId, workflow);
    this.storeMemory(`workflow_${workflowId}`, workflow, 'short');

    // Emit workflow created event
    await this.emitSystemEvent({
      id: `workflow-created-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { 
        event: 'workflow_created',
        workflowId,
        templateName,
        stepCount: workflow.steps.length
      },
      priority: 'normal',
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
    return workflowId;
  }

  async executeWorkflow(workflowId: string): Promise<any> {
    console.log(`▶️ Executing workflow: ${workflowId}`);
    
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (workflow.status !== 'created' && workflow.status !== 'paused') {
      throw new Error(`Cannot execute workflow in ${workflow.status} state`);
    }

    workflow.status = 'running';
    
    const execution = {
      workflowId,
      startTime: new Date(),
      steps: [],
      errors: [],
      status: 'running'
    };

    try {
      // Execute steps based on dependencies
      const executionOrder = this.calculateExecutionOrder(workflow);
      
      for (const stepId of executionOrder) {
        const step = workflow.steps.find(s => s.id === stepId);
        if (!step) continue;

        const stepResult = await this.executeWorkflowStep(step, workflow);
        execution.steps.push(stepResult);
        
        if (stepResult.status === 'failed') {
          execution.errors.push(stepResult.error);
          
          // Handle step failure
          const recoveryAction = await this.handleStepFailure(step, stepResult, workflow);
          if (recoveryAction === 'abort') {
            workflow.status = 'failed';
            execution.status = 'failed';
            break;
          }
        }
      }

      if (workflow.status === 'running') {
        workflow.status = 'completed';
        workflow.completedAt = new Date();
        execution.status = 'completed';
      }

    } catch (error) {
      console.error(`Workflow execution failed:`, error);
      workflow.status = 'failed';
      execution.status = 'failed';
      execution.errors.push(error.message);
    }

    execution.endTime = new Date();
    execution.duration = execution.endTime.getTime() - execution.startTime.getTime();

    // Store execution history
    this.executionHistory.set(workflowId, execution);
    this.storeMemory(`execution_${workflowId}`, execution, 'long');

    this.metrics.tasksCompleted += 1;
    return execution;
  }

  async pauseWorkflow(workflowId: string): Promise<void> {
    console.log(`⏸️ Pausing workflow: ${workflowId}`);
    
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (workflow.status !== 'running') {
      throw new Error(`Cannot pause workflow in ${workflow.status} state`);
    }

    workflow.status = 'paused';
    
    // Pause all running steps
    for (const step of workflow.steps) {
      if (step.status === 'in-progress') {
        step.status = 'pending';
      }
    }

    this.metrics.tasksCompleted += 1;
  }

  async resumeWorkflow(workflowId: string): Promise<void> {
    console.log(`▶️ Resuming workflow: ${workflowId}`);
    
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (workflow.status !== 'paused') {
      throw new Error(`Cannot resume workflow in ${workflow.status} state`);
    }

    // Resume execution
    await this.executeWorkflow(workflowId);
  }

  async cancelWorkflow(workflowId: string): Promise<void> {
    console.log(`❌ Cancelling workflow: ${workflowId}`);
    
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    workflow.status = 'failed';
    
    // Cancel all pending steps
    for (const step of workflow.steps) {
      if (step.status === 'pending' || step.status === 'in-progress') {
        step.status = 'failed';
      }
    }

    // Cleanup resources
    await this.cleanupWorkflowResources(workflowId);

    this.metrics.tasksCompleted += 1;
  }

  getWorkflowStatus(workflowId: string): any {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      return { status: 'not_found' };
    }

    const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
    const totalSteps = workflow.steps.length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return {
      workflowId,
      status: workflow.status,
      progress,
      completedSteps,
      totalSteps,
      currentStep: workflow.steps.find(s => s.status === 'in-progress')?.action || null,
      estimatedTimeRemaining: this.estimateTimeRemaining(workflow),
      agentricaiVisualization: {
        panelColor: this.getWorkflowPanelColor(workflow.status),
        progressGlow: workflow.status === 'running'
      }
    };
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'workflow-create-request':
        await this.handleWorkflowCreateRequest(message);
        break;
      
      case 'workflow-execute-request':
        await this.handleWorkflowExecuteRequest(message);
        break;
      
      case 'workflow-step-complete':
        await this.handleWorkflowStepComplete(message);
        break;
      
      case 'workflow-status-request':
        await this.handleWorkflowStatusRequest(message);
        break;
      
      default:
        console.log(`Workflow Orchestrator received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm like the conductor of an orchestra - I make sure all the helpers work together perfectly! 🎼✨",
      "I organize all the learning helpers so they can help you in the right order! 📋🤖",
      "I'm the teamwork helper that makes sure everyone does their part! 🤝💫",
      "I coordinate all the smart helpers like a coach coordinates a team! 🏆⚡",
      "I make sure all the learning helpers work together like a well-oiled machine! ⚙️🌟"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private initializeWorkflowTemplates(): void {
    // Learning Assessment Workflow
    this.workflowTemplates.set('learning_assessment', {
      name: 'Comprehensive Learning Assessment',
      description: 'Analyzes user learning progress and generates recommendations',
      steps: [
        {
          id: 'analyze_behavior',
          action: 'Analyze user behavior patterns',
          agentCapability: 'behavior-analysis',
          dependencies: [],
          timeout: 30000
        },
        {
          id: 'assess_progress',
          action: 'Assess learning progress',
          agentCapability: 'learning-assessment',
          dependencies: ['analyze_behavior'],
          timeout: 20000
        },
        {
          id: 'generate_insights',
          action: 'Generate learning insights',
          agentCapability: 'data-analysis',
          dependencies: ['assess_progress'],
          timeout: 15000
        },
        {
          id: 'create_recommendations',
          action: 'Create personalized recommendations',
          agentCapability: 'learning-assessment',
          dependencies: ['generate_insights'],
          timeout: 10000
        }
      ]
    });

    // Content Adaptation Workflow
    this.workflowTemplates.set('content_adaptation', {
      name: 'Adaptive Content Generation',
      description: 'Creates and optimizes content based on user preferences',
      steps: [
        {
          id: 'analyze_preferences',
          action: 'Analyze user preferences',
          agentCapability: 'behavior-analysis',
          dependencies: [],
          timeout: 20000
        },
        {
          id: 'generate_content',
          action: 'Generate base content',
          agentCapability: 'content-generation',
          dependencies: ['analyze_preferences'],
          timeout: 30000
        },
        {
          id: 'adapt_difficulty',
          action: 'Adapt content difficulty',
          agentCapability: 'difficulty-adaptation',
          dependencies: ['generate_content'],
          timeout: 15000
        },
        {
          id: 'optimize_sensory',
          action: 'Optimize for sensory preferences',
          agentCapability: 'sensory-optimization',
          dependencies: ['adapt_difficulty'],
          timeout: 20000
        }
      ]
    });

    // Error Resolution Workflow
    this.workflowTemplates.set('error_resolution', {
      name: 'Intelligent Error Resolution',
      description: 'Analyzes and resolves errors with child-friendly communication',
      steps: [
        {
          id: 'analyze_error',
          action: 'Analyze error context and impact',
          agentCapability: 'error-handling',
          dependencies: [],
          timeout: 10000
        },
        {
          id: 'generate_fix',
          action: 'Generate safe fix solution',
          agentCapability: 'error-handling',
          dependencies: ['analyze_error'],
          timeout: 15000
        },
        {
          id: 'validate_safety',
          action: 'Validate fix safety',
          agentCapability: 'error-handling',
          dependencies: ['generate_fix'],
          timeout: 5000
        },
        {
          id: 'implement_fix',
          action: 'Implement validated fix',
          agentCapability: 'error-handling',
          dependencies: ['validate_safety'],
          timeout: 20000
        }
      ]
    });

    // Agent Creation Workflow
    this.workflowTemplates.set('agent_creation', {
      name: 'Dynamic Agent Creation',
      description: 'Creates specialized agents based on requirements',
      steps: [
        {
          id: 'analyze_requirements',
          action: 'Analyze agent requirements',
          agentCapability: 'data-analysis',
          dependencies: [],
          timeout: 15000
        },
        {
          id: 'design_agent',
          action: 'Design agent architecture',
          agentCapability: 'agent-design',
          dependencies: ['analyze_requirements'],
          timeout: 30000
        },
        {
          id: 'generate_code',
          action: 'Generate agent code',
          agentCapability: 'code-generation',
          dependencies: ['design_agent'],
          timeout: 45000
        },
        {
          id: 'test_agent',
          action: 'Test agent functionality',
          agentCapability: 'agent-testing',
          dependencies: ['generate_code'],
          timeout: 25000
        },
        {
          id: 'deploy_agent',
          action: 'Deploy agent to ecosystem',
          agentCapability: 'agent-deployment',
          dependencies: ['test_agent'],
          timeout: 20000
        }
      ]
    });
  }

  private instantiateWorkflowSteps(templateSteps: any[], parameters: any): WorkflowStep[] {
    return templateSteps.map(templateStep => ({
      id: templateStep.id,
      agentId: '', // Will be assigned during execution
      action: templateStep.action,
      inputData: this.prepareStepInputData(templateStep, parameters),
      outputData: undefined,
      status: 'pending',
      dependencies: templateStep.dependencies || [],
      timeout: templateStep.timeout || 30000
    }));
  }

  private prepareStepInputData(templateStep: any, parameters: any): any {
    // Prepare input data for the step based on template and parameters
    const inputData = { ...parameters };
    
    // Add step-specific data
    switch (templateStep.id) {
      case 'analyze_behavior':
        inputData.analysisType = 'behavior_patterns';
        break;
      case 'assess_progress':
        inputData.assessmentType = 'comprehensive';
        break;
      case 'generate_content':
        inputData.contentType = parameters.activityType || 'general';
        break;
      case 'adapt_difficulty':
        inputData.targetDifficulty = parameters.difficulty || 'medium';
        break;
    }

    return inputData;
  }

  private buildDependencyGraph(workflow: AgentWorkflow): void {
    const graph = new Map<string, Set<string>>();
    
    for (const step of workflow.steps) {
      graph.set(step.id, new Set(step.dependencies));
    }
    
    this.dependencyGraph.set(workflow.id, graph);
  }

  private calculateExecutionOrder(workflow: AgentWorkflow): string[] {
    const graph = this.dependencyGraph.get(workflow.id);
    if (!graph) return workflow.steps.map(s => s.id);

    // Topological sort for dependency resolution
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (stepId: string) => {
      if (visiting.has(stepId)) {
        throw new Error(`Circular dependency detected involving step: ${stepId}`);
      }
      
      if (visited.has(stepId)) return;
      
      visiting.add(stepId);
      
      const dependencies = graph.get(stepId) || new Set();
      for (const dep of dependencies) {
        visit(dep);
      }
      
      visiting.delete(stepId);
      visited.add(stepId);
      order.push(stepId);
    };

    for (const stepId of graph.keys()) {
      if (!visited.has(stepId)) {
        visit(stepId);
      }
    }

    return order;
  }

  private async executeWorkflowStep(step: WorkflowStep, workflow: AgentWorkflow): Promise<any> {
    console.log(`⚙️ Executing workflow step: ${step.action}`);
    
    const stepExecution = {
      stepId: step.id,
      startTime: new Date(),
      status: 'in-progress',
      agentId: '',
      result: null,
      error: null
    };

    try {
      // Find appropriate agent for this step
      const agentId = await this.findAgentForStep(step);
      step.agentId = agentId;
      stepExecution.agentId = agentId;
      
      // Send task to agent
      const taskMessage: AgentMessage = {
        id: `task-${Date.now()}`,
        fromAgentId: this.id,
        toAgentId: agentId,
        type: 'workflow-task',
        data: {
          workflowId: workflow.id,
          stepId: step.id,
          action: step.action,
          inputData: step.inputData
        },
        priority: workflow.priority,
        timestamp: new Date(),
        requiresResponse: true
      };

      // Wait for response with timeout
      const response = await this.sendMessageWithTimeout(taskMessage, step.timeout);
      
      step.outputData = response.data;
      step.status = 'completed';
      stepExecution.status = 'completed';
      stepExecution.result = response.data;

    } catch (error) {
      console.error(`Step execution failed:`, error);
      step.status = 'failed';
      stepExecution.status = 'failed';
      stepExecution.error = error.message;
    }

    stepExecution.endTime = new Date();
    stepExecution.duration = stepExecution.endTime.getTime() - stepExecution.startTime.getTime();

    return stepExecution;
  }

  private async findAgentForStep(step: WorkflowStep): Promise<string> {
    // Find agent with required capability
    const messageRouter = 'message-router-001'; // Assume message router handles agent discovery
    
    // For now, return a mock agent ID based on capability
    const capabilityAgentMap = {
      'behavior-analysis': 'behavior-analyst-001',
      'learning-assessment': 'learning-coordinator-001',
      'content-generation': 'content-generator-001',
      'data-analysis': 'data-analyst-001',
      'error-handling': 'error-handler-001',
      'sensory-optimization': 'sensory-optimizer-001',
      'difficulty-adaptation': 'difficulty-adapter-001'
    };

    // Extract capability from step action
    const capability = this.extractCapabilityFromAction(step.action);
    const agentId = capabilityAgentMap[capability];
    
    if (!agentId) {
      throw new Error(`No agent found for capability: ${capability}`);
    }

    return agentId;
  }

  private extractCapabilityFromAction(action: string): string {
    const actionCapabilityMap = {
      'Analyze user behavior patterns': 'behavior-analysis',
      'Assess learning progress': 'learning-assessment',
      'Generate learning insights': 'data-analysis',
      'Create personalized recommendations': 'learning-assessment',
      'Analyze user preferences': 'behavior-analysis',
      'Generate base content': 'content-generation',
      'Adapt content difficulty': 'difficulty-adaptation',
      'Optimize for sensory preferences': 'sensory-optimization',
      'Analyze error context and impact': 'error-handling',
      'Generate safe fix solution': 'error-handling',
      'Validate fix safety': 'error-handling',
      'Implement validated fix': 'error-handling'
    };

    return actionCapabilityMap[action] || 'general';
  }

  private async sendMessageWithTimeout(message: AgentMessage, timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Step timeout after ${timeout}ms`));
      }, timeout);

      // Simulate message sending and response
      setTimeout(() => {
        clearTimeout(timeoutId);
        resolve({
          data: { result: 'Step completed successfully', timestamp: new Date() }
        });
      }, Math.random() * 1000 + 500); // 500-1500ms simulated processing
    });
  }

  private async handleStepFailure(step: WorkflowStep, stepResult: any, workflow: AgentWorkflow): Promise<'retry' | 'skip' | 'abort'> {
    console.log(`❌ Handling step failure: ${step.id} in workflow: ${workflow.id}`);
    
    // Determine recovery action based on step importance and error type
    if (step.dependencies.length === 0) {
      // Root step failure - try to retry
      return 'retry';
    }
    
    if (workflow.priority === 'critical') {
      // Critical workflow - abort on failure
      return 'abort';
    }
    
    // Try to skip non-critical steps
    return 'skip';
  }

  private async cleanupWorkflowResources(workflowId: string): Promise<void> {
    console.log(`🧹 Cleaning up resources for workflow: ${workflowId}`);
    
    // Remove from active workflows
    this.activeWorkflows.delete(workflowId);
    
    // Clean up dependency graph
    this.dependencyGraph.delete(workflowId);
    
    // Clear working memory
    this.clearMemory('working');
  }

  private estimateTimeRemaining(workflow: AgentWorkflow): number {
    const pendingSteps = workflow.steps.filter(s => s.status === 'pending');
    const avgStepTime = 15000; // 15 seconds average
    
    return pendingSteps.length * avgStepTime;
  }

  private getWorkflowPanelColor(status: string): string {
    const colorMap = {
      'created': 'neon-blue',
      'running': 'neon-cyan',
      'paused': 'neon-orange',
      'completed': 'neon-lime',
      'failed': 'red-500'
    };
    
    return colorMap[status] || 'stealth-light';
  }

  // Message handlers
  private async handleWorkflowCreateRequest(message: AgentMessage): Promise<void> {
    const { templateName, parameters } = message.data;
    const workflowId = await this.createWorkflow(templateName, parameters);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'workflow-created',
      data: { workflowId },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleWorkflowExecuteRequest(message: AgentMessage): Promise<void> {
    const { workflowId } = message.data;
    const execution = await this.executeWorkflow(workflowId);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'workflow-execution-complete',
      data: { execution },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleWorkflowStepComplete(message: AgentMessage): Promise<void> {
    const { workflowId, stepId, result } = message.data;
    
    const workflow = this.activeWorkflows.get(workflowId);
    if (workflow) {
      const step = workflow.steps.find(s => s.id === stepId);
      if (step) {
        step.outputData = result;
        step.status = 'completed';
      }
    }
  }

  private async handleWorkflowStatusRequest(message: AgentMessage): Promise<void> {
    const { workflowId } = message.data;
    const status = this.getWorkflowStatus(workflowId);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'workflow-status-response',
      data: { status },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}