import { BONUS_MAP, BonusType, FIELDS_PARAMS } from "@/constants/BoardFields";
import { IBoardTile } from "@/types";
import {
  Canvas,
  Fill,
  Group,
  Path,
  Rect,
  Skia,
  Text as SkiaText,
  matchFont,
  useCanvasRef,
} from "@shopify/react-native-skia";
import React, { useCallback, useMemo } from "react";
import { GestureResponderEvent, Platform } from "react-native";
import BoardTile from "./BoardTile";

interface ScrabbleBoardProps {
  fieldSize?: number;
  onFieldPress?: (row: number, col: number) => void;
  boardTiles: IBoardTile[];
}

const BOARD_SIZE = 15;
const BOARD_COLOR = "#08763b";
const GRID_COLOR = "#badce9c2";

const fontStyle = {
  fontFamily:
    Platform.select({ ios: "Helvetica Neue", android: "sans-serif" }) ??
    "sans-serif",
  fontSize: 10,
  fontWeight: "bold" as const,
};

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

// ─── Ścieżka gwiazdy (8 ramion) – zamiast emoji ★ ────────────────────────────
function buildStarPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
) {
  const path = Skia.Path.Make();
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    i === 0 ? path.moveTo(px, py) : path.lineTo(px, py);
  }
  path.close();
  return path;
}

// ─── Tekst wieloliniowy wyśrodkowany w polu ────────────────────────────────────
// Skia Text nie obsługuje zawijania – renderujemy każdą linię osobno.
// Używamy Paragraph API przez measureText do precyzyjnego wyśrodkowania.
function BonusText({
  lines,
  x,
  y,
  fieldSize,
  font,
}: {
  lines: string[];
  x: number;
  y: number;
  fieldSize: number;
  font: ReturnType<typeof matchFont>;
}) {
  if (!font) return null;
  const fs = font.getSize();
  // Szacunek szerokości znaku dla bold sans-serif ≈ 0.62 * fontSize
  const CHAR_W = fs * 0.62;
  const lineH = fs * 1.2;
  const totalH = lineH * lines.length;
  const startY = y + (fieldSize - totalH) / 2 + fs;

  return (
    <>
      {lines.map((line, idx) => {
        const approxW = line.length * CHAR_W;
        const textX = x + (fieldSize - approxW) / 2;
        const textY = startY + idx * lineH;
        return (
          <SkiaText
            key={idx}
            x={textX}
            y={textY}
            text={line}
            font={font}
            color="#e9e9e9cc"
          />
        );
      })}
    </>
  );
}

// ─── Główny komponent ─────────────────────────────────────────────────────────

const ScrabbleBoard: React.FC<ScrabbleBoardProps> = ({
  fieldSize = 40,
  onFieldPress,
  boardTiles,
}) => {
  const canvasRef = useCanvasRef();
  const totalSize = fieldSize * BOARD_SIZE;

  // fontSize musi się zmieścić w szerokości pola dla najdłuższej linii ("LITEROWA" = 8 znaków)
  // Przy fieldSize=22: 22/9 ≈ 2.4px – za małe. Używamy proporcji do znaku.
  // Szacunek: szerokość znaku ≈ fontSize * 0.6, maks tekst = 8 znaków → fontSize = fieldSize / (8*0.6)
  const font = useMemo(() => matchFont(fontStyle), []);

  // ── obsługa dotyku ──────────────────────────────────────────────────────────
  const handleTouch = useCallback(
    (e: GestureResponderEvent) => {
      if (!onFieldPress) return;
      const { locationX, locationY } = e.nativeEvent;
      const col = Math.floor(locationX / fieldSize);
      const row = Math.floor(locationY / fieldSize);
      if (col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE) {
        onFieldPress(row, col);
      }
    },
    [fieldSize, onFieldPress],
  );

  // ── prebuduj dane ────────────────────────────────────────────────────────────
  const bonusCells = useMemo(() => {
    const result: Array<{ row: number; col: number; bonus: BonusType }> = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const bonus = BONUS_MAP.get(row * 15 + col);
        if (bonus) result.push({ row, col, bonus });
      }
    }
    return result;
  }, []);

  // ── linie siatki ────────────────────────────────────────────────────────────
  const gridPath = useMemo(() => {
    const path = Skia.Path.Make();
    for (let i = 0; i <= BOARD_SIZE; i++) {
      const pos = i * fieldSize;
      path.moveTo(pos, 0);
      path.lineTo(pos, totalSize);
      path.moveTo(0, pos);
      path.lineTo(totalSize, pos);
    }
    return path;
  }, [fieldSize, totalSize]);

  // ── ścieżki diamentów i gwiazdki ────────────────────────────────────────────
  const diamondPaths = useMemo(
    () =>
      bonusCells.map(({ row, col }) => buildDiamondPath(col, row, fieldSize)),
    [bonusCells, fieldSize],
  );

  const starPath = useMemo(() => {
    const cx = 7 * fieldSize + fieldSize / 2;
    const cy = 7 * fieldSize + fieldSize / 2;
    return buildStarPath(cx, cy, fieldSize / 3.2, fieldSize / 6, 8);
  }, [fieldSize]);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <Canvas
      ref={canvasRef}
      style={{ width: totalSize, height: totalSize }}
      onTouchEnd={handleTouch}
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

            {/* 4. Gwiazdka na środkowym polu */}
            {bonus === "middle" && <Path path={starPath} color="#DC9C10" />}
          </Group>
        );
      })}
      {boardTiles.map((letter, i) => (
        <BoardTile
          key={i}
          letter={letter.letter}
          x={letter.x}
          y={letter.y}
          size={fieldSize}
        />
      ))}
      {/* Siatka na wierzchu wszystkich pól */}
      <Path path={gridPath} color={GRID_COLOR} strokeWidth={1} style="stroke" />
    </Canvas>
  );
};

export default ScrabbleBoard;
