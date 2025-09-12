// Knowledge Manager Agent - Knowledge base operations for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { IKnowledgeAgent } from '../base/AgentInterface';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';
import { agentricaiKnowledgeDB } from '../../services/knowledgeDatabase';

export class KnowledgeManager extends BaseAgent implements IKnowledgeAgent {
  private knowledgeCache: Map<string, any> = new Map();
  private searchIndex: Map<string, Set<string>> = new Map();
  private accessPatterns: Map<string, any> = new Map();
  private knowledgeGraph: Map<string, Set<string>> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'knowledge-manager-001',
      name: 'AgentricAI Knowledge Database Manager',
      type: 'knowledge-manager',
      version: '1.0.0',
      capabilities: [
        'knowledge-storage',
        'data-retrieval',
        'pattern-analysis',
        'memory-optimization',
        'search-indexing',
        'knowledge-graph-management'
      ],
      specialization: 'knowledge_base_management',
      neurodiverseOptimized: true,
      priority: 'critical',
      memoryAllocation: '4.8GB',
      status: 'initializing'
    };

    super(config);
    this.initializeKnowledgeStructure();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'store_knowledge':
        return await this.storeKnowledge(data.category, data.key, data.value);
      
      case 'retrieve_knowledge':
        return await this.retrieveKnowledge(data.category, data.key);
      
      case 'search_knowledge':
        return await this.searchKnowledge(data.query);
      
      case 'update_knowledge':
        return await this.updateKnowledge(data.category, data.key, data.value);
      
      case 'analyze_patterns':
        return await this.analyzeKnowledgePatterns();
      
      case 'optimize_storage':
        return await this.optimizeKnowledgeStorage();
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async storeKnowledge(category: string, key: string, value: any): Promise<void> {
    console.log(`💾 Storing knowledge: ${category}/${key}`);
    
    // Store in AgentricAI Knowledge Database
    const knowledgeId = await agentricaiKnowledgeDB.storeKnowledge(
      category, 
      key, 
      value, 
      this.id, 
      1.0
    );

    // Update local cache
    const cacheKey = `${category}:${key}`;
    this.knowledgeCache.set(cacheKey, {
      id: knowledgeId,
      category,
      key,
      value,
      timestamp: new Date(),
      accessCount: 0
    });

    // Update search index
    this.updateSearchIndex(category, key, value);
    
    // Update knowledge graph
    this.updateKnowledgeGraph(category, key, value);

    // Track storage patterns
    await this.trackAccessPattern('store', category, key);

    this.metrics.tasksCompleted += 1;
  }

  async retrieveKnowledge(category: string, key?: string): Promise<any> {
    console.log(`🔍 Retrieving knowledge: ${category}${key ? `/${key}` : ''}`);
    
    if (key) {
      // Retrieve specific knowledge entry
      const cacheKey = `${category}:${key}`;
      let knowledge = this.knowledgeCache.get(cacheKey);
      
      if (!knowledge) {
        // Fetch from database
        const value = await agentricaiKnowledgeDB.retrieveKnowledge(category, key, this.id);
        if (value) {
          knowledge = { category, key, value, timestamp: new Date(), accessCount: 1 };
          this.knowledgeCache.set(cacheKey, knowledge);
        }
      } else {
        knowledge.accessCount += 1;
        knowledge.lastAccessed = new Date();
      }

      await this.trackAccessPattern('retrieve', category, key);
      this.metrics.tasksCompleted += 1;
      
      return knowledge?.value || null;
    } else {
      // Retrieve all knowledge in category
      const categoryKnowledge = {};
      
      for (const [cacheKey, knowledge] of this.knowledgeCache.entries()) {
        if (knowledge.category === category) {
          categoryKnowledge[knowledge.key] = knowledge.value;
        }
      }

      this.metrics.tasksCompleted += 1;
      return categoryKnowledge;
    }
  }

  async searchKnowledge(query: string): Promise<any[]> {
    console.log(`🔎 Searching knowledge base for: "${query}"`);
    
    // Use AgentricAI Knowledge Database search
    const results = await agentricaiKnowledgeDB.queryKnowledge(query, this.id);
    
    // Enhance results with local analysis
    const enhancedResults = results.map(result => ({
      ...result,
      relevanceScore: this.calculateRelevanceScore(query, result),
      accessFrequency: this.getAccessFrequency(result.category, result.key),
      relatedKnowledge: this.findRelatedKnowledge(result.category, result.key)
    }));

    // Sort by relevance and access frequency
    enhancedResults.sort((a, b) => {
      const scoreA = a.relevanceScore + (a.accessFrequency * 0.1);
      const scoreB = b.relevanceScore + (b.accessFrequency * 0.1);
      return scoreB - scoreA;
    });

    await this.trackAccessPattern('search', 'query', query);
    this.metrics.tasksCompleted += 1;
    
    return enhancedResults.slice(0, 10); // Return top 10 results
  }

  async updateKnowledge(category: string, key: string, value: any): Promise<void> {
    console.log(`📝 Updating knowledge: ${category}/${key}`);
    
    // Update in database
    await agentricaiKnowledgeDB.storeKnowledge(category, key, value, this.id, 1.0);
    
    // Update local cache
    const cacheKey = `${category}:${key}`;
    const existing = this.knowledgeCache.get(cacheKey);
    
    if (existing) {
      existing.value = value;
      existing.timestamp = new Date();
      existing.version = (existing.version || 1) + 1;
    } else {
      this.knowledgeCache.set(cacheKey, {
        category,
        key,
        value,
        timestamp: new Date(),
        version: 1,
        accessCount: 0
      });
    }

    // Update search index
    this.updateSearchIndex(category, key, value);
    
    // Update knowledge graph
    this.updateKnowledgeGraph(category, key, value);

    await this.trackAccessPattern('update', category, key);
    this.metrics.tasksCompleted += 1;
  }

  async analyzeKnowledgePatterns(): Promise<any> {
    console.log(`📊 Analyzing knowledge patterns`);
    
    const analysis = {
      totalEntries: this.knowledgeCache.size,
      categories: this.getCategoryStats(),
      accessPatterns: this.getAccessPatternAnalysis(),
      knowledgeGraph: this.getKnowledgeGraphStats(),
      recommendations: [],
      trends: this.identifyKnowledgeTrends(),
      optimization_opportunities: this.identifyOptimizationOpportunities()
    };

    // Generate recommendations
    analysis.recommendations = this.generateKnowledgeRecommendations(analysis);

    this.storeMemory('knowledge_analysis', analysis, 'long');
    this.metrics.tasksCompleted += 1;
    
    return analysis;
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'knowledge-request':
        await this.handleKnowledgeRequest(message);
        break;
      
      case 'knowledge-update':
        await this.handleKnowledgeUpdate(message);
        break;
      
      case 'search-request':
        await this.handleSearchRequest(message);
        break;
      
      case 'pattern-analysis-request':
        await this.handlePatternAnalysisRequest(message);
        break;
      
      default:
        console.log(`Knowledge Manager received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm like a super smart library that remembers everything to help you learn! 📚✨",
      "I keep track of all the cool things you learn so we can build on them! 🧠💫",
      "I'm your memory helper - I remember what works best for you! 🌟",
      "I store all the awesome discoveries we make together! 🔍💎",
      "I'm like your personal learning assistant that never forgets! 🤖💙"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private async initializeKnowledgeStructure(): Promise<void> {
    // Initialize core knowledge categories for AgentricAI University
    const coreCategories = [
      'neurodiverse_learning_patterns',
      'sensory_processing_preferences', 
      'behavioral_indicators',
      'content_adaptation_rules',
      'error_resolution_patterns',
      'agent_communication_protocols',
      'system_optimization_rules'
    ];

    for (const category of coreCategories) {
      await this.initializeCategoryStructure(category);
    }
  }

  private async initializeCategoryStructure(category: string): Promise<void> {
    const structures = {
      'neurodiverse_learning_patterns': {
        'visual_learners': { preferences: ['high_contrast', 'minimal_animation', 'clear_layouts'] },
        'auditory_learners': { preferences: ['clear_speech', 'background_music', 'sound_cues'] },
        'kinesthetic_learners': { preferences: ['interactive_elements', 'movement_based', 'tactile_feedback'] },
        'routine_importance': { level: 'critical', adaptation_speed: 'gradual' }
      },
      'sensory_processing_preferences': {
        'visual_sensitivity': { brightness_tolerance: 'low', animation_speed: 'slow' },
        'auditory_sensitivity': { volume_tolerance: 'medium', frequency_range: 'comfortable' },
        'tactile_sensitivity': { texture_preferences: 'smooth', pressure_tolerance: 'light' }
      },
      'behavioral_indicators': {
        'engagement_positive': ['sustained_attention', 'exploration', 'completion'],
        'engagement_negative': ['rapid_clicking', 'long_pauses', 'task_switching'],
        'frustration_indicators': ['backtracking', 'error_repetition', 'avoidance']
      }
    };

    const structure = structures[category];
    if (structure) {
      for (const [key, value] of Object.entries(structure)) {
        await this.storeKnowledge(category, key, value);
      }
    }
  }

  private updateSearchIndex(category: string, key: string, value: any): void {
    const searchTerms = this.extractSearchTerms(category, key, value);
    const cacheKey = `${category}:${key}`;
    
    for (const term of searchTerms) {
      if (!this.searchIndex.has(term)) {
        this.searchIndex.set(term, new Set());
      }
      this.searchIndex.get(term)!.add(cacheKey);
    }
  }

  private extractSearchTerms(category: string, key: string, value: any): string[] {
    const terms = [category, key];
    
    if (typeof value === 'string') {
      terms.push(...value.toLowerCase().split(/\s+/));
    } else if (typeof value === 'object' && value !== null) {
      const jsonString = JSON.stringify(value).toLowerCase();
      terms.push(...jsonString.match(/\w+/g) || []);
    }
    
    return [...new Set(terms.filter(term => term.length > 2))];
  }

  private updateKnowledgeGraph(category: string, key: string, value: any): void {
    const nodeId = `${category}:${key}`;
    
    if (!this.knowledgeGraph.has(nodeId)) {
      this.knowledgeGraph.set(nodeId, new Set());
    }

    // Find relationships based on content
    if (typeof value === 'object' && value !== null) {
      for (const [k, v] of Object.entries(value)) {
        if (typeof v === 'string' && v.includes('_')) {
          // Potential reference to another knowledge entry
          this.knowledgeGraph.get(nodeId)!.add(`reference:${v}`);
        }
      }
    }

    // Category-based relationships
    for (const [otherNodeId] of this.knowledgeGraph.entries()) {
      if (otherNodeId.startsWith(category) && otherNodeId !== nodeId) {
        this.knowledgeGraph.get(nodeId)!.add(`category_peer:${otherNodeId}`);
      }
    }
  }

  private async trackAccessPattern(operation: string, category: string, key: string): Promise<void> {
    const patternKey = `${operation}:${category}`;
    const pattern = this.accessPatterns.get(patternKey) || {
      operation,
      category,
      count: 0,
      lastAccess: new Date(),
      frequency: 0,
      keys: new Set()
    };

    pattern.count += 1;
    pattern.lastAccess = new Date();
    pattern.keys.add(key);
    
    // Calculate frequency (accesses per hour)
    const hoursSinceFirst = pattern.firstAccess ? 
      (Date.now() - pattern.firstAccess.getTime()) / (1000 * 60 * 60) : 1;
    pattern.frequency = pattern.count / hoursSinceFirst;

    if (!pattern.firstAccess) {
      pattern.firstAccess = new Date();
    }

    this.accessPatterns.set(patternKey, pattern);
  }

  private calculateRelevanceScore(query: string, result: any): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Exact key match
    if (result.key.toLowerCase().includes(queryLower)) score += 50;
    
    // Category match
    if (result.category.toLowerCase().includes(queryLower)) score += 30;
    
    // Value content match
    const valueString = JSON.stringify(result.value).toLowerCase();
    const queryWords = queryLower.split(/\s+/);
    
    for (const word of queryWords) {
      if (valueString.includes(word)) score += 10;
    }
    
    // Confidence score boost
    score += (result.confidence_score || 0) * 20;
    
    return score;
  }

  private getAccessFrequency(category: string, key: string): number {
    const cacheKey = `${category}:${key}`;
    const knowledge = this.knowledgeCache.get(cacheKey);
    return knowledge?.accessCount || 0;
  }

  private findRelatedKnowledge(category: string, key: string): string[] {
    const nodeId = `${category}:${key}`;
    const relationships = this.knowledgeGraph.get(nodeId);
    
    if (!relationships) return [];
    
    return Array.from(relationships)
      .map(rel => rel.split(':')[1])
      .filter(rel => rel && rel !== nodeId)
      .slice(0, 5);
  }

  private getCategoryStats(): any {
    const stats = {};
    
    for (const knowledge of this.knowledgeCache.values()) {
      if (!stats[knowledge.category]) {
        stats[knowledge.category] = {
          count: 0,
          lastUpdated: knowledge.timestamp,
          totalAccesses: 0
        };
      }
      
      stats[knowledge.category].count += 1;
      stats[knowledge.category].totalAccesses += knowledge.accessCount || 0;
      
      if (knowledge.timestamp > stats[knowledge.category].lastUpdated) {
        stats[knowledge.category].lastUpdated = knowledge.timestamp;
      }
    }
    
    return stats;
  }

  private getAccessPatternAnalysis(): any {
    const analysis = {
      mostAccessedCategories: [],
      mostFrequentOperations: [],
      peakAccessTimes: [],
      accessTrends: {}
    };

    // Analyze most accessed categories
    const categoryAccess = {};
    for (const pattern of this.accessPatterns.values()) {
      categoryAccess[pattern.category] = (categoryAccess[pattern.category] || 0) + pattern.count;
    }

    analysis.mostAccessedCategories = Object.entries(categoryAccess)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Analyze operation frequency
    const operationFreq = {};
    for (const pattern of this.accessPatterns.values()) {
      operationFreq[pattern.operation] = (operationFreq[pattern.operation] || 0) + pattern.frequency;
    }

    analysis.mostFrequentOperations = Object.entries(operationFreq)
      .sort(([,a], [,b]) => b - a)
      .map(([operation, frequency]) => ({ operation, frequency }));

    return analysis;
  }

  private getKnowledgeGraphStats(): any {
    return {
      totalNodes: this.knowledgeGraph.size,
      totalConnections: Array.from(this.knowledgeGraph.values())
        .reduce((sum, connections) => sum + connections.size, 0),
      averageConnections: this.knowledgeGraph.size > 0 ? 
        Array.from(this.knowledgeGraph.values())
          .reduce((sum, connections) => sum + connections.size, 0) / this.knowledgeGraph.size : 0,
      mostConnectedNodes: this.getMostConnectedNodes()
    };
  }

  private getMostConnectedNodes(): any[] {
    return Array.from(this.knowledgeGraph.entries())
      .map(([nodeId, connections]) => ({ nodeId, connectionCount: connections.size }))
      .sort((a, b) => b.connectionCount - a.connectionCount)
      .slice(0, 5);
  }

  private identifyKnowledgeTrends(): any {
    const trends = {
      growthRate: this.calculateGrowthRate(),
      popularCategories: this.getPopularCategories(),
      emergingPatterns: this.getEmergingPatterns(),
      knowledgeGaps: this.identifyKnowledgeGaps()
    };

    return trends;
  }

  private calculateGrowthRate(): number {
    // Calculate knowledge base growth rate
    const recentEntries = Array.from(this.knowledgeCache.values())
      .filter(k => k.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    return recentEntries.length;
  }

  private getPopularCategories(): any[] {
    const categoryStats = this.getCategoryStats();
    
    return Object.entries(categoryStats)
      .sort(([,a], [,b]) => b.totalAccesses - a.totalAccesses)
      .slice(0, 3)
      .map(([category, stats]) => ({ category, ...stats }));
  }

  private getEmergingPatterns(): string[] {
    // Identify emerging knowledge patterns
    const patterns = [];
    
    const recentAccess = Array.from(this.accessPatterns.values())
      .filter(p => p.lastAccess > new Date(Date.now() - 60 * 60 * 1000)); // Last hour
    
    if (recentAccess.length > 0) {
      const mostActive = recentAccess
        .sort((a, b) => b.frequency - a.frequency)[0];
      patterns.push(`Increased activity in ${mostActive.category}`);
    }

    return patterns;
  }

  private identifyKnowledgeGaps(): string[] {
    const gaps = [];
    
    // Check for missing knowledge in core categories
    const coreCategories = [
      'neurodiverse_learning_patterns',
      'sensory_processing_preferences',
      'behavioral_indicators'
    ];

    for (const category of coreCategories) {
      const categoryEntries = Array.from(this.knowledgeCache.values())
        .filter(k => k.category === category);
      
      if (categoryEntries.length < 5) {
        gaps.push(`Insufficient knowledge in ${category}`);
      }
    }

    return gaps;
  }

  private identifyOptimizationOpportunities(): string[] {
    const opportunities = [];
    
    // Check cache efficiency
    const cacheHitRate = this.calculateCacheHitRate();
    if (cacheHitRate < 0.8) {
      opportunities.push('Improve cache hit rate through better prefetching');
    }

    // Check for unused knowledge
    const unusedKnowledge = Array.from(this.knowledgeCache.values())
      .filter(k => (k.accessCount || 0) === 0);
    
    if (unusedKnowledge.length > this.knowledgeCache.size * 0.2) {
      opportunities.push('Archive or remove unused knowledge entries');
    }

    return opportunities;
  }

  private calculateCacheHitRate(): number {
    // Simplified cache hit rate calculation
    const totalRequests = Array.from(this.accessPatterns.values())
      .reduce((sum, pattern) => sum + pattern.count, 0);
    
    const cacheHits = Array.from(this.knowledgeCache.values())
      .reduce((sum, knowledge) => sum + (knowledge.accessCount || 0), 0);
    
    return totalRequests > 0 ? cacheHits / totalRequests : 1;
  }

  private generateKnowledgeRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    if (analysis.totalEntries < 100) {
      recommendations.push('Expand knowledge base with more learning patterns');
    }
    
    if (analysis.knowledgeGraph.averageConnections < 2) {
      recommendations.push('Improve knowledge interconnections for better insights');
    }
    
    if (analysis.optimization_opportunities.length > 0) {
      recommendations.push(...analysis.optimization_opportunities);
    }
    
    return recommendations;
  }

  private async handleKnowledgeRequest(message: AgentMessage): Promise<void> {
    const { category, key } = message.data;
    const knowledge = await this.retrieveKnowledge(category, key);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'knowledge-response',
      data: { category, key, knowledge },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleKnowledgeUpdate(message: AgentMessage): Promise<void> {
    const { category, key, value } = message.data;
    await this.updateKnowledge(category, key, value);
  }

  private async handleSearchRequest(message: AgentMessage): Promise<void> {
    const { query } = message.data;
    const results = await this.searchKnowledge(query);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'search-results',
      data: { query, results },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handlePatternAnalysisRequest(message: AgentMessage): Promise<void> {
    const analysis = await this.analyzeKnowledgePatterns();
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'pattern-analysis-response',
      data: { analysis },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}