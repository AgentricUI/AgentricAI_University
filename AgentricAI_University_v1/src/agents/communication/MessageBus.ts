// Message Bus Agent - OS-level communication infrastructure for AgentricAI Core

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';
import { 
  AgentOSInterface, 
  SystemMessage, 
  MessageHandler, 
  AgentMessageBus 
} from '../base/AgentOSInterface';

export interface MessageChannel {
  name: string;
  subscribers: Set<string>;
  messageHistory: SystemMessage[];
  maxHistory: number;
  createdAt: Date;
  isPrivate: boolean;
}

export interface MessageRoute {
  pattern: string;
  handler: string;
  priority: number;
  enabled: boolean;
}

export interface MessageStats {
  totalMessages: number;
  messagesPerSecond: number;
  averageLatency: number;
  errorRate: number;
  channelCount: number;
  subscriberCount: number;
}

export interface QueuedMessage {
  message: SystemMessage;
  retries: number;
  maxRetries: number;
  nextRetry: Date;
  backoffMs: number;
}

export class MessageBus extends BaseAgent implements AgentOSInterface, AgentMessageBus {
  private channels: Map<string, MessageChannel> = new Map();
  private subscriptions: Map<string, MessageHandler> = new Map();
  private routes: Map<string, MessageRoute> = new Map();
  private messageQueue: QueuedMessage[] = [];
  private messageHistory: SystemMessage[] = [];
  private stats: MessageStats = {
    totalMessages: 0,
    messagesPerSecond: 0,
    averageLatency: 0,
    errorRate: 0,
    channelCount: 0,
    subscriberCount: 0
  };

  constructor() {
    const config: AgentConfig = {
      id: 'message-bus-001',
      name: 'System Message Bus',
      type: 'system-agent',
      version: '1.0.0',
      capabilities: [
        'message-routing',
        'channel-management',
        'subscription-management',
        'message-queuing',
        'broadcast-messaging',
        'quality-of-service'
      ],
      specialization: 'system_communication_infrastructure',
      neurodiverseOptimized: false,
      priority: 'critical',
      memoryAllocation: '512MB',
      status: 'initializing'
    };

    super(config);
    this.initializeDefaultChannels();
    this.startMessageProcessor();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'send_message':
        return await this.routeMessage(data.message);
      
      case 'create_channel':
        return await this.createMessageChannel(data.channelName);
      
      case 'join_channel':
        return await this.joinChannel(data.channelName);
      
      case 'leave_channel':
        return await this.leaveChannel(data.channelName);
      
      case 'get_stats':
        return this.getMessageStats();
      
      case 'get_channels':
        return this.listChannels();
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  // AgentMessageBus Implementation
  async broadcast(message: SystemMessage): Promise<void> {
    console.log(`📢 Broadcasting message: ${message.type}`);
    
    message.target = 'broadcast';
    await this.routeMessage(message);
    
    // Send to all channels
    for (const channel of this.channels.values()) {
      await this.sendToChannel(channel.name, message);
    }
    
    this.updateStats(message);
  }

  async multicast(targets: string[], message: SystemMessage): Promise<void> {
    console.log(`📡 Multicasting message to ${targets.length} targets`);
    
    for (const target of targets) {
      const targetMessage = { ...message, target };
      await this.unicast(target, targetMessage);
    }
  }

  async unicast(target: string, message: SystemMessage): Promise<void> {
    console.log(`📨 Sending unicast message to: ${target}`);
    
    message.target = target;
    await this.routeMessage(message);
    this.updateStats(message);
  }

  subscribe(eventType: string, handler: MessageHandler): string {
    const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`📝 Creating subscription: ${subscriptionId} for event: ${eventType}`);
    
    this.subscriptions.set(subscriptionId, handler);
    this.storeMemory(`subscription_${subscriptionId}`, {
      eventType,
      subscriptionId,
      createdAt: new Date()
    }, 'long');
    
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): void {
    console.log(`🗑️ Removing subscription: ${subscriptionId}`);
    
    this.subscriptions.delete(subscriptionId);
    this.clearMemory('long');
  }

  subscribeToAgent(agentId: string, handler: MessageHandler): string {
    return this.subscribe(`agent.${agentId}.*`, handler);
  }

