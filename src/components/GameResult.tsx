import React from 'react';
import { motion } from 'framer-motion';

interface GameResultProps {
  winner: 'player' | 'computer';
  playerScore: number;
  computerScore: number;
  onRestart: () => void;
}

export default function GameResult({ winner, playerScore, computerScore, onRestart }: GameResultProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        className="bg-white rounded-lg p-6 md:p-8 text-center border-4 border-gray-800 max-w-md w-full mx-4 overflow-hidden"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className={`text-2xl md:text-4xl mb-4 ${winner === 'player' ? 'text-green-500' : 'text-red-500'}`}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          {winner === 'player' ? '🏆' : '💀'}
        </motion.div>
        
        <h2 className={`text-lg md:text-xl mb-4 break-words ${winner === 'player' ? 'text-green-600' : 'text-red-600'}`}>
          {winner === 'player' ? 'VICTORY!' : 'DEFEAT!'}
        </h2>
        
        <div className="text-xs md:text-sm mb-6 text-gray-600 break-words">
          <div className="mb-2">Final Score:</div>
          <div className="mt-2">
            <span className="text-mint-600">You: {playerScore}</span>
            <span className="mx-4">-</span>
            <span className="text-red-600">Computer: {computerScore}</span>
          </div>
        </div>
        
        <motion.button
          onClick={onRestart}
          className="bg-mint-400 hover:bg-mint-500 text-gray-800 py-3 px-4 md:px-6 rounded-lg border-2 border-gray-800 transition-colors text-xs md:text-sm overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          PLAY AGAIN
        </motion.button>
      </motion.div>
    </motion.div>
  );
}