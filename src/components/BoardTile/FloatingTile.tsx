import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { LetterKey, POINTS } from "@/constants/BoardFields";
import { useGlobalContext } from "@/contexts/GlobalContext";

// const TILE_COLOR = "#1ae825";
const TILE_COLOR = "#32f0d6";
const LETTER_COLOR = "#015b52";
const LETTER_COLOR_BLANK = "#015b5266";
const SPRING = { damping: 22, stiffness: 350, mass: 0.8 };

export interface FloatingTileProps {
  letter: string;
  startX: number;
  startY: number;
  onDragEnd: (letter: string, absX: number, absY: number) => void;
}

const FloatingTile = ({
  letter,
  startX,
  startY,
  onDragEnd,
}: FloatingTileProps) => {
  const { fieldSize } = useGlobalContext();

  const tileSize = fieldSize * 2.5;

  const posX = useSharedValue(startX - tileSize / 2);
  const posY = useSharedValue(startY - tileSize / 2);
  const scale = useSharedValue(1.15);
  const activeLetterRef = useRef<string>(null!);

  useEffect(() => {
    activeLetterRef.current = letter;
    posX.value = startX - tileSize / 2;
    posY.value = startY - tileSize / 2;
    scale.value = 1.15;
  }, [startX, startY]);

  const displayLetter = (letter ?? "A").toUpperCase();
  const isBlank =
    letter !== null && letter !== "?" && letter === letter.toLowerCase();

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value },
      { translateY: posY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[styles.wrapper, animStyle]}
      onStartShouldSetResponder={() => !!letter}
      onMoveShouldSetResponder={() => !!letter}
      onResponderMove={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        posX.value = pageX - tileSize / 2;
        posY.value = pageY - tileSize / 2;
      }}
      onResponderRelease={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        scale.value = withSpring(1, SPRING);
        if (activeLetterRef.current) {
          onDragEnd(activeLetterRef.current, pageX, pageY);
        }
      }}
    >
      <View
        style={[
          styles.tile,
          {
            width: tileSize,
            height: tileSize,
            borderRadius: Math.floor(tileSize * 0.12),
            backgroundColor: TILE_COLOR,
          },
        ]}
      >
        <Text
          style={[
            styles.letter,
            {
              fontSize: Math.floor(tileSize * 0.55),
              color: isBlank ? LETTER_COLOR_BLANK : LETTER_COLOR,
            },
          ]}
        >
          {displayLetter}
        </Text>
        {!isBlank && (
          <Text
            style={[
              styles.points,
              {
                fontSize: Math.floor(tileSize * 0.22),
                color: LETTER_COLOR,
                bottom: Math.floor(tileSize * 0.06),
                right: Math.floor(tileSize * 0.08),
              },
            ]}
          >
            {POINTS[displayLetter as LetterKey] ?? 0}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

export default FloatingTile;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
  },
  tile: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },
  letter: {
    fontFamily: "Arial",
    fontWeight: "bold",
    includeFontPadding: false,
  },
  points: {
    position: "absolute",
    fontFamily: "Arial",
    fontWeight: "bold",
    includeFontPadding: false,
  },
});
