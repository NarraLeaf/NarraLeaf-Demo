import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Navigation item interface
 */
interface NavItem {
  id: string;
  label: string;
  icon?: string; // Optional icon for future extensibility
}

/**
 * HomePanel component props
 */
interface HomePanelProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
}

/**
 * Default navigation items
 */
const defaultNavItems: NavItem[] = [
  { id: 'start', label: 'START' },
  { id: 'load', label: 'LOAD' },
  { id: 'config', label: 'CONFIG' },
  { id: 'extra', label: 'EXTRA' },
  { id: 'exit', label: 'EXIT' }
];

/**
 * HomePanel - Visual Novel Style Left Navigation Panel
 * 
 * Features:
 * - Right-skewed parallelogram buttons with reverse-skewed text
 * - Smooth highlight animation using Framer Motion
 * - Hover effects and active state management
 * - Modern dark theme with white text
 * - Fully responsive and customizable
 */
const HomePanel: React.FC<HomePanelProps> = ({ 
  items = defaultNavItems, 
  className = '',
  onItemClick 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Handle button click
   */
  const handleItemClick = (item: NavItem, index: number) => {
    setActiveIndex(index);
    onItemClick?.(item, index);
  };

  /**
   * Calculate highlight position based on active index
   */
  const highlightTop = activeIndex * 60; // 60px per button height

  return (
    <div className={`fixed left-0 top-0 w-48 h-screen bg-transparent z-50 ${className}`}>
      {/* Main navigation container */}
      <div className="relative h-full flex flex-col justify-center items-start pl-8">
        
        {/* Animated highlight background */}
        <motion.div
          className="absolute left-4 w-44 h-16 bg-black/30 transform skew-x-12 rounded-sm"
          animate={{ top: highlightTop }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
          }}
        />

        {/* Navigation buttons */}
        <div className="relative z-10 space-y-0">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              className={`
                relative w-40 h-15 mb-0 
                transform skew-x-12 
                bg-black/80 border border-gray-600/50
                transition-all duration-200 ease-in-out
                hover:bg-black/90
                focus:outline-none focus:ring-2 focus:ring-white/20
                ${activeIndex === index ? 'bg-black/90' : ''}
              `}
              onClick={() => handleItemClick(item, index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                height: '60px', // Fixed height for consistent spacing
              }}
            >
              {/* Button text with reverse skew */}
              <span 
                className={`
                  block transform -skew-x-12 
                  font-bold text-lg tracking-wider
                  transition-colors duration-200
                  ${activeIndex === index 
                    ? 'text-white' 
                    : 'text-white/90 hover:text-gray-300'
                  }
                `}
              >
                {item.label}
              </span>

              {/* Subtle glow effect for active button */}
              {activeIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-white/5 transform skew-x-12 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent transform -translate-y-1/2" />
        <div className="absolute top-1/2 left-2 w-0.5 h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent transform -translate-y-1/2" />
      </div>
    </div>
  );
};

export default HomePanel;
