export interface Task {
  id: string;
  level?: "easy" | "medium" | "hard";
  title: string;
  description: string;
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
}

export interface ApiResponse {
  tasks: Task[];
}
