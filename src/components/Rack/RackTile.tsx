import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { LetterKey, POINTS } from "@/constants/BoardFields";
import { RackLetter } from "./Rack";
import useRackTile from "./hooks/useRackTile";

const TILE_COLOR = "#f8e8c7";
const TILE_COLOR_PLAYED = "#1ae825";
const LETTER_COLOR = "#015b52";
const LETTER_COLOR_BLANK = "#015b5266";

export interface ITileRackProps {
  item: RackLetter;
  tileSize: number;
  targetX: number;
  rackY: number;
  onDragMove: (
    id: string,
    letter: string,
    posX: number,
    absX: number,
    absY: number,
  ) => void;
  onDragEnd: (
    id: string,
    letter: string,
    absX: number,
    absY: number,
    finalPosX: number,
  ) => void;
}

const RackTile = ({ tileSize, ...rest }: ITileRackProps) => {
  const { animStyle, gesture, isBlank, displayLetter } = useRackTile({
    tileSize,
    item: rest.item,
    targetX: rest.targetX,
    rackY: rest.rackY,
    onDragMove: rest.onDragMove,
    onDragEnd: rest.onDragEnd,
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.tileWrapper,
          { width: tileSize, height: tileSize },
          animStyle,
        ]}
      >
        <View
          style={[
            styles.tile,
            {
              width: tileSize,
              height: tileSize,
              borderRadius: Math.floor(tileSize * 0.12),
              backgroundColor: rest.item.played
                ? TILE_COLOR_PLAYED
                : TILE_COLOR,
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
    </GestureDetector>
  );
};

export default RackTile;

const styles = StyleSheet.create({
  tileWrapper: { position: "absolute", top: 0 },
  tile: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
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
