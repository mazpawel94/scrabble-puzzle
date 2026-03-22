import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { LetterKey, POINTS } from "@/constants/BoardFields";
import { RackLetter } from "./Rack";

const TILE_COLOR = "#f8e8c7";
const TILE_COLOR_PLAYED = "#1ae825";
const LETTER_COLOR = "#015b52";
const LETTER_COLOR_BLANK = "#015b5266";

interface IRackTileProps {
  item: RackLetter;
  tileSize: number;
}

const RackTile = ({ item, tileSize }: IRackTileProps) => {
  const { id, letter, played } = item;

  const isBlank = useMemo(
    () => letter !== "?" && letter === letter.toLowerCase(),
    [letter],
  );
  const displayLetter = letter.toUpperCase();

  const borderRadius = Math.floor(tileSize * 0.12);

  return (
    <View
      style={[
        styles.tile,
        {
          width: tileSize,
          height: tileSize,
          borderRadius,
          backgroundColor: played ? TILE_COLOR_PLAYED : TILE_COLOR,
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
  );
};

export default RackTile;

const styles = StyleSheet.create({
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
