import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/database';

// Custom hook for agent management
export const useAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await db.supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      setAgents(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAgent = useCallback(async (agentData: any) => {
    try {
      const newAgent = await db.createAgent(agentData);
      setAgents(prev => [newAgent, ...prev]);
      return newAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
      throw err;
    }
  }, []);

  const updateAgent = useCallback(async (id: string, updates: any) => {
    try {
      const { data } = await db.supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      setAgents(prev => prev.map(agent => 
        agent.id === id ? { ...agent, ...data } : agent
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agent');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAgents();

    // Subscribe to real-time changes
    const subscription = db.subscribeToAgentChanges((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      switch (eventType) {
        case 'INSERT':
          setAgents(prev => [newRecord, ...prev]);
          break;
        case 'UPDATE':
          setAgents(prev => prev.map(agent => 
            agent.id === newRecord.id ? newRecord : agent
          ));
          break;
        case 'DELETE':
          setAgents(prev => prev.filter(agent => agent.id !== oldRecord.id));
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    refetch: fetchAgents
  };
};

// Custom hook for user sessions
export const useUserSessions = (userId?: string) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      let query = db.supabase
        .from('user_sessions')
        .select('*, agents(name, type)');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data } = await query.order('created_at', { ascending: false });
      setSessions(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createSession = useCallback(async (sessionData: any) => {
    try {
      const newSession = await db.createUserSession(sessionData);
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      throw err;
    }
  }, []);

  const updateProgress = useCallback(async (sessionId: string, progress: any) => {
    try {
      const updatedSession = await db.updateUserProgress(sessionId, progress);
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, ...updatedSession } : session
      ));
      return updatedSession;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    createSession,
    updateProgress,
    refetch: fetchSessions
  };
};

// Custom hook for system metrics
export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const systemMetrics = await db.getSystemMetrics();
      setMetrics(systemMetrics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};

// Custom hook for real-time agent memory
export const useAgentMemory = (agentId: string) => {
  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const updateMemory = useCallback(async (newMemory: any) => {
    await db.setAgentMemory(agentId, newMemory);
    setMemory(newMemory);
  }, [agentId]);

  const fetchMemory = useCallback(async () => {
    try {
      setLoading(true);
      const agentMemory = await db.getAgentMemory(agentId);
      setMemory(agentMemory);
    } catch (err) {
      console.error('Failed to fetch agent memory:', err);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    if (agentId) {
      fetchMemory();
    }
  }, [agentId, fetchMemory]);

  return {
    memory,
    loading,
    updateMemory,
    refetch: fetchMemory
  };
};