// Error Handler Agent - Child-friendly error resolution for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { IErrorAgent } from '../base/AgentInterface';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';

export class ErrorHandler extends BaseAgent implements IErrorAgent {
  private errorPatterns: Map<string, any> = new Map();
  private fixHistory: Map<string, any[]> = new Map();
  private childFriendlyExplanations: Map<string, string> = new Map();
  private safetyRules: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'error-handler-001',
      name: 'Stealth Error Guardian',
      type: 'error-handler',
      version: '1.0.0',
      capabilities: [
        'error-detection',
        'child-friendly-explanations',
        'auto-fix-generation',
        'safety-validation',
        'recovery-coordination',
        'pattern-learning'
      ],
      specialization: 'child_safe_error_handling',
      neurodiverseOptimized: true,
      priority: 'critical',
      memoryAllocation: '1.2GB',
      status: 'initializing'
    };

    super(config);
    this.initializeErrorPatterns();
    this.initializeSafetyRules();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'analyze_error':
        return await this.analyzeError(data.error, data.context);
      
      case 'generate_fix':
        return await this.generateFix(data.errorAnalysis);
      
      case 'create_explanation':
        return this.createChildFriendlyExplanation(data.error);
      
      case 'implement_fix':
        return await this.implementSafeFix(data.fix);
      
      case 'validate_safety':
        return this.validateFixSafety(data.fix, data.context);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async analyzeError(error: Error, context: any): Promise<any> {
    console.log(`🔍 Analyzing error: ${error.name} - ${error.message}`);
    
    const analysis = {
      errorId: `error-${Date.now()}`,
      errorType: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      severity: this.assessErrorSeverity(error, context),
      userImpact: this.assessUserImpact(error, context),
      neurodiverseImpact: this.assessNeurodiverseImpact(error, context),
      contextAnalysis: {
        userAction: context.lastUserAction,
        componentState: context.componentState,
        activeAgents: context.activeAgents,
        userType: context.userType || 'unknown'
      },
      patternMatch: this.findErrorPattern(error),
      recommendedAction: this.recommendAction(error, context),
      autoFixable: this.isAutoFixable(error, context),
      childSafe: context.userType === 'child',
      agentricaiSignature: {
        panelColor: this.selectErrorPanelColor(error),
        urgencyLevel: this.assessUrgencyLevel(error, context),
        stealthMode: context.userType === 'child' // Hide technical details from children
      }
    };

    // Store error analysis for pattern learning
    this.storeMemory(`error_analysis_${analysis.errorId}`, analysis, 'long');
    
    // Update error patterns for ecosystem learning
    await this.updateErrorPatterns(error, context, analysis);

    // Notify AgentricAI Core OS of error
    await this.emitSystemEvent({
      id: `system-error-${Date.now()}`,
      type: 'error-event',
      source: this.id,
      data: { analysis, context },
      priority: analysis.severity === 'critical' ? 'critical' : 'high',
      timestamp: new Date()
    });

    this.metrics.tasksCompleted += 1;
    return analysis;
  }

  async generateFix(errorAnalysis: any): Promise<any> {
    console.log(`🔧 Generating fix for error: ${errorAnalysis.errorType}`);
    
    const fix = {
      fixId: `fix-${Date.now()}`,
      errorId: errorAnalysis.errorId,
      fixType: this.determineFixType(errorAnalysis),
      description: this.generateFixDescription(errorAnalysis),
      implementation: this.generateFixImplementation(errorAnalysis),
      riskLevel: this.assessFixRisk(errorAnalysis),
      requiresApproval: this.requiresUserApproval(errorAnalysis),
      estimatedTime: this.estimateFixTime(errorAnalysis),
      rollbackPlan: this.generateRollbackPlan(errorAnalysis),
      childFriendlyDescription: this.generateChildFriendlyFixDescription(errorAnalysis),
      agentricaiMetadata: {
        panelColor: 'neon-lime',
        successGlow: true,
        stealthMode: errorAnalysis.childSafe
      }
    };

    // Validate fix safety
    const safetyValidation = await this.validateFixSafety(fix, errorAnalysis);
    fix.safetyValidated = safetyValidation.isValid;
    fix.safetyIssues = safetyValidation.issues;

    // Store fix for history
    const history = this.fixHistory.get(errorAnalysis.errorType) || [];
    history.push(fix);
    this.fixHistory.set(errorAnalysis.errorType, history);

    this.metrics.tasksCompleted += 1;
    return fix;
  }

  createChildFriendlyExplanation(error: Error): string {
    const explanations = {
      'TypeError': "Oops! It looks like our learning game got a little confused about what type of information it was working with. Don't worry - I'm helping it understand better! 🔧✨",
      'ReferenceError': "Our learning helper couldn't find something it was looking for. It's like when you can't find your favorite toy - but I'm helping it find the right path! 🗺️🔍",
      'SyntaxError': "The computer is learning how to speak better, just like you are! I'm teaching it the right words and grammar. 📚🤖",
      'NetworkError': "Our internet connection had a little hiccup, like when the TV signal gets fuzzy. I'm making sure everything connects properly! 📡💫",
      'TimeoutError': "Something was taking too long to finish, like when you're waiting for your favorite show to start. I'm making it faster! ⏰🚀",
      'ValidationError': "I found something that doesn't look quite right, like a puzzle piece that doesn't fit. I'm fixing it so everything works perfectly! 🧩✨"
    };
    
    const defaultExplanation = "Something small happened, but don't worry - I'm your helper and I'm making it all better! You're doing amazing! 🌟💙";
    
    return explanations[error.name] || defaultExplanation;
  }

  async implementSafeFix(fix: any): Promise<boolean> {
    console.log(`🛠️ Implementing safe fix: ${fix.fixId}`);
    
    if (!fix.safetyValidated) {
      throw new Error('Fix has not been safety validated');
    }

    if (fix.requiresApproval && !fix.approved) {
      throw new Error('Fix requires approval before implementation');
    }

    try {
      // Create system backup point
      const backupId = await this.createSystemBackup();
      
      // Implement the fix
      const implementation = await this.executeFix(fix);
      
      // Validate fix success
      const validation = await this.validateFixSuccess(fix, implementation);
      
      if (!validation.successful) {
        // Rollback if fix failed
        await this.rollbackFix(backupId, fix);
        return false;
      }

      // Log successful fix
      await this.logFixSuccess(fix, implementation);
      
      // Notify AgentricAI ecosystem of successful fix
      await this.emitSystemEvent({
        id: `fix-success-${Date.now()}`,
        type: 'system-event',
        source: this.id,
        data: { 
          event: 'error_resolved',
          fixId: fix.fixId,
          errorType: fix.errorType,
          implementation: implementation.summary
        },
        priority: 'normal',
        timestamp: new Date()
      });

      this.metrics.tasksCompleted += 1;
      return true;

    } catch (error) {
      console.error(`Failed to implement fix ${fix.fixId}:`, error);
      
      // Attempt rollback
      try {
        await this.rollbackFix(fix.rollbackPlan, fix);
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        // Escalate to system administrator
        await this.escalateToAdmin(fix, error, rollbackError);
      }
      
      return false;
    }
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'error-report':
        await this.handleErrorReport(message);
        break;
      
      case 'fix-request':
        await this.handleFixRequest(message);
        break;
      
      case 'safety-validation-request':
        await this.handleSafetyValidationRequest(message);
        break;
      
      default:
        console.log(`Error Handler received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "Don't worry! I'm your special helper who fixes things when they get confused! 🔧✨",
      "I'm like a superhero for computers - I make everything work perfectly for you! 🦸‍♂️💫",
      "When something goes wrong, I'm here to make it right! You're safe with me! 🛡️💙",
      "I love helping fix things so you can keep learning and having fun! 🌟🔧",
      "I'm your problem-solving friend - no worry is too big for me to handle! 🤝✨"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private initializeErrorPatterns(): void {
    // Common error patterns and their solutions
    this.errorPatterns.set('TypeError', {
      commonCauses: ['undefined_variable', 'wrong_data_type', 'null_reference'],
      typicalFixes: ['add_null_check', 'type_validation', 'default_value'],
      childImpact: 'low',
      autoFixable: true
    });

    this.errorPatterns.set('ReferenceError', {
      commonCauses: ['undefined_variable', 'scope_issue', 'import_missing'],
      typicalFixes: ['variable_declaration', 'scope_correction', 'import_addition'],
      childImpact: 'medium',
      autoFixable: true
    });

    this.errorPatterns.set('SyntaxError', {
      commonCauses: ['missing_bracket', 'typo', 'invalid_syntax'],
      typicalFixes: ['syntax_correction', 'bracket_matching', 'typo_fix'],
      childImpact: 'low',
      autoFixable: true
    });

    this.errorPatterns.set('NetworkError', {
      commonCauses: ['connection_timeout', 'server_unavailable', 'cors_issue'],
      typicalFixes: ['retry_request', 'fallback_data', 'cors_header'],
      childImpact: 'high',
      autoFixable: false
    });
  }

  private initializeSafetyRules(): void {
    // Safety rules for child-safe error handling
    this.safetyRules.set('child_interaction', {
      maxErrorDisplayTime: 5000, // 5 seconds max
      hideStackTraces: true,
      useEncouragingLanguage: true,
      autoApplyLowRiskFixes: true,
      notifyParentsOfCriticalErrors: true
    });

    this.safetyRules.set('data_protection', {
      neverLogPersonalInfo: true,
      anonymizeErrorReports: true,
      encryptSensitiveData: true,
      limitDataRetention: true
    });

    this.safetyRules.set('system_stability', {
      validateBeforeApply: true,
      createBackupPoints: true,
      testInSandbox: true,
      rollbackOnFailure: true
    });
  }

  private assessErrorSeverity(error: Error, context: any): 'low' | 'medium' | 'high' | 'critical' {
    // Critical errors that affect child safety or data
    if (error.name === 'SecurityError' || context.userType === 'child' && error.name === 'NetworkError') {
      return 'critical';
    }

    // High severity for errors that break core functionality
    if (error.name === 'ReferenceError' || error.name === 'TypeError' && context.componentState === 'learning_activity') {
      return 'high';
    }

    // Medium severity for errors that degrade experience
    if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
      return 'medium';
    }

    // Low severity for minor issues
    return 'low';
  }

  private assessUserImpact(error: Error, context: any): 'none' | 'minimal' | 'moderate' | 'severe' {
    if (context.userType === 'child') {
      // Any error has higher impact on children
      if (error.name === 'NetworkError') return 'severe';
      if (error.name === 'TypeError' || error.name === 'ReferenceError') return 'moderate';
      return 'minimal';
    }

    // Adult/admin impact assessment
    if (error.name === 'SecurityError') return 'severe';
    if (error.name === 'NetworkError') return 'moderate';
    return 'minimal';
  }

  private assessNeurodiverseImpact(error: Error, context: any): 'low' | 'medium' | 'high' {
    // Neurodiverse children may be more sensitive to disruptions
    if (context.userType === 'child') {
      if (error.name === 'NetworkError' || context.componentState === 'learning_activity') {
        return 'high'; // Disruption to routine/learning is high impact
      }
      return 'medium'; // Any error can be disruptive
    }
    return 'low';
  }

  private findErrorPattern(error: Error): any {
    return this.errorPatterns.get(error.name) || null;
  }

  private recommendAction(error: Error, context: any): string {
    const pattern = this.findErrorPattern(error);
    
    if (pattern?.autoFixable && context.userType === 'child') {
      return 'auto_fix_with_notification';
    }
    
    if (pattern?.autoFixable) {
      return 'suggest_auto_fix';
    }
    
    return 'manual_intervention_required';
  }

  private isAutoFixable(error: Error, context: any): boolean {
    const pattern = this.findErrorPattern(error);
    return pattern?.autoFixable === true && this.assessErrorSeverity(error, context) !== 'critical';
  }

  private selectErrorPanelColor(error: Error): string {
    const colorMap = {
      'TypeError': 'neon-blue',
      'ReferenceError': 'neon-cyan',
      'SyntaxError': 'neon-lime',
      'NetworkError': 'neon-orange',
      'SecurityError': 'red-500'
    };
    
    return colorMap[error.name] || 'neon-orange';
  }

  private assessUrgencyLevel(error: Error, context: any): 'low' | 'medium' | 'high' | 'critical' {
    if (context.userType === 'child' && error.name === 'NetworkError') return 'critical';
    if (error.name === 'SecurityError') return 'critical';
    if (context.componentState === 'learning_activity') return 'high';
    return 'medium';
  }

  private determineFixType(errorAnalysis: any): string {
    const pattern = this.findErrorPattern({ name: errorAnalysis.errorType });
    
    if (pattern?.typicalFixes?.length > 0) {
      return pattern.typicalFixes[0]; // Use most common fix
    }
    
    return 'generic_error_boundary';
  }

  private generateFixDescription(errorAnalysis: any): string {
    const fixType = this.determineFixType(errorAnalysis);
    
    const descriptions = {
      'add_null_check': 'Add validation to check for null or undefined values',
      'type_validation': 'Add type checking to ensure correct data types',
      'variable_declaration': 'Declare missing variables with appropriate default values',
      'syntax_correction': 'Fix syntax errors in the code',
      'retry_request': 'Implement retry logic for failed network requests',
      'fallback_data': 'Provide fallback data when network requests fail',
      'generic_error_boundary': 'Wrap component in error boundary for graceful handling'
    };
    
    return descriptions[fixType] || 'Apply generic error handling solution';
  }

  private generateFixImplementation(errorAnalysis: any): any {
    const fixType = this.determineFixType(errorAnalysis);
    
    const implementations = {
      'add_null_check': {
        code: 'if (value != null && value !== undefined) { /* safe operation */ }',
        type: 'code_modification',
        location: 'error_source'
      },
      'type_validation': {
        code: 'if (typeof value === "expected_type") { /* safe operation */ }',
        type: 'code_modification',
        location: 'error_source'
      },
      'variable_declaration': {
        code: 'const missingVariable = defaultValue;',
        type: 'code_addition',
        location: 'scope_start'
      },
      'generic_error_boundary': {
        code: '<ErrorBoundary fallback={ChildFriendlyError}>{children}</ErrorBoundary>',
        type: 'component_wrap',
        location: 'component_parent'
      }
    };
    
    return implementations[fixType] || implementations['generic_error_boundary'];
  }

  private assessFixRisk(errorAnalysis: any): 'low' | 'medium' | 'high' {
    if (errorAnalysis.childSafe && errorAnalysis.severity === 'low') return 'low';
    if (errorAnalysis.severity === 'critical') return 'high';
    return 'medium';
  }

  private requiresUserApproval(errorAnalysis: any): boolean {
    // Auto-approve low-risk fixes for children
    if (errorAnalysis.childSafe && this.assessFixRisk(errorAnalysis) === 'low') {
      return false;
    }
    
    // Require approval for high-risk or critical fixes
    return this.assessFixRisk(errorAnalysis) === 'high' || errorAnalysis.severity === 'critical';
  }

  private estimateFixTime(errorAnalysis: any): number {
    const fixType = this.determineFixType(errorAnalysis);
    
    const timeEstimates = {
      'add_null_check': 500,
      'type_validation': 800,
      'variable_declaration': 300,
      'syntax_correction': 200,
      'retry_request': 1000,
      'generic_error_boundary': 1500
    };
    
    return timeEstimates[fixType] || 1000;
  }

  private generateRollbackPlan(errorAnalysis: any): any {
    return {
      type: 'component_restore',
      backupRequired: true,
      rollbackSteps: [
        'Save current state',
        'Restore previous working state',
        'Validate system stability',
        'Notify user of rollback'
      ],
      estimatedTime: 2000
    };
  }

  private generateChildFriendlyFixDescription(errorAnalysis: any): string {
    const descriptions = {
      'TypeError': "I'm teaching the computer to be more careful with information! 📚",
      'ReferenceError': "I'm helping the computer find what it was looking for! 🔍",
      'SyntaxError': "I'm fixing the computer's spelling and grammar! ✏️",
      'NetworkError': "I'm making sure the internet connection works perfectly! 🌐",
      'generic_error_boundary': "I'm putting a safety net around everything to keep you safe! 🛡️"
    };
    
    const fixType = this.determineFixType(errorAnalysis);
    return descriptions[errorAnalysis.errorType] || descriptions['generic_error_boundary'];
  }

  private async validateFixSafety(fix: any, context: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Check against safety rules
    const childSafetyRule = this.safetyRules.get('child_interaction');
    const dataProtectionRule = this.safetyRules.get('data_protection');
    const systemStabilityRule = this.safetyRules.get('system_stability');

    // Validate child safety
    if (context.childSafe) {
      if (fix.riskLevel === 'high') {
        issues.push('High-risk fix not suitable for child environment');
      }
      
      if (fix.implementation.type === 'system_modification') {
        issues.push('System modifications not allowed in child environment');
      }
    }

    // Validate data protection
    if (fix.implementation.code?.includes('localStorage') || fix.implementation.code?.includes('sessionStorage')) {
      if (!dataProtectionRule.encryptSensitiveData) {
        issues.push('Data storage fix requires encryption validation');
      }
    }

    // Validate system stability
    if (fix.implementation.type === 'component_wrap' && !systemStabilityRule.testInSandbox) {
      issues.push('Component modifications require sandbox testing');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  private async updateErrorPatterns(error: Error, context: any, analysis: any): Promise<void> {
    const pattern = this.errorPatterns.get(error.name) || {
      commonCauses: [],
      typicalFixes: [],
      occurrenceCount: 0,
      successfulFixes: [],
      childImpact: 'unknown',
      autoFixable: false
    };

    pattern.occurrenceCount = (pattern.occurrenceCount || 0) + 1;
    pattern.lastOccurrence = new Date();
    pattern.contexts = pattern.contexts || [];
    pattern.contexts.push({
      userType: context.userType,
      componentState: context.componentState,
      timestamp: new Date()
    });

    // Keep only recent contexts
    if (pattern.contexts.length > 50) {
      pattern.contexts = pattern.contexts.slice(-50);
    }

    this.errorPatterns.set(error.name, pattern);
    this.storeMemory(`error_pattern_${error.name}`, pattern, 'long');
  }

  private async createSystemBackup(): Promise<string> {
    const backupId = `backup-${Date.now()}`;
    
    // In a real implementation, this would create a system state backup
    console.log(`💾 Creating system backup: ${backupId}`);
    
    this.storeMemory(`backup_${backupId}`, {
      timestamp: new Date(),
      systemState: 'captured',
      components: ['ui_state', 'agent_memory', 'user_progress']
    }, 'long');
    
    return backupId;
  }

  private async executeFix(fix: any): Promise<any> {
    console.log(`⚡ Executing fix: ${fix.fixType}`);
    
    // Simulate fix execution
    const implementation = {
      fixId: fix.fixId,
      startTime: new Date(),
      steps: [],
      success: true,
      summary: `Applied ${fix.fixType} fix successfully`
    };

    // Add execution steps based on fix type
    switch (fix.fixType) {
      case 'add_null_check':
        implementation.steps = [
          'Identified null reference location',
          'Added null validation check',
          'Tested with null values',
          'Validated fix effectiveness'
        ];
        break;
      
      case 'generic_error_boundary':
        implementation.steps = [
          'Wrapped component in error boundary',
          'Added child-friendly fallback UI',
          'Tested error scenarios',
          'Validated graceful degradation'
        ];
        break;
      
      default:
        implementation.steps = [
          'Applied generic fix',
          'Validated system stability',
          'Tested user interaction'
        ];
    }

    implementation.endTime = new Date();
    implementation.duration = implementation.endTime.getTime() - implementation.startTime.getTime();

    return implementation;
  }

  private async validateFixSuccess(fix: any, implementation: any): Promise<{ successful: boolean; issues: string[] }> {
    // Simulate fix validation
    const validation = {
      successful: true,
      issues: []
    };

    // Check if the original error would still occur
    try {
      // In a real implementation, this would test the fix
      console.log(`✅ Validating fix success for: ${fix.fixId}`);
      
      // Simulate validation checks
      if (Math.random() > 0.1) { // 90% success rate
        validation.successful = true;
      } else {
        validation.successful = false;
        validation.issues.push('Fix did not resolve the original error');
      }
      
    } catch (error) {
      validation.successful = false;
      validation.issues.push(`Fix validation failed: ${error.message}`);
    }

    return validation;
  }

  private async rollbackFix(backupId: string, fix: any): Promise<void> {
    console.log(`🔄 Rolling back fix: ${fix.fixId} using backup: ${backupId}`);
    
    const backup = this.retrieveMemory(`backup_${backupId}`, 'long');
    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`);
    }

    // Simulate rollback process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ Rollback completed for fix: ${fix.fixId}`);
  }

  private async logFixSuccess(fix: any, implementation: any): Promise<void> {
    const successLog = {
      fixId: fix.fixId,
      errorType: fix.errorType,
      implementation: implementation.summary,
      duration: implementation.duration,
      timestamp: new Date(),
      agentricaiMetadata: {
        panelColor: 'neon-lime',
        successIndicator: true
      }
    };

    // Add to fix history
    const history = this.fixHistory.get(fix.errorType) || [];
    history.push(successLog);
    this.fixHistory.set(fix.errorType, history);

    this.storeMemory(`fix_success_${fix.fixId}`, successLog, 'long');
  }

  private async escalateToAdmin(fix: any, error: Error, rollbackError: Error): Promise<void> {
    const escalation = {
      escalationId: `escalation-${Date.now()}`,
      fixId: fix.fixId,
      originalError: error.message,
      rollbackError: rollbackError.message,
      severity: 'critical',
      requiresImmediateAttention: true,
      agentricaiAlert: {
        panelColor: 'red-500',
        urgencyLevel: 'maximum',
        adminNotification: true
      }
    };

    await this.emitSystemEvent({
      id: escalation.escalationId,
      type: 'error-event',
      source: this.id,
      data: escalation,
      priority: 'critical',
      timestamp: new Date()
    });

    console.error(`🚨 CRITICAL: Escalated to admin - Fix and rollback both failed`);
  }

  private async handleErrorReport(message: AgentMessage): Promise<void> {
    const { error, context } = message.data;
    const analysis = await this.analyzeError(error, context);
    
    // Generate fix if auto-fixable
    if (analysis.autoFixable) {
      const fix = await this.generateFix(analysis);
      
      // Auto-apply if safe for children
      if (analysis.childSafe && fix.riskLevel === 'low') {
        await this.implementSafeFix(fix);
      }
    }

    // Send response if required
    if (message.requiresResponse) {
      await this.sendMessage(message.fromAgentId, {
        id: '',
        fromAgentId: this.id,
        toAgentId: message.fromAgentId,
        type: 'error-analysis-response',
        data: { analysis },
        priority: message.priority,
        timestamp: new Date(),
        requiresResponse: false,
        correlationId: message.id
      });
    }
  }

  private async handleFixRequest(message: AgentMessage): Promise<void> {
    const { errorAnalysis } = message.data;
    const fix = await this.generateFix(errorAnalysis);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'fix-generated',
      data: { fix },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleSafetyValidationRequest(message: AgentMessage): Promise<void> {
    const { fix, context } = message.data;
    const validation = await this.validateFixSafety(fix, context);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'safety-validation-response',
      data: { validation },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}