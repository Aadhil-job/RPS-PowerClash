import React, { useState } from 'react';
import { GameState, Difficulty } from './types/game';
import { createInitialPowerUps } from './utils/gameLogic';
import DifficultySelector from './components/DifficultySelector';
import GameBoard from './components/GameBoard';
import GameResult from './components/GameResult';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'difficulty',
    difficulty: null,
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    powerUps: createInitialPowerUps(),
    activePowerUp: null,
    gameLog: [],
    lastResult: null,
    computerMemory: []
  });

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      difficulty,
      gameLog: [`Game started in ${difficulty.toUpperCase()} mode!`]
    }));
  };

  const handleUpdateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const handleGameEnd = (winner: 'player' | 'computer') => {
    setGameState(prev => ({ 
      ...prev, 
      phase: 'finished',
      gameLog: [...prev.gameLog, `Game Over! ${winner === 'player' ? 'You' : 'Computer'} wins!`]
    }));
  };

  const handleRestart = () => {
    setGameState({
      phase: 'difficulty',
      difficulty: null,
      playerScore: 0,
      computerScore: 0,
      currentRound: 1,
      powerUps: createInitialPowerUps(),
      activePowerUp: null,
      gameLog: [],
      lastResult: null,
      computerMemory: []
    });
  };

  return (
    <div className="min-h-screen">
      {gameState.phase === 'difficulty' && (
        <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />
      )}
      
      {gameState.phase === 'playing' && (
        <GameBoard
          gameState={gameState}
          onUpdateGameState={handleUpdateGameState}
          onGameEnd={handleGameEnd}
        />
      )}
      
      {gameState.phase === 'finished' && (
        <>
          <GameBoard
            gameState={gameState}
            onUpdateGameState={handleUpdateGameState}
            onGameEnd={handleGameEnd}
          />
          <GameResult
            winner={gameState.playerScore >= 5 ? 'player' : 'computer'}
            playerScore={gameState.playerScore}
            computerScore={gameState.computerScore}
            onRestart={handleRestart}
          />
        </>
      )}
    </div>
  );
}

export default App;