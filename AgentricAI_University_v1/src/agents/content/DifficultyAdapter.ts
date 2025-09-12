// Difficulty Adapter Agent - Specialized difficulty level adjustment

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';

export class DifficultyAdapter extends BaseAgent {
  private difficultyProfiles: Map<string, any> = new Map();
  private adaptationHistory: Map<string, any[]> = new Map();
  private performanceMetrics: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'difficulty-adapter-001',
      name: 'Intelligent Difficulty Adapter',
      type: 'content-generator',
      version: '1.0.0',
      capabilities: [
        'difficulty-analysis',
        'adaptive-scaling',
        'performance-tracking',
        'challenge-optimization',
        'skill-assessment'
      ],
      specialization: 'dynamic_difficulty_adjustment',
      neurodiverseOptimized: true,
      priority: 'medium',
      memoryAllocation: '1.3GB',
      status: 'initializing'
    };

    super(config);
  }

  async processTask(taskData: any): Promise<any> {
    const { type, userId, data } = taskData;

    switch (type) {
      case 'analyze_performance':
        return await this.analyzePerformance(userId, data.sessionData);
      
      case 'calculate_difficulty':
        return await this.calculateOptimalDifficulty(userId, data.activityType);
      
      case 'adapt_content_difficulty':
        return await this.adaptContentDifficulty(data.content, data.targetDifficulty, userId);
      
      case 'track_progress':
        return await this.trackProgressAndAdjust(userId, data.progressData);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async analyzePerformance(userId: string, sessionData: any): Promise<any> {
    console.log(`📊 Analyzing performance for user: ${userId}`);
    
    const analysis = {
      userId,
      sessionId: sessionData.sessionId,
      timestamp: new Date(),
      metrics: {
        accuracy: this.calculateAccuracy(sessionData),
        speed: this.calculateSpeed(sessionData),
        persistence: this.calculatePersistence(sessionData),
        engagement: this.calculateEngagement(sessionData),
        frustrationLevel: this.calculateFrustrationLevel(sessionData)
      },
      skillAreas: this.analyzeSkillAreas(sessionData),
      recommendations: []
    };

    // Generate difficulty recommendations
    analysis.recommendations = this.generateDifficultyRecommendations(analysis);

    // Store performance analysis
    this.performanceMetrics.set(userId, analysis);
    this.storeMemory(`performance_${userId}`, analysis, 'long');

    this.metrics.tasksCompleted += 1;
    return analysis;
  }

  async calculateOptimalDifficulty(userId: string, activityType: string): Promise<string> {
    console.log(`🎯 Calculating optimal difficulty for user: ${userId}, activity: ${activityType}`);
    
    const performanceData = this.performanceMetrics.get(userId);
    const difficultyProfile = this.difficultyProfiles.get(userId);
    const adaptationHistory = this.adaptationHistory.get(userId) || [];

    let optimalDifficulty = 'medium'; // Default

    if (performanceData) {
      const { accuracy, speed, frustrationLevel, engagement } = performanceData.metrics;
      
      // Calculate difficulty based on performance metrics
      let difficultyScore = 50; // Base score for medium difficulty
      
      // Adjust based on accuracy
      if (accuracy > 90) difficultyScore += 20;
      else if (accuracy > 75) difficultyScore += 10;
      else if (accuracy < 50) difficultyScore -= 20;
      else if (accuracy < 65) difficultyScore -= 10;
      
      // Adjust based on speed (faster = can handle more difficulty)
      if (speed > 80) difficultyScore += 10;
      else if (speed < 40) difficultyScore -= 10;
      
      // Adjust based on frustration (higher frustration = lower difficulty)
      if (frustrationLevel > 70) difficultyScore -= 25;
      else if (frustrationLevel > 50) difficultyScore -= 15;
      else if (frustrationLevel < 20) difficultyScore += 10;
      
      // Adjust based on engagement
      if (engagement > 80) difficultyScore += 15;
      else if (engagement < 40) difficultyScore -= 15;
      
      // Determine difficulty level
      if (difficultyScore >= 70) optimalDifficulty = 'hard';
      else if (difficultyScore >= 40) optimalDifficulty = 'medium';
      else optimalDifficulty = 'easy';
    }

    // Consider neurodiverse factors
    if (difficultyProfile?.neurodiverseProfile) {
      const profile = difficultyProfile.neurodiverseProfile;
      
      // Be more conservative with difficulty increases for neurodiverse learners
      if (profile.learningPreferences?.changeAdaptation === 'gradual') {
        if (optimalDifficulty === 'hard' && this.getCurrentDifficulty(userId, activityType) === 'easy') {
          optimalDifficulty = 'medium'; // Gradual progression
        }
      }
      
      // Consider routine importance
      if (profile.learningPreferences?.routineImportance === 'high') {
        // Maintain consistent difficulty if user is comfortable
        const recentAdaptations = adaptationHistory.slice(-3);
        if (recentAdaptations.every(a => a.successful)) {
          optimalDifficulty = this.getCurrentDifficulty(userId, activityType);
        }
      }
    }

    // Store difficulty calculation
    this.storeMemory(`optimal_difficulty_${userId}_${activityType}`, {
      difficulty: optimalDifficulty,
      calculatedAt: new Date(),
      basedOn: performanceData ? 'performance_data' : 'default'
    }, 'short');

    this.metrics.tasksCompleted += 1;
    return optimalDifficulty;
  }

  async adaptContentDifficulty(content: any, targetDifficulty: string, userId: string): Promise<any> {
    console.log(`🔧 Adapting content difficulty to: ${targetDifficulty} for user: ${userId}`);
    
    const adaptedContent = { ...content };
    const currentDifficulty = content.metadata?.difficulty || 'medium';
    
    if (currentDifficulty === targetDifficulty) {
      return adaptedContent;
    }

    // Apply difficulty-specific adaptations
    const adaptations = this.getDifficultyAdaptations(targetDifficulty, content.type);
    
    // Apply visual adaptations
    if (adaptations.visual) {
      adaptedContent.visual = {
        ...adaptedContent.visual,
        ...adaptations.visual
      };
    }

    // Apply interaction adaptations
    if (adaptations.interaction) {
      adaptedContent.interaction = {
        ...adaptedContent.interaction,
        ...adaptations.interaction
      };
    }

    // Apply content adaptations
    if (adaptations.content) {
      adaptedContent.content = this.applyContentAdaptations(adaptedContent.content, adaptations.content);
    }

    // Apply timing adaptations
    if (adaptations.timing) {
      adaptedContent.timing = {
        ...adaptedContent.timing,
        ...adaptations.timing
      };
    }

    // Update metadata
    adaptedContent.metadata = {
      ...adaptedContent.metadata,
      difficulty: targetDifficulty,
      adaptedFrom: currentDifficulty,
      adaptedAt: new Date(),
      adaptedFor: userId
    };

    // Record adaptation
    await this.recordAdaptation(userId, {
      contentId: content.id,
      fromDifficulty: currentDifficulty,
      toDifficulty: targetDifficulty,
      adaptations: adaptations,
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
    return adaptedContent;
  }

  async trackProgressAndAdjust(userId: string, progressData: any): Promise<any> {
    console.log(`📈 Tracking progress and adjusting for user: ${userId}`);
    
    const currentProfile = this.difficultyProfiles.get(userId) || {
      userId,
      skillLevels: {},
      preferences: {},
      adaptationHistory: []
    };

    // Update skill levels based on progress
    if (progressData.skillAssessments) {
      Object.entries(progressData.skillAssessments).forEach(([skill, level]) => {
        currentProfile.skillLevels[skill] = level;
      });
    }

    // Analyze progress trends
    const progressTrends = this.analyzeProgressTrends(userId, progressData);
    
    // Generate adjustment recommendations
    const adjustmentRecommendations = this.generateAdjustmentRecommendations(progressTrends, currentProfile);

    // Update difficulty profile
    currentProfile.lastUpdated = new Date();
    currentProfile.progressTrends = progressTrends;
    currentProfile.adjustmentRecommendations = adjustmentRecommendations;

    this.difficultyProfiles.set(userId, currentProfile);
    this.storeMemory(`difficulty_profile_${userId}`, currentProfile, 'long');

    this.metrics.tasksCompleted += 1;
    return {
      profile: currentProfile,
      trends: progressTrends,
      recommendations: adjustmentRecommendations
    };
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'difficulty-analysis-request':
        await this.handleDifficultyAnalysisRequest(message);
        break;
      
      case 'adaptation-request':
        await this.handleAdaptationRequest(message);
        break;
      
      case 'progress-update':
        await this.handleProgressUpdate(message);
        break;
      
      default:
        console.log(`Difficulty Adapter received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm making sure the activities are just right for you! 🎯",
      "I'm adjusting things so they're not too easy or too hard! ⚖️",
      "I want you to feel challenged but successful! 🌟",
      "I'm finding the perfect level of fun for you! 🎮",
      "I'm making sure you can learn and grow at your own pace! 🌱"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private calculateAccuracy(sessionData: any): number {
    if (!sessionData.attempts || sessionData.attempts.length === 0) return 50;
    
    const correctAttempts = sessionData.attempts.filter(attempt => attempt.correct).length;
    return Math.round((correctAttempts / sessionData.attempts.length) * 100);
  }

  private calculateSpeed(sessionData: any): number {
    if (!sessionData.attempts || sessionData.attempts.length === 0) return 50;
    
    const avgResponseTime = sessionData.attempts.reduce((sum, attempt) => sum + (attempt.responseTime || 5000), 0) / sessionData.attempts.length;
    
    // Convert response time to speed score (faster = higher score)
    // Assuming 3 seconds is optimal, 1 second is very fast, 10 seconds is slow
    if (avgResponseTime <= 1000) return 100;
    if (avgResponseTime <= 3000) return 80;
    if (avgResponseTime <= 5000) return 60;
    if (avgResponseTime <= 8000) return 40;
    return 20;
  }

  private calculatePersistence(sessionData: any): number {
    if (!sessionData.attempts) return 50;
    
    const retryCount = sessionData.attempts.filter(attempt => attempt.isRetry).length;
    const totalAttempts = sessionData.attempts.length;
    
    // Higher retry rate indicates persistence
    const retryRate = retryCount / totalAttempts;
    return Math.min(100, Math.round(retryRate * 100 + 50));
  }

  private calculateEngagement(sessionData: any): number {
    let engagement = 50;
    
    if (sessionData.sessionDuration > 300000) engagement += 20; // 5+ minutes
    if (sessionData.interactionCount > 10) engagement += 15;
    if (sessionData.completionRate > 0.8) engagement += 15;
    if (sessionData.exploratoryBehavior) engagement += 10;
    
    return Math.min(100, engagement);
  }

  private calculateFrustrationLevel(sessionData: any): number {
    let frustration = 0;
    
    if (sessionData.rapidClicking) frustration += 25;
    if (sessionData.longPauses > 3) frustration += 20;
    if (sessionData.backtracking > 2) frustration += 15;
    if (sessionData.errorStreak > 3) frustration += 20;
    if (sessionData.quitAttempts > 0) frustration += 30;
    
    return Math.min(100, frustration);
  }

  private analyzeSkillAreas(sessionData: any): any {
    const skillAreas = {
      problemSolving: 50,
      patternRecognition: 50,
      memoryRetention: 50,
      motorSkills: 50,
      attention: 50
    };

    if (sessionData.skillMetrics) {
      Object.assign(skillAreas, sessionData.skillMetrics);
    }

    return skillAreas;
  }

  private generateDifficultyRecommendations(analysis: any): string[] {
    const recommendations = [];
    const { accuracy, frustrationLevel, engagement } = analysis.metrics;

    if (accuracy > 90 && frustrationLevel < 30) {
      recommendations.push('Consider increasing difficulty level');
    }
    
    if (accuracy < 50 || frustrationLevel > 70) {
      recommendations.push('Consider decreasing difficulty level');
    }
    
    if (engagement < 40) {
      recommendations.push('Try different activity types or themes');
    }
    
    if (analysis.skillAreas.attention < 40) {
      recommendations.push('Break activities into shorter segments');
    }

    return recommendations;
  }

  private getCurrentDifficulty(userId: string, activityType: string): string {
    const stored = this.retrieveMemory(`current_difficulty_${userId}_${activityType}`, 'short');
    return stored || 'medium';
  }

  private getDifficultyAdaptations(targetDifficulty: string, contentType: string): any {
    const adaptations = {
      easy: {
        visual: {
          elementsPerScreen: 3,
          colorComplexity: 'simple',
          animationSpeed: 'slow',
          textSize: 'large'
        },
        interaction: {
          timeLimit: null,
          attempts: 'unlimited',
          hints: true,
          guidance: 'high'
        },
        content: {
          complexity: 'minimal',
          steps: 'few',
          examples: 'many'
        },
        timing: {
          processingTime: 'extended',
          feedbackDelay: 1000
        }
      },
      medium: {
        visual: {
          elementsPerScreen: 5,
          colorComplexity: 'moderate',
          animationSpeed: 'medium',
          textSize: 'medium'
        },
        interaction: {
          timeLimit: 300, // 5 minutes
          attempts: 5,
          hints: true,
          guidance: 'medium'
        },
        content: {
          complexity: 'moderate',
          steps: 'moderate',
          examples: 'some'
        },
        timing: {
          processingTime: 'standard',
          feedbackDelay: 500
        }
      },
      hard: {
        visual: {
          elementsPerScreen: 8,
          colorComplexity: 'complex',
          animationSpeed: 'fast',
          textSize: 'small'
        },
        interaction: {
          timeLimit: 180, // 3 minutes
          attempts: 3,
          hints: false,
          guidance: 'minimal'
        },
        content: {
          complexity: 'high',
          steps: 'many',
          examples: 'few'
        },
        timing: {
          processingTime: 'quick',
          feedbackDelay: 200
        }
      }
    };

    return adaptations[targetDifficulty] || adaptations.medium;
  }

  private applyContentAdaptations(content: any, adaptations: any): any {
    const adapted = { ...content };
    
    if (adaptations.complexity === 'minimal') {
      // Simplify content structure
      if (adapted.elements) {
        Object.keys(adapted.elements).forEach(key => {
          const element = adapted.elements[key];
          if (Array.isArray(element)) {
            adapted.elements[key] = element.slice(0, 3);
          }
        });
      }
    } else if (adaptations.complexity === 'high') {
      // Increase content complexity
      if (adapted.elements) {
        Object.keys(adapted.elements).forEach(key => {
          const element = adapted.elements[key];
          if (Array.isArray(element) && element.length < 6) {
            // Add more elements if possible
            adapted.elements[key] = [...element, ...element.slice(0, 6 - element.length)];
          }
        });
      }
    }

    return adapted;
  }

  private async recordAdaptation(userId: string, adaptationRecord: any): Promise<void> {
    const history = this.adaptationHistory.get(userId) || [];
    history.push(adaptationRecord);
    
    // Keep only last 20 adaptations
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    
    this.adaptationHistory.set(userId, history);
    this.storeMemory(`adaptation_history_${userId}`, history, 'long');
  }

  private analyzeProgressTrends(userId: string, progressData: any): any {
    const history = this.adaptationHistory.get(userId) || [];
    
    const trends = {
      improvementRate: this.calculateImprovementRate(progressData),
      consistencyScore: this.calculateConsistencyScore(progressData),
      adaptationSuccess: this.calculateAdaptationSuccess(history),
      skillGrowth: this.calculateSkillGrowth(progressData)
    };

    return trends;
  }

  private calculateImprovementRate(progressData: any): number {
    if (!progressData.historicalScores || progressData.historicalScores.length < 2) return 0;
    
    const scores = progressData.historicalScores;
    const recent = scores.slice(-5);
    const earlier = scores.slice(-10, -5);
    
    if (earlier.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, score) => sum + score, 0) / earlier.length;
    
    return ((recentAvg - earlierAvg) / earlierAvg) * 100;
  }

  private calculateConsistencyScore(progressData: any): number {
    if (!progressData.historicalScores || progressData.historicalScores.length < 3) return 50;
    
    const scores = progressData.historicalScores.slice(-10);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(0, 100 - (standardDeviation * 2));
  }

  private calculateAdaptationSuccess(history: any[]): number {
    if (history.length === 0) return 50;
    
    const recentAdaptations = history.slice(-5);
    const successfulAdaptations = recentAdaptations.filter(a => a.successful).length;
    
    return (successfulAdaptations / recentAdaptations.length) * 100;
  }

  private calculateSkillGrowth(progressData: any): any {
    const skillGrowth = {};
    
    if (progressData.skillAssessments && progressData.previousSkillAssessments) {
      Object.keys(progressData.skillAssessments).forEach(skill => {
        const current = progressData.skillAssessments[skill];
        const previous = progressData.previousSkillAssessments[skill] || current;
        skillGrowth[skill] = current - previous;
      });
    }
    
    return skillGrowth;
  }

  private generateAdjustmentRecommendations(trends: any, profile: any): string[] {
    const recommendations = [];
    
    if (trends.improvementRate > 20) {
      recommendations.push('User is improving rapidly - consider increasing difficulty');
    } else if (trends.improvementRate < -10) {
      recommendations.push('User may be struggling - consider decreasing difficulty');
    }
    
    if (trends.consistencyScore < 30) {
      recommendations.push('Inconsistent performance - maintain current difficulty and provide more support');
    }
    
    if (trends.adaptationSuccess < 60) {
      recommendations.push('Recent adaptations not successful - be more conservative with changes');
    }
    
    return recommendations;
  }

  private async handleDifficultyAnalysisRequest(message: AgentMessage): Promise<void> {
    const { userId, sessionData } = message.data;
    const analysis = await this.analyzePerformance(userId, sessionData);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'difficulty-analysis-response',
      data: { analysis },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleAdaptationRequest(message: AgentMessage): Promise<void> {
    const { content, targetDifficulty, userId } = message.data;
    const adaptedContent = await this.adaptContentDifficulty(content, targetDifficulty, userId);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'content-adapted',
      data: { adaptedContent },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleProgressUpdate(message: AgentMessage): Promise<void> {
    const { userId, progressData } = message.data;
    await this.trackProgressAndAdjust(userId, progressData);
  }
}