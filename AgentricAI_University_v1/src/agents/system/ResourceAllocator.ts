// Resource Allocator Agent - OS-level resource management for AgentricAI Core

import { BaseAgent } from '../base/BaseAgent';
import { AgentConfig, AgentMessage } from '../base/AgentTypes';
import { 
  AgentOSInterface, 
  ResourceRequest, 
  ResourceAllocation, 
  ResourceUsage, 
  SystemResourceInfo,
  ResourceLimits,
  MemoryAllocation,
  ComputeAllocation,
  StorageAllocation,
  NetworkAllocation
} from '../base/AgentOSInterface';

export interface ResourcePool {
  type: 'memory' | 'compute' | 'storage' | 'network';
  total: number;
  allocated: number;
  available: number;
  reserved: number;
  unit: string;
}

export interface AllocationRecord {
  allocationId: string;
  agentId: string;
  resourceType: string;
  amount: number;
  allocatedAt: Date;
  expiresAt?: Date;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'active' | 'expired' | 'released';
}

export class ResourceAllocator extends BaseAgent implements AgentOSInterface {
  private resourcePools: Map<string, ResourcePool> = new Map();
  private allocations: Map<string, AllocationRecord> = new Map();
  private agentLimits: Map<string, ResourceLimits> = new Map();
  private usageHistory: Map<string, ResourceUsage[]> = new Map();
  private allocationQueue: ResourceRequest[] = [];

  constructor() {
    const config: AgentConfig = {
      id: 'resource-allocator-001',
      name: 'System Resource Allocator',
      type: 'system-agent',
      version: '1.0.0',
      capabilities: [
        'resource-allocation',
        'resource-monitoring',
        'quota-management',
        'load-balancing',
        'resource-optimization',
        'capacity-planning'
      ],
      specialization: 'system_resource_management',
      neurodiverseOptimized: false,
      priority: 'critical',
      memoryAllocation: '256MB',
      status: 'initializing'
    };

    super(config);
    this.initializeResourcePools();
  }

