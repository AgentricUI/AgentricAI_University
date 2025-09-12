// Behavior Analyst Agent - Pattern recognition and analysis for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { IBehaviorAgent } from '../base/AgentInterface';
import { AgentConfig, AgentMessage, NeurodiverseProfile } from '../base/AgentTypes';

export class BehaviorAnalyst extends BaseAgent implements IBehaviorAgent {
  private interactionPatterns: Map<string, any[]> = new Map();
  private sensoryProfiles: Map<string, NeurodiverseProfile> = new Map();
  private engagementMetrics: Map<string, any> = new Map();
  private behaviorPredictions: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'behavior-analyst-001',
      name: 'Behavior Pattern Analyst',
      type: 'behavior-analyst',
      version: '1.0.0',
      capabilities: [
        'behavior-analysis',
        'pattern-recognition',
        'sensory-profiling',
        'engagement-monitoring',
        'behavior-prediction',
        'adaptive-recommendations'
      ],
      specialization: 'neurodiverse_behavior_analysis',
      neurodiverseOptimized: true,
      priority: 'high',
      memoryAllocation: '1.8GB',
      status: 'initializing'
    };

    super(config);
  }

  async processTask(taskData: any): Promise<any> {
    const { type, userId, data } = taskData;

    switch (type) {
      case 'analyze_interaction':
        return await this.analyzeInteractionPattern(data.interactions);
      
      case 'detect_sensory_preferences':
        return await this.detectSensoryPreferences(userId);
      
      case 'monitor_engagement':
        return await this.monitorEngagement(userId, data.sessionData);
      
      case 'predict_behavior':
        return await this.predictBehavior(userId, data.context);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async analyzeInteractionPattern(interactions: any[]): Promise<any> {
    console.log(`🔍 Analyzing interaction patterns for ${interactions.length} interactions`);
    
    const analysis = {
      totalInteractions: interactions.length,
      averageSessionLength: 0,
      preferredActivities: [],
      strugglingAreas: [],
      engagementTrends: [],
      sensoryIndicators: {},
      behaviorPatterns: {},
      recommendations: []
    };

    if (interactions.length === 0) return analysis;

    // Analyze session lengths
    const sessionLengths = interactions.map(i => i.duration || 0);
    analysis.averageSessionLength = sessionLengths.reduce((sum, len) => sum + len, 0) / sessionLengths.length;

    // Identify preferred activities
    const activityCounts = {};
    interactions.forEach(interaction => {
      const activity = interaction.activityType;
      activityCounts[activity] = (activityCounts[activity] || 0) + 1;
    });

    analysis.preferredActivities = Object.entries(activityCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([activity, count]) => ({ activity, count }));

    // Identify struggling areas
    const completionRates = {};
    interactions.forEach(interaction => {
      const activity = interaction.activityType;
      if (!completionRates[activity]) {
        completionRates[activity] = { total: 0, completed: 0 };
      }
      completionRates[activity].total++;
      if (interaction.completed) {
        completionRates[activity].completed++;
      }
    });

    analysis.strugglingAreas = Object.entries(completionRates)
      .map(([activity, data]: [string, any]) => ({
        activity,
        completionRate: data.completed / data.total
      }))
      .filter(item => item.completionRate < 0.6)
      .sort((a, b) => a.completionRate - b.completionRate);

    // Generate recommendations
    analysis.recommendations = this.generateBehaviorRecommendations(analysis);

    const userId = interactions[0]?.userId || 'unknown';
    this.storeMemory(`interaction_analysis_${userId}`, analysis, 'long');
    
    this.metrics.tasksCompleted += 1;
    this.metrics.lastActivity = new Date();

    return analysis;
  }

  async detectSensoryPreferences(userId: string): Promise<NeurodiverseProfile> {
    console.log(`🧠 Detecting sensory preferences for user: ${userId}`);
    
    const interactions = this.retrieveMemory(`interactions_${userId}`, 'long') || [];
    
    const profile: NeurodiverseProfile = {
      sensoryPreferences: {
        visualComplexity: this.analyzeVisualComplexityPreference(interactions),
        audioEnabled: this.analyzeAudioPreference(interactions),
        animationSpeed: this.analyzeAnimationSpeedPreference(interactions),
        contrastLevel: this.analyzeContrastPreference(interactions)
      },
      communicationStyle: {
        directLanguage: true,
        visualSupports: true,
        processingTime: this.analyzeProcessingTimeNeeds(interactions),
        feedbackFrequency: this.analyzeFeedbackFrequency(interactions)
      },
      learningPreferences: {
        routineImportance: this.analyzeRoutineImportance(interactions),
        changeAdaptation: 'gradual',
        informationProcessing: this.analyzeInformationProcessing(interactions)
      }
    };

    this.sensoryProfiles.set(userId, profile);
    this.storeMemory(`sensory_profile_${userId}`, profile, 'long');

    this.metrics.tasksCompleted += 1;
    return profile;
  }

  async monitorEngagement(userId: string, sessionData: any): Promise<any> {
    console.log(`📊 Monitoring engagement for user: ${userId}`);
    
    const engagementMetric = {
      userId,
      sessionId: sessionData.sessionId,
      timestamp: new Date(),
      engagementLevel: this.calculateEngagementLevel(sessionData),
      attentionSpan: sessionData.focusTime || 0,
      interactionFrequency: sessionData.interactions?.length || 0,
      frustrationIndicators: this.detectFrustrationIndicators(sessionData),
      positiveIndicators: this.detectPositiveIndicators(sessionData),
      recommendations: []
    };

    // Store engagement data
    const engagementHistory = this.retrieveMemory(`engagement_${userId}`, 'long') || [];
    engagementHistory.push(engagementMetric);
    this.storeMemory(`engagement_${userId}`, engagementHistory, 'long');

    // Generate recommendations if engagement is low
    if (engagementMetric.engagementLevel < 60) {
      engagementMetric.recommendations = this.generateEngagementRecommendations(engagementMetric);
    }

    this.metrics.tasksCompleted += 1;
    return engagementMetric;
  }

  async predictBehavior(userId: string, context: any): Promise<any> {
    console.log(`🔮 Predicting behavior for user: ${userId}`);
    
    const historicalData = this.retrieveMemory(`interaction_analysis_${userId}`, 'long');
    const sensoryProfile = this.retrieveMemory(`sensory_profile_${userId}`, 'long');
    const engagementHistory = this.retrieveMemory(`engagement_${userId}`, 'long') || [];

    const prediction = {
      userId,
      context,
      timestamp: new Date(),
      predictedEngagement: this.predictEngagementLevel(historicalData, context),
      likelyBehaviors: this.predictLikelyBehaviors(historicalData, sensoryProfile, context),
      riskFactors: this.identifyRiskFactors(engagementHistory, context),
      recommendations: this.generatePredictiveRecommendations(historicalData, sensoryProfile, context),
      confidence: this.calculatePredictionConfidence(historicalData, engagementHistory)
    };

    this.behaviorPredictions.set(userId, prediction);
    this.storeMemory(`behavior_prediction_${userId}`, prediction, 'short');

    this.metrics.tasksCompleted += 1;
    return prediction;
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'behavior-analysis':
        await this.handleBehaviorAnalysisRequest(message);
        break;
      
      case 'engagement-update':
        await this.handleEngagementUpdate(message);
        break;
      
      case 'sensory-assessment':
        await this.handleSensoryAssessment(message);
        break;
      
      default:
        console.log(`Behavior Analyst received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm watching how you learn and play to help make things even more fun! 🎯",
      "You're doing great! I'm learning about what you like best! 🌟",
      "I can see you're really good at some activities - that's awesome! 🎉",
      "I'm here to help make sure everything is just right for you! 💫",
      "Your learning style is unique and special - I love that! 🚀"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private analyzeVisualComplexityPreference(interactions: any[]): 'low' | 'medium' | 'high' {
    // Analyze user's response to different visual complexity levels
    const complexityPerformance = { low: 0, medium: 0, high: 0 };
    interactions.forEach(interaction => {
      if (interaction.visualComplexity && interaction.completionRate) {
        complexityPerformance[interaction.visualComplexity] += interaction.completionRate;
      }
    });
    
    const bestComplexity = Object.entries(complexityPerformance)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
    return (bestComplexity?.[0] as 'low' | 'medium' | 'high') || 'low';
  }

  private analyzeAudioPreference(interactions: any[]): boolean {
    const audioInteractions = interactions.filter(i => i.audioEnabled !== undefined);
    if (audioInteractions.length === 0) return true;
    
    const audioSuccessRate = audioInteractions
      .filter(i => i.audioEnabled && i.completed)
      .length / audioInteractions.filter(i => i.audioEnabled).length;
    
    return audioSuccessRate > 0.6;
  }

  private analyzeAnimationSpeedPreference(interactions: any[]): 'slow' | 'medium' | 'fast' {
    // Default to slow for neurodiverse users
    return 'slow';
  }

  private analyzeContrastPreference(interactions: any[]): 'low' | 'medium' | 'high' {
    // Default to high contrast for better accessibility
    return 'high';
  }

  private analyzeProcessingTimeNeeds(interactions: any[]): 'standard' | 'extended' {
    const avgResponseTime = interactions.reduce((sum, i) => sum + (i.responseTime || 0), 0) / interactions.length;
    return avgResponseTime > 5000 ? 'extended' : 'standard';
  }

  private analyzeFeedbackFrequency(interactions: any[]): 'immediate' | 'periodic' | 'minimal' {
    return 'immediate'; // Neurodiverse learners benefit from immediate feedback
  }

  private analyzeRoutineImportance(interactions: any[]): 'low' | 'medium' | 'high' {
    return 'high'; // Routine is typically important for neurodiverse learners
  }

  private analyzeInformationProcessing(interactions: any[]): 'sequential' | 'parallel' | 'mixed' {
    return 'sequential'; // Sequential processing is often preferred
  }

  private calculateEngagementLevel(sessionData: any): number {
    let engagement = 50; // Base engagement
    
    if (sessionData.interactions?.length > 5) engagement += 20;
    if (sessionData.completionRate > 0.8) engagement += 20;
    if (sessionData.focusTime > 300) engagement += 10; // 5+ minutes
    if (sessionData.positiveInteractions > sessionData.negativeInteractions) engagement += 10;
    
    return Math.min(100, Math.max(0, engagement));
  }

  private detectFrustrationIndicators(sessionData: any): string[] {
    const indicators = [];
    
    if (sessionData.rapidClicking) indicators.push('rapid_clicking');
    if (sessionData.longPauses) indicators.push('long_pauses');
    if (sessionData.backtracking) indicators.push('backtracking');
    if (sessionData.completionRate < 0.3) indicators.push('low_completion');
    
    return indicators;
  }

  private detectPositiveIndicators(sessionData: any): string[] {
    const indicators = [];
    
    if (sessionData.steadyProgress) indicators.push('steady_progress');
    if (sessionData.completionRate > 0.8) indicators.push('high_completion');
    if (sessionData.exploratoryBehavior) indicators.push('exploration');
    if (sessionData.repeatActivities) indicators.push('activity_preference');
    
    return indicators;
  }

  private generateBehaviorRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    if (analysis.averageSessionLength < 300) {
      recommendations.push('Consider shorter, more frequent sessions');
    }
    
    if (analysis.strugglingAreas.length > 0) {
      recommendations.push(`Provide additional support for: ${analysis.strugglingAreas.map(a => a.activity).join(', ')}`);
    }
    
    if (analysis.preferredActivities.length > 0) {
      recommendations.push(`Leverage preferred activities: ${analysis.preferredActivities.map(a => a.activity).join(', ')}`);
    }
    
    return recommendations;
  }

  private generateEngagementRecommendations(metric: any): string[] {
    const recommendations = [];
    
    if (metric.engagementLevel < 40) {
      recommendations.push('Consider reducing activity difficulty');
      recommendations.push('Increase positive reinforcement');
    }
    
    if (metric.frustrationIndicators.length > 2) {
      recommendations.push('Implement calming strategies');
      recommendations.push('Provide additional guidance');
    }
    
    if (metric.attentionSpan < 180) {
      recommendations.push('Break activities into smaller segments');
    }
    
    return recommendations;
  }

  private predictEngagementLevel(historicalData: any, context: any): number {
    if (!historicalData) return 50;
    
    let predicted = 50;
    
    // Factor in historical performance
    if (historicalData.averageSessionLength > 300) predicted += 15;
    if (historicalData.preferredActivities.length > 0) predicted += 10;
    
    // Factor in current context
    if (context.activityType && historicalData.preferredActivities.some(a => a.activity === context.activityType)) {
      predicted += 20;
    }
    
    return Math.min(100, Math.max(0, predicted));
  }

  private predictLikelyBehaviors(historicalData: any, sensoryProfile: any, context: any): string[] {
    const behaviors = [];
    
    if (sensoryProfile?.learningPreferences?.routineImportance === 'high') {
      behaviors.push('prefers_consistent_structure');
    }
    
    if (historicalData?.averageSessionLength < 300) {
      behaviors.push('short_attention_span');
    }
    
    if (context.newActivity) {
      behaviors.push('may_need_extra_support');
    }
    
    return behaviors;
  }

  private identifyRiskFactors(engagementHistory: any[], context: any): string[] {
    const risks = [];
    
    if (engagementHistory.length > 0) {
      const recentEngagement = engagementHistory.slice(-3);
      const avgRecentEngagement = recentEngagement.reduce((sum, e) => sum + e.engagementLevel, 0) / recentEngagement.length;
      
      if (avgRecentEngagement < 40) {
        risks.push('declining_engagement');
      }
    }
    
    if (context.timeOfDay === 'late') {
      risks.push('fatigue_factor');
    }
    
    return risks;
  }

  private generatePredictiveRecommendations(historicalData: any, sensoryProfile: any, context: any): string[] {
    const recommendations = [];
    
    if (sensoryProfile?.sensoryPreferences?.visualComplexity === 'low') {
      recommendations.push('Use simplified visual layouts');
    }
    
    if (historicalData?.strugglingAreas?.length > 0) {
      recommendations.push('Provide scaffolding for challenging areas');
    }
    
    if (context.newActivity) {
      recommendations.push('Introduce new activity gradually');
    }
    
    return recommendations;
  }

  private calculatePredictionConfidence(historicalData: any, engagementHistory: any[]): number {
    let confidence = 50;
    
    if (historicalData && Object.keys(historicalData).length > 0) confidence += 25;
    if (engagementHistory.length > 5) confidence += 25;
    
    return Math.min(100, confidence);
  }

  private async handleBehaviorAnalysisRequest(message: AgentMessage): Promise<void> {
    const { userId, interactions } = message.data;
    const analysis = await this.analyzeInteractionPattern(interactions);
    
    if (message.requiresResponse) {
      await this.sendMessage(message.fromAgentId, {
        id: '',
        fromAgentId: this.id,
        toAgentId: message.fromAgentId,
        type: 'behavior-analysis-response',
        data: { analysis },
        priority: message.priority,
        timestamp: new Date(),
        requiresResponse: false,
        correlationId: message.id
      });
    }
  }

  private async handleEngagementUpdate(message: AgentMessage): Promise<void> {
    const { userId, sessionData } = message.data;
    await this.monitorEngagement(userId, sessionData);
  }

  private async handleSensoryAssessment(message: AgentMessage): Promise<void> {
    const { userId } = message.data;
    const profile = await this.detectSensoryPreferences(userId);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'sensory-profile-response',
      data: { userId, profile },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}