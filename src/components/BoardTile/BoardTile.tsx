import { Group, Rect } from "@shopify/react-native-skia";

import useBoardTile from "./hooks/useBoardTile";
import TileLetter from "./TileLetter";
import TilePoints from "./TilePoints";

export enum EBoardFieldState {
  suggestion = "suggestion",
  done = "done",
  sketch = "sketch",
  changed = "changed",
  newMove = "newMove",
}

const TILE_COLORS: Record<string, string> = {
  basic: "#f8e8c7",
  [EBoardFieldState.suggestion]: "#f8e8c7",
  [EBoardFieldState.done]: "#f8e8c7",
  [EBoardFieldState.sketch]: "#f8e8c7", // opacity obsługiwana osobno
  [EBoardFieldState.changed]: "#777777",
  [EBoardFieldState.newMove]: "#1ae825",
};

export const LETTER_COLOR = "#015b52";

export interface BoardTileProps {
  size: number;
  /** Pozycja X lewego-górnego rogu pola na canvasie */
  x: number;
  /** Pozycja Y lewego-górnego rogu pola na canvasie */
  y: number;
  letter?: string;
  transparent?: boolean;
  newMove?: boolean;
}

const BoardTile: React.FC<BoardTileProps> = ({
  size,
  x,
  y,
  letter,
  newMove = false,
}) => {
  const { isBlank, letterFont, pointFont } = useBoardTile(size, letter);

  if (!letter) {
    return (
      <Rect
        x={x + 1}
        y={y + 1}
        width={size - 2}
        height={size - 2}
        color="transparent"
      />
    );
  }

  return (
    <Group>
      <Rect
        x={x + 0.5}
        y={y + 0.5}
        width={size - 1}
        height={size - 1}
        color={
          newMove ? TILE_COLORS[EBoardFieldState.newMove] : TILE_COLORS.basic
        }
      />

      <TileLetter
        letter={letter}
        isBlank={isBlank}
        size={size}
        x={x}
        y={y}
        font={letterFont}
      />

      <TilePoints
        letter={letter}
        isBlank={isBlank}
        size={size}
        x={x}
        y={y}
        font={pointFont}
      />
    </Group>
  );
};

export default BoardTile;
