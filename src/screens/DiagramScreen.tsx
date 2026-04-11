import { useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionPanel } from "@/components/ActionsPanel/ActionsPanel";
import ScrabbleBoard from "@/components/Board/ScrabbleBoard";
import BoardHeader from "@/components/BoardHeader";
import FloatingTile from "@/components/BoardTile/FloatingTile";
import Rack from "@/components/Rack/Rack";
import Toast from "@/components/Toast";
import { useGlobalActionsContext } from "@/contexts/GlobalContext";
import useDiagramScreen from "./hooks/useDiagramScreen";

export default function DiagramScreen() {
  const {
    floatingTile,
    height,
    index,
    level,
    panelHeight,
    handleContainerLayout,
    handleFieldPress,
    handleFloatingDragEnd,
    handleTilePress,
  } = useDiagramScreen();

  const containerRef = useRef<View>(null!);

  const { incrementIndex } = useGlobalActionsContext();

  return (
    <SafeAreaView
      ref={containerRef}
      style={styles.root}
      edges={["bottom", "top"]}
      onLayout={handleContainerLayout}
    >
      <Text
        style={[styles.header, { height: height * 0.1 }]}
        onPress={incrementIndex}
      >
        Poziom: {level} ({index})
      </Text>
      <BoardHeader />
      <View style={[styles.boardArea]}>
        {Platform.OS === "web" ? (
          <Text style={styles.webInfo}>Skia nie jest wspierana na web.</Text>
        ) : (
          // <ZoomablePanView
          //   contentWidth={boardWidth}
          //   contentHeight={boardHeight}
          //   containerWidth={width}
          //   containerHeight={boardAreaHeight}
          //   minScale={1}
          //   maxScale={5}
          // >
          <ScrabbleBoard
            containerRef={containerRef}
            onFieldPress={handleFieldPress}
            onTilePress={handleTilePress}
          />
          // </ZoomablePanView>
        )}
      </View>
      <View style={[styles.lettersPanel]}>
        <Rack panelHeight={panelHeight} />
      </View>
      <View style={[styles.space]}></View>
      <Toast />
      <ActionPanel />
      {floatingTile ? (
        <FloatingTile
          letter={floatingTile.letter}
          startX={floatingTile.absX}
          startY={floatingTile.absY}
          onDragEnd={handleFloatingDragEnd}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#023a0a",
    marginBottom: 4,
  },

  webInfo: {
    color: "#6B6B85",
    fontSize: 14,
  },
  space: {
    flexGrow: 1,
  },
  boardArea: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  lettersPanel: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
});
