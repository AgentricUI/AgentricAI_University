import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Zap } from 'lucide-react';

const AgentStatus: React.FC = () => {
  const agents = [
    { name: 'Learning Coordinator', status: 'active', load: 85 },
    { name: 'Behavior Analyst', status: 'processing', load: 62 },
    { name: 'Content Generator', status: 'idle', load: 12 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-0 top-1/2 transform -translate-y-1/2 z-20"
    >
      <div className="bg-stealth-panel backdrop-blur-lg border border-stealth-border rounded-r-lg p-4 space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-4 h-4 text-neon-cyan" />
          <span className="text-white text-sm font-medium">AGENTS</span>
        </div>
        
        {agents.map((agent, index) => (
          <div key={agent.name} className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              agent.status === 'active' ? 'bg-neon-lime animate-pulse' :
              agent.status === 'processing' ? 'bg-neon-cyan animate-pulse' :
              'bg-stealth-light'
            }`} />
            
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white truncate">{agent.name}</div>
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-stealth-light" />
                <span className="text-xs text-stealth-light">{agent.load}%</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="border-t border-stealth-border pt-2">
          <div className="flex items-center justify-center space-x-1">
            <Zap className="w-3 h-3 text-neon-orange" />
            <span className="text-xs text-neon-orange">OPTIMAL</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentStatus;