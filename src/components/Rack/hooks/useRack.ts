import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { IRackProps, RackLetter } from "../Rack";

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

const useRack = ({ panelHeight, onDragMove, containerRef }: IRackProps) => {
  const { width } = useWindowDimensions();
  const {
    boardLayoutParams,
    currentLetters,
    currentLettersOnBoard,
    fieldSize,
    userSolutionTiles,
  } = useGlobalContext();
  const [rackLetters, setRackLetters] = useState<RackLetter[]>([]);
  const [order, setOrder] = useState<RackLetter[]>(rackLetters);

  const orderRef = useRef(order);
  const rackRef = useRef<View>(null);
  const rackY = useRef(0);

  const { setUserSolutionTiles } = useGlobalActionsContext();

  const tileSize = useMemo(
    () => Math.floor(Math.min(panelHeight * 0.82, (width / 7) * 0.92)),
    [],
  );

  const handlePut = useCallback(
    (id: string, letter: string, absX: number, absY: number) => {
      const fieldX = Math.floor((absX - boardLayoutParams.x) / fieldSize);
      const fieldY = Math.floor((absY - boardLayoutParams.y) / fieldSize);
      const boardPosition = {
        letter,
        x: fieldX,
        y: fieldY,
        isNewMove: true,
      };
      const isOutsideBoard =
        absX < boardLayoutParams.x ||
        absX > boardLayoutParams.width + boardLayoutParams.x ||
        absY > boardLayoutParams.height + boardLayoutParams.y ||
        absY < boardLayoutParams.y;
      const isBusy = [
        ...(currentLettersOnBoard || []),
        ...userSolutionTiles,
      ].some((el) => el.x === boardPosition.x && el.y === boardPosition.y);
      if (isOutsideBoard || isBusy) return;

      setUserSolutionTiles((prev) => [...prev, boardPosition]);
      setRackLetters((prev) =>
        prev.map((el) => (el.id !== id ? el : { ...el, played: true })),
      );
    },
    [boardLayoutParams, fieldSize, currentLettersOnBoard, userSolutionTiles],
  );

  useEffect(() => {
    setRackLetters(
      (currentLetters || "")
        .split("")
        .map((el, i) => ({ id: `${i}`, letter: el, played: false })),
    );
    setUserSolutionTiles([]);
  }, [currentLetters]);

  const handleDragMove = useCallback(
    (id: string, letter: string, posX: number, absX: number, absY: number) => {
      onDragMove?.(id, letter, absX, absY);
    },
    [onDragMove],
  );

  const handleDragEnd = useCallback(
    (
      id: string,
      letter: string,
      ax: number,
      ay: number,
      finalPosX?: number,
    ) => {
      // REORDER TYLKO NA KONIEC — stabilnie i bez nakładania
      if (finalPosX !== undefined) {
        const cur = orderRef.current.filter(
          (l) => l.letter !== "(" && l.letter !== ")",
        );
        const currentIndex = cur.findIndex((l) => l.id === id);
        if (currentIndex !== -1) {
          const centerX = finalPosX + tileSize / 2;
          let targetIndex = currentIndex;

          for (let i = 0; i < cur.length - 1; i++) {
            const slotA =
              calcX(i, tileSize, GAP, cur.length, width) + tileSize / 2;
            const slotB =
              calcX(i + 1, tileSize, GAP, cur.length, width) + tileSize / 2;
            const threshold = (slotA + slotB) / 2;

            if (centerX < threshold) {
              targetIndex = i;
              break;
            }
            targetIndex = i + 1;
          }

          if (targetIndex !== currentIndex) {
            const next = [...cur];
            const [moved] = next.splice(currentIndex, 1);
            next.splice(targetIndex, 0, moved);
            orderRef.current = next;
            setOrder(next);
          }
        }
      }

      handlePut?.(id, letter, ax, ay);
    },
    [handlePut, tileSize, width],
  );

  const handleOnLayout = useCallback(() => {
    rackRef.current?.measureLayout(containerRef.current!, (_, y) => {
      rackY.current = y;
    });
  }, [containerRef]);

  useEffect(() => {
    setOrder(rackLetters);
    orderRef.current = rackLetters;
  }, [rackLetters]);

  // reset ruchu przez button
  useEffect(() => {
    if (userSolutionTiles.length === 0)
      setRackLetters((prev) => prev.map((el) => ({ ...el, played: false })));
  }, [userSolutionTiles.length]);

  return {
    rackRef,
    tileSize,
    rackY,
    visible: order.filter((el) => !el.played),
    width,
    handleDragMove,
    handleDragEnd,
    handleOnLayout,
  };
};

export default useRack;
