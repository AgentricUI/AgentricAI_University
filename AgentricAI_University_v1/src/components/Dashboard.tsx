import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Cpu, Users, Activity, Terminal, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgentricAIPanel from './ui/AgentricAIPanel';
import NeonButton from './ui/NeonButton';
import AgentricAIStatusBar from './ui/AgentricAIStatusBar';
import AgentricAINetworkVisualization from './ui/AgentricAINetworkVisualization';
import AgentricAITerminal from './ui/AgentricAITerminal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const platformStats = [
    { label: 'Active Agents', value: '3', icon: Cpu, color: 'neon-cyan' },
    { label: 'User Sessions', value: '12', icon: Users, color: 'neon-blue' },
    { label: 'Tasks Completed', value: '847', icon: Activity, color: 'neon-lime' },
    { label: 'System Status', value: 'OPTIMAL', icon: Shield, color: 'neon-orange' }
  ];

  return (
    <>
      <AgentricAIStatusBar />
      <div className="container mx-auto px-6 py-8 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
          <span className="bg-gradient-to-r from-neon-cyan to-neon-lime bg-clip-text text-transparent">
            AGENTRICAI CORE OS
          </span>
          <span className="ml-3 text-neon-blue">UNIVERSITY PLATFORM</span>
        </h1>
        <p className="text-stealth-light text-lg">
          Revolutionary Agent Operating System with Self-Evolving University Platform
        </p>
      </motion.div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {platformStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <AgentricAIPanel className="p-6 text-center" variant="primary" glowEffect>
              <stat.icon className={`w-8 h-8 text-${stat.color} mx-auto mb-3`} />
              <div className={`text-2xl font-bold text-${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-stealth-light text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </AgentricAIPanel>
          </motion.div>
        ))}
      </div>

      {/* Access Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AgentricAIPanel className="p-8 h-full" variant="primary" rivetPattern="edges">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <span className="text-neon-cyan">AgentricAI Core OS</span>
                  <span className="ml-2">Command Center</span>
                </h3>
                <p className="text-stealth-light">
                  Access the revolutionary agent operating system and ecosystem management.
                </p>
              </div>
              <Shield className="w-8 h-8 text-neon-orange" />
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-stealth-light">
                <div className="w-2 h-2 bg-neon-cyan rounded-full mr-3" />
                Agent OS Process Management
              </div>
              <div className="flex items-center text-stealth-light">
                <div className="w-2 h-2 bg-neon-blue rounded-full mr-3" />
                Hot-Swappable Agent Architecture
              </div>
              <div className="flex items-center text-stealth-light">
                <div className="w-2 h-2 bg-neon-lime rounded-full mr-3" />
                Intelligent Resource Allocation
              </div>
            </div>
            
            <NeonButton
              onClick={() => navigate('/admin')}
              className="w-full"
              variant="primary"
            >
              Enter Admin Panel
              <ArrowRight className="w-4 h-4 ml-2" />
            </NeonButton>
          </AgentricAIPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AgentricAIPanel className="p-8 h-full" variant="accent" rivetPattern="edges">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <span className="text-neon-lime">AgentricAI University</span>
                  <span className="ml-2">Learning Hub</span>
                </h3>
                <p className="text-stealth-light">
                  Specialized learning platform running on AgentricAI Core OS.
                </p>
              </div>
              <Users className="w-8 h-8 text-neon-lime" />
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-stealth-light">
                <div className="w-2 h-2 bg-neon-cyan rounded-full mr-3" />
                Agent-Driven Adaptive Learning
              </div>
              <div className="flex items-center text-stealth-light">
                <div className="w-2 h-2 bg-neon-blue rounded-full mr-3" />
                Neurodiverse-Optimized Agent Behavior
              </div>
              <div className="flex items-center text-stealth-light">
                <div className="w-2 h-2 bg-neon-lime rounded-full mr-3" />
                Real-Time Agent Analytics
              </div>
            </div>
            
            <NeonButton
              onClick={() => navigate('/user')}
              className="w-full"
              variant="secondary"
            >
              Enter University Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </NeonButton>
          </AgentricAIPanel>
        </motion.div>
      </div>

      {/* AgentricAI Core OS Network Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12"
      >
        <AgentricAIPanel className="p-6" variant="secondary" rivetPattern="full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Network className="w-6 h-6 text-neon-blue mr-2" />
              <span className="bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                AgentricAI Core OS
              </span>
              <span className="ml-2 text-neon-lime">Agent Network</span>
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-lime rounded-full animate-pulse" />
              <span className="text-neon-lime text-sm font-medium">OPERATIONAL</span>
            </div>
          </div>
          <AgentricAINetworkVisualization />
        </AgentricAIPanel>
      </motion.div>

      {/* AgentricAI Terminal */}
      <AgentricAITerminal />
    </div>
    </>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;