import React from 'react';
import { motion } from 'framer-motion';
import { PowerUp, PowerUpType } from '../types/game';

interface PowerUpButtonsProps {
  powerUps: PowerUp[];
  activePowerUp: PowerUpType | null;
  onActivatePowerUp: (type: PowerUpType) => void;
}

export default function PowerUpButtons({ powerUps, activePowerUp, onActivatePowerUp }: PowerUpButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-full">
      {powerUps.map((powerUp) => {
        const isAvailable = powerUp.currentCooldown === 0 && powerUp.usesLeft > 0;
        const isActive = activePowerUp === powerUp.type;
        
        return (
          <motion.button
            key={powerUp.type}
            onClick={() => isAvailable && !isActive ? onActivatePowerUp(powerUp.type) : null}
            className={`
              relative p-2 md:p-3 rounded-lg border-2 transition-all duration-300 text-[10px] md:text-xs max-w-full overflow-hidden
              ${isActive 
                ? 'bg-yellow-400 border-yellow-600 text-gray-800 shadow-lg shadow-yellow-400/50' 
                : isAvailable 
                  ? 'bg-mint-400 hover:bg-mint-500 border-gray-800 text-gray-800 shadow-md hover:shadow-lg hover:shadow-mint-400/30' 
                  : 'bg-gray-600 border-gray-700 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
            whileHover={isAvailable ? { scale: 1.05 } : {}}
            whileTap={isAvailable ? { scale: 0.95 } : {}}
            animate={isActive ? { 
              boxShadow: ['0 0 20px rgba(255, 235, 59, 0.5)', '0 0 40px rgba(255, 235, 59, 0.8)', '0 0 20px rgba(255, 235, 59, 0.5)']
            } : {}}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            disabled={!isAvailable && !isActive}
          >
            <div className="text-sm md:text-lg mb-1">{powerUp.icon}</div>
            <div className="font-bold truncate">{powerUp.name.toUpperCase()}</div>
            <div className="text-[6px] md:text-[8px] mt-1 leading-tight break-words">{powerUp.description}</div>
            
            {powerUp.currentCooldown > 0 && (
              <motion.div 
                className="absolute top-1 right-1 bg-red-500 text-white text-[6px] md:text-[8px] px-1 py-0.5 rounded"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {powerUp.currentCooldown}
              </motion.div>
            )}
            
            {powerUp.maxUses && (
              <div className="absolute top-1 left-1 bg-blue-500 text-white text-[6px] md:text-[8px] px-1 py-0.5 rounded">
                {powerUp.usesLeft}
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}