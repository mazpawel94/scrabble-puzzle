export type LEVEL = "easy" | "medium" | "hard" | "unknown";
export interface Task {
  id?: string;
  level?: LEVEL;
  title?: string;
  description?: string;
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
  // Dodaj inne pola według potrzeb
}
export interface IBoardTile {
  x: number;
  y: number;
  letter: string;
  isNewMove?: boolean;
  isMoved?: boolean;
}

export interface ApiResponse {
  tasks: Task[];
}

export interface IBoardLayoutParams {
  x: number;
  y: number;
  width: number;
  height: number;
}
