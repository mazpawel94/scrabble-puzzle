import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { View, useWindowDimensions } from "react-native";

import { RackLetter } from "../Rack";

// 7 stałych kluczy bufora — zawsze te same, żeby biblioteka nie remountowała
const BUFFER_ITEMS: RackLetter[] = Array.from({ length: 7 }, (_, i) => ({
  id: `__buffer_${i}`,
  letter: "",
}));

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
    ({ key: id, data: orderedData }: { key: string; data: RackLetter[] }) => {
      const letter = orderedData.find((el) => el.id === id)?.letter;
      if (!letter) return;

      const { x: absX, y: absY } = lastAbsPos.current;

      const newOrder = orderedData
        .filter((el) => !el.id.startsWith("__buffer_"))
        .map((el) => el.id);

      const isOutsideBoard =
        absX < boardLayoutParams.x ||
        absX > boardLayoutParams.x + boardLayoutParams.width ||
        absY < boardLayoutParams.y ||
        absY > boardLayoutParams.y + boardLayoutParams.height;

      const fieldX = Math.floor((absX - boardLayoutParams.x) / fieldSize);
      const fieldY = Math.floor((absY - boardLayoutParams.y) / fieldSize);

      const isBusy = [
        ...(currentLettersOnBoard || []),
        ...userSolutionTiles,
      ].some((el) => el.x === fieldX && el.y === fieldY);

      if (isBusy || isOutsideBoard) {
        setRackLetters((prev) => {
          const byId = Object.fromEntries(prev.map((l) => [l.id, l]));
          const played = prev.filter((l) => l.played);
          return newOrder.map((id) => byId[id] || played.pop());
        });
        return;
      }

      setRackLetters((prev) => {
        const byId = Object.fromEntries(prev.map((l) => [l.id, l]));
        const played = prev.filter((l) => l.played);
        const reordered = newOrder.map((id) => byId[id] || played.pop());
        return reordered.map((el) =>
          el.id === id ? { ...el, played: true } : el,
        );
      });
      setUserSolutionTiles((prev) => [
        ...prev,
        { letter, x: fieldX, y: fieldY, isNewMove: true },
      ]);
    },
    [boardLayoutParams, fieldSize, currentLettersOnBoard, userSolutionTiles],
  );

  const handleDragMove = useCallback(
    ({ touchData }: { touchData: { absoluteX: number; absoluteY: number } }) =>
      (lastAbsPos.current = {
        x: touchData.absoluteX,
        y: touchData.absoluteY,
      }),
    [],
  );

  const paddedData = useMemo<RackLetter[]>(() => {
    const slots = rackLetters.map((l) =>
      l.played ? { id: `__empty_${l.id}`, letter: "" } : l,
    );
    for (let i = slots.length; i < 7; i++) {
      slots.push({ id: `__empty_extra_${i}`, letter: "" });
    }
    // Bufor zawsze na początku — tworzy górny wiersz z fixed-order
    return [...BUFFER_ITEMS, ...slots];
  }, [rackLetters]);

  useEffect(() => {
    setRackLetters(
      (currentLetters || "")
        .split("")
        .map((letter, i) => ({ id: `${i}`, letter, played: false })),
    );
    setUserSolutionTiles([]);
  }, [currentLetters]);

  return {
    lastAbsPos,
    rackRef,
    paddedData,
    tileSize,
    handleDragEnd,
    handleDragMove,
  };
};

export default useRack;
