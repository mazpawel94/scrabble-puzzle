import React from "react";
import { View } from "react-native";

import { IBoardTile } from "@/types";
import ScrabbleBoard from "./ScrabbleBoard";

interface ScrabbleBoardWithCoordsProps {
  fieldSize: number;
  onFieldPress?: (row: number, col: number) => void;
  boardTiles: IBoardTile[];
}

const ScrabbleBoardWithCoords: React.FC<ScrabbleBoardWithCoordsProps> = ({
  fieldSize,
  onFieldPress,
  boardTiles,
}) => {
  return (
    <View
      style={{
        backgroundColor: "#08763b",
        padding: 10,
        borderWidth: 3,
        borderColor: "#223333",
      }}
    >
      <ScrabbleBoard
        fieldSize={fieldSize}
        onFieldPress={onFieldPress}
        boardTiles={boardTiles}
      />
    </View>
  );
};

export default ScrabbleBoardWithCoords;
