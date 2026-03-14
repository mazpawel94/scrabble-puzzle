import { matchFont } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Platform } from "react-native";

const FONT_FAMILY =
  Platform.select({ ios: "Helvetica Neue", android: "sans-serif" }) ??
  "sans-serif";

function makeFont(size: number) {
  return matchFont({
    fontFamily: FONT_FAMILY,
    fontSize: size,
    fontWeight: "bold",
  });
}

const useBoardTile = (size: number, letter: string | undefined) => {
  const letterFont = useMemo(() => makeFont(Math.floor(size / 2) + 2), [size]);
  const pointFont = useMemo(() => makeFont(Math.floor(size / 4)), [size]);

  const isBlank = useMemo(() => letter === letter?.toLowerCase(), []);

  return { isBlank, letterFont, pointFont };
};

export default useBoardTile;
