import { AdaptiveSettings, UserSession, Activity } from '../types';

export class AdaptiveEngine {
  private static instance: AdaptiveEngine;

  private constructor() {}

  static getInstance(): AdaptiveEngine {
    if (!AdaptiveEngine.instance) {
      AdaptiveEngine.instance = new AdaptiveEngine();
    }
    return AdaptiveEngine.instance;
  }

  analyzeUserBehavior(session: UserSession): AdaptiveSettings {
    const { activitiesCompleted, progress } = session;
    
    // Simple adaptive logic - can be enhanced with ML models
    let difficultyLevel: AdaptiveSettings['difficultyLevel'] = 'medium';
    
    if (progress < 30) {
      difficultyLevel = 'easy';
    } else if (progress > 80) {
      difficultyLevel = 'hard';
    }

    return {
      difficultyLevel,
      sensoryPreferences: {
        visualComplexity: progress > 60 ? 'medium' : 'low',
        audioEnabled: true,
        animationSpeed: 'medium'
      },
      learningStyle: this.inferLearningStyle(activitiesCompleted)
    };
  }

  private inferLearningStyle(completedActivities: string[]): AdaptiveSettings['learningStyle'] {
    // Analyze completion patterns to infer learning style
    const visualActivities = completedActivities.filter(a => 
      a.includes('color') || a.includes('shape')
    ).length;
    
    const auditoryActivities = completedActivities.filter(a => 
      a.includes('sound') || a.includes('music')
    ).length;
    
    const kinestheticActivities = completedActivities.filter(a => 
      a.includes('trace') || a.includes('draw')
    ).length;

    if (visualActivities > auditoryActivities && visualActivities > kinestheticActivities) {
      return 'visual';
    } else if (auditoryActivities > kinestheticActivities) {
      return 'auditory';
    } else if (kinestheticActivities > 0) {
      return 'kinesthetic';
    }
    
    return 'mixed';
  }

  adaptActivity(activity: Activity, settings: AdaptiveSettings): Activity {
    const adapted = { ...activity };
    
    // Adjust activity based on settings
    switch (settings.difficultyLevel) {
      case 'easy':
        adapted.adaptiveData = { 
          ...adapted.adaptiveData, 
          hints: true, 
          timeLimit: null,
          attempts: 5 
        };
        break;
      case 'hard':
        adapted.adaptiveData = { 
          ...adapted.adaptiveData, 
          hints: false, 
          timeLimit: 60,
          attempts: 3 
        };
        break;
      default:
        adapted.adaptiveData = { 
          ...adapted.adaptiveData, 
          hints: true, 
          timeLimit: 120,
          attempts: 4 
        };
    }

    return adapted;
  }

  generateRecommendations(userSessions: UserSession[]): string[] {
    const recommendations: string[] = [];
    
    if (userSessions.length === 0) {
      return ['Start with color recognition activities to build foundational skills'];
    }

    const latestSession = userSessions[userSessions.length - 1];
    const avgProgress = userSessions.reduce((sum, s) => sum + s.progress, 0) / userSessions.length;

    if (avgProgress < 50) {
      recommendations.push('Consider reducing difficulty level for better engagement');
      recommendations.push('Increase positive reinforcement and celebration moments');
    } else if (avgProgress > 85) {
      recommendations.push('Ready for more challenging activities');
      recommendations.push('Consider introducing advanced problem-solving tasks');
    }

    if (latestSession.activitiesCompleted.length < 3) {
      recommendations.push('Encourage completing more activities per session');
    }

    return recommendations;
  }
}

export const adaptiveEngine = AdaptiveEngine.getInstance();