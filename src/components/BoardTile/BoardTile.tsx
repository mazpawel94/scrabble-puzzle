import { Group, Rect } from "@shopify/react-native-skia";

import { EBoardTileState } from "@/types";
import useBoardTile from "./hooks/useBoardTile";
import TileLetter from "./TileLetter";
import TilePoints from "./TilePoints";

const TILE_COLORS: Record<string, string> = {
  [EBoardTileState.initial]: "#f8e8c7",
  [EBoardTileState.correct]: "#1ae825",
  [EBoardTileState.newMove]: "#32f0d6",
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
  state: EBoardTileState;
}

const BoardTile: React.FC<BoardTileProps> = ({ size, x, y, letter, state }) => {
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
        color={TILE_COLORS[state] || "#f8e8c7"}
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
