// Student Agent - Digital representation of individual students

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';

export class StudentAgent extends BaseAgent {
  private learningProfile: any = {};
  private progressData: Map<string, any> = new Map();
  private behaviorPatterns: Map<string, any> = new Map();
  private socialConnections: Map<string, any> = new Map();
  private parentalGoals: Map<string, any> = new Map();

  constructor(studentId: string, studentData: any) {
    const config: AgentConfig = {
      id: `student-agent-${studentId}`,
      name: `Digital Student - ${studentData.name || studentId}`,
      type: 'educational-student',
      version: '1.0.0',
      capabilities: [
        'learning-tracking',
        'progress-monitoring',
        'behavior-modeling',
        'goal-pursuit',
        'self-advocacy',
        'peer-interaction'
      ],
      specialization: 'individual_student_representation',
      neurodiverseOptimized: true,
      priority: 'high',
      memoryAllocation: '1.8GB',
      status: 'initializing'
    };

    super(config);
    this.initializeStudentProfile(studentData);
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'update_progress':
        return await this.updateLearningProgress(data.activity, data.performance);
      
      case 'set_goals':
        return await this.setPersonalGoals(data.goals, data.source);
      
      case 'track_behavior':
        return await this.trackBehaviorPattern(data.behavior, data.context);
      
      case 'interact_socially':
        return await this.recordSocialInteraction(data.interaction);
      
      case 'request_support':
        return await this.requestSupport(data.supportType, data.context);
      
      case 'celebrate_achievement':
        return await this.celebrateAchievement(data.achievement);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async updateLearningProgress(activity: any, performance: any): Promise<any> {
    console.log(`📈 Updating learning progress for activity: ${activity.id}`);
    
    const progressUpdate = {
      activityId: activity.id,
      subject: activity.subject,
      timestamp: new Date(),
      performance: {
        accuracy: performance.accuracy || 0,
        completionTime: performance.completionTime || 0,
        attemptsNeeded: performance.attempts || 1,
        helpRequested: performance.helpRequests || 0,
        engagementLevel: performance.engagement || 50
      },
      skillsAddressed: activity.skills || [],
      masteryLevel: this.calculateMasteryLevel(performance),
      growthFromPrevious: this.calculateGrowth(activity.id, performance),
      adaptationsUsed: performance.adaptations || [],
      sensoryFeedback: performance.sensoryResponse || {}
    };

    // Store progress data
    this.progressData.set(activity.id, progressUpdate);
    
    // Update learning profile
    this.updateLearningProfile(progressUpdate);
    
    // Notify teacher agent
    await this.sendMessage('teacher-agent-001', {
      id: '',
      fromAgentId: this.id,
      toAgentId: 'teacher-agent-001',
      type: 'student-progress-update',
      data: { studentId: this.id, progressUpdate },
      priority: 'medium',
      timestamp: new Date(),
      requiresResponse: false
    });

    // Check if goals are met
    await this.checkGoalProgress(progressUpdate);

    this.metrics.tasksCompleted += 1;
    return progressUpdate;
  }

  async setPersonalGoals(goals: any[], source: 'parent' | 'teacher' | 'student' | 'iep'): Promise<any> {
    console.log(`🎯 Setting personal goals from ${source}`);
    
    const goalSet = {
      source,
      goals: goals.map(goal => ({
        id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: goal.description,
        targetDate: goal.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        priority: goal.priority || 'medium',
        measurable: goal.measurable || true,
        progress: 0,
        milestones: goal.milestones || [],
        accommodations: goal.accommodations || [],
        supportNeeded: goal.supportNeeded || []
      })),
      setAt: new Date(),
      reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    this.parentalGoals.set(source, goalSet);
    this.storeMemory(`goals_${source}`, goalSet, 'long');

    // Notify learning coordinator
    await this.sendMessage('learning-coordinator-001', {
      id: '',
      fromAgentId: this.id,
      toAgentId: 'learning-coordinator-001',
      type: 'student-goals-update',
      data: { studentId: this.id, goalSet },
      priority: 'medium',
      timestamp: new Date(),
      requiresResponse: false
    });

    this.metrics.tasksCompleted += 1;
    return goalSet;
  }

  async trackBehaviorPattern(behavior: any, context: any): Promise<any> {
    console.log(`👁️ Tracking behavior pattern: ${behavior.type}`);
    
    const behaviorRecord = {
      type: behavior.type,
      timestamp: new Date(),
      context: {
        activity: context.activity,
        timeOfDay: context.timeOfDay,
        environment: context.environment,
        socialSituation: context.socialSituation
      },
      intensity: behavior.intensity || 'moderate',
      duration: behavior.duration || 0,
      triggers: behavior.triggers || [],
      interventionsUsed: behavior.interventions || [],
      outcome: behavior.outcome || 'neutral',
      sensoryFactors: behavior.sensoryFactors || {}
    };

    // Store behavior pattern
    const patterns = this.behaviorPatterns.get(behavior.type) || [];
    patterns.push(behaviorRecord);
    this.behaviorPatterns.set(behavior.type, patterns);

    // Analyze for patterns
    const patternAnalysis = this.analyzeBehaviorPatterns(behavior.type);
    
    // Notify behavior analyst if concerning pattern
    if (patternAnalysis.concernLevel === 'high') {
      await this.sendMessage('behavior-analyst-001', {
        id: '',
        fromAgentId: this.id,
        toAgentId: 'behavior-analyst-001',
        type: 'behavior-concern',
        data: { studentId: this.id, behaviorRecord, patternAnalysis },
        priority: 'high',
        timestamp: new Date(),
        requiresResponse: true
      });
    }

    this.metrics.tasksCompleted += 1;
    return { behaviorRecord, patternAnalysis };
  }

  async recordSocialInteraction(interaction: any): Promise<any> {
    console.log(`🤝 Recording social interaction`);
    
    const socialRecord = {
      interactionId: `social-${Date.now()}`,
      timestamp: new Date(),
      participants: interaction.participants || [],
      type: interaction.type || 'peer_interaction',
      quality: interaction.quality || 'positive',
      duration: interaction.duration || 0,
      initiatedBy: interaction.initiatedBy || 'other',
      communicationUsed: interaction.communication || 'verbal',
      supportNeeded: interaction.supportNeeded || false,
      outcome: interaction.outcome || 'successful',
      skillsObserved: interaction.skillsObserved || []
    };

    // Store social interaction
    this.socialConnections.set(socialRecord.interactionId, socialRecord);
    
    // Update social skills profile
    this.updateSocialSkillsProfile(socialRecord);

    this.metrics.tasksCompleted += 1;
    return socialRecord;
  }

  async requestSupport(supportType: string, context: any): Promise<any> {
    console.log(`🆘 Requesting support: ${supportType}`);
    
    const supportRequest = {
      requestId: `support-${Date.now()}`,
      studentId: this.id,
      supportType,
      context,
      urgency: this.determineSupportUrgency(supportType, context),
      timestamp: new Date(),
      status: 'pending'
    };

    // Route to appropriate support agent
    const targetAgent = this.selectSupportAgent(supportType);
    
    await this.sendMessage(targetAgent, {
      id: '',
      fromAgentId: this.id,
      toAgentId: targetAgent,
      type: 'support-request',
      data: { supportRequest },
      priority: supportRequest.urgency,
      timestamp: new Date(),
      requiresResponse: true
    });

    this.metrics.tasksCompleted += 1;
    return supportRequest;
  }

  async celebrateAchievement(achievement: any): Promise<any> {
    console.log(`🎉 Celebrating achievement: ${achievement.type}`);
    
    const celebration = {
      achievementId: `achievement-${Date.now()}`,
      type: achievement.type,
      description: achievement.description,
      timestamp: new Date(),
      significance: this.assessAchievementSignificance(achievement),
      celebrationMethod: this.selectCelebrationMethod(achievement),
      shareWithParents: achievement.shareWithParents !== false,
      addToPortfolio: achievement.addToPortfolio !== false
    };

    // Update achievement history
    const achievements = this.retrieveMemory('achievements', 'long') || [];
    achievements.push(celebration);
    this.storeMemory('achievements', achievements, 'long');

    // Notify parents if appropriate
    if (celebration.shareWithParents) {
      await this.sendMessage('parent-liaison-001', {
        id: '',
        fromAgentId: this.id,
        toAgentId: 'parent-liaison-001',
        type: 'achievement-notification',
        data: { studentId: this.id, celebration },
        priority: 'low',
        timestamp: new Date(),
        requiresResponse: false
      });
    }

    this.metrics.tasksCompleted += 1;
    return celebration;
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'learning-activity':
        await this.handleLearningActivity(message);
        break;
      
      case 'goal-check':
        await this.handleGoalCheck(message);
        break;
      
      case 'behavior-intervention':
        await this.handleBehaviorIntervention(message);
        break;
      
      case 'social-opportunity':
        await this.handleSocialOpportunity(message);
        break;
      
      default:
        console.log(`Student Agent received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm your digital learning buddy who keeps track of all your amazing progress! 🌟📚",
      "I love celebrating every step of your learning journey with you! 🎉💫",
      "I'm here to help you reach all your goals and dreams! 🎯✨",
      "I remember all the cool things you learn so we can build on them! 🧠🚀",
      "You're doing such an amazing job, and I'm so proud of you! 🏆💙"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private initializeStudentProfile(studentData: any): void {
    this.learningProfile = {
      studentId: studentData.id,
      name: studentData.name,
      age: studentData.age,
      grade: studentData.grade,
      diagnosis: studentData.diagnosis || [],
      learningStyle: studentData.learningStyle || 'unknown',
      sensoryProfile: studentData.sensoryProfile || {},
      communicationLevel: studentData.communicationLevel || 'verbal',
      supportNeeds: studentData.supportNeeds || [],
      strengths: studentData.strengths || [],
      challenges: studentData.challenges || [],
      interests: studentData.interests || [],
      accommodations: studentData.accommodations || [],
      goals: studentData.goals || [],
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    this.storeMemory('learning_profile', this.learningProfile, 'long');
  }

  private calculateMasteryLevel(performance: any): 'emerging' | 'developing' | 'proficient' | 'advanced' {
    const accuracy = performance.accuracy || 0;
    
    if (accuracy >= 90) return 'advanced';
    if (accuracy >= 75) return 'proficient';
    if (accuracy >= 50) return 'developing';
    return 'emerging';
  }

  private calculateGrowth(activityId: string, currentPerformance: any): number {
    const previousData = Array.from(this.progressData.values())
      .filter(data => data.activityId === activityId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (previousData.length < 2) return 0;
    
    const previous = previousData[1]; // Second most recent
    const current = currentPerformance;
    
    return current.accuracy - previous.performance.accuracy;
  }

  private updateLearningProfile(progressUpdate: any): void {
    // Update learning style based on performance patterns
    if (progressUpdate.performance.engagementLevel > 80) {
      const activity = progressUpdate.activityId;
      if (activity.includes('visual')) {
        this.learningProfile.learningStyleConfidence = this.learningProfile.learningStyleConfidence || {};
        this.learningProfile.learningStyleConfidence.visual = (this.learningProfile.learningStyleConfidence.visual || 0) + 1;
      }
    }

    // Update strengths and challenges
    if (progressUpdate.masteryLevel === 'advanced') {
      const skill = progressUpdate.skillsAddressed[0];
      if (skill && !this.learningProfile.strengths.includes(skill)) {
        this.learningProfile.strengths.push(skill);
      }
    }

    this.learningProfile.lastUpdated = new Date();
    this.storeMemory('learning_profile', this.learningProfile, 'long');
  }

  private async checkGoalProgress(progressUpdate: any): Promise<void> {
    for (const [source, goalSet] of this.parentalGoals.entries()) {
      for (const goal of goalSet.goals) {
        if (this.isGoalRelated(goal, progressUpdate)) {
          const progressIncrease = this.calculateGoalProgress(goal, progressUpdate);
          goal.progress = Math.min(100, goal.progress + progressIncrease);
          
          if (goal.progress >= 100) {
            await this.celebrateAchievement({
              type: 'goal_completion',
              description: goal.description,
              source: source,
              shareWithParents: true
            });
          }
        }
      }
    }
  }

  private analyzeBehaviorPatterns(behaviorType: string): any {
    const patterns = this.behaviorPatterns.get(behaviorType) || [];
    
    if (patterns.length < 3) {
      return { concernLevel: 'low', confidence: 'low' };
    }

    const recentPatterns = patterns.slice(-10); // Last 10 occurrences
    
    const analysis = {
      frequency: this.calculateBehaviorFrequency(recentPatterns),
      intensity: this.calculateAverageIntensity(recentPatterns),
      triggers: this.identifyCommonTriggers(recentPatterns),
      effectiveInterventions: this.identifyEffectiveInterventions(recentPatterns),
      concernLevel: this.assessConcernLevel(recentPatterns),
      confidence: 'high'
    };

    return analysis;
  }

  private updateSocialSkillsProfile(socialRecord: any): void {
    const socialProfile = this.retrieveMemory('social_profile', 'long') || {
      initiationSkills: 0,
      responseSkills: 0,
      conversationSkills: 0,
      nonverbalSkills: 0,
      conflictResolution: 0
    };

    // Update based on interaction quality
    if (socialRecord.quality === 'positive') {
      if (socialRecord.initiatedBy === 'self') {
        socialProfile.initiationSkills += 1;
      } else {
        socialProfile.responseSkills += 1;
      }
      
      if (socialRecord.duration > 300) { // 5+ minutes
        socialProfile.conversationSkills += 1;
      }
    }

    this.storeMemory('social_profile', socialProfile, 'long');
  }

  private determineSupportUrgency(supportType: string, context: any): 'low' | 'medium' | 'high' | 'critical' {
    const urgencyMap = {
      'sensory_overload': 'critical',
      'emotional_regulation': 'high',
      'academic_help': 'medium',
      'social_support': 'medium',
      'communication_help': 'high',
      'general_question': 'low'
    };
    
    return urgencyMap[supportType] || 'medium';
  }

  private selectSupportAgent(supportType: string): string {
    const agentMap = {
      'sensory_overload': 'sensory-optimizer-001',
      'emotional_regulation': 'behavior-analyst-001',
      'academic_help': 'teacher-agent-001',
      'social_support': 'social-skills-agent-001',
      'communication_help': 'speech-therapist-agent-001'
    };
    
    return agentMap[supportType] || 'teacher-agent-001';
  }

  private assessAchievementSignificance(achievement: any): 'minor' | 'moderate' | 'major' | 'milestone' {
    if (achievement.type === 'goal_completion') return 'milestone';
    if (achievement.type === 'skill_mastery') return 'major';
    if (achievement.type === 'improvement') return 'moderate';
    return 'minor';
  }

  private selectCelebrationMethod(achievement: any): string {
    const methods = {
      'milestone': 'special_recognition_ceremony',
      'major': 'achievement_badge_and_notification',
      'moderate': 'positive_feedback_and_sticker',
      'minor': 'encouraging_message'
    };
    
    return methods[achievement.significance] || methods['moderate'];
  }

  private isGoalRelated(goal: any, progressUpdate: any): boolean {
    // Check if progress update relates to goal
    return goal.description.toLowerCase().includes(progressUpdate.subject.toLowerCase()) ||
           progressUpdate.skillsAddressed.some(skill => goal.description.toLowerCase().includes(skill.toLowerCase()));
  }

  private calculateGoalProgress(goal: any, progressUpdate: any): number {
    // Calculate how much this progress contributes to goal completion
    const baseProgress = progressUpdate.performance.accuracy > 75 ? 10 : 5;
    const masteryBonus = progressUpdate.masteryLevel === 'advanced' ? 5 : 0;
    
    return baseProgress + masteryBonus;
  }

  private calculateBehaviorFrequency(patterns: any[]): number {
    if (patterns.length === 0) return 0;
    
    const timeSpan = patterns[patterns.length - 1].timestamp.getTime() - patterns[0].timestamp.getTime();
    const days = timeSpan / (1000 * 60 * 60 * 24);
    
    return patterns.length / Math.max(days, 1);
  }

  private calculateAverageIntensity(patterns: any[]): string {
    const intensityMap = { low: 1, moderate: 2, high: 3 };
    const reverseMap = { 1: 'low', 2: 'moderate', 3: 'high' };
    
    const avgIntensity = patterns.reduce((sum, pattern) => {
      return sum + (intensityMap[pattern.intensity] || 2);
    }, 0) / patterns.length;
    
    return reverseMap[Math.round(avgIntensity)] || 'moderate';
  }

  private identifyCommonTriggers(patterns: any[]): string[] {
    const triggerCounts = {};
    
    patterns.forEach(pattern => {
      pattern.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });
    
    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trigger]) => trigger);
  }

  private identifyEffectiveInterventions(patterns: any[]): string[] {
    const effectiveInterventions = patterns
      .filter(pattern => pattern.outcome === 'positive')
      .flatMap(pattern => pattern.interventionsUsed);
    
    const interventionCounts = {};
    effectiveInterventions.forEach(intervention => {
      interventionCounts[intervention] = (interventionCounts[intervention] || 0) + 1;
    });
    
    return Object.entries(interventionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([intervention]) => intervention);
  }

  private assessConcernLevel(patterns: any[]): 'low' | 'medium' | 'high' {
    const negativeOutcomes = patterns.filter(p => p.outcome === 'negative').length;
    const highIntensity = patterns.filter(p => p.intensity === 'high').length;
    
    if (negativeOutcomes > patterns.length * 0.6 || highIntensity > patterns.length * 0.4) {
      return 'high';
    }
    
    if (negativeOutcomes > patterns.length * 0.3 || highIntensity > patterns.length * 0.2) {
      return 'medium';
    }
    
    return 'low';
  }

  private async handleLearningActivity(message: AgentMessage): Promise<void> {
    const { activity, performance } = message.data;
    await this.updateLearningProgress(activity, performance);
  }

  private async handleGoalCheck(message: AgentMessage): Promise<void> {
    const { goalId } = message.data;
    // Check specific goal progress and respond
  }

  private async handleBehaviorIntervention(message: AgentMessage): Promise<void> {
    const { intervention } = message.data;
    await this.trackBehaviorPattern(intervention.behavior, intervention.context);
  }

  private async handleSocialOpportunity(message: AgentMessage): Promise<void> {
    const { opportunity } = message.data;
    await this.recordSocialInteraction(opportunity);
  }
}