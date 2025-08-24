export type Choice = 'rock' | 'paper' | 'scissors';
export type Difficulty = 'easy' | 'hard';
export type GamePhase = 'difficulty' | 'playing' | 'finished';
export type PowerUpType = 'shield' | 'doubleDamage' | 'reversal' | 'wildCard';

export interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  cooldown: number;
  maxUses?: number;
  currentCooldown: number;
  usesLeft: number;
}

export interface GameResult {
  winner: 'player' | 'computer' | 'draw';
  playerChoice: Choice;
  computerChoice: Choice;
  pointsAwarded: { player: number; computer: number };
  powerUpUsed?: PowerUpType;
}

export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty | null;
  playerScore: number;
  computerScore: number;
  currentRound: number;
  powerUps: PowerUp[];
  activePowerUp: PowerUpType | null;
  gameLog: string[];
  lastResult: GameResult | null;
  computerMemory: Choice[];
}