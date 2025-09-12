/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Stealth Bomber Theme Colors
        'stealth-black': '#0a0a0a',
        'stealth-panel': '#1a1a1a',
        'stealth-panel-light': '#2a2a2a',
        'stealth-border': '#3a3a3a',
        'stealth-light': '#a0a0a0',
        
        // Neon Accent Colors
        'neon-cyan': '#00ffff',
        'neon-blue': '#0080ff',
        'neon-lime': '#00ff80',
        'neon-orange': '#ff8000',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px #00ffff40',
        'neon-blue': '0 0 20px #0080ff40',
        'neon-lime': '0 0 20px #00ff8040',
        'neon-orange': '0 0 20px #ff800040',
      },
      backgroundImage: {
        'stealth-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'panel-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ffff40' },
          '100%': { boxShadow: '0 0 20px #00ffff80' }
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'text-neon-cyan',
    'text-neon-blue', 
    'text-neon-lime',
    'text-neon-orange',
    'border-neon-cyan',
    'border-neon-blue',
    'border-neon-lime', 
    'border-neon-orange',
    'bg-neon-cyan',
    'bg-neon-blue',
    'bg-neon-lime',
    'bg-neon-orange'
  ]
};