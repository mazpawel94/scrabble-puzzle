import { LetterKey, POINTS } from "@/constants/BoardFields";
import { SkFont, Text } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { LETTER_COLOR } from "./BoardTile";

interface ITilePointsProps {
  isBlank: boolean;
  size: number;
  x: number;
  y: number;
  letter: string;
  font: SkFont;
}
const TilePoints = ({
  letter,
  isBlank,
  size,
  x,
  y,
  font,
}: ITilePointsProps) => {
  const pointSize = Math.floor(size / 4);

  // Pozycja punktów – prawy dolny róg
  const pointX = x + size - 1 - pointSize;
  const pointY = y + size - 2 - pointSize;

  const points = useMemo(
    () => `${POINTS[letter.toUpperCase() as LetterKey] ?? POINTS["?"]}`,
    [letter],
  );

  if (!font) return null;
  return (
    <Text
      x={pointX}
      y={pointY + pointSize} // Skia: y = baseline
      text={points}
      font={font}
      color={LETTER_COLOR}
      opacity={isBlank ? 0 : 1}
    />
  );
};

export default TilePoints;
