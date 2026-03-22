import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import { RackLetter } from "../Rack";

export function calcX(
  index: number,
  tileSize: number,
  gap: number,
  count: number,
  containerWidth: number,
): number {
  const totalWidth = count * tileSize + (count - 1) * gap;
  const startX = (containerWidth - totalWidth) / 2;
  return startX + index * (tileSize + gap);
}
export const GAP = 6;

const useRack = (panelHeight: number) => {
  const { width } = useWindowDimensions();
  const {
    boardLayoutParams,
    currentLetters,
    currentLettersOnBoard,
    fieldSize,
    rackLetters,
    userSolutionTiles,
  } = useGlobalContext();
  const { setRackLetters, setUserSolutionTiles } = useGlobalActionsContext();

  const rackRef = useRef<View>(null);
  const lastAbsPos = useRef({ x: 0, y: 0 });

  const tileSize = Math.floor(Math.min(panelHeight * 0.82, (width / 7) * 0.92));

  const handleDragEnd = useCallback(
    (id: string, letter: string) => {
      const { x: absX, y: absY } = lastAbsPos.current;

      const isOutsideBoard =
        absX < boardLayoutParams.x ||
        absX > boardLayoutParams.x + boardLayoutParams.width ||
        absY < boardLayoutParams.y ||
        absY > boardLayoutParams.y + boardLayoutParams.height;

      if (isOutsideBoard) return;

      const fieldX = Math.floor((absX - boardLayoutParams.x) / fieldSize);
      const fieldY = Math.floor((absY - boardLayoutParams.y) / fieldSize);

      const isBusy = [
        ...(currentLettersOnBoard || []),
        ...userSolutionTiles,
      ].some((el) => el.x === fieldX && el.y === fieldY);

      if (isBusy) return;
      setUserSolutionTiles((prev) => [
        ...prev,
        { letter, x: fieldX, y: fieldY, isNewMove: true },
      ]);
      setRackLetters((prev) =>
        prev.map((el) => (el.id === id ? { ...el, played: true } : el)),
      );
    },
    [boardLayoutParams, fieldSize, currentLettersOnBoard, userSolutionTiles],
  );

  const paddedData = useMemo<RackLetter[]>(() => {
    const slots = rackLetters.map((l) =>
      l.played ? { id: `__empty_${l.id}`, letter: "" } : l,
    );
    for (let i = slots.length; i < 7; i++) {
      slots.push({ id: `__empty_extra_${i}`, letter: "" });
    }
    return slots;
  }, [rackLetters]);

  useEffect(() => {
    setRackLetters(
      (currentLetters || "")
        .split("")
        .map((letter, i) => ({ id: `${i}`, letter, played: false })),
    );
    setUserSolutionTiles([]);
  }, [currentLetters]);

  useEffect(() => {
    if (userSolutionTiles.length === 0) {
      setRackLetters((prev) => prev.map((el) => ({ ...el, played: false })));
    }
  }, [userSolutionTiles.length]);

  return {
    lastAbsPos,
    rackRef,
    paddedData,
    tileSize,
    handleDragEnd,
  };
};

export default useRack;
