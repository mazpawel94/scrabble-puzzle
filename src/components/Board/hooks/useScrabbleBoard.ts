import { BONUS_MAP, BonusType } from "@/constants/BoardFields";
import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { matchFont, Skia, useCanvasRef } from "@shopify/react-native-skia";
import { RefObject, useCallback, useMemo, useRef } from "react";
import { GestureResponderEvent, Platform, View } from "react-native";

const BOARD_COLOR = "#08763b";
const GRID_COLOR = "#badce9c2";

// ─── Diament wycentrowany na środku pola ─────────────────────────────────────
// Romb = kwadrat fs×fs obrócony o 45°, przekątna = fs*sqrt(2)/2 ≈ 0.707*fs
// Dzięki temu "skrzydła" wystają dokładnie do połowy sąsiedniego pola
function buildDiamondPath(col: number, row: number, fs: number) {
  const cx = col * fs + fs / 2;
  const cy = row * fs + fs / 2;
  // Półoś rombu = połowa przekątnej kwadratu fs×fs
  const half = (fs * Math.SQRT2) / 2; // ≈ 0.707 * fs
  const path = Skia.Path.Make();
  path.moveTo(cx, cy - half); // góra
  path.lineTo(cx + half, cy); // prawo
  path.lineTo(cx, cy + half); // dół
  path.lineTo(cx - half, cy); // lewo
  path.close();
  return path;
}

const fontStyle = {
  fontFamily:
    Platform.select({ ios: "Helvetica Neue", android: "sans-serif" }) ??
    "sans-serif",
  fontSize: 10,
  fontWeight: "bold" as const,
};

const useScrabbleBoard = (
  onFieldPress: (row: number, col: number) => void,
  containerRef: RefObject<View>,
) => {
  const boardRef = useRef<View>(null!);
  const canvasRef = useCanvasRef();

  const {
    currentLettersOnBoard,
    fieldSize,
    revealedLocation,
    userSolutionTiles,
  } = useGlobalContext();
  const { setBoardLayoutParams } = useGlobalActionsContext();

  const font = useMemo(() => matchFont(fontStyle), []);

  const handleTouch = useCallback(
    (e: GestureResponderEvent) => {
      if (!onFieldPress) return;
      const { locationX, locationY } = e.nativeEvent;
      const col = Math.floor(locationX / fieldSize);
      const row = Math.floor(locationY / fieldSize);
      if (col >= 0 && col < 15 && row >= 0 && row < 15) {
        onFieldPress(row, col);
      }
    },
    [fieldSize, onFieldPress],
  );

  const bonusCells = useMemo(() => {
    const result: Array<{ row: number; col: number; bonus: BonusType }> = [];
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const bonus = BONUS_MAP.get(row * 15 + col);
        if (bonus) result.push({ row, col, bonus });
      }
    }
    return result;
  }, []);

  // ── linie siatki ────────────────────────────────────────────────────────────
  const gridPath = useMemo(() => {
    const path = Skia.Path.Make();
    for (let i = 0; i <= 15; i++) {
      const pos = i * fieldSize;
      path.moveTo(pos, 0);
      path.lineTo(pos, fieldSize * 15);
      path.moveTo(0, pos);
      path.lineTo(fieldSize * 15, pos);
    }
    return path;
  }, [fieldSize]);

  // ── ścieżki diamentów i gwiazdki ────────────────────────────────────────────
  const diamondPaths = useMemo(
    () =>
      bonusCells.map(({ row, col }) => buildDiamondPath(col, row, fieldSize)),
    [bonusCells, fieldSize],
  );

  const boardTiles = useMemo(
    () => [...currentLettersOnBoard, ...userSolutionTiles],
    [currentLettersOnBoard, userSolutionTiles],
  );

  const handleOnLayout = useCallback(() => {
    boardRef.current?.measureLayout(
      containerRef.current!,
      (x, y, width, height) => {
        setBoardLayoutParams({
          x: x + 13,
          y: y + 13,
          width: width - 2 * 13,
          height: height - 2 * 13,
        });
      },
      () => {},
    );
  }, [boardRef, containerRef]);

  return {
    boardRef,
    canvasRef,
    boardTiles,
    bonusCells,
    fieldSize,
    font,
    gridPath,
    diamondPaths,
    revealedLocation,
    handleOnLayout,
    handleTouch,
  };
};

export default useScrabbleBoard;