  async processTask(taskData: any): Promise<any> {
    const { type, data } = taskData;

    switch (type) {
      case 'allocate_resources':
        return await this.requestSystemResources(data.request);
      
      case 'deallocate_resources':
        return await this.releaseResources(data.allocationId);
      
      case 'get_resource_usage':
        return await this.monitorUsage(data.agentId);
      
      case 'set_resource_limits':
        return await this.setResourceLimits(data.agentId, data.limits);
      
      case 'get_system_resources':
        return await this.getSystemResources();
      
      case 'optimize_allocations':
        return await this.optimizeResourceAllocations();
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  // Resource Pool Management
  private initializeResourcePools(): void {
    // Initialize system resource pools
    this.resourcePools.set('memory', {
      type: 'memory',
      total: 16 * 1024 * 1024 * 1024, // 16GB in bytes
      allocated: 0,
      available: 16 * 1024 * 1024 * 1024,
      reserved: 2 * 1024 * 1024 * 1024, // 2GB reserved for system
      unit: 'bytes'
    });

    this.resourcePools.set('compute', {
      type: 'compute',
      total: 100, // 100% CPU
      allocated: 0,
      available: 100,
      reserved: 20, // 20% reserved for system
      unit: 'percentage'
    });

    this.resourcePools.set('storage', {
      type: 'storage',
      total: 1024 * 1024 * 1024 * 1024, // 1TB in bytes
      allocated: 0,
      available: 1024 * 1024 * 1024 * 1024,
      reserved: 100 * 1024 * 1024 * 1024, // 100GB reserved
      unit: 'bytes'
    });

    this.resourcePools.set('network', {
      type: 'network',
      total: 1000, // 1Gbps in Mbps
      allocated: 0,
      available: 1000,
      reserved: 100, // 100Mbps reserved
      unit: 'mbps'
    });
  }

  // AgentOSInterface Implementation
  async requestSystemResources(request: ResourceRequest): Promise<ResourceAllocation> {
    console.log(`📋 Processing resource allocation request:`, request);
    
    const allocationId = `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const allocation: ResourceAllocation = {
      allocationId,
      expiresAt: request.duration ? new Date(Date.now() + request.duration) : undefined
    };

    // Validate and allocate memory
    if (request.memory) {
      allocation.memory = await this.allocateMemory('system', request.memory);
    }

    // Validate and allocate compute
    if (request.compute) {
      allocation.compute = await this.allocateCompute('system', request.compute);
    }

    // Validate and allocate storage
    if (request.storage) {
      allocation.storage = await this.allocateStorage('system', request.storage);
    }

    // Validate and allocate network
    if (request.network) {
      allocation.network = await this.allocateNetwork('system', '100Mbps');
    }

    // Record the allocation
    const record: AllocationRecord = {
      allocationId,
      agentId: 'system',
      resourceType: 'mixed',
      amount: 1,
      allocatedAt: new Date(),
      expiresAt: allocation.expiresAt,
      priority: request.priority || 'normal',
      status: 'active'
    };

    this.allocations.set(allocationId, record);
    
    this.metrics.tasksCompleted += 1;
    return allocation;
  }

  async releaseResources(allocationId: string): Promise<void> {
    console.log(`🧹 Releasing resources: ${allocationId}`);
    
    const record = this.allocations.get(allocationId);
    if (!record) {
      throw new Error(`Allocation not found: ${allocationId}`);
    }

    // Mark as released
    record.status = 'released';
    
    // Update resource pools (simplified - in real implementation would track specific amounts)
    this.updateResourcePools();
    
    this.metrics.tasksCompleted += 1;
  }

  async updateResourceUsage(allocationId: string, usage: any): Promise<void> {
    const record = this.allocations.get(allocationId);
    if (record) {
      // Update usage tracking
      const agentUsage = this.usageHistory.get(record.agentId) || [];
      agentUsage.push({
        agentId: record.agentId,
        memory: usage.memory || { allocated: '0MB', used: '0MB', peak: '0MB' },
        compute: usage.compute || { cpuUsage: 0, threads: 0, priority: 0 },
        storage: usage.storage || { allocated: '0MB', used: '0MB' },
        network: usage.network || { bandwidth: '0Mbps', connections: 0, bytesIn: 0, bytesOut: 0 },
        timestamp: new Date()
      });
      
      // Keep only recent history
      if (agentUsage.length > 100) {
        agentUsage.splice(0, agentUsage.length - 100);
      }
      
      this.usageHistory.set(record.agentId, agentUsage);
    }
  }

  async allocateMemory(agentId: string, amount: string, type: 'heap' | 'stack' | 'shared' = 'heap'): Promise<MemoryAllocation> {
    const memoryPool = this.resourcePools.get('memory')!;
    const bytesRequested = this.parseMemorySize(amount);
    
    if (bytesRequested > memoryPool.available) {
      throw new Error(`Insufficient memory: requested ${amount}, available ${this.formatBytes(memoryPool.available)}`);
    }

    // Check agent limits
    const limits = this.agentLimits.get(agentId);
    if (limits?.maxMemory) {
      const maxBytes = this.parseMemorySize(limits.maxMemory);
      const currentUsage = await this.getAgentMemoryUsage(agentId);
      if (currentUsage + bytesRequested > maxBytes) {
        throw new Error(`Memory limit exceeded for agent ${agentId}`);
      }
    }

    // Allocate memory
    memoryPool.allocated += bytesRequested;
    memoryPool.available -= bytesRequested;

    return {
      allocated: amount,
      address: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
      type
    };
  }

  async deallocateMemory(allocationId: string): Promise<void> {
    const record = this.allocations.get(allocationId);
    if (record) {
      record.status = 'released';
      this.updateResourcePools();
    }
  }

  async getMemoryUsage(agentId: string): Promise<any> {
    const usage = this.usageHistory.get(agentId);
    if (!usage || usage.length === 0) {
      return { allocated: '0MB', used: '0MB', peak: '0MB' };
    }
    
    const latest = usage[usage.length - 1];
    return latest.memory;
  }

  async allocateCompute(agentId: string, priority: 'low' | 'medium' | 'high' | 'critical'): Promise<ComputeAllocation> {
    const computePool = this.resourcePools.get('compute')!;
    const priorityMap = { low: 10, medium: 25, high: 40, critical: 60 };
    const cpuQuota = priorityMap[priority];
    
    if (cpuQuota > computePool.available) {
      throw new Error(`Insufficient compute: requested ${cpuQuota}%, available ${computePool.available}%`);
    }

    // Check agent limits
    const limits = this.agentLimits.get(agentId);
    if (limits?.maxCpu && cpuQuota > limits.maxCpu) {
      throw new Error(`CPU limit exceeded for agent ${agentId}`);
    }

    // Allocate compute
    computePool.allocated += cpuQuota;
    computePool.available -= cpuQuota;

    const priorityLevel = { low: 1, medium: 5, high: 8, critical: 10 }[priority];
    
    return {
      threads: Math.min(4, Math.ceil(cpuQuota / 25)),
      priority: priorityLevel,
      cpuQuota
    };
  }

  async deallocateCompute(allocationId: string): Promise<void> {
    const record = this.allocations.get(allocationId);
    if (record) {
      record.status = 'released';
      this.updateResourcePools();
    }
  }

  async getComputeUsage(agentId: string): Promise<any> {
    const usage = this.usageHistory.get(agentId);
    if (!usage || usage.length === 0) {
      return { cpuUsage: 0, threads: 0, priority: 0 };
    }
    
    const latest = usage[usage.length - 1];
    return latest.compute;
  }

  async allocateStorage(agentId: string, size: string, type: 'persistent' | 'temporary' = 'temporary'): Promise<StorageAllocation> {
    const storagePool = this.resourcePools.get('storage')!;
    const bytesRequested = this.parseMemorySize(size);
    
    if (bytesRequested > storagePool.available) {
      throw new Error(`Insufficient storage: requested ${size}, available ${this.formatBytes(storagePool.available)}`);
    }

    // Check agent limits
    const limits = this.agentLimits.get(agentId);
    if (limits?.maxStorage) {
      const maxBytes = this.parseMemorySize(limits.maxStorage);
      const currentUsage = await this.getAgentStorageUsage(agentId);
      if (currentUsage + bytesRequested > maxBytes) {
        throw new Error(`Storage limit exceeded for agent ${agentId}`);
      }
    }

    // Allocate storage
    storagePool.allocated += bytesRequested;
    storagePool.available -= bytesRequested;

    return {
      path: `/tmp/agent-${agentId}-${Date.now()}`,
      size,
      type
    };
  }

  async deallocateStorage(allocationId: string): Promise<void> {
    const record = this.allocations.get(allocationId);
    if (record) {
      record.status = 'released';
      this.updateResourcePools();
    }
  }

  async getStorageUsage(agentId: string): Promise<any> {
    const usage = this.usageHistory.get(agentId);
    if (!usage || usage.length === 0) {
      return { allocated: '0MB', used: '0MB' };
    }
    
    const latest = usage[usage.length - 1];
    return latest.storage;
  }

  async allocateNetwork(agentId: string, bandwidth: string): Promise<NetworkAllocation> {
    const networkPool = this.resourcePools.get('network')!;
    const mbpsRequested = this.parseBandwidth(bandwidth);
    
    if (mbpsRequested > networkPool.available) {
      throw new Error(`Insufficient bandwidth: requested ${bandwidth}, available ${networkPool.available}Mbps`);
    }

    // Check agent limits
    const limits = this.agentLimits.get(agentId);
    if (limits?.maxBandwidth) {
      const maxMbps = this.parseBandwidth(limits.maxBandwidth);
      if (mbpsRequested > maxMbps) {
        throw new Error(`Bandwidth limit exceeded for agent ${agentId}`);
      }
    }

    // Allocate network
    networkPool.allocated += mbpsRequested;
    networkPool.available -= mbpsRequested;

    return {
      bandwidth,
      connections: limits?.maxConnections || 10,
      protocols: ['http', 'https', 'websocket']
    };
  }

  async deallocateNetwork(allocationId: string): Promise<void> {
    const record = this.allocations.get(allocationId);
    if (record) {
      record.status = 'released';
      this.updateResourcePools();
    }
  }

  async getNetworkUsage(agentId: string): Promise<any> {
    const usage = this.usageHistory.get(agentId);
    if (!usage || usage.length === 0) {
      return { bandwidth: '0Mbps', connections: 0, bytesIn: 0, bytesOut: 0 };
    }
    
    const latest = usage[usage.length - 1];
    return latest.network;
  }

  async monitorUsage(agentId: string): Promise<ResourceUsage> {
    const usage: ResourceUsage = {
      agentId,
      memory: await this.getMemoryUsage(agentId),
      compute: await this.getComputeUsage(agentId),
      storage: await this.getStorageUsage(agentId),
      network: await this.getNetworkUsage(agentId),
      timestamp: new Date()
    };

    // Store in history
    const history = this.usageHistory.get(agentId) || [];
    history.push(usage);
    this.usageHistory.set(agentId, history);

    return usage;
  }

  async getSystemResources(): Promise<SystemResourceInfo> {
    const memoryPool = this.resourcePools.get('memory')!;
    const computePool = this.resourcePools.get('compute')!;
    const storagePool = this.resourcePools.get('storage')!;
    const networkPool = this.resourcePools.get('network')!;

    return {
      totalMemory: this.formatBytes(memoryPool.total),
      availableMemory: this.formatBytes(memoryPool.available),
      totalCpu: computePool.total,
      availableCpu: computePool.available,
      totalStorage: this.formatBytes(storagePool.total),
      availableStorage: this.formatBytes(storagePool.available),
      networkBandwidth: `${networkPool.total}Mbps`,
      activeAgents: new Set(Array.from(this.allocations.values()).map(a => a.agentId)).size
    };
  }

  async setResourceLimits(agentId: string, limits: ResourceLimits): Promise<void> {
    console.log(`⚖️ Setting resource limits for agent ${agentId}:`, limits);
    this.agentLimits.set(agentId, limits);
    this.storeMemory(`limits_${agentId}`, limits, 'long');
  }

  async optimizeResourceAllocations(): Promise<any> {
    console.log(`🔧 Optimizing resource allocations`);
    
    const optimizations = {
      memoryDefragmented: 0,
      computeRebalanced: 0,
      expiredAllocationsReleased: 0,
      recommendations: []
    };

    // Release expired allocations
    const now = new Date();
    for (const [id, record] of this.allocations.entries()) {
      if (record.expiresAt && record.expiresAt < now && record.status === 'active') {
        await this.releaseResources(id);
        optimizations.expiredAllocationsReleased++;
      }
    }

    // Generate recommendations
    const memoryPool = this.resourcePools.get('memory')!;
    if (memoryPool.available < memoryPool.total * 0.2) {
      optimizations.recommendations.push('Memory usage is high - consider scaling or optimizing agents');
    }

    const computePool = this.resourcePools.get('compute')!;
    if (computePool.available < computePool.total * 0.2) {
      optimizations.recommendations.push('CPU usage is high - consider load balancing');
    }

    this.metrics.tasksCompleted += 1;
    return optimizations;
  }

  // Additional OS Interface methods
  async registerWithOS(): Promise<void> {
    console.log(`📝 Registering Resource Allocator with OS`);
    this.storeMemory('os_registration', {
      registered: true,
      registeredAt: new Date(),
      services: ['resource-allocation', 'resource-monitoring', 'quota-management']
    }, 'long');
  }

  async unregisterFromOS(): Promise<void> {
    console.log(`📝 Unregistering Resource Allocator from OS`);
    this.clearMemory('long');
  }

  async updateRegistration(updates: any): Promise<void> {
    const registration = this.retrieveMemory('os_registration', 'long') || {};
    this.storeMemory('os_registration', { ...registration, ...updates }, 'long');
  }

  async reportHealthToOS(): Promise<void> {
    const systemResources = await this.getSystemResources();
    console.log(`🏥 Reporting resource health to OS:`, systemResources);
  }

  async getSystemHealth(): Promise<any> {
    const resources = await this.getSystemResources();
    return {
      resourcePools: Object.fromEntries(this.resourcePools),
      activeAllocations: this.allocations.size,
      systemLoad: this.calculateSystemLoad(),
      recommendations: await this.generateHealthRecommendations()
    };
  }

  subscribeToSystemEvents(): void {
    console.log(`📡 Subscribing to system events`);
  }

  unsubscribeFromSystemEvents(): void {
    console.log(`📡 Unsubscribing from system events`);
  }

  async emitSystemEvent(event: any): Promise<void> {
    console.log(`📢 Emitting system event:`, event.type);
    window.dispatchEvent(new CustomEvent('systemEvent', { detail: event }));
  }

  async discoverServices(): Promise<string[]> {
    return ['resource-allocation', 'resource-monitoring', 'quota-management', 'capacity-planning'];
  }

  async requestService(request: any): Promise<any> {
    return { success: true, data: 'Resource service response' };
  }

  async registerService(serviceType: string, handler: any): Promise<void> {
    console.log(`📋 Registering service: ${serviceType}`);
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'resource-allocation-request':
        await this.handleResourceAllocationRequest(message);
        break;
      
      case 'resource-release-request':
        await this.handleResourceReleaseRequest(message);
        break;
      
      case 'resource-usage-request':
        await this.handleResourceUsageRequest(message);
        break;
      
      default:
        console.log(`Resource Allocator received unknown message type: ${message.type}`);
    }
  }

  generateChildFriendlyResponse(data: any): string {
    return "I'm the resource helper that makes sure everyone gets what they need to work properly! 📦⚡";
  }

  // Private helper methods
  private updateResourcePools(): void {
    // Recalculate resource pool availability based on active allocations
    // This is a simplified version - real implementation would track exact amounts
    for (const pool of this.resourcePools.values()) {
      const activeAllocations = Array.from(this.allocations.values())
        .filter(a => a.status === 'active').length;
      
      // Simplified calculation
      pool.allocated = activeAllocations * (pool.total * 0.1);
      pool.available = pool.total - pool.allocated - pool.reserved;
    }
  }

  private parseMemorySize(size: string): number {
    const units = { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4 };
    const match = size.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
    if (!match) throw new Error(`Invalid memory size format: ${size}`);
    
    const [, amount, unit] = match;
    return parseFloat(amount) * (units[unit.toUpperCase()] || 1);
  }

  private parseBandwidth(bandwidth: string): number {
    const match = bandwidth.match(/^(\d+(?:\.\d+)?)\s*([KMG]?)bps$/i);
    if (!match) throw new Error(`Invalid bandwidth format: ${bandwidth}`);
    
    const [, amount, unit] = match;
    const multipliers = { '': 1, K: 1000, M: 1000000, G: 1000000000 };
    return parseFloat(amount) * (multipliers[unit.toUpperCase()] || 1) / 1000000; // Convert to Mbps
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)}${units[unitIndex]}`;
  }

  private async getAgentMemoryUsage(agentId: string): number {
    const usage = await this.getMemoryUsage(agentId);
    return this.parseMemorySize(usage.allocated || '0MB');
  }

  private async getAgentStorageUsage(agentId: string): number {
    const usage = await this.getStorageUsage(agentId);
    return this.parseMemorySize(usage.allocated || '0MB');
  }

  private calculateSystemLoad(): number {
    const totalAllocations = this.allocations.size;
    const activeAllocations = Array.from(this.allocations.values())
      .filter(a => a.status === 'active').length;
    
    return totalAllocations > 0 ? (activeAllocations / totalAllocations) * 100 : 0;
  }

  private async generateHealthRecommendations(): Promise<string[]> {
    const recommendations = [];
    const memoryPool = this.resourcePools.get('memory')!;
    const computePool = this.resourcePools.get('compute')!;
    
    if (memoryPool.available < memoryPool.total * 0.1) {
      recommendations.push('Critical: Memory usage above 90% - immediate action required');
    } else if (memoryPool.available < memoryPool.total * 0.2) {
      recommendations.push('Warning: Memory usage above 80% - consider optimization');
    }
    
    if (computePool.available < computePool.total * 0.1) {
      recommendations.push('Critical: CPU usage above 90% - load balancing needed');
    }
    
    return recommendations;
  }

  private async handleResourceAllocationRequest(message: AgentMessage): Promise<void> {
    const { request } = message.data;
    try {
      const allocation = await this.requestSystemResources(request);
      
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'resource-allocation-response',
          data: { success: true, allocation },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    } catch (error) {
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'resource-allocation-response',
          data: { success: false, error: error.message },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    }
  }

  private async handleResourceReleaseRequest(message: AgentMessage): Promise<void> {
    const { allocationId } = message.data;
    try {
      await this.releaseResources(allocationId);
      
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'resource-release-response',
          data: { success: true },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    } catch (error) {
      if (message.requiresResponse) {
        await this.sendMessage(message.fromAgentId, {
          id: '',
          fromAgentId: this.id,
          toAgentId: message.fromAgentId,
          type: 'resource-release-response',
          data: { success: false, error: error.message },
          priority: message.priority,
          timestamp: new Date(),
          requiresResponse: false,
          correlationId: message.id
        });
      }
    }
  }

  private async handleResourceUsageRequest(message: AgentMessage): Promise<void> {
    const { agentId } = message.data;
    const usage = await this.monitorUsage(agentId);
    
    await this.sendMessage(message.fromAgentId, {
      id: '',
      fromAgentId: this.id,
      toAgentId: message.fromAgentId,
      type: 'resource-usage-response',
      data: { usage },
      priority: message.priority,
      timestamp: new Date(),
      requiresResponse: false,
      correlationId: message.id
    });
  }
}