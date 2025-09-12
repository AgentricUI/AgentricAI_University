import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Smile, 
  Award, 
  Play, 
  Pause,
  RotateCcw,
  Volume2
} from 'lucide-react';
import StealthPanel from './ui/StealthPanel';
import NeonButton from './ui/NeonButton';

const UserInterface: React.FC = () => {
  const [currentActivity, setCurrentActivity] = useState('welcome');
  const [progress, setProgress] = useState(65);

  const activities = [
    {
      id: 'colors',
      name: 'Color Recognition',
      icon: Star,
      color: 'neon-cyan',
      completed: true
    },
    {
      id: 'shapes',
      name: 'Shape Matching',
      icon: Heart,
      color: 'neon-blue',
      completed: true
    },
    {
      id: 'numbers',
      name: 'Number Game',
      icon: Smile,
      color: 'neon-lime',
      completed: false
    },
    {
      id: 'letters',
      name: 'Letter Tracing',
      icon: Award,
      color: 'neon-orange',
      completed: false
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <span className="text-neon-cyan">Welcome to</span>
          <span className="ml-3 bg-gradient-to-r from-neon-lime to-neon-blue bg-clip-text text-transparent">
            AgentricAI University
          </span>
          <span className="ml-3">🎓</span>
        </h1>
        <p className="text-stealth-light text-xl">
          Where AI agents help you learn and grow
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <StealthPanel className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium">Today's Progress</span>
            <span className="text-neon-cyan font-bold text-xl">{progress}%</span>
          </div>
          <div className="w-full bg-stealth-panel rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-lime"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-stealth-light">
            <span>Keep going!</span>
            <span>3 of 4 activities</span>
          </div>
        </StealthPanel>
      </motion.div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <StealthPanel 
              className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                activity.completed 
                  ? 'border-2 border-neon-lime bg-gradient-to-br from-stealth-panel to-stealth-panel-light' 
                  : 'border-2 border-transparent hover:border-stealth-light'
              }`}
              onClick={() => setCurrentActivity(activity.id)}
            >
              <div className="text-center">
                <activity.icon 
                  className={`w-16 h-16 text-${activity.color} mx-auto mb-4`}
                />
                <h3 className="text-xl font-bold text-white mb-2">
                  {activity.name}
                </h3>
                {activity.completed && (
                  <div className="flex items-center justify-center text-neon-lime mb-4">
                    <Award className="w-5 h-5 mr-2" />
                    <span className="font-medium">Completed!</span>
                  </div>
                )}
                <NeonButton
                  variant={activity.completed ? "secondary" : "primary"}
                  className="w-full"
                >
                  {activity.completed ? "Play Again" : "Start Activity"}
                </NeonButton>
              </div>
            </StealthPanel>
          </motion.div>
        ))}
      </div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <StealthPanel className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-3 bg-stealth-panel-light rounded-full hover:bg-neon-cyan hover:bg-opacity-20 transition-colors">
                <Play className="w-6 h-6 text-neon-cyan" />
              </button>
              <button className="p-3 bg-stealth-panel-light rounded-full hover:bg-neon-orange hover:bg-opacity-20 transition-colors">
                <Pause className="w-6 h-6 text-neon-orange" />
              </button>
              <button className="p-3 bg-stealth-panel-light rounded-full hover:bg-neon-lime hover:bg-opacity-20 transition-colors">
                <RotateCcw className="w-6 h-6 text-neon-lime" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-stealth-light">Sound</span>
              <button className="p-3 bg-stealth-panel-light rounded-full hover:bg-neon-blue hover:bg-opacity-20 transition-colors">
                <Volume2 className="w-6 h-6 text-neon-blue" />
              </button>
            </div>
          </div>
        </StealthPanel>
      </motion.div>

      {/* Encouraging Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8"
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-cyan to-neon-lime bg-opacity-20 px-6 py-3 rounded-full">
          <Star className="w-5 h-5 text-neon-cyan" />
          <span className="text-white font-medium">You're doing amazing! Keep learning! ⭐</span>
          <Star className="w-5 h-5 text-neon-lime" />
        </div>
      </motion.div>
    </div>
  );
};

export default UserInterface;