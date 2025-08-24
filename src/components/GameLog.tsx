import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GameLogProps {
  logs: string[];
}

export default function GameLog({ logs }: GameLogProps) {
  const logRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);
  
  return (
    <motion.div 
      className="bg-gray-900 text-green-400 p-2 md:p-4 rounded-lg border-2 border-green-500 h-32 md:h-40 max-w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      <div className="text-[10px] md:text-xs text-green-300 mb-2 border-b border-green-500 pb-1 truncate">
        === GAME LOG ===
      </div>
      <div 
        ref={logRef}
        className="text-[8px] md:text-[10px] leading-relaxed overflow-y-auto h-20 md:h-24 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-green-500 break-words"
      >
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-1 break-words overflow-hidden"
          >
            &gt; {log}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}