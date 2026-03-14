import {
  Canvas,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

/**
 * Odpowiednik webowego Background ze styled-components.
 *
 * Oryginał CSS:
 *   clip-path: polygon(81% 23%, 100% 10%, 100% 100%, 0 100%, 0 37%, 18% 30%);
 *   background: linear-gradient(103deg, #81f6a6 0%, #4eab6b 36%, #29964b 100%);
 *
 * Renderowany absolutnie pod wszystkimi ekranami, z-index = -1 przez
 * ustawienie go jako pierwszego dziecka w _layout.tsx.
 */
const AppBackground: React.FC = () => {
  const { width, height: h } = useWindowDimensions();
  const height = h + 100;

  const path = React.useMemo(() => {
    // Przeliczamy punkty clip-path z % na piksele
    // polygon(81% 23%, 100% 10%, 100% 100%, 0 100%, 0 37%, 18% 30%)
    const pts = [
      [0.81 * width, 0.23 * height],
      [width, 0.1 * height],
      [width, height],
      [0, height],
      [0, 0.37 * height],
      [0.18 * width, 0.3 * height],
    ];
    const p = Skia.Path.Make();
    p.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
    p.close();
    return p;
  }, [width, height]);

  // linear-gradient(103deg, ...) – Skia używa wektorów start/end
  // 103° od osi X: start = lewy-górny obszar, end = prawy-dolny
  const angle = (103 * Math.PI) / 180;
  const len = Math.sqrt(width * width + height * height);
  const cx = width / 2;
  const cy = height / 2;
  const start = vec(
    cx - (Math.cos(angle) * len) / 2,
    cy - (Math.sin(angle) * len) / 2,
  );
  const end = vec(
    cx + (Math.cos(angle) * len) / 2,
    cy + (Math.sin(angle) * len) / 2,
  );

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Path path={path}>
        <LinearGradient
          start={start}
          end={end}
          colors={["#81f6a6", "#4eab6b", "#29964b"]}
          positions={[0, 0.36, 1]}
        />
      </Path>
    </Canvas>
  );
};

export default AppBackground;
