import React from 'react';
import { motion } from 'framer-motion';
import { Choice } from '../types/game';
import { choiceEmojis, handEmojis } from '../utils/gameLogic';

interface ChoiceButtonProps {
  choice: Choice;
  onClick: (choice: Choice) => void;
  disabled?: boolean;
}

export default function ChoiceButton({ choice, onClick, disabled }: ChoiceButtonProps) {
  const choiceName = choice.charAt(0).toUpperCase() + choice.slice(1);
  
  return (
    <motion.button
      onClick={() => onClick(choice)}
      disabled={disabled}
      className={`
        p-3 md:p-6 rounded-lg border-2 transition-all duration-200 max-w-full overflow-hidden
        ${disabled 
          ? 'bg-gray-400 border-gray-500 cursor-not-allowed opacity-50' 
          : 'bg-white hover:bg-gray-50 border-gray-800 hover:shadow-lg hover:scale-105'
        }
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      <motion.div 
        className="text-2xl md:text-4xl mb-2"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        {handEmojis[choice]}
      </motion.div>
      <div className="text-[10px] md:text-xs text-gray-700 truncate">{choiceName.toUpperCase()}</div>
      <div className="text-sm md:text-lg mt-1">{choiceEmojis[choice]}</div>
    </motion.button>
  );
}