export type LEVEL = "easy" | "medium" | "hard" | "unknown" | "resume";
export interface Task {
  id: string;
  level?: number;
  title?: string;
  description?: string;
  isPublic?: boolean | string;
  words: {
    coordinates: string;
    word: string;
  }[];
  letters: string;
  solution: {
    word: string;
    coordinates: string;
    evaluate: number;
  };
  tags?: string[];
  createdAt: string;
}
export interface IBoardTile {
  x: number;
  y: number;
  letter: string;
  isNewMove?: boolean;
  isMoved?: boolean;
  isLocked?: boolean;
}

export interface IBoardLayoutParams {
  x: number;
  y: number;
  width: number;
  height: number;
}
