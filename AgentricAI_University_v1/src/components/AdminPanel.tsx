import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  Settings, 
  Monitor, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import StealthPanel from './ui/StealthPanel';
import AgentricAIPanel from './ui/AgentricAIPanel';
import NeonButton from './ui/NeonButton';
import AgentCard from './ui/AgentCard';
import KnowledgeDatabasePanel from './KnowledgeDatabasePanel';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agents');

  const agents = [
    {
      id: 'agent-001',
      name: 'Learning Coordinator',
      status: 'active',
      tasks: 3,
      memory: '2.4GB',
      uptime: '12h 34m',
      type: 'adaptive'
    },
    {
      id: 'agent-002', 
      name: 'Behavior Analyst',
      status: 'processing',
      tasks: 1,
      memory: '1.8GB',
      uptime: '8h 22m',
      type: 'monitoring'
    },
    {
      id: 'agent-003',
      name: 'Content Generator',
      status: 'idle',
      tasks: 0,
      memory: '0.9GB',
      uptime: '15h 7m',
      type: 'creative'
    }
  ];

  const systemMetrics = [
    { label: 'CPU Usage', value: '34%', status: 'optimal' },
    { label: 'Memory', value: '5.1/16 GB', status: 'optimal' },
    { label: 'Storage', value: '240/1TB', status: 'optimal' },
    { label: 'Network', value: '120ms', status: 'warning' }
  ];

  const tabs = [
    { id: 'agents', label: 'AI Agents', icon: Brain },
    { id: 'monitoring', label: 'System Monitor', icon: Monitor },
    { id: 'database', label: 'Knowledge Database', icon: Database },
    { id: 'settings', label: 'Configuration', icon: Settings }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <span className="bg-gradient-to-r from-neon-cyan to-neon-orange bg-clip-text text-transparent">
            AGENTRICAI CORE OS
          </span>
          <span className="ml-3 text-stealth-light">UNIVERSITY CONTROL CENTER</span>
        </h1>
        <p className="text-stealth-light">
          Agent Operating System with Revolutionary Self-Evolving University Platform
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-neon-cyan bg-opacity-20 text-neon-cyan border-2 border-neon-cyan'
                : 'bg-stealth-panel text-stealth-light hover:bg-stealth-panel-light border-2 border-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">AgentricAI Core OS Agent Ecosystem</h2>
              <div className="flex space-x-3">
                <NeonButton variant="primary">
                  <Brain className="w-4 h-4 mr-2" />
                  Create Agent
                </NeonButton>
                <NeonButton variant="secondary">
                  <Database className="w-4 h-4 mr-2" />
                  Agent File (.af) Integration
                </NeonButton>
                <NeonButton 
                  onClick={() => window.location.href = '/admin/agent-monitor'}
                  variant="secondary"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  OS Monitor
                </NeonButton>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">AgentricAI Core OS Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <AgentricAIPanel className="p-6" variant="primary">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stealth-light text-sm">{metric.label}</span>
                    {metric.status === 'optimal' ? (
                      <CheckCircle className="w-4 h-4 text-neon-lime" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-neon-orange" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                </AgentricAIPanel>
              ))}
            </div>

            <AgentricAIPanel className="p-6" variant="secondary" rivetPattern="edges">
              <h3 className="text-lg font-bold text-white mb-4">AgentricAI Core OS Activity Log</h3>
              <div className="space-y-3">
                {[
                  { time: '14:32:15', event: 'Agent-001 completed learning assessment', type: 'success' },
                  { time: '14:31:42', event: 'Core OS: New agent process spawned', type: 'info' },
                  { time: '14:30:18', event: 'Resource Allocator: Memory optimization completed', type: 'success' },
                  { time: '14:29:33', event: 'Message Bus: High throughput detected', type: 'warning' },
                  { time: '14:28:45', event: 'Process Manager: Agent hot-swap successful', type: 'success' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-stealth-panel rounded-lg">
                    <Clock className={`w-4 h-4 ${
                      log.type === 'success' ? 'text-neon-lime' :
                      log.type === 'warning' ? 'text-neon-orange' : 'text-neon-cyan'
                    }`} />
                    <span className="text-stealth-light text-sm">{log.time}</span>
                    <span className="text-white flex-1">{log.event}</span>
                  </div>
                ))}
              </div>
            </AgentricAIPanel>
          </div>
        )}

        {activeTab === 'database' && (
          <KnowledgeDatabasePanel />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">AgentricAI Core OS Configuration</h2>
            <AgentricAIPanel className="p-6" variant="warning">
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-neon-lime mx-auto mb-4" />
                <p className="text-stealth-light text-lg">Configuration panel coming soon</p>
                <p className="text-stealth-light text-sm mt-2">
                  Advanced settings for Core OS behavior, agent parameters, and system optimization
                </p>
              </div>
            </AgentricAIPanel>
          </div>
        )}
      </motion.div>
      </div>
    </>
  );
};

export default AdminPanel;