  async routeMessage(message: SystemMessage): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Add to message history
      this.messageHistory.push(message);
      if (this.messageHistory.length > 1000) {
        this.messageHistory = this.messageHistory.slice(-1000);
      }

      // Find matching routes
      const matchingRoutes = this.findMatchingRoutes(message);
      
      if (matchingRoutes.length === 0) {
        console.warn(`No routes found for message type: ${message.type}`);
        return;
      }

      // Route to all matching handlers
      for (const route of matchingRoutes) {
        await this.executeRoute(route, message);
      }

      // Update latency stats
      const latency = Date.now() - startTime;
      this.stats.averageLatency = (this.stats.averageLatency + latency) / 2;
      
    } catch (error) {
      console.error(`Error routing message:`, error);
      this.stats.errorRate += 1;
      
      // Queue for retry if appropriate
      if (message.priority === 'critical' || message.priority === 'high') {
        await this.queueForRetry(message);
      }
    }
  }

  async createMessageChannel(channelName: string): Promise<void> {
    console.log(`📺 Creating message channel: ${channelName}`);
    
    if (this.channels.has(channelName)) {
      throw new Error(`Channel already exists: ${channelName}`);
    }

    const channel: MessageChannel = {
      name: channelName,
      subscribers: new Set(),
      messageHistory: [],
      maxHistory: 100,
      createdAt: new Date(),
      isPrivate: false
    };

    this.channels.set(channelName, channel);
    this.stats.channelCount = this.channels.size;
    
    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'channel_created', channelName },
      priority: 'normal',
      timestamp: new Date()
    });
  }

  async joinChannel(channelName: string): Promise<void> {
    console.log(`🚪 Joining channel: ${channelName}`);
    
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel not found: ${channelName}`);
    }

    channel.subscribers.add(this.id);
    this.updateSubscriberCount();
    
    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'channel_joined', channelName, agentId: this.id },
      priority: 'normal',
      timestamp: new Date()
    });
  }

  async leaveChannel(channelName: string): Promise<void> {
    console.log(`🚪 Leaving channel: ${channelName}`);
    
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel not found: ${channelName}`);
    }

    channel.subscribers.delete(this.id);
    this.updateSubscriberCount();
    
    await this.emitSystemEvent({
      id: `event-${Date.now()}`,
      type: 'system-event',
      source: this.id,
      data: { event: 'channel_left', channelName, agentId: this.id },
      priority: 'normal',
      timestamp: new Date()
    });
  }

  setPriority(messageId: string, priority: 'low' | 'normal' | 'high' | 'critical'): void {
    // Find message in queue and update priority
    const queuedMessage = this.messageQueue.find(qm => qm.message.id === messageId);
    if (queuedMessage) {
      queuedMessage.message.priority = priority;
      // Re-sort queue by priority
      this.sortMessageQueue();
    }
  }

  setRetryPolicy(messageId: string, retries: number, backoff: number): void {
    const queuedMessage = this.messageQueue.find(qm => qm.message.id === messageId);
    if (queuedMessage) {
      queuedMessage.maxRetries = retries;
      queuedMessage.backoffMs = backoff;
    }
  }

  setDeliveryGuarantee(messageId: string, guarantee: 'at-most-once' | 'at-least-once' | 'exactly-once'): void {
    // Store delivery guarantee preference
    this.storeMemory(`delivery_${messageId}`, { guarantee }, 'short');
  }

  // Message Processing
  private async sendToChannel(channelName: string, message: SystemMessage): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) return;

    // Add to channel history
    channel.messageHistory.push(message);
    if (channel.messageHistory.length > channel.maxHistory) {
      channel.messageHistory = channel.messageHistory.slice(-channel.maxHistory);
    }

    // Notify all subscribers
    for (const subscriberId of channel.subscribers) {
      await this.notifySubscriber(subscriberId, message);
    }
  }

  private async notifySubscriber(subscriberId: string, message: SystemMessage): Promise<void> {
    try {
      // Find matching subscriptions
      for (const [subId, handler] of this.subscriptions.entries()) {
        const subscription = this.retrieveMemory(`subscription_${subId}`, 'long');
        if (subscription && this.matchesEventType(message.type, subscription.eventType)) {
          await handler(message);
        }
      }
    } catch (error) {
      console.error(`Error notifying subscriber ${subscriberId}:`, error);
    }
  }

  private findMatchingRoutes(message: SystemMessage): MessageRoute[] {
    const routes = [];
    
    for (const [pattern, route] of this.routes.entries()) {
      if (route.enabled && this.matchesPattern(message.type, pattern)) {
        routes.push(route);
      }
    }
    
    // Sort by priority
    return routes.sort((a, b) => b.priority - a.priority);
  }

  private async executeRoute(route: MessageRoute, message: SystemMessage): Promise<void> {
    try {
      // Execute route handler
      console.log(`🛤️ Executing route: ${route.pattern} -> ${route.handler}`);
      
      // In a real implementation, this would invoke the actual handler
      // For now, we'll just log the routing
      
    } catch (error) {
      console.error(`Error executing route ${route.pattern}:`, error);
      throw error;
    }
  }

  private async queueForRetry(message: SystemMessage): Promise<void> {
    const queuedMessage: QueuedMessage = {
      message,
      retries: 0,
      maxRetries: 3,
      nextRetry: new Date(Date.now() + 1000), // 1 second initial delay
      backoffMs: 1000
    };
    
    this.messageQueue.push(queuedMessage);
    this.sortMessageQueue();
  }

  private sortMessageQueue(): void {
    const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
    
    this.messageQueue.sort((a, b) => {
      const aPriority = priorityOrder[a.message.priority] || 0;
      const bPriority = priorityOrder[b.message.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return a.nextRetry.getTime() - b.nextRetry.getTime();
    });
  }

  private startMessageProcessor(): void {
    // Process queued messages every second
    setInterval(async () => {
      await this.processMessageQueue();
      this.updateMessageStats();
    }, 1000);
  }

  private async processMessageQueue(): Promise<void> {
    const now = new Date();
    const messagesToProcess = this.messageQueue.filter(qm => qm.nextRetry <= now);
    
    for (const queuedMessage of messagesToProcess) {
      try {
        await this.routeMessage(queuedMessage.message);
        
        // Remove from queue on success
        this.messageQueue = this.messageQueue.filter(qm => qm !== queuedMessage);
        
      } catch (error) {
        queuedMessage.retries++;
        
        if (queuedMessage.retries >= queuedMessage.maxRetries) {
          // Max retries exceeded, remove from queue
          console.error(`Message ${queuedMessage.message.id} exceeded max retries`);
          this.messageQueue = this.messageQueue.filter(qm => qm !== queuedMessage);
        } else {
          // Schedule next retry with exponential backoff
          queuedMessage.nextRetry = new Date(now.getTime() + queuedMessage.backoffMs * Math.pow(2, queuedMessage.retries));
        }
      }
    }
  }

  private initializeDefaultChannels(): void {
    // Create default system channels
    const defaultChannels = [
      'system-events',
      'agent-lifecycle',
      'resource-events',
      'error-events',
      'health-monitoring'
    ];

    for (const channelName of defaultChannels) {
      const channel: MessageChannel = {
        name: channelName,
        subscribers: new Set(),
        messageHistory: [],
        maxHistory: 100,
        createdAt: new Date(),
        isPrivate: false
      };
      
      this.channels.set(channelName, channel);
    }

    this.stats.channelCount = this.channels.size;
  }

  private matchesEventType(messageType: string, eventPattern: string): boolean {
    // Simple pattern matching with wildcards
    const pattern = eventPattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(messageType);
  }

  private matchesPattern(messageType: string, routePattern: string): boolean {
    return this.matchesEventType(messageType, routePattern);
  }

  private updateStats(message: SystemMessage): void {
    this.stats.totalMessages++;
    
    // Calculate messages per second (simple moving average)
    const now = Date.now();
    const recentMessages = this.messageHistory.filter(m => 
      now - m.timestamp.getTime() < 1000
    ).length;
    
    this.stats.messagesPerSecond = recentMessages;
  }

  private updateMessageStats(): void {
    // Update various statistics
    this.stats.channelCount = this.channels.size;
    this.updateSubscriberCount();
  }

  private updateSubscriberCount(): void {
    let totalSubscribers = 0;
    for (const channel of this.channels.values()) {
      totalSubscribers += channel.subscribers.size;
    }
    this.stats.subscriberCount = totalSubscribers;
  }

  private getMessageStats(): MessageStats {
    return { ...this.stats };
  }

  private listChannels(): MessageChannel[] {
    return Array.from(this.channels.values());
  }

  // AgentOSInterface Implementation
  async registerWithOS(): Promise<void> {
    console.log(`📝 Registering Message Bus with OS`);
    this.storeMemory('os_registration', {
      registered: true,
      registeredAt: new Date(),
      services: ['message-routing', 'channel-management', 'broadcast-messaging']
    }, 'long');
  }

  async unregisterFromOS(): Promise<void> {
    console.log(`📝 Unregistering Message Bus from OS`);
    this.clearMemory('long');
  }

  async updateRegistration(updates: any): Promise<void> {
    const registration = this.retrieveMemory('os_registration', 'long') || {};
    this.storeMemory('os_registration', { ...registration, ...updates }, 'long');
  }

  async requestSystemResources(resources: any): Promise<any> {
    // Message bus has minimal resource requirements
    return {
      allocationId: `msgbus-${Date.now()}`,
      memory: { allocated: '512MB', address: '0x12345678', type: 'heap' }
    };
  }

  async releaseResources(allocationId: string): Promise<void> {
    console.log(`🧹 Releasing message bus resources: ${allocationId}`);
  }

  async updateResourceUsage(allocationId: string, usage: any): Promise<void> {
    // Track message bus resource usage
  }

  async reportHealthToOS(): Promise<void> {
    const health = {
      status: 'healthy',
      metrics: {
        totalMessages: this.stats.totalMessages,
        messagesPerSecond: this.stats.messagesPerSecond,
        averageLatency: this.stats.averageLatency,
        errorRate: this.stats.errorRate,
        queueSize: this.messageQueue.length
      }
    };
    
    console.log(`🏥 Reporting message bus health to OS:`, health.status);
  }

  async getSystemHealth(): Promise<any> {
    return {
      messageStats: this.stats,
      queueSize: this.messageQueue.length,
      channelHealth: this.getChannelHealth(),
      subscriptionHealth: this.getSubscriptionHealth()
    };
  }

  subscribeToSystemEvents(): void {
    console.log(`📡 Message Bus subscribing to system events`);
  }

  unsubscribeFromSystemEvents(): void {
    console.log(`📡 Message Bus unsubscribing from system events`);
  }

  async emitSystemEvent(event: any): Promise<void> {
    console.log(`📢 Message Bus emitting system event:`, event.type);
    await this.broadcast(event);
  }

  async discoverServices(): Promise<string[]> {
    return ['message-routing', 'channel-management', 'broadcast-messaging', 'subscription-management'];
  }

  async requestService(request: any): Promise<any> {
    return { success: true, data: 'Message bus service response' };
  }

  async registerService(serviceType: string, handler: any): Promise<void> {
    console.log(`📋 Registering message bus service: ${serviceType}`);
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    // Convert AgentMessage to SystemMessage and route
    const systemMessage: SystemMessage = {
      id: message.id,
      type: message.type,
      source: message.fromAgentId,
      target: message.toAgentId,
      data: message.data,
      priority: message.priority,
      timestamp: message.timestamp,
      ttl: 300000 // 5 minutes default TTL
    };

    await this.routeMessage(systemMessage);
  }

  generateChildFriendlyResponse(data: any): string {
    return "I'm the message helper that makes sure all the learning helpers can talk to each other! 📬💬";
  }

  // Private helper methods
  private getChannelHealth(): any {
    const channelHealth = {};
    
    for (const [name, channel] of this.channels.entries()) {
      channelHealth[name] = {
        subscribers: channel.subscribers.size,
        messageCount: channel.messageHistory.length,
        lastActivity: channel.messageHistory.length > 0 
          ? channel.messageHistory[channel.messageHistory.length - 1].timestamp
          : channel.createdAt
      };
    }
    
    return channelHealth;
  }

  private getSubscriptionHealth(): any {
    return {
      totalSubscriptions: this.subscriptions.size,
      activeSubscriptions: this.subscriptions.size, // Simplified
      subscriptionTypes: Array.from(this.subscriptions.keys()).map(id => {
        const sub = this.retrieveMemory(`subscription_${id}`, 'long');
        return sub?.eventType || 'unknown';
      })
    };
  }
}