// Event Bus Agent - Event-driven communication for AgentricAI University

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage, AgentEvent } from '../base/AgentTypes';

export class EventBus extends BaseAgent {
  private eventSubscriptions: Map<string, Set<string>> = new Map();
  private eventHistory: AgentEvent[] = [];
  private eventHandlers: Map<string, Function> = new Map();
  private eventFilters: Map<string, any> = new Map();
  private eventMetrics: Map<string, any> = new Map();

  constructor() {
    const config: AgentConfig = {
      id: 'event-bus-001',
      name: 'AgentricAI Event Bus',
      type: 'communication-router',
      version: '1.0.0',
      capabilities: [
        'event-publishing',
        'event-subscription',
        'event-filtering',
        'event-routing',
        'event-persistence',
        'event-analytics'
      ],
      specialization: 'event_driven_communication',
      neurodiverseOptimized: false,
      priority: 'critical',
      memoryAllocation: '800MB',
      status: 'initializing'
    };

    super(config);
    this.initializeEventTypes();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'publish_event':
        return await this.publishEvent(data.event);
      
      case 'subscribe_to_event':
        return await this.subscribeToEvent(data.agentId, data.eventType, data.filter);
      
      case 'unsubscribe_from_event':
        return await this.unsubscribeFromEvent(data.agentId, data.eventType);
      
      case 'get_event_history':
        return this.getEventHistory(data.eventType, data.timeframe);
      
      case 'get_event_metrics':
        return this.getEventMetrics(data.eventType);
      
      case 'filter_events':
        return this.filterEvents(data.events, data.criteria);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  async publishEvent(event: AgentEvent): Promise<void> {
    console.log(`📢 Publishing event: ${event.type} from ${event.agentId}`);
    
    // Add to event history
    this.eventHistory.push(event);
    
    // Keep only recent events (last 1000)
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }

    // Update event metrics
    this.updateEventMetrics(event);

    // Find subscribers for this event type
    const subscribers = this.eventSubscriptions.get(event.type) || new Set();
    
    // Notify all subscribers
    for (const subscriberId of subscribers) {
      await this.notifySubscriber(subscriberId, event);
    }

    // Store event persistently if important
    if (event.severity === 'critical' || event.severity === 'error') {
      this.storeMemory(`critical_event_${event.id}`, event, 'long');
    }

    // Emit to system event bus
    await this.emitSystemEvent({
      id: event.id,
      type: 'agent-event',
      source: this.id,
      data: event,
      priority: this.mapSeverityToPriority(event.severity),
      timestamp: event.timestamp
    });

    this.metrics.tasksCompleted += 1;
  }

  async subscribeToEvent(agentId: string, eventType: string, filter?: any): Promise<string> {
    console.log(`📝 Agent ${agentId} subscribing to event: ${eventType}`);
    
    if (!this.eventSubscriptions.has(eventType)) {
      this.eventSubscriptions.set(eventType, new Set());
    }
    
    this.eventSubscriptions.get(eventType)!.add(agentId);
    
    // Store filter if provided
    if (filter) {
      const filterKey = `${agentId}:${eventType}`;
      this.eventFilters.set(filterKey, filter);
    }

    // Generate subscription ID
    const subscriptionId = `sub-${agentId}-${eventType}-${Date.now()}`;
    
    this.storeMemory(`subscription_${subscriptionId}`, {
      agentId,
      eventType,
      filter,
      subscribedAt: new Date()
    }, 'long');

    this.metrics.tasksCompleted += 1;
    return subscriptionId;
  }

  async unsubscribeFromEvent(agentId: string, eventType: string): Promise<void> {
    console.log(`🗑️ Agent ${agentId} unsubscribing from event: ${eventType}`);
    
    const subscribers = this.eventSubscriptions.get(eventType);
    if (subscribers) {
      subscribers.delete(agentId);
      
      // Remove empty subscription sets
      if (subscribers.size === 0) {
        this.eventSubscriptions.delete(eventType);
      }
    }

    // Remove filter
    const filterKey = `${agentId}:${eventType}`;
    this.eventFilters.delete(filterKey);

    this.metrics.tasksCompleted += 1;
  }

