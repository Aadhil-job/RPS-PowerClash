import { Choice, PowerUp, GameResult, PowerUpType } from '../types/game';

export const choices: Choice[] = ['rock', 'paper', 'scissors'];

export const choiceEmojis = {
  rock: '🪨',
  paper: '📜',
  scissors: '✂️'
};

export const handEmojis = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️'
};

export function determineWinner(playerChoice: Choice, computerChoice: Choice): 'player' | 'computer' | 'draw' {
  if (playerChoice === computerChoice) return 'draw';
  
  const winConditions = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };
  
  return winConditions[playerChoice] === computerChoice ? 'player' : 'computer';
}

export function getComputerChoice(difficulty: string, playerHistory: Choice[]): Choice {
  if (difficulty === 'easy') {
    return choices[Math.floor(Math.random() * 3)];
  }
  
  // Hard mode: Try to predict player's next move based on patterns
  if (playerHistory.length < 2) {
    return choices[Math.floor(Math.random() * 3)];
  }
  
  // Look for patterns in last few moves
  const recentMoves = playerHistory.slice(-3);
  const moveFrequency: Record<Choice, number> = { rock: 0, paper: 0, scissors: 0 };
  
  recentMoves.forEach(move => moveFrequency[move]++);
  
  // Predict most frequent move and counter it
  const predictedMove = Object.entries(moveFrequency)
    .reduce((a, b) => moveFrequency[a[0] as Choice] > moveFrequency[b[0] as Choice] ? a : b)[0] as Choice;
  
  const counters = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock'
  };
  
  // Add some randomness (70% smart, 30% random)
  return Math.random() < 0.7 ? counters[predictedMove] : choices[Math.floor(Math.random() * 3)];
}

export function createInitialPowerUps(): PowerUp[] {
  return [
    {
      type: 'shield',
      name: 'Shield',
      description: 'Turn a loss into a draw',
      icon: '🛡️',
      cooldown: 3,
      currentCooldown: 0,
      usesLeft: Infinity
    },
    {
      type: 'doubleDamage',
      name: 'Double Damage',
      description: 'Win grants +2 points',
      icon: '💥',
      cooldown: 0,
      maxUses: 1,
      currentCooldown: 0,
      usesLeft: 1
    },
    {
      type: 'reversal',
      name: 'Reversal',
      description: 'Turn a loss into a win',
      icon: '🔄',
      cooldown: 5,
      currentCooldown: 0,
      usesLeft: Infinity
    },
    {
      type: 'wildCard',
      name: 'Wild Card',
      description: 'Reroll after seeing opponent move',
      icon: '🎲',
      cooldown: 5,
      currentCooldown: 0,
      usesLeft: Infinity
    }
  ];
}

export function applyPowerUp(
  result: 'player' | 'computer' | 'draw',
  powerUpType: PowerUpType | null
): GameResult['pointsAwarded'] {
  let playerPoints = 0;
  let computerPoints = 0;
  
  if (result === 'player') {
    playerPoints = powerUpType === 'doubleDamage' ? 2 : 1;
  } else if (result === 'computer') {
    if (powerUpType === 'shield') {
      // Shield turns loss into draw
      playerPoints = 0;
      computerPoints = 0;
    } else if (powerUpType === 'reversal') {
      // Reversal turns loss into win
      playerPoints = 1;
      computerPoints = 0;
    } else {
      computerPoints = 1;
    }
  }
  
  return { player: playerPoints, computer: computerPoints };
}