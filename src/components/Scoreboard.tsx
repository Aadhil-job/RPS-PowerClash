import React from 'react';
import { motion } from 'framer-motion';

interface ScoreboardProps {
  playerScore: number;
  computerScore: number;
  currentRound: number;
  difficulty: string;
}

export default function Scoreboard({ playerScore, computerScore, currentRound, difficulty }: ScoreboardProps) {
  return (
    <motion.div 
      className="bg-gray-800 text-white p-3 md:p-4 rounded-lg border-2 border-yellow-400 shadow-lg max-w-full overflow-hidden"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      <div className="flex justify-between items-center mb-2 gap-2">
        <div className="text-center">
          <div className="text-[10px] md:text-xs text-yellow-400 mb-1 truncate">PLAYER</div>
          <motion.div 
            className="text-lg md:text-2xl text-mint-400"
            key={playerScore}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {playerScore}
          </motion.div>
        </div>
        
        <div className="text-center">
          <div className="text-[10px] md:text-xs text-yellow-400 mb-1">VS</div>
          <div className="text-xs md:text-sm">R{currentRound}</div>
        </div>
        
        <div className="text-center">
          <div className="text-[10px] md:text-xs text-yellow-400 mb-1 truncate">COMPUTER</div>
          <motion.div 
            className="text-lg md:text-2xl text-red-400"
            key={computerScore}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {computerScore}
          </motion.div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-[8px] md:text-xs text-yellow-400 break-words">
          {difficulty.toUpperCase()} MODE • FIRST TO 5 WINS
        </div>
      </div>
    </motion.div>
  );
}