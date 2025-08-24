import React from 'react';
import { motion } from 'framer-motion';
import { Difficulty } from '../types/game';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ onSelectDifficulty }: DifficultySelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-mint-300 to-cyan-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-2xl border-4 border-gray-800 max-w-md w-full mx-4 overflow-hidden"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <motion.h1 
          className="text-xl md:text-2xl lg:text-3xl text-center mb-2 text-gray-800 break-words"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          POWER CLASH
        </motion.h1>
        <motion.p 
          className="text-[10px] md:text-xs text-center mb-6 md:mb-8 text-gray-600 break-words"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Rock · Paper · Scissors
        </motion.p>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => onSelectDifficulty('easy')}
            className="w-full bg-mint-400 hover:bg-mint-500 text-gray-800 py-3 md:py-4 px-4 md:px-6 rounded-lg border-2 border-gray-800 transition-all duration-200 text-xs md:text-sm overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🌟 EASY MODE 🌟
            <div className="text-[10px] md:text-xs mt-1 opacity-80 break-words">Random computer moves</div>
          </motion.button>
          
          <motion.button
            onClick={() => onSelectDifficulty('hard')}
            className="w-full bg-red-400 hover:bg-red-500 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg border-2 border-gray-800 transition-all duration-200 text-xs md:text-sm overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔥 HARD MODE 🔥
            <div className="text-[10px] md:text-xs mt-1 opacity-80 break-words">Smart AI prediction</div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}