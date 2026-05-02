import { SkFont, Text } from "@shopify/react-native-skia";

import { useMemo } from "react";
import { LETTER_COLOR } from "./BoardTile";

interface ITileLetterProps {
  isBlank: boolean;
  size: number;
  x: number;
  y: number;
  letter: string;
  font: SkFont;
}

const TileLetter = ({
  size,
  isBlank,
  x,
  y,
  font,
  letter,
}: ITileLetterProps) => {
  const letterSize = Math.floor(size / 2) + 2;

  // Wyśrodkowanie litery w poziomie
  const letterX = useMemo(() => {
    const measuredLetter = font?.measureText(letter);
    return measuredLetter
      ? x + (size - measuredLetter.width) / 2
      : x + size * 0.15;
  }, [letter, x, size]);

  if (!font) return null;
  return (
    <Text
      x={letterX - (letter === "I" || isBlank ? 1 : 0)}
      y={y + letterSize / 2 + letterSize - 3} // Skia: y = baseline
      text={letter.toUpperCase()}
      font={font}
      color={LETTER_COLOR}
      opacity={isBlank ? 0.3 : 1}
    />
  );
};

export default TileLetter;
