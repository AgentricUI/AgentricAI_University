import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  MessageSquare, 
  Zap, 
  Database,
  Network,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useAgentricAICoreOS } from '../hooks/useStealthEcosystem';
import StealthPanel from './ui/StealthPanel';
import AgentricAIPanel from './ui/AgentricAIPanel';
import NeonButton from './ui/NeonButton';

const AgentMonitoringDashboard: React.FC = () => {
  const {
    coreOSStatus,
    activeAgents,
    recentActivity,
    loading,
    error,
    getAgentMetrics,
    sendAgentMessage,
    triggerWorkflow
  } = useAgentricAICoreOS();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentMetrics, setAgentMetrics] = useState<any>(null);
  const [networkVisualization, setNetworkVisualization] = useState(true);

  useEffect(() => {
    if (selectedAgent) {
      loadAgentMetrics(selectedAgent);
    }
  }, [selectedAgent]);

  const loadAgentMetrics = async (agentId: string) => {
    try {
      const metrics = await getAgentMetrics(agentId);
      setAgentMetrics(metrics);
    } catch (err) {
      console.error('Failed to load agent metrics:', err);
    }
  };

  const handleTestCommunication = async () => {
    try {
      await sendAgentMessage(
        'stealth-learning-coordinator',
        'stealth-behavior-analyst',
        {
          type: 'test_communication',
          message: 'System communication test',
          timestamp: new Date().toISOString()
        },
        'normal'
      );
    } catch (err) {
      console.error('Communication test failed:', err);
    }
  };

  const handleTriggerWorkflow = async (workflowType: string) => {
    try {
      await triggerWorkflow(workflowType, {
        test_mode: true,
        initiated_by: 'admin_dashboard'
      });
    } catch (err) {
      console.error('Workflow trigger failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stealth-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stealth-black flex items-center justify-center">
        <StealthPanel className="p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-neon-orange mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Ecosystem Error</h2>
          <p className="text-stealth-light">{error}</p>
        </StealthPanel>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <span className="bg-gradient-to-r from-neon-cyan to-neon-lime bg-clip-text text-transparent">
            AGENTRICAI CORE OS
          </span>
          <span className="ml-3 text-neon-blue">AGENT ECOSYSTEM MONITOR</span>
        </h1>
        <p className="text-stealth-light">
          Real-time visualization of AgentricAI Core OS agent ecosystem
        </p>
      </motion.div>

      {/* Core OS Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AgentricAIPanel className="p-6 text-center border-2 border-neon-cyan" variant="primary">
            <Brain className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
            <div className="text-2xl font-bold text-neon-cyan mb-1">
              {coreOSStatus?.agent_status?.total || 0}
            </div>
            <div className="text-stealth-light text-sm uppercase tracking-wider">
              OS Agents
            </div>
          </AgentricAIPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AgentricAIPanel className="p-6 text-center border-2 border-neon-lime" variant="success">
            <Activity className="w-8 h-8 text-neon-lime mx-auto mb-3" />
            <div className="text-2xl font-bold text-neon-lime mb-1">
              {coreOSStatus?.agent_status?.active || 0}
            </div>
            <div className="text-stealth-light text-sm uppercase tracking-wider">
              Active OS Agents
            </div>
          </AgentricAIPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AgentricAIPanel className="p-6 text-center border-2 border-neon-blue" variant="secondary">
            <MessageSquare className="w-8 h-8 text-neon-blue mx-auto mb-3" />
            <div className="text-2xl font-bold text-neon-blue mb-1">
              {coreOSStatus?.communication_activity?.recent_messages || 0}
            </div>
            <div className="text-stealth-light text-sm uppercase tracking-wider">
              OS Messages/Min
            </div>
          </AgentricAIPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AgentricAIPanel className="p-6 text-center border-2 border-neon-orange" variant="warning">
            <Database className="w-8 h-8 text-neon-orange mx-auto mb-3" />
            <div className="text-2xl font-bold text-neon-orange mb-1">
              {coreOSStatus?.knowledge_base?.total_entries || 0}
            </div>
            <div className="text-stealth-light text-sm uppercase tracking-wider">
              OS Knowledge Entries
            </div>
          </AgentricAIPanel>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agent Network Visualization */}
        <div className="lg:col-span-2">
          <AgentricAIPanel className="p-6" variant="primary" rivetPattern="full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Network className="w-6 h-6 text-neon-cyan mr-2" />
                AgentricAI Core OS Communication Network
              </h3>
              <div className="flex space-x-2">
                <NeonButton
                  onClick={handleTestCommunication}
                  variant="primary"
                  className="text-sm px-4 py-2"
                >
                  Test OS Comms
                </NeonButton>
                <button
                  onClick={() => setNetworkVisualization(!networkVisualization)}
                  className="text-stealth-light hover:text-neon-cyan transition-colors"
                >
                  <Zap className="w-5 h-5" />
                </button>
              </div>
            </div>

            {networkVisualization ? (
              <div className="relative h-80 bg-stealth-panel-light rounded-lg overflow-hidden">
                {/* Network Visualization */}
                <svg className="w-full h-full">
                  {/* Agent Nodes */}
                  <motion.circle
                    cx="20%"
                    cy="30%"
                    r="20"
                    fill="#00ffff"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  <motion.circle
                    cx="80%"
                    cy="30%"
                    r="20"
                    fill="#0080ff"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                  />
                  <motion.circle
                    cx="50%"
                    cy="70%"
                    r="20"
                    fill="#00ff80"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 }}
                  />
                  <motion.circle
                    cx="20%"
                    cy="70%"
                    r="15"
                    fill="#ff8000"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 }}
                  />

                  {/* Communication Lines */}
                  <motion.line
                    x1="20%"
                    y1="30%"
                    x2="80%"
                    y2="30%"
                    stroke="#00ffff"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.3, duration: 1 }}
                  />
                  <motion.line
                    x1="50%"
                    y1="70%"
                    x2="20%"
                    y2="30%"
                    stroke="#00ff80"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                  />
                  <motion.line
                    x1="50%"
                    y1="70%"
                    x2="80%"
                    y2="30%"
                    stroke="#0080ff"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.7, duration: 1 }}
                  />
                </svg>

                {/* Agent Labels */}
                <div className="absolute top-4 left-4 text-xs text-neon-cyan">
                  Learning Coordinator
                </div>
                <div className="absolute top-4 right-4 text-xs text-neon-blue">
                  Behavior Analyst
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-neon-lime">
                  Content Generator
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-neon-orange">
                  Error Handler
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Agent List View */}
                {[
                  { name: 'Core OS Process Manager', status: 'active', color: 'neon-cyan', tasks: 8 },
                  { name: 'Core OS Resource Allocator', status: 'active', color: 'neon-blue', tasks: 5 },
                  { name: 'Core OS Message Bus', status: 'processing', color: 'neon-lime', tasks: 127 },
                  { name: 'Learning Coordinator', status: 'active', color: 'neon-orange', tasks: 3 },
                  { name: 'Behavior Analyst', status: 'processing', color: 'neon-cyan', tasks: 1 },
                  { name: 'Content Generator', status: 'idle', color: 'neon-blue', tasks: 0 }
                ].map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-stealth-panel-light rounded-lg cursor-pointer hover:bg-stealth-border transition-colors"
                    onClick={() => setSelectedAgent(agent.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${agent.color} ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
                      <span className="text-white font-medium">{agent.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${agent.color} bg-opacity-20 text-${agent.color}`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-stealth-light text-sm">{agent.tasks} tasks</span>
                      <Activity className={`w-4 h-4 text-${agent.color}`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AgentricAIPanel>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* System Status */}
          <AgentricAIPanel className="p-6" variant="success">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-neon-lime mr-2" />
              Core OS Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-stealth-light text-sm">Core OS Health</span>
                <span className="text-neon-lime font-medium">OPTIMAL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stealth-light text-sm">Response Time</span>
                <span className="text-neon-cyan font-medium">120ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stealth-light text-sm">Memory Usage</span>
                <span className="text-neon-blue font-medium">5.1/16 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stealth-light text-sm">Uptime</span>
                <span className="text-neon-orange font-medium">12h 34m</span>
              </div>
            </div>
          </AgentricAIPanel>

          {/* Workflow Controls */}
          <AgentricAIPanel className="p-6" variant="secondary">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 text-neon-cyan mr-2" />
              Core OS Workflow Controls
            </h3>
            <div className="space-y-3">
              <NeonButton
                onClick={() => handleTriggerWorkflow('learning_assessment')}
                variant="primary"
                className="w-full text-sm"
              >
                Trigger Learning Assessment
              </NeonButton>
              <NeonButton
                onClick={() => handleTriggerWorkflow('content_adaptation')}
                variant="secondary"
                className="w-full text-sm"
              >
                Content Adaptation
              </NeonButton>
              <NeonButton
                onClick={() => handleTriggerWorkflow('agent_creation')}
                variant="danger"
                className="w-full text-sm"
              >
                Create New Agent
              </NeonButton>
            </div>
          </AgentricAIPanel>

          {/* Recent Activity */}
          <AgentricAIPanel className="p-6" variant="accent">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 text-neon-blue mr-2" />
              Core OS Activity
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-2 bg-stealth-panel-light rounded"
                >
                  <div className={`w-2 h-2 rounded-full bg-${activity.stealth_theme?.panel_color || 'neon-cyan'} mt-2`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{activity.type.replace('_', ' ')}</p>
                    <p className="text-stealth-light text-xs">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AgentricAIPanel>
        </div>
      </div>

      {/* Performance Metrics */}
      {coreOSStatus?.agentricai_core_os_metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <AgentricAIPanel className="p-6" variant="primary" rivetPattern="full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-neon-lime mr-2" />
              AgentricAI Core OS Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Cpu className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-cyan mb-1">
                  {coreOSStatus.agentricai_core_os_metrics?.os_efficiency || '98.7%'}
                </div>
                <div className="text-stealth-light text-sm">OS Efficiency</div>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-neon-lime mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-lime mb-1">
                  {coreOSStatus.agentricai_core_os_metrics?.agent_network_status?.toUpperCase() || 'OPTIMAL'}
                </div>
                <div className="text-stealth-light text-sm">Agent Network</div>
              </div>
              <div className="text-center">
                <HardDrive className="w-8 h-8 text-neon-orange mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-orange mb-1">
                  {coreOSStatus.agentricai_core_os_metrics?.system_integrity || '100%'}
                </div>
                <div className="text-stealth-light text-sm">System Integrity</div>
              </div>
            </div>
          </AgentricAIPanel>
        </motion.div>
      )}
    </div>
  );
};

export default AgentMonitoringDashboard;