// Content Generator Agent - Dynamic content creation for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { IContentAgent } from '../base/AgentInterface';
import { AgentConfig, AgentMessage, NeurodiverseProfile } from '../base/AgentTypes';

export class ContentGenerator extends BaseAgent implements IContentAgent {
  private contentTemplates: Map<string, any> = new Map();
  private generatedContent: Map<string, any> = new Map();
  private contentHistory: Map<string, any[]> = new Map();
  private adaptationRules: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'content-generator-001',
      name: 'Adaptive Content Creator',
      type: 'content-generator',
      version: '1.0.0',
      capabilities: [
        'content-generation',
        'difficulty-adaptation',
        'sensory-optimization',
        'personalization',
        'template-management',
        'content-validation'
      ],
      specialization: 'autism_friendly_content_creation',
      neurodiverseOptimized: true,
      priority: 'medium',
      memoryAllocation: '2.1GB',
      status: 'initializing'
    };

    super(config);
    this.initializeContentTemplates();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, userId, data } = taskData;

    switch (type) {
      case 'generate_content':
        return await this.generateContent(data.requirements);
      
      case 'adapt_difficulty':
        return await this.adaptDifficulty(data.content, data.targetLevel);
      
      case 'optimize_sensory':
        return await this.optimizeForSensory(data.content, data.preferences);
      
      case 'validate_content':
        return await this.validateContentSafety(data.content);
      
      case 'personalize_content':
        return await this.personalizeContent(userId, data.content, data.profile);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async generateContent(requirements: any): Promise<any> {
    console.log(`🎨 Generating content for requirements:`, requirements);
    
    const contentType = requirements.type || 'activity';
    const template = this.contentTemplates.get(contentType);
    
    if (!template) {
      throw new Error(`No template found for content type: ${contentType}`);
    }

    const generatedContent = {
      id: `content-${Date.now()}`,
      type: contentType,
      title: this.generateTitle(requirements),
      description: this.generateDescription(requirements),
      instructions: this.generateInstructions(requirements),
      content: this.generateContentBody(template, requirements),
      metadata: {
        difficulty: requirements.difficulty || 'medium',
        estimatedDuration: this.estimateDuration(requirements),
        learningObjectives: this.extractLearningObjectives(requirements),
        neurodiverseOptimized: true,
        sensoryConsiderations: this.getSensoryConsiderations(requirements)
      },
      createdAt: new Date(),
      version: '1.0'
    };

    // Store generated content
    this.generatedContent.set(generatedContent.id, generatedContent);
    
    // Add to content history
    const userId = requirements.userId || 'system';
    const history = this.contentHistory.get(userId) || [];
    history.push(generatedContent);
    this.contentHistory.set(userId, history);

    this.metrics.tasksCompleted += 1;
    this.metrics.lastActivity = new Date();

    return generatedContent;
  }

  async adaptDifficulty(content: any, targetLevel: string): Promise<any> {
    console.log(`🎯 Adapting content difficulty to: ${targetLevel}`);
    
    const adaptedContent = { ...content };
    const currentLevel = content.metadata?.difficulty || 'medium';
    
    if (currentLevel === targetLevel) {
      return adaptedContent;
    }

    // Apply difficulty adaptations
    switch (targetLevel) {
      case 'easy':
        adaptedContent.content = this.simplifyContent(content.content);
        adaptedContent.instructions = this.simplifyInstructions(content.instructions);
        adaptedContent.metadata.hints = true;
        adaptedContent.metadata.timeLimit = null;
        adaptedContent.metadata.attempts = 'unlimited';
        break;
      
      case 'medium':
        adaptedContent.content = this.moderateContent(content.content);
        adaptedContent.instructions = this.clarifyInstructions(content.instructions);
        adaptedContent.metadata.hints = true;
        adaptedContent.metadata.timeLimit = 300; // 5 minutes
        adaptedContent.metadata.attempts = 5;
        break;
      
      case 'hard':
        adaptedContent.content = this.complexifyContent(content.content);
        adaptedContent.instructions = this.challengeInstructions(content.instructions);
        adaptedContent.metadata.hints = false;
        adaptedContent.metadata.timeLimit = 180; // 3 minutes
        adaptedContent.metadata.attempts = 3;
        break;
    }

    adaptedContent.metadata.difficulty = targetLevel;
    adaptedContent.metadata.adaptedFrom = content.id;
    adaptedContent.metadata.adaptedAt = new Date();
    adaptedContent.id = `${content.id}-${targetLevel}`;

    this.generatedContent.set(adaptedContent.id, adaptedContent);
    this.metrics.tasksCompleted += 1;

    return adaptedContent;
  }

  async optimizeForSensory(content: any, preferences: any): Promise<any> {
    console.log(`👁️ Optimizing content for sensory preferences`);
    
    const optimizedContent = { ...content };
    
    // Visual optimizations
    if (preferences.visualComplexity === 'low') {
      optimizedContent.visual = {
        ...optimizedContent.visual,
        elementsPerScreen: Math.min(3, optimizedContent.visual?.elementsPerScreen || 5),
        colorPalette: 'simplified',
        contrast: 'high',
        animations: 'minimal'
      };
    }

    if (preferences.animationSpeed === 'slow') {
      optimizedContent.visual = {
        ...optimizedContent.visual,
        animationDuration: (optimizedContent.visual?.animationDuration || 300) * 2,
        transitionSpeed: 'slow',
        autoPlay: false
      };
    }

    // Auditory optimizations
    if (!preferences.audioEnabled) {
      optimizedContent.audio = {
        enabled: false,
        alternatives: {
          visualCues: true,
          textInstructions: true,
          hapticFeedback: true
        }
      };
    } else {
      optimizedContent.audio = {
        ...optimizedContent.audio,
        volume: Math.min(50, optimizedContent.audio?.volume || 70),
        backgroundMusic: false,
        soundEffects: 'gentle'
      };
    }

    // Interaction optimizations
    optimizedContent.interaction = {
      ...optimizedContent.interaction,
      processingTime: preferences.processingTime || 'extended',
      feedbackDelay: 500,
      inputSensitivity: 'low',
      errorTolerance: 'high'
    };

    optimizedContent.metadata.sensoryOptimized = true;
    optimizedContent.metadata.optimizedFor = preferences;
    optimizedContent.metadata.optimizedAt = new Date();

    this.metrics.tasksCompleted += 1;
    return optimizedContent;
  }

  async validateContentSafety(content: any): Promise<boolean> {
    console.log(`🛡️ Validating content safety`);
    
    const validationResults = {
      ageAppropriate: this.validateAgeAppropriateness(content),
      neurodiverseFriendly: this.validateNeurodiverseFriendliness(content),
      sensoryConsiderate: this.validateSensoryConsiderations(content),
      instructionClarity: this.validateInstructionClarity(content),
      accessibilityCompliant: this.validateAccessibility(content),
      emotionalSafety: this.validateEmotionalSafety(content)
    };

    const isValid = Object.values(validationResults).every(result => result === true);
    
    // Store validation results
    this.storeMemory(`validation_${content.id}`, {
      contentId: content.id,
      results: validationResults,
      isValid,
      validatedAt: new Date()
    }, 'long');

    this.metrics.tasksCompleted += 1;
    return isValid;
  }

  async personalizeContent(userId: string, content: any, profile: any): Promise<any> {
    console.log(`👤 Personalizing content for user: ${userId}`);
    
    const personalizedContent = { ...content };
    
    // Apply learning style preferences
    if (profile.learningStyle === 'visual') {
      personalizedContent.presentation = {
        ...personalizedContent.presentation,
        visualElements: 'enhanced',
        textSupport: 'minimal',
        diagrams: true,
        colorCoding: true
      };
    } else if (profile.learningStyle === 'auditory') {
      personalizedContent.presentation = {
        ...personalizedContent.presentation,
        audioInstructions: true,
        narration: true,
        soundCues: true,
        musicBackground: 'soft'
      };
    } else if (profile.learningStyle === 'kinesthetic') {
      personalizedContent.presentation = {
        ...personalizedContent.presentation,
        interactiveElements: 'enhanced',
        dragAndDrop: true,
        touchInteractions: true,
        physicalMovement: true
      };
    }

    // Apply neurodiverse profile optimizations
    if (profile.neurodiverseProfile) {
      personalizedContent = await this.optimizeForSensory(personalizedContent, profile.neurodiverseProfile.sensoryPreferences);
    }

    // Apply interest-based personalization
    if (profile.interests && profile.interests.length > 0) {
      personalizedContent.theme = this.selectTheme(profile.interests);
      personalizedContent.examples = this.generatePersonalizedExamples(content, profile.interests);
    }

    // Apply difficulty based on performance history
    const userHistory = this.contentHistory.get(userId) || [];
    const suggestedDifficulty = this.calculateOptimalDifficulty(userHistory, profile);
    
    if (suggestedDifficulty !== content.metadata.difficulty) {
      personalizedContent = await this.adaptDifficulty(personalizedContent, suggestedDifficulty);
    }

    personalizedContent.metadata.personalizedFor = userId;
    personalizedContent.metadata.personalizedAt = new Date();
    personalizedContent.id = `${content.id}-personalized-${userId}`;

    this.generatedContent.set(personalizedContent.id, personalizedContent);
    this.metrics.tasksCompleted += 1;

    return personalizedContent;
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'content-request':
        await this.handleContentRequest(message);
        break;
      
      case 'adaptation-request':
        await this.handleAdaptationRequest(message);
        break;
      
      case 'validation-request':
        await this.handleValidationRequest(message);
        break;
      
      default:
        console.log(`Content Generator received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm creating something special just for you! 🎨✨",
      "I'm making a fun activity that's perfect for how you learn! 🌟",
      "I'm designing something amazing that you'll love! 🎉",
      "I'm crafting the perfect learning adventure for you! 🚀",
      "I'm building something cool that matches your style! 💫"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private initializeContentTemplates(): void {
    // Color recognition template
    this.contentTemplates.set('color-recognition', {
      type: 'interactive',
      structure: {
        introduction: 'color_intro',
        practice: 'color_matching',
        assessment: 'color_identification',
        celebration: 'success_feedback'
      },
      elements: ['color_palette', 'matching_game', 'feedback_system'],
      adaptable: ['difficulty', 'complexity', 'speed']
    });

    // Shape matching template
    this.contentTemplates.set('shape-matching', {
      type: 'drag_drop',
      structure: {
        introduction: 'shape_intro',
        practice: 'shape_sorting',
        assessment: 'shape_matching',
        celebration: 'completion_reward'
      },
      elements: ['shape_library', 'sorting_areas', 'progress_indicator'],
      adaptable: ['shape_count', 'complexity', 'time_limit']
    });

    // Number games template
    this.contentTemplates.set('number-games', {
      type: 'counting',
      structure: {
        introduction: 'number_intro',
        practice: 'counting_exercise',
        assessment: 'number_recognition',
        celebration: 'achievement_badge'
      },
      elements: ['number_display', 'counting_objects', 'input_system'],
      adaptable: ['number_range', 'object_count', 'visual_aids']
    });

    // Letter tracing template
    this.contentTemplates.set('letter-tracing', {
      type: 'tracing',
      structure: {
        introduction: 'letter_intro',
        practice: 'tracing_exercise',
        assessment: 'letter_recognition',
        celebration: 'writing_success'
      },
      elements: ['letter_display', 'tracing_path', 'guidance_system'],
      adaptable: ['letter_size', 'guidance_level', 'practice_repetitions']
    });
  }

  private generateTitle(requirements: any): string {
    const titles = {
      'color-recognition': ['Color Adventure', 'Rainbow Explorer', 'Color Detective', 'Colorful Journey'],
      'shape-matching': ['Shape Safari', 'Geometry Quest', 'Shape Detective', 'Pattern Explorer'],
      'number-games': ['Number Adventure', 'Counting Quest', 'Math Explorer', 'Number Detective'],
      'letter-tracing': ['Letter Journey', 'Writing Adventure', 'Alphabet Explorer', 'Letter Detective']
    };
    
    const typeTitle = titles[requirements.type] || ['Learning Adventure'];
    return typeTitle[Math.floor(Math.random() * typeTitle.length)];
  }

  private generateDescription(requirements: any): string {
    const descriptions = {
      'color-recognition': 'Explore the wonderful world of colors! Learn to identify and match different colors in this engaging activity.',
      'shape-matching': 'Discover amazing shapes all around us! Practice identifying and matching different geometric shapes.',
      'number-games': 'Join the number adventure! Learn to count and recognize numbers through fun interactive games.',
      'letter-tracing': 'Start your writing journey! Practice tracing letters and learn the alphabet step by step.'
    };
    
    return descriptions[requirements.type] || 'An exciting learning activity designed just for you!';
  }

  private generateInstructions(requirements: any): string[] {
    const instructions = {
      'color-recognition': [
        'Look at the colors on the screen',
        'Find the matching color when asked',
        'Click or tap on your choice',
        'Great job! Try the next one'
      ],
      'shape-matching': [
        'Look at the different shapes',
        'Drag each shape to its matching outline',
        'Take your time to find the right match',
        'Celebrate when you complete each match!'
      ],
      'number-games': [
        'Count the objects you see',
        'Choose the correct number',
        'Click on your answer',
        'Keep going to practice more numbers!'
      ],
      'letter-tracing': [
        'Follow the dotted line with your finger or mouse',
        'Start at the green dot',
        'Trace slowly and carefully',
        'Practice makes perfect!'
      ]
    };
    
    return instructions[requirements.type] || ['Follow the instructions on screen', 'Take your time', 'Have fun learning!'];
  }

  private generateContentBody(template: any, requirements: any): any {
    const contentBody = {
      template: template.type,
      structure: template.structure,
      elements: this.generateElements(template.elements, requirements),
      interactions: this.generateInteractions(template.type, requirements),
      feedback: this.generateFeedbackSystem(requirements),
      progression: this.generateProgression(requirements)
    };

    return contentBody;
  }

  private generateElements(templateElements: string[], requirements: any): any {
    const elements = {};
    
    templateElements.forEach(element => {
      switch (element) {
        case 'color_palette':
          elements[element] = this.generateColorPalette(requirements);
          break;
        case 'shape_library':
          elements[element] = this.generateShapeLibrary(requirements);
          break;
        case 'number_display':
          elements[element] = this.generateNumberDisplay(requirements);
          break;
        case 'letter_display':
          elements[element] = this.generateLetterDisplay(requirements);
          break;
        default:
          elements[element] = this.generateGenericElement(element, requirements);
      }
    });

    return elements;
  }

  private generateColorPalette(requirements: any): any {
    const basicColors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
    const difficulty = requirements.difficulty || 'medium';
    
    let colorCount = 4;
    if (difficulty === 'easy') colorCount = 3;
    if (difficulty === 'hard') colorCount = 6;
    
    return {
      colors: basicColors.slice(0, colorCount),
      presentation: 'grid',
      size: 'large',
      labels: difficulty !== 'hard'
    };
  }

  private generateShapeLibrary(requirements: any): any {
    const basicShapes = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'];
    const difficulty = requirements.difficulty || 'medium';
    
    let shapeCount = 4;
    if (difficulty === 'easy') shapeCount = 3;
    if (difficulty === 'hard') shapeCount = 6;
    
    return {
      shapes: basicShapes.slice(0, shapeCount),
      style: 'outlined',
      size: 'medium',
      colors: ['blue', 'green', 'red']
    };
  }

  private generateNumberDisplay(requirements: any): any {
    const difficulty = requirements.difficulty || 'medium';
    
    let maxNumber = 5;
    if (difficulty === 'easy') maxNumber = 3;
    if (difficulty === 'hard') maxNumber = 10;
    
    return {
      range: [1, maxNumber],
      style: 'large_font',
      objects: 'dots',
      showNumeral: true
    };
  }

  private generateLetterDisplay(requirements: any): any {
    const difficulty = requirements.difficulty || 'medium';
    
    let letterSet = 'ABC';
    if (difficulty === 'medium') letterSet = 'ABCDEF';
    if (difficulty === 'hard') letterSet = 'ABCDEFGHIJ';
    
    return {
      letters: letterSet.split(''),
      case: 'uppercase',
      font: 'child_friendly',
      size: 'extra_large'
    };
  }

  private generateGenericElement(elementType: string, requirements: any): any {
    return {
      type: elementType,
      configuration: 'default',
      adaptable: true
    };
  }

  private generateInteractions(templateType: string, requirements: any): any {
    const interactions = {
      'interactive': { type: 'click', feedback: 'immediate', retry: true },
      'drag_drop': { type: 'drag', feedback: 'on_drop', snap: true },
      'counting': { type: 'click', feedback: 'immediate', validation: true },
      'tracing': { type: 'trace', feedback: 'continuous', guidance: true }
    };

    return interactions[templateType] || interactions['interactive'];
  }

  private generateFeedbackSystem(requirements: any): any {
    return {
      positive: ['Great job!', 'Excellent!', 'You did it!', 'Amazing work!'],
      encouragement: ['Try again!', 'You can do it!', 'Almost there!', 'Keep going!'],
      celebration: ['🎉', '⭐', '🌟', '👏'],
      sounds: requirements.audioEnabled !== false,
      visual: true,
      timing: 'immediate'
    };
  }

  private generateProgression(requirements: any): any {
    return {
      type: 'linear',
      checkpoints: 3,
      completion_criteria: 'accuracy',
      advancement: 'automatic',
      review: 'optional'
    };
  }

  private estimateDuration(requirements: any): number {
    const baseDuration = 300; // 5 minutes
    const difficulty = requirements.difficulty || 'medium';
    
    const multipliers = { easy: 0.8, medium: 1.0, hard: 1.3 };
    return Math.round(baseDuration * multipliers[difficulty]);
  }

  private extractLearningObjectives(requirements: any): string[] {
    const objectives = {
      'color-recognition': ['Identify primary colors', 'Match colors accurately', 'Develop visual discrimination'],
      'shape-matching': ['Recognize basic shapes', 'Understand spatial relationships', 'Develop pattern recognition'],
      'number-games': ['Count objects accurately', 'Recognize numerals', 'Understand quantity concepts'],
      'letter-tracing': ['Practice letter formation', 'Develop fine motor skills', 'Learn alphabet sequence']
    };
    
    return objectives[requirements.type] || ['Engage in learning activity', 'Practice new skills', 'Build confidence'];
  }

  private getSensoryConsiderations(requirements: any): any {
    return {
      visual: {
        contrast: 'high',
        brightness: 'moderate',
        animations: 'gentle',
        complexity: 'appropriate'
      },
      auditory: {
        volume: 'comfortable',
        frequency: 'pleasant',
        background: 'minimal'
      },
      interaction: {
        responsiveness: 'immediate',
        feedback: 'clear',
        error_tolerance: 'high'
      }
    };
  }

  private simplifyContent(content: any): any {
    const simplified = { ...content };
    
    // Reduce complexity
    if (simplified.elements) {
      Object.keys(simplified.elements).forEach(key => {
        const element = simplified.elements[key];
        if (element.colors) element.colors = element.colors.slice(0, 3);
        if (element.shapes) element.shapes = element.shapes.slice(0, 3);
        if (element.range) element.range = [1, 3];
      });
    }
    
    return simplified;
  }

  private simplifyInstructions(instructions: string[]): string[] {
    return instructions.map(instruction => {
      return instruction.replace(/complex|difficult|challenging/gi, 'easy')
                       .replace(/quickly|fast/gi, 'slowly')
                       .replace(/many|several/gi, 'a few');
    });
  }

  private moderateContent(content: any): any {
    // Content is already at moderate level
    return content;
  }

  private clarifyInstructions(instructions: string[]): string[] {
    return instructions.map(instruction => `${instruction} Take your time and do your best!`);
  }

  private complexifyContent(content: any): any {
    const complex = { ...content };
    
    // Increase complexity
    if (complex.elements) {
      Object.keys(complex.elements).forEach(key => {
        const element = complex.elements[key];
        if (element.colors && element.colors.length < 6) {
          element.colors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
        }
        if (element.shapes && element.shapes.length < 6) {
          element.shapes = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'];
        }
        if (element.range) element.range = [1, 10];
      });
    }
    
    return complex;
  }

  private challengeInstructions(instructions: string[]): string[] {
    return instructions.map(instruction => {
      return instruction.replace(/slowly|carefully/gi, 'quickly and accurately');
    });
  }

  private validateAgeAppropriateness(content: any): boolean {
    // Check for age-appropriate content
    return true; // Simplified validation
  }

  private validateNeurodiverseFriendliness(content: any): boolean {
    // Check for neurodiverse-friendly features
    return content.metadata?.neurodiverseOptimized === true;
  }

  private validateSensoryConsiderations(content: any): boolean {
    // Check for sensory considerations
    return content.metadata?.sensoryConsiderations !== undefined;
  }

  private validateInstructionClarity(content: any): boolean {
    // Check instruction clarity
    return content.instructions && content.instructions.length > 0;
  }

  private validateAccessibility(content: any): boolean {
    // Check accessibility compliance
    return true; // Simplified validation
  }

  private validateEmotionalSafety(content: any): boolean {
    // Check for emotionally safe content
    return true; // Simplified validation
  }

  private selectTheme(interests: string[]): string {
    const themes = {
      animals: 'safari',
      space: 'cosmic',
      ocean: 'underwater',
      nature: 'garden',
      vehicles: 'transportation'
    };
    
    for (const interest of interests) {
      if (themes[interest]) return themes[interest];
    }
    
    return 'friendly';
  }

  private generatePersonalizedExamples(content: any, interests: string[]): any {
    // Generate examples based on user interests
    return {
      theme: this.selectTheme(interests),
      examples: interests.slice(0, 3),
      customization: 'high'
    };
  }

  private calculateOptimalDifficulty(history: any[], profile: any): string {
    if (history.length === 0) return 'easy';
    
    const recentPerformance = history.slice(-5);
    const avgSuccess = recentPerformance.reduce((sum, item) => {
      return sum + (item.completed ? 1 : 0);
    }, 0) / recentPerformance.length;
    
    if (avgSuccess > 0.8) return 'medium';
    if (avgSuccess > 0.6) return 'easy';
    return 'easy';
  }

  private async handleContentRequest(message: AgentMessage): Promise<void> {
    const { requirements } = message.data;
    const content = await this.generateContent(requirements);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'content-generated',
      data: { content },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleAdaptationRequest(message: AgentMessage): Promise<void> {
    const { content, adaptationType, parameters } = message.data;
    
    let adaptedContent;
    if (adaptationType === 'difficulty') {
      adaptedContent = await this.adaptDifficulty(content, parameters.targetLevel);
    } else if (adaptationType === 'sensory') {
      adaptedContent = await this.optimizeForSensory(content, parameters.preferences);
    }
    
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

  private async handleValidationRequest(message: AgentMessage): Promise<void> {
    const { content } = message.data;
    const isValid = await this.validateContentSafety(content);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'validation-result',
      data: { contentId: content.id, isValid },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}