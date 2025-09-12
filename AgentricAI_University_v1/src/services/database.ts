import { createClient } from '@supabase/supabase-js';

// Database service interfaces
export interface DatabaseConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  redis?: {
    url: string;
    token: string;
  };
  vector?: {
    apiKey: string;
    environment: string;
  };
}

// Unified database service
export class DatabaseService {
  private supabase;
  private redis?: any;
  private vector?: any;

  constructor(config: DatabaseConfig) {
    // Initialize Supabase
    this.supabase = createClient(config.supabase.url, config.supabase.anonKey);
    
    // Initialize Redis if configured
    if (config.redis) {
      // Redis initialization would go here
    }
    
    // Initialize Vector DB if configured
    if (config.vector) {
      // Vector DB initialization would go here
    }
  }

  // Agent Management
  async createAgent(agentData: any) {
    const { data, error } = await this.supabase
      .from('agents')
      .insert(agentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAgent(id: string) {
    const { data, error } = await this.supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAgentStatus(id: string, status: string) {
    const { data, error } = await this.supabase
      .from('agents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // User Session Management
  async createUserSession(sessionData: any) {
    const { data, error } = await this.supabase
      .from('user_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUserProgress(sessionId: string, progress: any) {
    const { data, error } = await this.supabase
      .from('user_sessions')
      .update({ 
        progress_score: progress.score,
        activities_completed: progress.activities,
        adaptive_data: progress.adaptiveData,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Task Management
  async assignTask(taskData: any) {
    const { data, error } = await this.supabase
      .from('agent_tasks')
      .insert(taskData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async completeTask(taskId: string, outputData: any) {
    const { data, error } = await this.supabase
      .from('agent_tasks')
      .update({
        status: 'completed',
        output_data: outputData,
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Analytics & Reporting
  async getSystemMetrics() {
    const { data: agents } = await this.supabase
      .from('agents')
      .select('status');
    
    const { data: sessions } = await this.supabase
      .from('user_sessions')
      .select('progress_score, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    const { data: tasks } = await this.supabase
      .from('agent_tasks')
      .select('status, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    return {
      agents: {
        total: agents?.length || 0,
        active: agents?.filter(a => a.status === 'active').length || 0,
        idle: agents?.filter(a => a.status === 'idle').length || 0
      },
      sessions: {
        total: sessions?.length || 0,
        avgProgress: sessions?.reduce((sum, s) => sum + (s.progress_score || 0), 0) / (sessions?.length || 1)
      },
      tasks: {
        total: tasks?.length || 0,
        completed: tasks?.filter(t => t.status === 'completed').length || 0,
        pending: tasks?.filter(t => t.status === 'pending').length || 0
      }
    };
  }

  // Memory Management (Redis integration)
  async setAgentMemory(agentId: string, memory: any) {
    if (this.redis) {
      await this.redis.setex(`agent:${agentId}:memory`, 3600, JSON.stringify(memory));
    }
    // Fallback to Supabase if Redis not available
    return this.supabase
      .from('agent_memory')
      .upsert({ agent_id: agentId, memory_data: memory });
  }

  async getAgentMemory(agentId: string) {
    if (this.redis) {
      const cached = await this.redis.get(`agent:${agentId}:memory`);
      if (cached) return JSON.parse(cached);
    }
    
    // Fallback to Supabase
    const { data } = await this.supabase
      .from('agent_memory')
      .select('memory_data')
      .eq('agent_id', agentId)
      .single();
    
    return data?.memory_data;
  }

  // Real-time subscriptions
  subscribeToAgentChanges(callback: (payload: any) => void) {
    return this.supabase
      .channel('agents')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'agents' }, 
        callback
      )
      .subscribe();
  }

  subscribeToTaskChanges(callback: (payload: any) => void) {
    return this.supabase
      .channel('tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'agent_tasks' }, 
        callback
      )
      .subscribe();
  }
}

// Export singleton instance
export const db = new DatabaseService({
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  }
});