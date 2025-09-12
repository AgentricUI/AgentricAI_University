// Learning Coordinator Agent - Main learning coordination logic for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { ILearningAgent } from '../base/AgentInterface';
import { AgentConfig, AgentMessage, NeurodiverseProfile } from '../base/AgentTypes';

export class LearningCoordinator extends BaseAgent implements ILearningAgent {
  private learningProfiles: Map<string, any> = new Map();
  private activeAssessments: Map<string, any> = new Map();
  private contentAdaptations: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'learning-coordinator-001',
      name: 'Learning Coordinator',
      type: 'learning-coordinator',
      version: '1.0.0',
      capabilities: [
        'learning-assessment',
        'progress-tracking', 
        'content-adaptation',
        'engagement-monitoring',
        'recommendation-generation'
      ],
      specialization: 'neurodiverse_learning_coordination',
      neurodiverseOptimized: true,
      priority: 'critical',
      memoryAllocation: '2.4GB',
      status: 'initializing'
    };

    super(config);
  }

  // Core processing method
  async processTask(taskData: any): Promise<any> {
    const { type, userId, data } = taskData;

    switch (type) {
      case 'assess_learning':
        return await this.assessLearningProgress(userId);
      
      case 'adapt_content':
        return await this.adaptContent(data.content, data.userProfile);
      
      case 'track_engagement':
        return await this.trackEngagement(userId, data.activityId, data.engagement);
      
      case 'generate_recommendations':
        return await this.generateRecommendations(userId);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  // Learning-specific methods
  async assessLearningProgress(userId: string): Promise<any> {
    console.log(`📊 Assessing learning progress for user: ${userId}`);
    
    const userProfile = this.learningProfiles.get(userId);
    const previousAssessments = this.retrieveMemory(`assessments_${userId}`, 'long') || [];
    
    // Simulate learning assessment
    const assessment = {
      userId,
      timestamp: new Date(),
      overallProgress: Math.floor(Math.random() * 100),
      skillAreas: {
        colorRecognition: Math.floor(Math.random() * 100),
        shapeMatching: Math.floor(Math.random() * 100),
        numberGames: Math.floor(Math.random() * 100),
        letterTracing: Math.floor(Math.random() * 100)
      },
      engagementLevel: Math.floor(Math.random() * 100),
      adaptiveRecommendations: await this.generateAdaptiveRecommendations(userId),
      neurodiverseConsiderations: this.analyzeNeurodiverseNeeds(userProfile)
    };

    // Store assessment
    previousAssessments.push(assessment);
    this.storeMemory(`assessments_${userId}`, previousAssessments, 'long');
    this.activeAssessments.set(userId, assessment);

    // Update metrics
    this.metrics.tasksCompleted += 1;
    this.metrics.lastActivity = new Date();

    // Notify other agents
    await this.sendMessage('behavior-analyst', {
      id: '',
      fromAgentId: this.id,
      toAgentId: 'behavior-analyst',
      type: 'learning-assessment',
      data: { userId, assessment },
      priority: 'medium',
      timestamp: new Date(),
      requiresResponse: false
    });

    return assessment;
  }

  async adaptContent(content: any, userProfile: any): Promise<any> {
    console.log(`🎯 Adapting content for user profile`);
    
    const adaptedContent = { ...content };
    
    // Apply neurodiverse optimizations
    if (userProfile.neurodiverseProfile) {
      adaptedContent = this.applySensoryOptimizations(adaptedContent);
    }

    // Adjust difficulty based on progress
    const userProgress = this.retrieveMemory(`progress_${userProfile.userId}`, 'short');
    if (userProgress) {
      adaptedContent.difficulty = this.calculateOptimalDifficulty(userProgress);
    }

    // Apply learning style preferences
    if (userProfile.learningStyle === 'visual') {
      adaptedContent.visualElements = true;
      adaptedContent.textInstructions = false;
    } else if (userProfile.learningStyle === 'auditory') {
      adaptedContent.audioInstructions = true;
      adaptedContent.soundEffects = true;
    }

    // Store adaptation for future reference
    this.contentAdaptations.set(`${userProfile.userId}_${content.id}`, adaptedContent);
    
    this.metrics.tasksCompleted += 1;
    return adaptedContent;
  }

  async trackEngagement(userId: string, activityId: string, engagement: any): Promise<void> {
    console.log(`📈 Tracking engagement for user ${userId} in activity ${activityId}`);
    
    const engagementHistory = this.retrieveMemory(`engagement_${userId}`, 'long') || [];
    
    const engagementRecord = {
      userId,
      activityId,
      timestamp: new Date(),
      engagementLevel: engagement.level,
      timeSpent: engagement.timeSpent,
      completionRate: engagement.completionRate,
      interactionCount: engagement.interactions,
      frustrationIndicators: engagement.frustration || [],
      positiveIndicators: engagement.positive || []
    };

    engagementHistory.push(engagementRecord);
    this.storeMemory(`engagement_${userId}`, engagementHistory, 'long');

    // Analyze engagement patterns
    const patterns = this.analyzeEngagementPatterns(engagementHistory);
    
    // If engagement is low, trigger content adaptation
    if (engagement.level < 50) {
      await this.sendMessage('content-generator', {
        id: '',
        fromAgentId: this.id,
        toAgentId: 'content-generator',
        type: 'content-request',
        data: { 
          userId, 
          activityId, 
          reason: 'low_engagement',
          patterns 
        },
        priority: 'high',
        timestamp: new Date(),
        requiresResponse: true
      });
    }

    this.metrics.tasksCompleted += 1;
  }

  async generateRecommendations(userId: string): Promise<string[]> {
    console.log(`💡 Generating recommendations for user: ${userId}`);
    
    const userProfile = this.learningProfiles.get(userId);
    const assessments = this.retrieveMemory(`assessments_${userId}`, 'long') || [];
    const engagement = this.retrieveMemory(`engagement_${userId}`, 'long') || [];

    const recommendations: string[] = [];

    // Analyze recent performance
    if (assessments.length > 0) {
      const latestAssessment = assessments[assessments.length - 1];
      
      if (latestAssessment.overallProgress < 50) {
        recommendations.push("Consider reducing activity difficulty for better success rate");
        recommendations.push("Increase positive reinforcement and celebration moments");
      }
      
      if (latestAssessment.overallProgress > 85) {
        recommendations.push("Ready for more challenging activities");
        recommendations.push("Consider introducing advanced problem-solving tasks");
      }

      // Skill-specific recommendations
      Object.entries(latestAssessment.skillAreas).forEach(([skill, score]) => {
        if (score < 60) {
          recommendations.push(`Focus on ${skill} activities with additional support`);
        } else if (score > 90) {
          recommendations.push(`${skill} mastery achieved - ready for advanced concepts`);
        }
      });
    }

    // Engagement-based recommendations
    if (engagement.length > 0) {
      const avgEngagement = engagement.reduce((sum, e) => sum + e.engagementLevel, 0) / engagement.length;
      
      if (avgEngagement < 60) {
        recommendations.push("Try shorter activity sessions to maintain focus");
        recommendations.push("Incorporate more interactive elements");
      }
    }

    // Neurodiverse-specific recommendations
    if (userProfile?.neurodiverseProfile) {
      const profile = userProfile.neurodiverseProfile;
      
      if (profile.sensoryPreferences.visualComplexity === 'low') {
        recommendations.push("Continue using simplified visual layouts");
      }
      
      if (profile.learningPreferences.routineImportance === 'high') {
        recommendations.push("Maintain consistent activity structure and timing");
      }
    }

    this.storeMemory(`recommendations_${userId}`, recommendations, 'short');
    this.metrics.tasksCompleted += 1;

    return recommendations;
  }

  // Message processing
  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'learning-assessment':
        await this.handleAssessmentRequest(message);
        break;
      
      case 'progress-update':
        await this.handleProgressUpdate(message);
        break;
      
      case 'content-adaptation-request':
        await this.handleContentAdaptationRequest(message);
        break;
      
      default:
        console.log(`Learning Coordinator received unknown message type: ${message.type}`);
    }
  }

  // Neurodiverse optimization
  protected async applyNeurodiverseOptimizations(profile: NeurodiverseProfile): Promise<void> {
    console.log(`🧠 Applying neurodiverse optimizations for Learning Coordinator`);
    
    // Adjust processing speed based on profile
    if (profile.communicationStyle.processingTime === 'extended') {
      this.storeMemory('processing_delay', 2000, 'working'); // 2 second delay
    }
    
    // Set communication preferences
    if (profile.communicationStyle.directLanguage) {
      this.storeMemory('communication_style', 'direct', 'working');
    }
    
    // Configure feedback frequency
    this.storeMemory('feedback_frequency', profile.communicationStyle.feedbackFrequency, 'working');
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "Wow! You're doing such a great job learning! 🌟",
      "I love seeing how much you're growing! Keep it up! 🎉",
      "You're becoming such a smart learner! I'm so proud! 💫",
      "Every day you learn something new - that's amazing! 🚀",
      "Your brain is like a super computer - so cool! 🧠✨"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private async generateAdaptiveRecommendations(userId: string): Promise<string[]> {
    const recommendations = [
      "Continue with current difficulty level",
      "Add more visual cues to activities", 
      "Increase positive reinforcement frequency",
      "Consider shorter activity sessions"
    ];
    
    return recommendations.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private analyzeNeurodiverseNeeds(userProfile: any): any {
    if (!userProfile?.neurodiverseProfile) return {};
    
    return {
      sensoryConsiderations: userProfile.neurodiverseProfile.sensoryPreferences,
      communicationNeeds: userProfile.neurodiverseProfile.communicationStyle,
      learningAdaptations: userProfile.neurodiverseProfile.learningPreferences
    };
  }

  private calculateOptimalDifficulty(userProgress: any): string {
    if (userProgress.averageScore < 60) return 'easy';
    if (userProgress.averageScore > 85) return 'hard';
    return 'medium';
  }

  private analyzeEngagementPatterns(engagementHistory: any[]): any {
    if (engagementHistory.length === 0) return {};
    
    const avgEngagement = engagementHistory.reduce((sum, e) => sum + e.engagementLevel, 0) / engagementHistory.length;
    const avgTimeSpent = engagementHistory.reduce((sum, e) => sum + e.timeSpent, 0) / engagementHistory.length;
    
    return {
      averageEngagement: avgEngagement,
      averageTimeSpent: avgTimeSpent,
      trend: engagementHistory.length > 1 ? 
        (engagementHistory[engagementHistory.length - 1].engagementLevel > engagementHistory[0].engagementLevel ? 'improving' : 'declining') : 
        'stable'
    };
  }

  private async handleAssessmentRequest(message: AgentMessage): Promise<void> {
    const { userId } = message.data;
    const assessment = await this.assessLearningProgress(userId);
    
    // Send response if required
    if (message.requiresResponse) {
      await this.sendMessage(message.fromAgentId, {
        id: '',
        fromAgentId: this.id,
        toAgentId: message.fromAgentId,
        type: 'assessment-response',
        data: { assessment },
        priority: message.priority,
        timestamp: new Date(),
        requiresResponse: false,
        correlationId: message.id
      });
    }
  }

  private async handleProgressUpdate(message: AgentMessage): Promise<void> {
    const { userId, progress } = message.data;
    this.storeMemory(`progress_${userId}`, progress, 'short');
    
    // Update learning profile
    const profile = this.learningProfiles.get(userId) || {};
    profile.lastUpdate = new Date();
    profile.currentProgress = progress;
    this.learningProfiles.set(userId, profile);
  }

  private async handleContentAdaptationRequest(message: AgentMessage): Promise<void> {
    const { content, userProfile } = message.data;
    const adaptedContent = await this.adaptContent(content, userProfile);
    
    // Send adapted content back
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'adapted-content',
      data: { adaptedContent },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}