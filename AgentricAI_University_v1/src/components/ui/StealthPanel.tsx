import React from 'react';
import { motion } from 'framer-motion';

interface StealthPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const StealthPanel: React.FC<StealthPanelProps> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      className={`
        bg-stealth-panel 
        border border-stealth-border 
        rounded-lg 
        backdrop-blur-lg
        relative
        overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Rivet Details */}
      <div className="absolute top-2 left-2 w-1 h-1 bg-stealth-light rounded-full opacity-30" />
      <div className="absolute top-2 right-2 w-1 h-1 bg-stealth-light rounded-full opacity-30" />
      <div className="absolute bottom-2 left-2 w-1 h-1 bg-stealth-light rounded-full opacity-30" />
      <div className="absolute bottom-2 right-2 w-1 h-1 bg-stealth-light rounded-full opacity-30" />
      
      {/* Panel Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default StealthPanel;