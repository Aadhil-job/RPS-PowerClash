import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Choice, PowerUpType, GameState, GameResult } from '../types/game';
import { handEmojis, determineWinner, getComputerChoice, applyPowerUp } from '../utils/gameLogic';
import Scoreboard from './Scoreboard';
import PowerUpButtons from './PowerUpButtons';
import GameLog from './GameLog';
import ChoiceButton from './ChoiceButton';

interface GameBoardProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onGameEnd: (winner: 'player' | 'computer') => void;
}

export default function GameBoard({ gameState, onUpdateGameState, onGameEnd }: GameBoardProps) {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wildCardActive, setWildCardActive] = useState(false);

  const handleChoiceSelection = async (choice: Choice) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setPlayerChoice(choice);
    
    // Generate computer choice
    const compChoice = getComputerChoice(gameState.difficulty!, gameState.computerMemory);
    setComputerChoice(compChoice);
    
    // If Wild Card is active, allow reroll
    if (gameState.activePowerUp === 'wildCard') {
      setWildCardActive(true);
      setIsProcessing(false);
      return;
    }
    
    await processRound(choice, compChoice);
  };

  const handleWildCardReroll = async (newChoice: Choice) => {
    setPlayerChoice(newChoice);
    setWildCardActive(false);
    await processRound(newChoice, computerChoice!);
  };

  const processRound = async (pChoice: Choice, cChoice: Choice) => {
    setIsProcessing(true);
    setShowResult(true);
    
    // Determine initial winner
    let winner = determineWinner(pChoice, cChoice);
    
    // Apply power-up effects
    const pointsAwarded = applyPowerUp(winner, gameState.activePowerUp);
    
    // Update winner based on power-up effects
    if (gameState.activePowerUp === 'shield' && winner === 'computer') {
      winner = 'draw';
    } else if (gameState.activePowerUp === 'reversal' && winner === 'computer') {
      winner = 'player';
    }
    
    const result: GameResult = {
      winner,
      playerChoice: pChoice,
      computerChoice: cChoice,
      pointsAwarded,
      powerUpUsed: gameState.activePowerUp || undefined
    };
    
    // Update scores
    const newPlayerScore = gameState.playerScore + pointsAwarded.player;
    const newComputerScore = gameState.computerScore + pointsAwarded.computer;
    
    // Update power-ups cooldowns and usage
    const updatedPowerUps = gameState.powerUps.map(powerUp => {
      if (powerUp.currentCooldown > 0) {
        return { ...powerUp, currentCooldown: powerUp.currentCooldown - 1 };
      }
      if (gameState.activePowerUp === powerUp.type) {
        return {
          ...powerUp,
          currentCooldown: powerUp.cooldown,
          usesLeft: powerUp.maxUses ? powerUp.usesLeft - 1 : powerUp.usesLeft
        };
      }
      return powerUp;
    });
    
    // Create log entry
    const logEntry = createLogEntry(result);
    
    // Update game state
    onUpdateGameState({
      playerScore: newPlayerScore,
      computerScore: newComputerScore,
      currentRound: gameState.currentRound + 1,
      powerUps: updatedPowerUps,
      activePowerUp: null,
      gameLog: [...gameState.gameLog, logEntry],
      lastResult: result,
      computerMemory: [...gameState.computerMemory, pChoice].slice(-10) // Keep last 10 moves
    });
    
    // Check for game end
    setTimeout(() => {
      if (newPlayerScore >= 5) {
        onGameEnd('player');
      } else if (newComputerScore >= 5) {
        onGameEnd('computer');
      } else {
        setPlayerChoice(null);
        setComputerChoice(null);
        setShowResult(false);
        setIsProcessing(false);
      }
    }, 3000);
  };

  const createLogEntry = (result: GameResult): string => {
    const { playerChoice, computerChoice, winner, pointsAwarded, powerUpUsed } = result;
    let entry = `R${gameState.currentRound}: ${handEmojis[playerChoice]} vs ${handEmojis[computerChoice]}`;
    
    if (powerUpUsed) {
      entry += ` [${powerUpUsed.toUpperCase()}]`;
    }
    
    if (winner === 'draw') {
      entry += ' - DRAW';
    } else if (winner === 'player') {
      entry += ` - WIN! +${pointsAwarded.player}pts`;
    } else {
      entry += ` - LOSE +${pointsAwarded.computer}pts`;
    }
    
    return entry;
  };

  const handleActivatePowerUp = (type: PowerUpType) => {
    onUpdateGameState({ activePowerUp: type });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-mint-300 to-cyan-400 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <h1 
            className="text-xl md:text-2xl lg:text-4xl text-gray-800 mb-2 break-words"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            POWER CLASH
          </h1>
        </motion.div>
        
        {/* Scoreboard */}
        <Scoreboard
          playerScore={gameState.playerScore}
          computerScore={gameState.computerScore}
          currentRound={gameState.currentRound}
          difficulty={gameState.difficulty!}
        />
        
        {/* Game Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column - Choices and Battle */}
          <div className="space-y-4">
            {/* Active Power-up Display */}
            {gameState.activePowerUp && (
              <motion.div
                className="bg-yellow-400 text-gray-800 p-2 md:p-3 rounded-lg border-2 border-gray-800 text-center max-w-full overflow-hidden"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                <div className="text-[10px] md:text-xs break-words">POWER-UP ACTIVE:</div>
                <div className="text-xs md:text-sm font-bold truncate">
                  {gameState.powerUps.find(p => p.type === gameState.activePowerUp)?.icon}{' '}
                  {gameState.activePowerUp!.toUpperCase()}
                </div>
              </motion.div>
            )}
            
            {/* Battle Area */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 md:p-6 border-2 border-gray-800 max-w-full overflow-hidden">
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key="choices"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {wildCardActive ? (
                      <div className="text-center">
                        <div className="mb-4" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                          <div className="text-xs md:text-sm text-gray-700 mb-2 break-words">WILD CARD ACTIVE!</div>
                          <div className="text-[10px] md:text-xs text-gray-600 mb-4 break-words">
                            Computer chose: {handEmojis[computerChoice!]}
                            <br />Choose your move:
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                          {(['rock', 'paper', 'scissors'] as Choice[]).map(choice => (
                            <ChoiceButton
                              key={choice}
                              choice={choice}
                              onClick={handleWildCardReroll}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div 
                          className="text-xs md:text-sm mb-4 text-gray-700 break-words"
                          style={{ fontFamily: '"Press Start 2P", monospace' }}
                        >
                          CHOOSE YOUR WEAPON
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                          {(['rock', 'paper', 'scissors'] as Choice[]).map(choice => (
                            <ChoiceButton
                              key={choice}
                              choice={choice}
                              onClick={handleChoiceSelection}
                              disabled={isProcessing}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-center"
                  >
                    <div 
                      className="text-xs md:text-sm mb-4 text-gray-700 break-words"
                      style={{ fontFamily: '"Press Start 2P", monospace' }}
                    >
                      BATTLE RESULT
                    </div>
                    <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-4">
                      <div className="text-center">
                        <div className="text-[10px] md:text-xs text-gray-600 mb-2">YOU</div>
                        <motion.div 
                          className="text-2xl md:text-4xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.3, repeat: 3 }}
                        >
                          {playerChoice && handEmojis[playerChoice]}
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className="text-xl md:text-2xl"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        ⚔️
                      </motion.div>
                      
                      <div className="text-center">
                        <div className="text-[10px] md:text-xs text-gray-600 mb-2">COMPUTER</div>
                        <motion.div 
                          className="text-2xl md:text-4xl"
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.3, repeat: 3 }}
                        >
                          {computerChoice && handEmojis[computerChoice]}
                        </motion.div>
                      </div>
                    </div>
                    
                    <motion.div
                      className={`text-lg font-bold ${
                        gameState.lastResult?.winner === 'player' 
                          ? 'text-green-600' 
                          : gameState.lastResult?.winner === 'computer' 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}
                      style={{ fontFamily: '"Press Start 2P", monospace' }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                    >
                      {gameState.lastResult?.winner === 'player' && 'YOU WIN!'}
                      {gameState.lastResult?.winner === 'computer' && 'YOU LOSE!'}
                      {gameState.lastResult?.winner === 'draw' && 'DRAW!'}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right Column - Power-ups and Log */}
          <div className="space-y-4">
            {/* Power-ups */}
            <div>
              <div 
                className="text-xs md:text-sm mb-3 text-gray-800 break-words"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                POWER-UPS
              </div>
              <PowerUpButtons
                powerUps={gameState.powerUps}
                activePowerUp={gameState.activePowerUp}
                onActivatePowerUp={handleActivatePowerUp}
              />
            </div>
            
            {/* Game Log */}
            <GameLog logs={gameState.gameLog} />
          </div>
        </div>
      </div>
    </div>
  );
}