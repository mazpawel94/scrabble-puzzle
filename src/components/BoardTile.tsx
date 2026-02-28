import { LetterKey, POINTS } from "@/constants/BoardFields";
import {
    Group,
    Rect,
    Skia,
    Text as SkiaText,
    matchFont,
} from "@shopify/react-native-skia";
import { Platform } from "react-native";

// ─── stany pola (1:1 z EBoardFieldState) ─────────────────────────────────────

export enum EBoardFieldState {
  suggestion = "suggestion",
  done = "done",
  sketch = "sketch",
  changed = "changed",
  newMove = "newMove",
}

const TILE_COLORS: Record<string, string> = {
  basic: "#f8e8c7",
  [EBoardFieldState.suggestion]: "#f8e8c7",
  [EBoardFieldState.done]: "#f8e8c7",
  [EBoardFieldState.sketch]: "#f8e8c7", // opacity obsługiwana osobno
  [EBoardFieldState.changed]: "#777777",
  [EBoardFieldState.newMove]: "#1ae825",
};

const LETTER_COLOR = "#015b52";
const FONT_FAMILY =
  Platform.select({ ios: "Helvetica Neue", android: "sans-serif" }) ??
  "sans-serif";

// ─── helper: zaokrąglony prostokąt przez Path ─────────────────────────────────
// Skia ma RoundedRect, ale tu potrzebujemy go jako Path żeby móc kontrolować opacity na Group
function roundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const path = Skia.Path.Make();
  path.addRRect(Skia.RRectXY(Skia.XYWHRect(x, y, w, h), r, r));
  return path;
}

// ─── typy ─────────────────────────────────────────────────────────────────────

export interface BoardTileProps {
  /** Rozmiar boku pola w px (= fieldSize z planszy) */
  size: number;
  /** Pozycja X lewego-górnego rogu pola na canvasie */
  x: number;
  /** Pozycja Y lewego-górnego rogu pola na canvasie */
  y: number;
  letter?: string;
  state?: EBoardFieldState | "";
  transparent?: boolean;
  newMove?: boolean;
  /** Uwaga: obsługę tapnięcia rób na poziomie Canvas.onTouchEnd,
   *  tu callback jest opcjonalny (Skia nie ma onClick per-element) */
  handleClick?: () => void;
}

// ─── czcionki (tworzone poza komponentem żeby nie re-tworzyć przy każdym render) ──

function makeFont(size: number) {
  return matchFont({
    fontFamily: FONT_FAMILY,
    fontSize: size,
    fontWeight: "bold",
  });
}

// ─── komponent ────────────────────────────────────────────────────────────────

const BoardTile: React.FC<BoardTileProps> = ({
  size,
  x,
  y,
  letter,
  state = "",
  transparent = false,
  newMove = false,
}) => {
  const isLarge = size > 37;
  const cornerRadius = isLarge ? 4 : 2;
  const letterSize = isLarge ? 25 : Math.floor(size / 2) + 2;
  const pointSize = isLarge ? 9 : Math.floor(size / 4);

  // Czcionki
  const letterFont = makeFont(letterSize);
  const pointFont = makeFont(pointSize);

  // Puste pole – przezroczysty Rect tylko do obsługi dotyku (jak w Konvie)
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

  const isBlank = letter === letter.toLowerCase();
  const displayLetter = letter.toUpperCase();
  const points = POINTS[displayLetter as LetterKey] ?? POINTS["?"];

  const tileColor = newMove
    ? TILE_COLORS[EBoardFieldState.newMove]
    : state
      ? TILE_COLORS[state]
      : TILE_COLORS.basic;

  // opacity: sketch = 0.53 (88 hex ≈ 53%), transparent = 0, reszta = 1
  const tileOpacity = transparent
    ? 0
    : state === EBoardFieldState.sketch
      ? 0.53
      : 1;
  const letterOpacity = transparent ? 0 : isBlank ? 0.3 : 1;
  const pointOpacity = transparent || isBlank ? 0 : 1;

  // Pozycja litery – wyśrodkowana poziomo, pionowo jak w Konvie
  const letterY = y + (isLarge ? 8 : letterSize / 2);

  // Pozycja punktów – prawy dolny róg
  const pointX = x + size - 1 - pointSize;
  const pointY = y + size - 2 - pointSize;

  // Wyśrodkowanie litery w poziomie
  const measuredLetter = letterFont?.measureText(displayLetter);
  const letterX = measuredLetter
    ? x + (size - measuredLetter.width) / 2
    : x + size * 0.15;

  return (
    <Group>
      {/* Kafelek */}
      {/* <Path
        path={roundedRectPath(x + 1, y + 1, size - 2, size - 2, cornerRadius)}
        color={tileColor}
        opacity={tileOpacity}
      /> */}
      <Rect
        x={x + 0.5}
        y={y + 0.5}
        width={size - 1}
        height={size - 1}
        color={tileColor}
      />

      {/* Litera */}
      {letterFont && (
        <SkiaText
          x={letterX}
          y={letterY + letterSize - 3} // Skia: y = baseline
          text={displayLetter}
          font={letterFont}
          color={LETTER_COLOR}
          opacity={letterOpacity}
        />
      )}

      {/* Punkty */}
      {pointFont && (
        <SkiaText
          x={pointX}
          y={pointY + pointSize} // Skia: y = baseline
          text={String(points)}
          font={pointFont}
          color={LETTER_COLOR}
          opacity={pointOpacity}
        />
      )}
    </Group>
  );
};

export default BoardTile;
