import { FIELDS_PARAMS } from "@/constants/BoardFields";
import { Canvas, Fill, Group, Path, Rect } from "@shopify/react-native-skia";
import React, { RefObject } from "react";
import { View } from "react-native";
import BoardTile from "../BoardTile/BoardTile";
import BonusText from "./BonusText";
import useScrabbleBoard from "./hooks/useScrabbleBoard";

interface ScrabbleBoardProps {
  onFieldPress: (row: number, col: number) => void;
  onTilePress: (letter: string, absX: number, absY: number) => void;
  containerRef: RefObject<View>;
}
const BOARD_COLOR = "#08763b";
const GRID_COLOR = "#badce9c2";

const ScrabbleBoard: React.FC<ScrabbleBoardProps> = ({
  onFieldPress,
  onTilePress,
  containerRef,
}) => {
  const {
    boardRef,
    canvasRef,
    boardTiles,
    bonusCells,
    diamondPaths,
    fieldSize,
    font,
    gridPath,
    revealedLocation,
    handleOnLayout,
    handleTouchStart,
  } = useScrabbleBoard(onFieldPress, onTilePress, containerRef);

  return (
    <View
      ref={boardRef}
      style={{
        backgroundColor: "#08763b",
        padding: 10,
        borderWidth: 3,
        borderColor: "#223333",
      }}
      onLayout={handleOnLayout}
    >
      <Canvas
        ref={canvasRef}
        style={{ width: fieldSize * 15, height: fieldSize * 15 }}
        onTouchStart={handleTouchStart}
      >
        <Fill color={BOARD_COLOR} />

        {bonusCells.map(({ row, col, bonus }, i) => {
          const params = FIELDS_PARAMS[bonus];
          const x = col * fieldSize;
          const y = row * fieldSize;
          const lines = params.text ? params.text.split("\n") : [];

          return (
            <Group key={`${row}-${col}`}>
              {/* 1. Diament wystający poza pole – renderowany PRZED prostokątem */}
              <Path path={diamondPaths[i]} color={params.color} />

              {/* 2. Kwadratowe wypełnienie pola */}
              <Rect
                x={x}
                y={y}
                width={fieldSize}
                height={fieldSize}
                color={params.color}
              />

              {/* 3. Tekst bonusu */}
              {bonus !== "middle" && font && lines.length > 0 && (
                <BonusText
                  lines={lines}
                  x={x}
                  y={y}
                  fieldSize={fieldSize}
                  font={font}
                />
              )}
            </Group>
          );
        })}
        {revealedLocation.map(({ x, y }) => (
          <Rect
            key={`${x}-${y}`}
            x={x * fieldSize}
            y={y * fieldSize}
            width={fieldSize}
            height={fieldSize}
            color="#32f0d6bd"
          />
        ))}
        {boardTiles
          .filter((el) => !el.isMoved)
          .map((letter, i) => (
            <BoardTile
              key={i}
              letter={letter.letter}
              x={letter.x * fieldSize}
              y={letter.y * fieldSize}
              size={fieldSize}
              newMove={letter.isNewMove}
            />
          ))}
        {/* Siatka na wierzchu wszystkich pól */}
        <Path
          path={gridPath}
          color={GRID_COLOR}
          strokeWidth={1}
          style="stroke"
        />
      </Canvas>
    </View>
  );
};

export default ScrabbleBoard;
