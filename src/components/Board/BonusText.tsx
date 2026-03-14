import { matchFont, Text } from "@shopify/react-native-skia";

interface IBonusTextProps {
  lines: string[];
  x: number;
  y: number;
  fieldSize: number;
  font: ReturnType<typeof matchFont>;
}

const BonusText = ({ lines, x, y, fieldSize, font }: IBonusTextProps) => {
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
          <Text
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
};

export default BonusText;
