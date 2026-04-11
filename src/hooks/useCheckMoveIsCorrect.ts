import { IBoardTile } from "@/types";
import { useMemo } from "react";

const isInOneLine = (newTiles: IBoardTile[], _: IBoardTile[]) =>
  new Set(newTiles.map((el) => el.x)).size === 1 ||
  new Set(newTiles.map((el) => el.y)).size === 1;

const isAdjacentToDoneField = (
  newTiles: IBoardTile[],
  tilesOnBoard: IBoardTile[],
) =>
  newTiles.some((el) =>
    tilesOnBoard.some(
      (tile) =>
        (tile.x === el.x && (tile.y - 1 === el.y || tile.y + 1 === el.y)) ||
        (tile.y === el.y && (tile.x - 1 === el.x || tile.x + 1 === el.x)),
    ),
  );

const isWithoutGap = (newTiles: IBoardTile[], tilesOnBoard: IBoardTile[]) => {
  const isVertical = new Set(newTiles.map((el) => el.x)).size === 1;
  const sortedTiles = newTiles.sort((a, b) =>
    isVertical ? (a.y < b.y ? -1 : 1) : a.x < b.x ? -1 : 1,
  );
  const start = sortedTiles[0];
  const end = sortedTiles[sortedTiles.length - 1];
  const fields = Array.from(
    { length: (isVertical ? end.y - start.y : end.x - start.x) + 1 },
    (_, i) => ({
      x: isVertical ? start.x : start.x + i,
      y: isVertical ? start.y + i : start.y,
    }),
  );
  return fields.every((el) =>
    [...tilesOnBoard, ...newTiles].find(
      (field) => field.x === el.x && field.y === el.y,
    ),
  );
};

const conditions = [isInOneLine, isAdjacentToDoneField, isWithoutGap];

const useCheckMoveIsCorrect = (
  userSolutionTiles: IBoardTile[],
  currentLettersOnBoard: IBoardTile[],
) => {
  const moveIsCorrect = useMemo(() => {
    return conditions.every((condition) =>
      condition(userSolutionTiles, currentLettersOnBoard),
    );
  }, [userSolutionTiles, currentLettersOnBoard]);

  return { moveIsCorrect };
};

export default useCheckMoveIsCorrect;
