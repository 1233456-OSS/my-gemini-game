export type TetrominoShape = number[][];

export enum TetrominoType {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

export interface WordEntry {
  english: string;
  chinese: string;
}

export interface WordBook {
  id: string;
  name: string;
  words: WordEntry[];
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface HighScore {
  score: number;
  date: string;
  book: string;
}

export type GridCell = {
  filled: boolean;
  color: string;
  isGarbage?: boolean;
  isPermanent?: boolean; // New flag for blocks that cannot be cleared
};

export type Grid = GridCell[][];

export interface ActivePiece {
  x: number;
  y: number;
  type: TetrominoType;
  rotation: number; // 0, 1, 2, 3
  word: WordEntry;
  options: WordEntry[]; // The 4 options for the current drop (1 correct, 3 distractors)
}
