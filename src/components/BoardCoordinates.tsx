import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BoardCoordinatesProps {
  /** Musi być taki sam jak fieldSize w ScrabbleBoard */
  fieldSize: number;
  /** Szerokość paska z numerami po lewej */
  gutterSize?: number;
}

const LETTERS = "ABCDEFGHIJKLMNO".split("");
const NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);

const BoardCoordinates: React.FC<BoardCoordinatesProps> = ({
  fieldSize,
  gutterSize = 20,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Górny rząd liter */}
      <View style={[styles.topRow, { marginLeft: gutterSize }]}>
        {LETTERS.map((letter) => (
          <View key={letter} style={{ width: fieldSize, alignItems: "center" }}>
            <Text style={styles.coordText}>{letter}</Text>
          </View>
        ))}
      </View>

      <View style={styles.boardRow}>
        {/* Lewa kolumna liczb */}
        <View style={{ width: gutterSize }}>
          {NUMBERS.map((num) => (
            <View
              key={num}
              style={{
                height: fieldSize,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.coordText}>{num}</Text>
            </View>
          ))}
        </View>

        {/* Slot na planszę – children */}
        <View style={styles.boardSlot} />
      </View>
    </View>
  );
};

export default BoardCoordinates;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    height: 20,
    alignItems: "center",
  },
  boardRow: {
    flexDirection: "row",
  },
  boardSlot: {
    flex: 1,
  },
  coordText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "600",
    lineHeight: 11,
  },
});
