// Sensory Optimizer Agent - Sensory-friendly content optimization

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage, NeurodiverseProfile } from '../base/AgentTypes';

export class SensoryOptimizer extends BaseAgent {
  private sensoryProfiles: Map<string, any> = new Map();
  private optimizationRules: Map<string, any> = new Map();
  private sensoryFeedback: Map<string, any[]> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'sensory-optimizer-001',
      name: 'Sensory Experience Optimizer',
      type: 'content-generator',
      version: '1.0.0',
      capabilities: [
        'sensory-optimization',
        'accessibility-enhancement',
        'comfort-assessment',
        'trigger-avoidance',
        'preference-learning'
      ],
      specialization: 'sensory_friendly_content_optimization',
      neurodiverseOptimized: true,
      priority: 'high',
      memoryAllocation: '1.4GB',
      status: 'initializing'
    };

    super(config);
    this.initializeOptimizationRules();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, userId, data } = taskData;

    switch (type) {
      case 'optimize_content':
        return await this.optimizeContent(data.content, data.sensoryProfile);
      
      case 'assess_comfort':
        return await this.assessSensoryComfort(userId, data.content, data.feedback);
      
      case 'detect_triggers':
        return await this.detectSensoryTriggers(userId, data.interactionData);
      
      case 'generate_alternatives':
        return await this.generateSensoryAlternatives(data.content, data.triggers);
      
      case 'learn_preferences':
        return await this.learnSensoryPreferences(userId, data.behaviorData);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async optimizeContent(content: any, sensoryProfile: any): Promise<any> {
    console.log(`🎨 Optimizing content for sensory preferences`);
    
    const optimizedContent = { ...content };
    
    // Visual optimizations
    optimizedContent.visual = await this.optimizeVisualElements(content.visual || {}, sensoryProfile);
    
    // Auditory optimizations
    optimizedContent.audio = await this.optimizeAudioElements(content.audio || {}, sensoryProfile);
    
    // Interaction optimizations
    optimizedContent.interaction = await this.optimizeInteractionElements(content.interaction || {}, sensoryProfile);
    
    // Layout optimizations
    optimizedContent.layout = await this.optimizeLayoutElements(content.layout || {}, sensoryProfile);
    
    // Animation optimizations
    optimizedContent.animations = await this.optimizeAnimationElements(content.animations || {}, sensoryProfile);

    // Add sensory metadata
    optimizedContent.sensoryMetadata = {
      optimizedFor: sensoryProfile,
      optimizationLevel: this.calculateOptimizationLevel(sensoryProfile),
      comfortScore: this.predictComfortScore(optimizedContent, sensoryProfile),
      optimizedAt: new Date()
    };

    this.metrics.tasksCompleted += 1;
    return optimizedContent;
  }

  async assessSensoryComfort(userId: string, content: any, feedback: any): Promise<any> {
    console.log(`🧠 Assessing sensory comfort for user: ${userId}`);
    
    const assessment = {
      userId,
      contentId: content.id,
      timestamp: new Date(),
      comfortMetrics: {
        visual: this.assessVisualComfort(feedback),
        auditory: this.assessAuditoryComfort(feedback),
        interaction: this.assessInteractionComfort(feedback),
        overall: 0
      },
      stressIndicators: this.identifyStressIndicators(feedback),
      comfortIndicators: this.identifyComfortIndicators(feedback),
      recommendations: []
    };

    // Calculate overall comfort
    const metrics = assessment.comfortMetrics;
    assessment.comfortMetrics.overall = (metrics.visual + metrics.auditory + metrics.interaction) / 3;

    // Generate recommendations
    assessment.recommendations = this.generateComfortRecommendations(assessment);

    // Store assessment
    const feedbackHistory = this.sensoryFeedback.get(userId) || [];
    feedbackHistory.push(assessment);
    this.sensoryFeedback.set(userId, feedbackHistory);
    
    this.storeMemory(`sensory_assessment_${userId}`, assessment, 'long');

    this.metrics.tasksCompleted += 1;
    return assessment;
  }

  async detectSensoryTriggers(userId: string, interactionData: any): Promise<string[]> {
    console.log(`⚠️ Detecting sensory triggers for user: ${userId}`);
    
    const triggers = [];
    
    // Analyze interaction patterns for trigger indicators
    if (interactionData.visualStress) {
      if (interactionData.visualStress.brightness) triggers.push('bright_visuals');
      if (interactionData.visualStress.flashing) triggers.push('flashing_elements');
      if (interactionData.visualStress.complexity) triggers.push('visual_complexity');
      if (interactionData.visualStress.motion) triggers.push('excessive_motion');
    }

    if (interactionData.auditoryStress) {
      if (interactionData.auditoryStress.volume) triggers.push('loud_audio');
      if (interactionData.auditoryStress.frequency) triggers.push('high_frequency_sounds');
      if (interactionData.auditoryStress.sudden) triggers.push('sudden_sounds');
      if (interactionData.auditoryStress.background) triggers.push('background_noise');
    }

    if (interactionData.interactionStress) {
      if (interactionData.interactionStress.speed) triggers.push('fast_interactions');
      if (interactionData.interactionStress.precision) triggers.push('precise_movements');
      if (interactionData.interactionStress.timing) triggers.push('time_pressure');
    }

    // Store detected triggers
    this.storeMemory(`sensory_triggers_${userId}`, triggers, 'long');
    
    // Update user's sensory profile
    await this.updateSensoryProfile(userId, { triggers });

    this.metrics.tasksCompleted += 1;
    return triggers;
  }

  async generateSensoryAlternatives(content: any, triggers: string[]): Promise<any> {
    console.log(`🔄 Generating sensory alternatives for ${triggers.length} triggers`);
    
    const alternatives = {
      visual: {},
      audio: {},
      interaction: {},
      layout: {}
    };

    // Generate visual alternatives
    if (triggers.includes('bright_visuals')) {
      alternatives.visual.brightness = 'reduced';
      alternatives.visual.colorScheme = 'dark_mode';
      alternatives.visual.contrast = 'soft';
    }

    if (triggers.includes('visual_complexity')) {
      alternatives.visual.elementsPerScreen = 'minimal';
      alternatives.visual.layout = 'simplified';
      alternatives.visual.colorPalette = 'limited';
    }

    if (triggers.includes('excessive_motion')) {
      alternatives.visual.animations = 'disabled';
      alternatives.visual.transitions = 'instant';
      alternatives.visual.autoPlay = false;
    }

    if (triggers.includes('flashing_elements')) {
      alternatives.visual.flashingElements = 'disabled';
      alternatives.visual.blinkingText = 'disabled';
      alternatives.visual.strobeEffects = 'disabled';
    }

    // Generate audio alternatives
    if (triggers.includes('loud_audio')) {
      alternatives.audio.volume = 'reduced';
      alternatives.audio.dynamicRange = 'compressed';
    }

    if (triggers.includes('sudden_sounds')) {
      alternatives.audio.fadeIn = true;
      alternatives.audio.fadeOut = true;
      alternatives.audio.suddenSounds = 'disabled';
    }

    if (triggers.includes('background_noise')) {
      alternatives.audio.backgroundAudio = 'disabled';
      alternatives.audio.ambientSounds = 'minimal';
    }

    // Generate interaction alternatives
    if (triggers.includes('fast_interactions')) {
      alternatives.interaction.responseTime = 'extended';
      alternatives.interaction.timeouts = 'disabled';
      alternatives.interaction.processingDelay = 'added';
    }

    if (triggers.includes('precise_movements')) {
      alternatives.interaction.targetSize = 'enlarged';
      alternatives.interaction.clickTolerance = 'increased';
      alternatives.interaction.dragSensitivity = 'reduced';
    }

    if (triggers.includes('time_pressure')) {
      alternatives.interaction.timeLimits = 'disabled';
      alternatives.interaction.countdowns = 'hidden';
      alternatives.interaction.urgencyIndicators = 'disabled';
    }

    this.metrics.tasksCompleted += 1;
    return alternatives;
  }

  async learnSensoryPreferences(userId: string, behaviorData: any): Promise<any> {
    console.log(`📚 Learning sensory preferences for user: ${userId}`);
    
    const currentProfile = this.sensoryProfiles.get(userId) || {
      userId,
      preferences: {},
      triggers: [],
      comfortZones: {},
      learningHistory: []
    };

    // Analyze behavior patterns
    const preferences = this.analyzeBehaviorPatterns(behaviorData);
    
    // Update preferences
    currentProfile.preferences = { ...currentProfile.preferences, ...preferences };
    
    // Update comfort zones
    currentProfile.comfortZones = this.updateComfortZones(currentProfile.comfortZones, behaviorData);
    
    // Add to learning history
    currentProfile.learningHistory.push({
      timestamp: new Date(),
      behaviorData: behaviorData,
      learnedPreferences: preferences
    });

    // Keep only recent history
    if (currentProfile.learningHistory.length > 50) {
      currentProfile.learningHistory = currentProfile.learningHistory.slice(-50);
    }

    // Store updated profile
    this.sensoryProfiles.set(userId, currentProfile);
    this.storeMemory(`sensory_profile_${userId}`, currentProfile, 'long');

    this.metrics.tasksCompleted += 1;
    return currentProfile;
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'sensory-optimization-request':
        await this.handleOptimizationRequest(message);
        break;
      
      case 'comfort-assessment-request':
        await this.handleComfortAssessmentRequest(message);
        break;
      
      case 'trigger-detection-request':
        await this.handleTriggerDetectionRequest(message);
        break;
      
      default:
        console.log(`Sensory Optimizer received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm making everything feel just right for your eyes and ears! 👀👂",
      "I want you to be super comfortable while you learn! 🤗",
      "I'm adjusting things so they feel perfect for you! ✨",
      "I'm like your comfort helper - making sure everything is nice! 💙",
      "I'm creating the most comfortable learning space for you! 🏠"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private initializeOptimizationRules(): void {
    // Visual optimization rules
    this.optimizationRules.set('visual_low_complexity', {
      elementsPerScreen: 3,
      colorCount: 4,
      animationSpeed: 'slow',
      contrast: 'high'
    });

    this.optimizationRules.set('visual_high_sensitivity', {
      brightness: 40,
      flashingElements: false,
      rapidMovement: false,
      colorSaturation: 'low'
    });

    // Audio optimization rules
    this.optimizationRules.set('audio_sensitive', {
      volume: 30,
      backgroundAudio: false,
      suddenSounds: false,
      frequencyRange: 'comfortable'
    });

    // Interaction optimization rules
    this.optimizationRules.set('interaction_gentle', {
      responseTime: 'extended',
      feedbackDelay: 1000,
      errorTolerance: 'high',
      processingTime: 'generous'
    });
  }

  private async optimizeVisualElements(visual: any, profile: any): Promise<any> {
    const optimized = { ...visual };
    
    if (profile.sensoryPreferences?.visualComplexity === 'low') {
      optimized.elementsPerScreen = Math.min(3, optimized.elementsPerScreen || 5);
      optimized.colorPalette = 'simplified';
      optimized.layout = 'spacious';
    }

    if (profile.sensoryPreferences?.contrastLevel === 'high') {
      optimized.contrast = 'enhanced';
      optimized.textContrast = 'maximum';
      optimized.borderDefinition = 'clear';
    }

    if (profile.sensoryPreferences?.animationSpeed === 'slow') {
      optimized.animationDuration = (optimized.animationDuration || 300) * 2;
      optimized.transitionSpeed = 'slow';
      optimized.autoPlay = false;
    }

    // Apply brightness optimization
    if (profile.triggers?.includes('bright_visuals')) {
      optimized.brightness = Math.min(50, optimized.brightness || 80);
      optimized.backgroundBrightness = 'dim';
    }

    return optimized;
  }

  private async optimizeAudioElements(audio: any, profile: any): Promise<any> {
    const optimized = { ...audio };
    
    if (!profile.sensoryPreferences?.audioEnabled) {
      optimized.enabled = false;
      optimized.alternatives = {
        visualCues: true,
        hapticFeedback: true,
        textNotifications: true
      };
      return optimized;
    }

    // Volume optimization
    if (profile.triggers?.includes('loud_audio')) {
      optimized.volume = Math.min(40, optimized.volume || 70);
      optimized.maxVolume = 50;
    }

    // Background audio optimization
    if (profile.triggers?.includes('background_noise')) {
      optimized.backgroundMusic = false;
      optimized.ambientSounds = false;
    }

    // Sudden sound optimization
    if (profile.triggers?.includes('sudden_sounds')) {
      optimized.fadeIn = 1000;
      optimized.fadeOut = 1000;
      optimized.abruptSounds = false;
    }

    return optimized;
  }

  private async optimizeInteractionElements(interaction: any, profile: any): Promise<any> {
    const optimized = { ...interaction };
    
    if (profile.communicationStyle?.processingTime === 'extended') {
      optimized.responseTimeout = null;
      optimized.processingDelay = 2000;
      optimized.rushIndicators = false;
    }

    if (profile.triggers?.includes('time_pressure')) {
      optimized.timeLimits = false;
      optimized.countdownTimers = false;
      optimized.urgencyVisuals = false;
    }

    if (profile.triggers?.includes('precise_movements')) {
      optimized.targetSize = 'large';
      optimized.clickTolerance = 'generous';
      optimized.dragThreshold = 'low';
    }

    return optimized;
  }

  private async optimizeLayoutElements(layout: any, profile: any): Promise<any> {
    const optimized = { ...layout };
    
    if (profile.sensoryPreferences?.visualComplexity === 'low') {
      optimized.spacing = 'generous';
      optimized.grouping = 'clear';
      optimized.hierarchy = 'obvious';
    }

    if (profile.learningPreferences?.routineImportance === 'high') {
      optimized.consistency = 'strict';
      optimized.navigationPattern = 'predictable';
      optimized.elementPlacement = 'consistent';
    }

    return optimized;
  }

  private async optimizeAnimationElements(animations: any, profile: any): Promise<any> {
    const optimized = { ...animations };
    
    if (profile.sensoryPreferences?.animationSpeed === 'slow') {
      optimized.duration = (optimized.duration || 300) * 2;
      optimized.easing = 'gentle';
    }

    if (profile.triggers?.includes('excessive_motion')) {
      optimized.enabled = false;
      optimized.alternatives = {
        staticTransitions: true,
        instantChanges: true
      };
    }

    if (profile.triggers?.includes('flashing_elements')) {
      optimized.flashing = false;
      optimized.blinking = false;
      optimized.strobing = false;
    }

    return optimized;
  }

  private calculateOptimizationLevel(profile: any): string {
    let optimizationScore = 0;
    
    if (profile.triggers?.length > 3) optimizationScore += 30;
    if (profile.sensoryPreferences?.visualComplexity === 'low') optimizationScore += 20;
    if (profile.sensoryPreferences?.animationSpeed === 'slow') optimizationScore += 15;
    if (!profile.sensoryPreferences?.audioEnabled) optimizationScore += 25;
    if (profile.communicationStyle?.processingTime === 'extended') optimizationScore += 10;
    
    if (optimizationScore >= 70) return 'high';
    if (optimizationScore >= 40) return 'medium';
    return 'low';
  }

  private predictComfortScore(content: any, profile: any): number {
    let score = 50; // Base comfort score
    
    // Visual comfort factors
    if (content.visual?.brightness <= 60) score += 10;
    if (content.visual?.animationSpeed === 'slow') score += 15;
    if (content.visual?.elementsPerScreen <= 4) score += 10;
    
    // Audio comfort factors
    if (!content.audio?.enabled && !profile.sensoryPreferences?.audioEnabled) score += 20;
    if (content.audio?.volume <= 50) score += 10;
    
    // Interaction comfort factors
    if (content.interaction?.processingDelay >= 1000) score += 15;
    if (!content.interaction?.timeLimits) score += 10;
    
    return Math.min(100, score);
  }

  private assessVisualComfort(feedback: any): number {
    let comfort = 50;
    
    if (feedback.visualStrain === 'none') comfort += 25;
    else if (feedback.visualStrain === 'mild') comfort += 10;
    else if (feedback.visualStrain === 'severe') comfort -= 30;
    
    if (feedback.colorComfort === 'pleasant') comfort += 15;
    if (feedback.brightnessComfort === 'perfect') comfort += 10;
    if (feedback.animationComfort === 'smooth') comfort += 10;
    
    return Math.max(0, Math.min(100, comfort));
  }

  private assessAuditoryComfort(feedback: any): number {
    let comfort = 50;
    
    if (feedback.audioStrain === 'none') comfort += 25;
    else if (feedback.audioStrain === 'mild') comfort += 10;
    else if (feedback.audioStrain === 'severe') comfort -= 30;
    
    if (feedback.volumeComfort === 'perfect') comfort += 15;
    if (feedback.soundQuality === 'pleasant') comfort += 10;
    
    return Math.max(0, Math.min(100, comfort));
  }

  private assessInteractionComfort(feedback: any): number {
    let comfort = 50;
    
    if (feedback.interactionStress === 'none') comfort += 25;
    else if (feedback.interactionStress === 'mild') comfort += 10;
    else if (feedback.interactionStress === 'high') comfort -= 30;
    
    if (feedback.responseTimeComfort === 'perfect') comfort += 15;
    if (feedback.controlComfort === 'easy') comfort += 10;
    
    return Math.max(0, Math.min(100, comfort));
  }

  private identifyStressIndicators(feedback: any): string[] {
    const indicators = [];
    
    if (feedback.eyeStrain) indicators.push('visual_stress');
    if (feedback.headache) indicators.push('sensory_overload');
    if (feedback.fatigue) indicators.push('cognitive_load');
    if (feedback.irritability) indicators.push('frustration');
    if (feedback.avoidance) indicators.push('avoidance_behavior');
    
    return indicators;
  }

  private identifyComfortIndicators(feedback: any): string[] {
    const indicators = [];
    
    if (feedback.relaxed) indicators.push('relaxation');
    if (feedback.focused) indicators.push('sustained_attention');
    if (feedback.engaged) indicators.push('positive_engagement');
    if (feedback.enjoyment) indicators.push('pleasure_response');
    if (feedback.completion) indicators.push('task_completion');
    
    return indicators;
  }

  private generateComfortRecommendations(assessment: any): string[] {
    const recommendations = [];
    
    if (assessment.comfortMetrics.visual < 60) {
      recommendations.push('Reduce visual complexity and brightness');
    }
    
    if (assessment.comfortMetrics.auditory < 60) {
      recommendations.push('Lower audio volume or provide audio alternatives');
    }
    
    if (assessment.comfortMetrics.interaction < 60) {
      recommendations.push('Increase response time allowances and reduce precision requirements');
    }
    
    if (assessment.stressIndicators.length > 2) {
      recommendations.push('Implement break reminders and stress reduction techniques');
    }
    
    return recommendations;
  }

  private updateSensoryProfile(userId: string, updates: any): Promise<void> {
    const profile = this.sensoryProfiles.get(userId) || { userId };
    
    if (updates.triggers) {
      profile.triggers = [...new Set([...(profile.triggers || []), ...updates.triggers])];
    }
    
    if (updates.preferences) {
      profile.preferences = { ...profile.preferences, ...updates.preferences };
    }
    
    profile.lastUpdated = new Date();
    this.sensoryProfiles.set(userId, profile);
    
    return Promise.resolve();
  }

  private analyzeBehaviorPatterns(behaviorData: any): any {
    const preferences = {};
    
    // Analyze visual preferences
    if (behaviorData.visualInteractions) {
      const visual = behaviorData.visualInteractions;
      if (visual.preferredBrightness) preferences.brightness = visual.preferredBrightness;
      if (visual.preferredAnimationSpeed) preferences.animationSpeed = visual.preferredAnimationSpeed;
      if (visual.preferredComplexity) preferences.visualComplexity = visual.preferredComplexity;
    }
    
    // Analyze audio preferences
    if (behaviorData.audioInteractions) {
      const audio = behaviorData.audioInteractions;
      if (audio.preferredVolume) preferences.volume = audio.preferredVolume;
      if (audio.audioEnabled !== undefined) preferences.audioEnabled = audio.audioEnabled;
    }
    
    // Analyze interaction preferences
    if (behaviorData.interactionPatterns) {
      const interaction = behaviorData.interactionPatterns;
      if (interaction.preferredSpeed) preferences.interactionSpeed = interaction.preferredSpeed;
      if (interaction.preferredFeedback) preferences.feedbackType = interaction.preferredFeedback;
    }
    
    return preferences;
  }

  private updateComfortZones(currentZones: any, behaviorData: any): any {
    const zones = { ...currentZones };
    
    if (behaviorData.comfortableSettings) {
      Object.assign(zones, behaviorData.comfortableSettings);
    }
    
    return zones;
  }

  private async handleOptimizationRequest(message: AgentMessage): Promise<void> {
    const { content, sensoryProfile } = message.data;
    const optimizedContent = await this.optimizeContent(content, sensoryProfile);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'content-optimized',
      data: { optimizedContent },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleComfortAssessmentRequest(message: AgentMessage): Promise<void> {
    const { userId, content, feedback } = message.data;
    const assessment = await this.assessSensoryComfort(userId, content, feedback);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'comfort-assessment-complete',
      data: { assessment },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleTriggerDetectionRequest(message: AgentMessage): Promise<void> {
    const { userId, interactionData } = message.data;
    const triggers = await this.detectSensoryTriggers(userId, interactionData);
    
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
}