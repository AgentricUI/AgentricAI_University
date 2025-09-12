// Interaction Monitor Agent - Real-time user interaction monitoring

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';

export class InteractionMonitor extends BaseAgent {
  private activeMonitoring: Map<string, any> = new Map();
  private interactionStreams: Map<string, any[]> = new Map();
  private alertThresholds: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'interaction-monitor-001',
      name: 'Real-time Interaction Monitor',
      type: 'behavior-analyst',
      version: '1.0.0',
      capabilities: [
        'real-time-monitoring',
        'interaction-tracking',
        'alert-generation',
        'pattern-detection',
        'session-analysis'
      ],
      specialization: 'real_time_interaction_monitoring',
      neurodiverseOptimized: true,
      priority: 'high',
      memoryAllocation: '1.5GB',
      status: 'initializing'
    };

    super(config);
  }

  async processTask(taskData: any): Promise<any> {
    const { type, userId, data } = taskData;

    switch (type) {
      case 'start_monitoring':
        return await this.startMonitoring(userId, data.sessionId);
      
      case 'track_interaction':
        return await this.trackInteraction(userId, data.interaction);
      
      case 'analyze_session':
        return await this.analyzeSession(userId, data.sessionId);
      
      case 'stop_monitoring':
        return await this.stopMonitoring(userId);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async startMonitoring(userId: string, sessionId: string): Promise<any> {
    console.log(`🔍 Starting interaction monitoring for user: ${userId}, session: ${sessionId}`);
    
    const monitoringSession = {
      userId,
      sessionId,
      startTime: new Date(),
      interactions: [],
      alerts: [],
      patterns: {},
      status: 'active'
    };

    this.activeMonitoring.set(userId, monitoringSession);
    this.interactionStreams.set(userId, []);
    
    // Set default alert thresholds
    this.alertThresholds.set(userId, {
      frustrationThreshold: 3, // 3 frustration indicators
      inactivityThreshold: 300000, // 5 minutes
      errorThreshold: 5, // 5 consecutive errors
      engagementThreshold: 30 // Below 30% engagement
    });

    this.metrics.tasksCompleted += 1;
    return monitoringSession;
  }

  async trackInteraction(userId: string, interaction: any): Promise<any> {
    const monitoringSession = this.activeMonitoring.get(userId);
    if (!monitoringSession) {
      throw new Error(`No active monitoring session for user: ${userId}`);
    }

    const timestampedInteraction = {
      ...interaction,
      timestamp: new Date(),
      sessionTime: Date.now() - monitoringSession.startTime.getTime()
    };

    // Add to interaction stream
    const stream = this.interactionStreams.get(userId) || [];
    stream.push(timestampedInteraction);
    this.interactionStreams.set(userId, stream);

    // Add to monitoring session
    monitoringSession.interactions.push(timestampedInteraction);

    // Analyze interaction in real-time
    const analysis = await this.analyzeInteractionRealTime(userId, timestampedInteraction);
    
    // Check for alerts
    await this.checkAlertConditions(userId, analysis);

    // Update patterns
    this.updateInteractionPatterns(userId, timestampedInteraction);

    this.metrics.tasksCompleted += 1;
    return analysis;
  }

  async analyzeSession(userId: string, sessionId: string): Promise<any> {
    console.log(`📊 Analyzing session for user: ${userId}, session: ${sessionId}`);
    
    const monitoringSession = this.activeMonitoring.get(userId);
    if (!monitoringSession) {
      throw new Error(`No monitoring session found for user: ${userId}`);
    }

    const interactions = monitoringSession.interactions;
    const sessionDuration = Date.now() - monitoringSession.startTime.getTime();

    const analysis = {
      sessionId,
      userId,
      duration: sessionDuration,
      totalInteractions: interactions.length,
      interactionRate: interactions.length / (sessionDuration / 60000), // per minute
      engagementMetrics: this.calculateEngagementMetrics(interactions),
      behaviorPatterns: this.identifyBehaviorPatterns(interactions),
      alertsSummary: monitoringSession.alerts,
      recommendations: this.generateSessionRecommendations(interactions, monitoringSession.alerts)
    };

    // Store session analysis
    this.storeMemory(`session_analysis_${sessionId}`, analysis, 'long');

    this.metrics.tasksCompleted += 1;
    return analysis;
  }

  async stopMonitoring(userId: string): Promise<any> {
    console.log(`⏹️ Stopping interaction monitoring for user: ${userId}`);
    
    const monitoringSession = this.activeMonitoring.get(userId);
    if (!monitoringSession) {
      return { status: 'no_active_session' };
    }

    monitoringSession.endTime = new Date();
    monitoringSession.status = 'completed';

    // Final analysis
    const finalAnalysis = await this.analyzeSession(userId, monitoringSession.sessionId);

    // Clean up active monitoring
    this.activeMonitoring.delete(userId);
    
    // Keep interaction stream for a while for pattern analysis
    setTimeout(() => {
      this.interactionStreams.delete(userId);
    }, 300000); // 5 minutes

    this.metrics.tasksCompleted += 1;
    return {
      status: 'monitoring_stopped',
      finalAnalysis,
      session: monitoringSession
    };
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'start-monitoring':
        await this.handleStartMonitoring(message);
        break;
      
      case 'interaction-event':
        await this.handleInteractionEvent(message);
        break;
      
      case 'monitoring-status':
        await this.handleMonitoringStatus(message);
        break;
      
      default:
        console.log(`Interaction Monitor received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm watching to make sure you're having fun! 👀✨",
      "I'm here to help if you need anything! 🤝",
      "I can see you're doing great! Keep it up! 🌟",
      "I'm making sure everything is working perfectly for you! 🔧",
      "You're amazing! I love watching you learn! 🎉"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private async analyzeInteractionRealTime(userId: string, interaction: any): Promise<any> {
    const analysis = {
      interactionType: interaction.type,
      timestamp: interaction.timestamp,
      engagementIndicators: this.detectEngagementIndicators(interaction),
      frustrationIndicators: this.detectFrustrationIndicators(interaction),
      successIndicators: this.detectSuccessIndicators(interaction),
      attentionLevel: this.calculateAttentionLevel(interaction),
      needsIntervention: false
    };

    // Determine if intervention is needed
    if (analysis.frustrationIndicators.length > 2 || analysis.attentionLevel < 30) {
      analysis.needsIntervention = true;
    }

    return analysis;
  }

  private async checkAlertConditions(userId: string, analysis: any): Promise<void> {
    const thresholds = this.alertThresholds.get(userId);
    const monitoringSession = this.activeMonitoring.get(userId);
    
    if (!thresholds || !monitoringSession) return;

    // Check frustration threshold
    if (analysis.frustrationIndicators.length >= thresholds.frustrationThreshold) {
      await this.generateAlert(userId, 'high_frustration', {
        indicators: analysis.frustrationIndicators,
        recommendation: 'Consider providing additional support or reducing difficulty'
      });
    }

    // Check engagement threshold
    if (analysis.attentionLevel < thresholds.engagementThreshold) {
      await this.generateAlert(userId, 'low_engagement', {
        attentionLevel: analysis.attentionLevel,
        recommendation: 'Try changing activity or providing encouragement'
      });
    }

    // Check for intervention needs
    if (analysis.needsIntervention) {
      await this.generateAlert(userId, 'intervention_needed', {
        reason: 'Multiple indicators suggest user needs support',
        recommendation: 'Provide immediate assistance or guidance'
      });
    }
  }

  private async generateAlert(userId: string, alertType: string, data: any): Promise<void> {
    const alert = {
      userId,
      type: alertType,
      timestamp: new Date(),
      data,
      severity: this.determineAlertSeverity(alertType),
      handled: false
    };

    const monitoringSession = this.activeMonitoring.get(userId);
    if (monitoringSession) {
      monitoringSession.alerts.push(alert);
    }

    // Notify other agents
    await this.sendMessage('learning-coordinator', {
      id: '',
      fromAgentId: this.id,
      toAgentId: 'learning-coordinator',
      type: 'interaction-alert',
      data: { userId, alert },
      priority: alert.severity === 'high' ? 'high' : 'medium',
      timestamp: new Date(),
      requiresResponse: false
    });

    console.log(`🚨 Alert generated for user ${userId}: ${alertType}`);
  }

  private updateInteractionPatterns(userId: string, interaction: any): void {
    const monitoringSession = this.activeMonitoring.get(userId);
    if (!monitoringSession) return;

    if (!monitoringSession.patterns) {
      monitoringSession.patterns = {};
    }

    // Update interaction type patterns
    const interactionType = interaction.type;
    if (!monitoringSession.patterns[interactionType]) {
      monitoringSession.patterns[interactionType] = { count: 0, avgDuration: 0, successRate: 0 };
    }

    const pattern = monitoringSession.patterns[interactionType];
    pattern.count += 1;
    
    if (interaction.duration) {
      pattern.avgDuration = ((pattern.avgDuration * (pattern.count - 1)) + interaction.duration) / pattern.count;
    }
    
    if (interaction.success !== undefined) {
      pattern.successRate = ((pattern.successRate * (pattern.count - 1)) + (interaction.success ? 1 : 0)) / pattern.count;
    }
  }

  private detectEngagementIndicators(interaction: any): string[] {
    const indicators = [];
    
    if (interaction.duration > 5000) indicators.push('sustained_attention');
    if (interaction.exploratoryBehavior) indicators.push('exploration');
    if (interaction.repeatAction) indicators.push('interest_repetition');
    if (interaction.positiveResponse) indicators.push('positive_feedback');
    
    return indicators;
  }

  private detectFrustrationIndicators(interaction: any): string[] {
    const indicators = [];
    
    if (interaction.rapidClicking) indicators.push('rapid_clicking');
    if (interaction.longPause > 10000) indicators.push('extended_pause');
    if (interaction.backtracking) indicators.push('backtracking');
    if (interaction.errorCount > 2) indicators.push('multiple_errors');
    if (interaction.negativeResponse) indicators.push('negative_feedback');
    
    return indicators;
  }

  private detectSuccessIndicators(interaction: any): string[] {
    const indicators = [];
    
    if (interaction.completed) indicators.push('task_completion');
    if (interaction.efficiency > 0.8) indicators.push('high_efficiency');
    if (interaction.firstAttemptSuccess) indicators.push('immediate_success');
    if (interaction.improvement) indicators.push('skill_improvement');
    
    return indicators;
  }

  private calculateAttentionLevel(interaction: any): number {
    let attention = 50; // Base level
    
    if (interaction.focusTime > 30000) attention += 20; // 30+ seconds focus
    if (interaction.distractionCount === 0) attention += 15;
    if (interaction.taskSwitching < 2) attention += 10;
    if (interaction.responseTime < 3000) attention += 5; // Quick responses
    
    return Math.min(100, Math.max(0, attention));
  }

  private calculateEngagementMetrics(interactions: any[]): any {
    if (interactions.length === 0) {
      return { overall: 0, attention: 0, participation: 0, persistence: 0 };
    }

    const totalAttention = interactions.reduce((sum, i) => sum + (i.attentionLevel || 50), 0);
    const avgAttention = totalAttention / interactions.length;

    const completedTasks = interactions.filter(i => i.completed).length;
    const participationRate = completedTasks / interactions.length;

    const persistenceIndicators = interactions.filter(i => i.retryCount > 0).length;
    const persistenceRate = persistenceIndicators / interactions.length;

    const overall = (avgAttention + (participationRate * 100) + (persistenceRate * 100)) / 3;

    return {
      overall: Math.round(overall),
      attention: Math.round(avgAttention),
      participation: Math.round(participationRate * 100),
      persistence: Math.round(persistenceRate * 100)
    };
  }

  private identifyBehaviorPatterns(interactions: any[]): any {
    const patterns = {
      preferredInteractionTypes: {},
      timePatterns: {},
      errorPatterns: {},
      successPatterns: {}
    };

    interactions.forEach(interaction => {
      // Interaction type preferences
      const type = interaction.type;
      patterns.preferredInteractionTypes[type] = (patterns.preferredInteractionTypes[type] || 0) + 1;

      // Time-based patterns
      const hour = new Date(interaction.timestamp).getHours();
      patterns.timePatterns[hour] = (patterns.timePatterns[hour] || 0) + 1;

      // Error patterns
      if (interaction.errorCount > 0) {
        const errorType = interaction.errorType || 'unknown';
        patterns.errorPatterns[errorType] = (patterns.errorPatterns[errorType] || 0) + 1;
      }

      // Success patterns
      if (interaction.completed) {
        const successType = interaction.type;
        patterns.successPatterns[successType] = (patterns.successPatterns[successType] || 0) + 1;
      }
    });

    return patterns;
  }

  private generateSessionRecommendations(interactions: any[], alerts: any[]): string[] {
    const recommendations = [];

    if (alerts.length > 3) {
      recommendations.push('Consider reducing session complexity or duration');
    }

    const frustrationAlerts = alerts.filter(a => a.type === 'high_frustration');
    if (frustrationAlerts.length > 0) {
      recommendations.push('Implement calming strategies and provide additional support');
    }

    const engagementAlerts = alerts.filter(a => a.type === 'low_engagement');
    if (engagementAlerts.length > 0) {
      recommendations.push('Try more interactive or preferred activities');
    }

    const avgAttention = interactions.reduce((sum, i) => sum + (i.attentionLevel || 50), 0) / interactions.length;
    if (avgAttention < 40) {
      recommendations.push('Break activities into shorter segments');
    }

    return recommendations;
  }

  private determineAlertSeverity(alertType: string): 'low' | 'medium' | 'high' {
    const highSeverityAlerts = ['intervention_needed', 'high_frustration'];
    const mediumSeverityAlerts = ['low_engagement', 'multiple_errors'];
    
    if (highSeverityAlerts.includes(alertType)) return 'high';
    if (mediumSeverityAlerts.includes(alertType)) return 'medium';
    return 'low';
  }

  private async handleStartMonitoring(message: AgentMessage): Promise<void> {
    const { userId, sessionId } = message.data;
    await this.startMonitoring(userId, sessionId);
  }

  private async handleInteractionEvent(message: AgentMessage): Promise<void> {
    const { userId, interaction } = message.data;
    await this.trackInteraction(userId, interaction);
  }

  private async handleMonitoringStatus(message: AgentMessage): Promise<void> {
    const { userId } = message.data;
    const session = this.activeMonitoring.get(userId);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'monitoring-status-response',
      data: { userId, session: session || null },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}