  getEventHistory(eventType?: string, timeframe?: string): AgentEvent[] {
    let events = this.eventHistory;
    
    // Filter by event type
    if (eventType) {
      events = events.filter(e => e.type === eventType);
    }
    
    // Filter by timeframe
    if (timeframe) {
      const cutoffTime = this.parseTimeframe(timeframe);
      events = events.filter(e => e.timestamp >= cutoffTime);
    }
    
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getEventMetrics(eventType?: string): any {
    if (eventType) {
      return this.eventMetrics.get(eventType) || {
        totalEvents: 0,
        eventsPerHour: 0,
        averageProcessingTime: 0,
        subscriberCount: 0
      };
    }
    
    // Return overall metrics
    const totalEvents = this.eventHistory.length;
    const recentEvents = this.eventHistory.filter(e => 
      e.timestamp > new Date(Date.now() - 60 * 60 * 1000)
    ).length;
    
    return {
      totalEvents,
      eventsPerHour: recentEvents,
      activeSubscriptions: this.eventSubscriptions.size,
      eventTypes: Array.from(this.eventSubscriptions.keys()).length
    };
  }

  filterEvents(events: AgentEvent[], criteria: any): AgentEvent[] {
    return events.filter(event => {
      // Apply filtering criteria
      if (criteria.severity && event.severity !== criteria.severity) return false;
      if (criteria.agentId && event.agentId !== criteria.agentId) return false;
      if (criteria.timeRange) {
        const eventTime = event.timestamp.getTime();
        if (eventTime < criteria.timeRange.start || eventTime > criteria.timeRange.end) return false;
      }
      
      return true;
    });
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'event-publish':
        await this.handleEventPublish(message);
        break;
      
      case 'event-subscribe':
        await this.handleEventSubscribe(message);
        break;
      
      case 'event-unsubscribe':
        await this.handleEventUnsubscribe(message);
        break;
      
      case 'event-history-request':
        await this.handleEventHistoryRequest(message);
        break;
      
      default:
        console.log(`Event Bus received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    const responses = [
      "I'm like the announcement system that tells all the helpers what's happening! 📢✨",
      "I make sure everyone knows about important events and updates! 📰🤖",
      "I'm the news reporter for all the learning helpers! 📺💫",
      "I help spread good news and important information to everyone! 🗞️🌟",
      "I'm like the school intercom that keeps everyone informed! 📻💙"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Private helper methods
  private initializeEventTypes(): void {
    // Initialize common event types and their default metrics
    const eventTypes = [
      'agent.started',
      'agent.stopped',
      'agent.error',
      'user.session.started',
      'user.session.ended',
      'user.progress.updated',
      'content.generated',
      'content.adapted',
      'error.detected',
      'error.resolved',
      'workflow.started',
      'workflow.completed',
      'system.resource.allocated',
      'system.resource.released'
    ];

    for (const eventType of eventTypes) {
      this.eventMetrics.set(eventType, {
        totalEvents: 0,
        eventsPerHour: 0,
        averageProcessingTime: 0,
        subscriberCount: 0,
        lastEvent: null
      });
    }
  }

  private updateEventMetrics(event: AgentEvent): void {
    const metrics = this.eventMetrics.get(event.type) || {
      totalEvents: 0,
      eventsPerHour: 0,
      averageProcessingTime: 0,
      subscriberCount: 0,
      lastEvent: null
    };

    metrics.totalEvents += 1;
    metrics.lastEvent = event.timestamp;
    metrics.subscriberCount = this.eventSubscriptions.get(event.type)?.size || 0;

    // Calculate events per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentEvents = this.eventHistory.filter(e => 
      e.type === event.type && e.timestamp > oneHourAgo
    ).length;
    metrics.eventsPerHour = recentEvents;

    this.eventMetrics.set(event.type, metrics);
  }

  private async notifySubscriber(subscriberId: string, event: AgentEvent): Promise<void> {
    try {
      // Check if subscriber has filters
      const filterKey = `${subscriberId}:${event.type}`;
      const filter = this.eventFilters.get(filterKey);
      
      if (filter && !this.eventMatchesFilter(event, filter)) {
        return; // Event doesn't match filter
      }

      // Send event notification
      await this.sendMessage(subscriberId, {
        id: `event-notification-${Date.now()}`,
        fromAgentId: this.id,
        toAgentId: subscriberId,
        type: 'event-notification',
        data: { event },
        priority: this.mapSeverityToPriority(event.severity),
        timestamp: new Date(),
        requiresResponse: false
      });

    } catch (error) {
      console.error(`Failed to notify subscriber ${subscriberId}:`, error);
    }
  }

  private eventMatchesFilter(event: AgentEvent, filter: any): boolean {
    // Apply filter criteria
    if (filter.severity && event.severity !== filter.severity) return false;
    if (filter.agentId && event.agentId !== filter.agentId) return false;
    if (filter.dataFilter) {
      // Apply data-specific filters
      for (const [key, value] of Object.entries(filter.dataFilter)) {
        if (event.data[key] !== value) return false;
      }
    }
    
    return true;
  }

  private mapSeverityToPriority(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap = {
      'info': 'low',
      'warning': 'medium',
      'error': 'high',
      'critical': 'critical'
    };
    
    return severityMap[severity] || 'medium';
  }

  private parseTimeframe(timeframe: string): Date {
    const now = Date.now();
    const timeframes = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const duration = timeframes[timeframe] || timeframes['24h'];
    return new Date(now - duration);
  }

  // Message handlers
  private async handleEventPublish(message: AgentMessage): Promise<void> {
    const { event } = message.data;
    await this.publishEvent(event);
  }

  private async handleEventSubscribe(message: AgentMessage): Promise<void> {
    const { agentId, eventType, filter } = message.data;
    const subscriptionId = await this.subscribeToEvent(agentId, eventType, filter);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'subscription-confirmed',
      data: { subscriptionId },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleEventUnsubscribe(message: AgentMessage): Promise<void> {
    const { agentId, eventType } = message.data;
    await this.unsubscribeFromEvent(agentId, eventType);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'unsubscription-confirmed',
      data: { agentId, eventType },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }

  private async handleEventHistoryRequest(message: AgentMessage): Promise<void> {
    const { eventType, timeframe } = message.data;
    const history = this.getEventHistory(eventType, timeframe);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'event-history-response',
      data: { history },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}