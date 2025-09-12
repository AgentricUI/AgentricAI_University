// Sensory Processor Agent - Specialized sensory preference handling

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage, NeurodiverseProfile } from '../base/AgentTypes';

export class SensoryProcessor extends BaseAgent {
  private sensoryProfiles: Map<string, any> = new Map();
  private sensoryAdaptations: Map<string, any> = new Map();
  private sensoryTriggers: Map<string, string[]> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'sensory-processor-001',
      name: 'Sensory Processing Specialist',
      type: 'behavior-analyst',
      version: '1.0.0',
      capabilities: [
        'sensory-analysis',
        'trigger-detection',
        'adaptation-generation',
        'sensory-optimization',
        'comfort-assessment'
      ],
      specialization: 'sensory_processing_optimization',
      neurodiverseOptimized: true,
      priority: 'high',
      memoryAllocation: '1.2GB',
      status: 'initializing'
    };

    super(config);
  }

  async processTask(taskData: any): Promise<any> {
    const { type, userId, data } = taskData;

    switch (type) {
      case 'analyze_sensory_response':
        return await this.analyzeSensoryResponse(userId, data);
      
      case 'detect_triggers':
        return await this.detectSensoryTriggers(userId, data.interactions);
      
      case 'generate_adaptations':
        return await this.generateSensoryAdaptations(userId, data.context);
      
      case 'optimize_environment':
        return await this.optimizeSensoryEnvironment(userId, data.environment);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async analyzeSensoryResponse(userId: string, responseData: any): Promise<any> {
    console.log(`👁️ Analyzing sensory response for user: ${userId}`);
    
    const analysis = {
      userId,
      timestamp: new Date(),
      visualResponse: this.analyzeVisualResponse(responseData),
      auditoryResponse: this.analyzeAuditoryResponse(responseData),
      tactileResponse: this.analyzeTactileResponse(responseData),
      overallComfort: this.calculateComfortLevel(responseData),
      recommendations: []
    };

    // Generate specific recommendations
    analysis.recommendations = this.generateSensoryRecommendations(analysis);

    // Store analysis
    this.storeMemory(`sensory_analysis_${userId}`, analysis, 'long');
    
    this.metrics.tasksCompleted += 1;
    return analysis;
  }

  async detectSensoryTriggers(userId: string, interactions: any[]): Promise<string[]> {
    console.log(`⚠️ Detecting sensory triggers for user: ${userId}`);
    
    const triggers = [];
    
    // Analyze interactions for negative responses
    interactions.forEach(interaction => {
      if (interaction.negativeResponse || interaction.discomfort) {
        if (interaction.visualElements?.brightness > 80) triggers.push('bright_visuals');
        if (interaction.audioElements?.volume > 70) triggers.push('loud_audio');
        if (interaction.animations?.speed === 'fast') triggers.push('fast_animations');
        if (interaction.visualElements?.complexity === 'high') triggers.push('visual_complexity');
      }
    });

    // Remove duplicates
    const uniqueTriggers = [...new Set(triggers)];
    
    // Store triggers
    this.sensoryTriggers.set(userId, uniqueTriggers);
    this.storeMemory(`sensory_triggers_${userId}`, uniqueTriggers, 'long');
    
    this.metrics.tasksCompleted += 1;
    return uniqueTriggers;
  }

  async generateSensoryAdaptations(userId: string, context: any): Promise<any> {
    console.log(`🔧 Generating sensory adaptations for user: ${userId}`);
    
    const triggers = this.sensoryTriggers.get(userId) || [];
    const profile = this.retrieveMemory(`sensory_analysis_${userId}`, 'long');
    
    const adaptations = {
      visual: this.generateVisualAdaptations(triggers, profile, context),
      auditory: this.generateAuditoryAdaptations(triggers, profile, context),
      interaction: this.generateInteractionAdaptations(triggers, profile, context),
      environment: this.generateEnvironmentAdaptations(triggers, profile, context)
    };

    this.sensoryAdaptations.set(userId, adaptations);
    this.storeMemory(`sensory_adaptations_${userId}`, adaptations, 'short');
    
    this.metrics.tasksCompleted += 1;
    return adaptations;
  }

  async optimizeSensoryEnvironment(userId: string, environment: any): Promise<any> {
    console.log(`🎯 Optimizing sensory environment for user: ${userId}`);
    
    const adaptations = this.sensoryAdaptations.get(userId);
    const triggers = this.sensoryTriggers.get(userId) || [];
    
    const optimizedEnvironment = { ...environment };
    
    // Apply visual optimizations
    if (triggers.includes('bright_visuals')) {
      optimizedEnvironment.brightness = Math.min(60, environment.brightness || 80);
    }
    
    if (triggers.includes('visual_complexity')) {
      optimizedEnvironment.visualComplexity = 'low';
      optimizedEnvironment.elementsPerScreen = Math.min(3, environment.elementsPerScreen || 5);
    }
    
    if (triggers.includes('fast_animations')) {
      optimizedEnvironment.animationSpeed = 'slow';
      optimizedEnvironment.transitionDuration = Math.max(800, environment.transitionDuration || 300);
    }
    
    // Apply auditory optimizations
    if (triggers.includes('loud_audio')) {
      optimizedEnvironment.audioVolume = Math.min(50, environment.audioVolume || 70);
    }
    
    // Apply interaction optimizations
    optimizedEnvironment.feedbackDelay = adaptations?.interaction?.feedbackDelay || 500;
    optimizedEnvironment.processingTime = adaptations?.interaction?.processingTime || 'extended';
    
    this.storeMemory(`optimized_environment_${userId}`, optimizedEnvironment, 'short');
    
    this.metrics.tasksCompleted += 1;
    return optimizedEnvironment;
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'sensory-analysis-request':
        await this.handleSensoryAnalysisRequest(message);
        break;
      
      case 'trigger-detection-request':
        await this.handleTriggerDetectionRequest(message);
        break;
      
      case 'adaptation-request':
        await this.handleAdaptationRequest(message);
        break;
      
      default:
        console.log(`Sensory Processor received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm making sure everything feels just right for you! 🌈",
      "I want you to be comfortable while you learn and play! 💙",
      "I'm like your comfort helper - making things perfect for you! ✨",
      "Your comfort is super important to me! 🤗",
      "I'm adjusting things so they feel good for your eyes and ears! 👀👂"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private analyzeVisualResponse(responseData: any): any {
    return {
      brightness_tolerance: responseData.brightness_comfort || 'medium',
      contrast_preference: responseData.contrast_preference || 'high',
      color_sensitivity: responseData.color_reactions || 'normal',
      animation_tolerance: responseData.animation_comfort || 'slow',
      complexity_preference: responseData.complexity_comfort || 'low'
    };
  }

  private analyzeAuditoryResponse(responseData: any): any {
    return {
      volume_tolerance: responseData.volume_comfort || 'medium',
      frequency_sensitivity: responseData.frequency_reactions || 'normal',
      background_noise_tolerance: responseData.noise_tolerance || 'low',
      audio_preference: responseData.audio_enabled !== false
    };
  }

  private analyzeTactileResponse(responseData: any): any {
    return {
      touch_sensitivity: responseData.touch_reactions || 'normal',
      texture_preferences: responseData.texture_comfort || 'smooth',
      pressure_tolerance: responseData.pressure_comfort || 'light'
    };
  }

  private calculateComfortLevel(responseData: any): number {
    let comfort = 50;
    
    if (responseData.reported_comfort) comfort = responseData.reported_comfort;
    if (responseData.stress_indicators?.length === 0) comfort += 20;
    if (responseData.positive_engagement) comfort += 15;
    if (responseData.completion_without_breaks) comfort += 15;
    
    return Math.min(100, Math.max(0, comfort));
  }

  private generateSensoryRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    if (analysis.overallComfort < 60) {
      recommendations.push('Reduce sensory load in environment');
    }
    
    if (analysis.visualResponse.brightness_tolerance === 'low') {
      recommendations.push('Decrease screen brightness and use darker themes');
    }
    
    if (analysis.auditoryResponse.volume_tolerance === 'low') {
      recommendations.push('Lower audio volume and minimize background sounds');
    }
    
    if (analysis.visualResponse.animation_tolerance === 'low') {
      recommendations.push('Slow down or disable animations');
    }
    
    return recommendations;
  }

  private generateVisualAdaptations(triggers: string[], profile: any, context: any): any {
    const adaptations = {
      brightness: 60,
      contrast: 'high',
      animationSpeed: 'slow',
      complexity: 'low',
      colorScheme: 'calm'
    };
    
    if (triggers.includes('bright_visuals')) {
      adaptations.brightness = 40;
      adaptations.colorScheme = 'dark';
    }
    
    if (triggers.includes('visual_complexity')) {
      adaptations.complexity = 'minimal';
    }
    
    return adaptations;
  }

  private generateAuditoryAdaptations(triggers: string[], profile: any, context: any): any {
    const adaptations = {
      volume: 50,
      backgroundAudio: false,
      audioFeedback: 'gentle',
      speechRate: 'slow'
    };
    
    if (triggers.includes('loud_audio')) {
      adaptations.volume = 30;
      adaptations.audioFeedback = 'minimal';
    }
    
    return adaptations;
  }

  private generateInteractionAdaptations(triggers: string[], profile: any, context: any): any {
    return {
      feedbackDelay: 500,
      processingTime: 'extended',
      inputSensitivity: 'low',
      gestureComplexity: 'simple'
    };
  }

  private generateEnvironmentAdaptations(triggers: string[], profile: any, context: any): any {
    return {
      layout: 'simplified',
      spacing: 'generous',
      focusIndicators: 'clear',
      distractionReduction: 'high'
    };
  }

  private async handleSensoryAnalysisRequest(message: AgentMessage): Promise<void> {
    const { userId, responseData } = message.data;
    const analysis = await this.analyzeSensoryResponse(userId, responseData);
    
    if (message.requiresResponse) {
      await this.sendMessage(message.fromAgentId, {
        id: '',
        fromAgentId: this.id,
        toAgentId: message.fromAgentId,
        type: 'sensory-analysis-response',
        data: { analysis },
        priority: message.priority,
        timestamp: new Date(),
        requiresResponse: false,
        correlationId: message.id
      });
    }
  }

  private async handleTriggerDetectionRequest(message: AgentMessage): Promise<void> {
    const { userId, interactions } = message.data;
    const triggers = await this.detectSensoryTriggers(userId, interactions);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'triggers-detected',
      data: { userId, triggers },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleAdaptationRequest(message: AgentMessage): Promise<void> {
    const { userId, context } = message.data;
    const adaptations = await this.generateSensoryAdaptations(userId, context);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'adaptations-generated',
      data: { userId, adaptations },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}