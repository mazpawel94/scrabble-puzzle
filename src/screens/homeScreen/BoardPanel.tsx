import ScrabbleBoard from "@/components/Board/ScrabbleBoard";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

const PREVIEW_HEIGHT = 330;

const BoardPanel = ({ viewRef }: { viewRef: React.RefObject<View> }) => {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const boardWidth = width - 12;
  const scale = PREVIEW_HEIGHT / boardWidth;

  return (
    <View style={[styles.trainingCard]}>
      <View
        style={{
          height: PREVIEW_HEIGHT,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            width: boardWidth,
            height: boardWidth,
            transform: [{ scale }],
          }}
        >
          <ScrabbleBoard
            onFieldPress={() => {}}
            onTilePress={() => {}}
            containerRef={viewRef}
          />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: -2,
            width: boardWidth,
            transform: [{ scale }],
          }}
        >
          <Button
            mode="contained"
            onPress={() => router.push("/task/resume")}
            style={[styles.resumeButton, { backgroundColor: "#ebefe7" }]}
            contentStyle={{ paddingVertical: 5 }}
            icon="play"
          >
            Kontynuuj trening
          </Button>
        </View>
      </View>
    </View>
  );
};

export default BoardPanel;

const styles = StyleSheet.create({
  trainingCard: {
    borderRadius: 16,
    position: "relative",
    padding: 25,
  },
  resumeButton: {
    borderRadius: 8,
    opacity: 0.9,
  },
});
