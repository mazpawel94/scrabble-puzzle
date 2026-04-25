import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { LEVEL } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

interface FloatingTileState {
  letter: string;
  absX: number;
  absY: number;
}

const useDiagramScreen = () => {
  const { level } = useLocalSearchParams<{ level: string }>();
  const { height } = useWindowDimensions();
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const {
    boardLayoutParams,
    currentLettersOnBoard,
    fieldSize,
    userSolutionTiles,
  } = useGlobalContext();

  const { setRackLetters, setSelectedLevel, setUserSolutionTiles } =
    useGlobalActionsContext();

  const [floatingTile, setFloatingTile] = useState<FloatingTileState | null>(
    null,
  );

  const containerRef = useRef<View>(null!);
  // Offset lewej krawędzi kontenera względem ekranu — koryguje alignItems: "center"
  const containerOffsetX = useRef(0);

  const panelHeight = height * 0.2;

  const checkIsBusy = useCallback(
    (col: number, row: number) => {
      return [...(currentLettersOnBoard || []), ...userSolutionTiles].some(
        (el) => el.x === col && el.y === row,
      );
    },
    [currentLettersOnBoard, userSolutionTiles],
  );

  const handleContainerLayout = useCallback(() => {
    containerRef.current?.measure((_x, _y, _w, _h, pageX) => {
      containerOffsetX.current = pageX;
    });
    setIsLayoutReady(true);
  }, []);

  const handleTilePress = (letter: string, absX: number, absY: number) => {
    const col = Math.floor((absX - boardLayoutParams.x) / fieldSize);
    const row = Math.floor((absY - boardLayoutParams.y) / fieldSize);
    setUserSolutionTiles((prev) =>
      prev.map((el) => ({ ...el, isMoved: el.x === col && el.y === row })),
    );
    // Koryguj X o offset kontenera (SafeAreaView z alignItems: "center")
    setFloatingTile({ letter, absX: absX - containerOffsetX.current, absY });
  };

  const handleFloatingDragEnd = (
    letter: string,
    absX: number,
    absY: number,
  ) => {
    setFloatingTile(null);

    const isOverBoard =
      absX >= boardLayoutParams.x &&
      absX <= boardLayoutParams.x + boardLayoutParams.width &&
      absY >= boardLayoutParams.y &&
      absY <= boardLayoutParams.y + boardLayoutParams.height;

    if (isOverBoard) {
      const col = Math.floor((absX - boardLayoutParams.x) / fieldSize);
      const row = Math.floor((absY - boardLayoutParams.y) / fieldSize);

      const isBusy = checkIsBusy(col, row);
      if (!isBusy) {
        setUserSolutionTiles((prev) =>
          prev.map((el) =>
            el.isMoved ? { ...el, x: col, y: row, isMoved: false } : el,
          ),
        );
      } else
        setUserSolutionTiles((prev) =>
          prev.map((el) => ({ ...el, isMoved: false })),
        );
    } else {
      setUserSolutionTiles((prev) => prev.filter((el) => !el.isMoved));
      const isBlank = letter === letter.toLowerCase();
      setRackLetters((prev) =>
        prev.map((el, index) =>
          ((el.letter === letter &&
            prev.findIndex((l) => l.letter === letter && l.played) === index) ||
            (isBlank &&
              el.letter === "?" &&
              prev.findIndex((l) => l.letter === "?" && l.played) === index)) &&
          el.played
            ? { ...el, played: false }
            : el,
        ),
      );
    }
  };

  const handleFieldPress = useCallback(
    (row: number, col: number) => {
      if (checkIsBusy(col, row)) return;

      console.log(`Kliknięto pole [${row}, ${col}]`);
    },
    [checkIsBusy],
  );

  useEffect(() => {
    setSelectedLevel(level as LEVEL);
  }, [level]);

  //jeżeli user odłożył wszystkie płytki
  useEffect(() => {
    if (!userSolutionTiles.length) setFloatingTile(null);
  }, [userSolutionTiles]);

  return {
    floatingTile,
    height,
    isLayoutReady,
    level,
    panelHeight,
    handleContainerLayout,
    handleFieldPress,
    handleFloatingDragEnd,
    handleTilePress,
  };
};

export default useDiagramScreen;
