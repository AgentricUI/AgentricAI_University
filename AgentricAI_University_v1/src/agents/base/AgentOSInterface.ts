// Agent OS Integration Interface - Core OS integration for AgentricAI agents

export interface ResourceRequest {
  memory?: string;
  compute?: 'low' | 'medium' | 'high' | 'critical';
  storage?: string;
  network?: boolean;
  duration?: number; // milliseconds
  priority?: 'background' | 'normal' | 'high' | 'critical';
}

export interface ResourceAllocation {
  allocationId: string;
  memory?: MemoryAllocation;
  compute?: ComputeAllocation;
  storage?: StorageAllocation;
  network?: NetworkAllocation;
  expiresAt?: Date;
}

export interface MemoryAllocation {
  allocated: string;
  address: string;
  type: 'heap' | 'stack' | 'shared';
}

export interface ComputeAllocation {
  threads: number;
  priority: number;
  cpuQuota: number; // percentage
}

export interface StorageAllocation {
  path: string;
  size: string;
  type: 'persistent' | 'temporary';
}

export interface NetworkAllocation {
  bandwidth: string;
  connections: number;
  protocols: string[];
}

export interface HealthReport {
  agentId: string;
  status: 'healthy' | 'degraded' | 'critical' | 'unresponsive';
  metrics: {
    memoryUsage: number;
    cpuUsage: number;
    responseTime: number;
    errorRate: number;
    taskQueueSize: number;
  };
  issues: HealthIssue[];
  lastReported: Date;
}

export interface HealthIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export interface SystemMessage {
  id: string;
  type: 'system-event' | 'agent-event' | 'resource-event' | 'error-event';
  source: string;
  target?: string;
  data: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: Date;
  ttl?: number; // time to live in milliseconds
}

export interface MessageHandler {
  (message: SystemMessage): Promise<void> | void;
}

export interface ServiceRequest {
  serviceType: string;
  operation: string;
  payload: any;
  timeout?: number;
  retries?: number;
}

export interface ServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: any;
}

// Core OS Integration Interface
export interface AgentOSInterface {
  // Resource Management
  requestSystemResources(resources: ResourceRequest): Promise<ResourceAllocation>;
  releaseResources(allocationId: string): Promise<void>;
  updateResourceUsage(allocationId: string, usage: any): Promise<void>;
  
  // System Registration
  registerWithOS(): Promise<void>;
  unregisterFromOS(): Promise<void>;
  updateRegistration(updates: any): Promise<void>;
  
  // Health Monitoring
  reportHealthToOS(): Promise<void>;
  getSystemHealth(): Promise<any>;
  subscribeToHealthAlerts(): void;
  
  // Event System
  subscribeToSystemEvents(): void;
  unsubscribeFromSystemEvents(): void;
  emitSystemEvent(event: SystemMessage): Promise<void>;
  
  // Service Discovery
  discoverServices(): Promise<string[]>;
  requestService(request: ServiceRequest): Promise<ServiceResponse>;
  registerService(serviceType: string, handler: any): Promise<void>;
}

// Message Bus Interface
export interface AgentMessageBus {
  // Broadcasting
  broadcast(message: SystemMessage): Promise<void>;
  multicast(targets: string[], message: SystemMessage): Promise<void>;
  unicast(target: string, message: SystemMessage): Promise<void>;
  
  // Subscription Management
  subscribe(eventType: string, handler: MessageHandler): string; // returns subscription ID
  unsubscribe(subscriptionId: string): void;
  subscribeToAgent(agentId: string, handler: MessageHandler): string;
  
  // Message Routing
  routeMessage(message: SystemMessage): Promise<void>;
  createMessageChannel(channelName: string): Promise<void>;
  joinChannel(channelName: string): Promise<void>;
  leaveChannel(channelName: string): Promise<void>;
  
  // Quality of Service
  setPriority(messageId: string, priority: 'low' | 'normal' | 'high' | 'critical'): void;
  setRetryPolicy(messageId: string, retries: number, backoff: number): void;
  setDeliveryGuarantee(messageId: string, guarantee: 'at-most-once' | 'at-least-once' | 'exactly-once'): void;
}

// Resource Manager Interface
export interface ResourceManager {
  // Memory Management
  allocateMemory(agentId: string, amount: string, type?: 'heap' | 'stack' | 'shared'): Promise<MemoryAllocation>;
  deallocateMemory(allocationId: string): Promise<void>;
  getMemoryUsage(agentId: string): Promise<any>;
  
  // Compute Management
  allocateCompute(agentId: string, priority: 'low' | 'medium' | 'high' | 'critical'): Promise<ComputeAllocation>;
  deallocateCompute(allocationId: string): Promise<void>;
  getComputeUsage(agentId: string): Promise<any>;
  
  // Storage Management
  allocateStorage(agentId: string, size: string, type?: 'persistent' | 'temporary'): Promise<StorageAllocation>;
  deallocateStorage(allocationId: string): Promise<void>;
  getStorageUsage(agentId: string): Promise<any>;
  
  // Network Management
  allocateNetwork(agentId: string, bandwidth: string): Promise<NetworkAllocation>;
  deallocateNetwork(allocationId: string): Promise<void>;
  getNetworkUsage(agentId: string): Promise<any>;
  
  // Monitoring
  monitorUsage(agentId: string): Promise<ResourceUsage>;
  getSystemResources(): Promise<SystemResourceInfo>;
  setResourceLimits(agentId: string, limits: ResourceLimits): Promise<void>;
}

export interface ResourceUsage {
  agentId: string;
  memory: {
    allocated: string;
    used: string;
    peak: string;
  };
  compute: {
    cpuUsage: number;
    threads: number;
    priority: number;
  };
  storage: {
    allocated: string;
    used: string;
  };
  network: {
    bandwidth: string;
    connections: number;
    bytesIn: number;
    bytesOut: number;
  };
  timestamp: Date;
}

export interface SystemResourceInfo {
  totalMemory: string;
  availableMemory: string;
  totalCpu: number;
  availableCpu: number;
  totalStorage: string;
  availableStorage: string;
  networkBandwidth: string;
  activeAgents: number;
}

export interface ResourceLimits {
  maxMemory?: string;
  maxCpu?: number;
  maxStorage?: string;
  maxConnections?: number;
  maxBandwidth?: string;
}