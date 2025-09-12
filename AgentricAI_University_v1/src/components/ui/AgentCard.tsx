import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  Clock, 
  HardDrive, 
  Play, 
  Pause, 
  Settings,
  CheckCircle,
  AlertCircle,
  Minus
} from 'lucide-react';
import StealthPanel from './StealthPanel';
import NeonButton from './NeonButton';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'processing' | 'idle';
  tasks: number;
  memory: string;
  uptime: string;
  type: string;
}

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getStatusIcon = () => {
    switch (agent.status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-neon-lime" />;
      case 'processing':
        return <AlertCircle className="w-5 h-5 text-neon-cyan animate-pulse" />;
      default:
        return <Minus className="w-5 h-5 text-stealth-light" />;
    }
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'active':
        return 'border-neon-lime';
      case 'processing':
        return 'border-neon-cyan';
      default:
        return 'border-stealth-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <StealthPanel className={`p-6 border-2 ${getStatusColor()}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
            <span className="text-sm text-stealth-light uppercase tracking-wider">
              {agent.type}
            </span>
          </div>
          {getStatusIcon()}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-neon-blue" />
              <span className="text-stealth-light text-sm">Tasks</span>
            </div>
            <span className="text-white font-medium">{agent.tasks}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-neon-orange" />
              <span className="text-stealth-light text-sm">Memory</span>
            </div>
            <span className="text-white font-medium">{agent.memory}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-neon-lime" />
              <span className="text-stealth-light text-sm">Uptime</span>
            </div>
            <span className="text-white font-medium">{agent.uptime}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <NeonButton
            className="flex-1 py-2 px-4 text-sm"
            variant="primary"
          >
            {agent.status === 'active' ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Start
              </>
            )}
          </NeonButton>
          
          <button className="p-2 border-2 border-stealth-border text-stealth-light hover:border-neon-cyan hover:text-neon-cyan transition-colors rounded-lg">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </StealthPanel>
    </motion.div>
  );
};

export default AgentCard;