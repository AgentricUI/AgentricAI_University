import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:shadow-neon-blue';
      case 'danger':
        return 'border-neon-orange text-neon-orange hover:bg-neon-orange hover:shadow-neon-orange';
      default:
        return 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:shadow-neon-cyan';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        px-6 py-3 
        border-2 
        rounded-lg 
        font-medium 
        transition-all 
        duration-300 
        flex 
        items-center 
        justify-center
        backdrop-blur-sm
        ${getVariantClasses()}
        hover:text-stealth-black
        hover:shadow-lg
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;