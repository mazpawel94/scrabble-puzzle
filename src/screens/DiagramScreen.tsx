import { useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionPanel } from "@/components/ActionsPanel/ActionsPanel";
import ScrabbleBoard from "@/components/Board/ScrabbleBoard";
import Rack from "@/components/Rack/Rack";
import Toast from "@/components/Toast";
import useDiagramScreen from "./hooks/useDiagramScreen";

export default function DiagramScreen() {
  const { height, level, panelHeight, handleFieldPress } = useDiagramScreen();

  const containerRef = useRef<View>(null!);

  return (
    <SafeAreaView ref={containerRef} style={styles.root} edges={["bottom"]}>
      <Text style={[styles.header, { height: height * 0.1 }]}>
        Poziom: {level}
      </Text>
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
          />
          // </ZoomablePanView>
        )}
      </View>
      <View style={[styles.lettersPanel]}>
        <Rack containerRef={containerRef} panelHeight={panelHeight} />
      </View>
      <View style={[styles.space]}></View>
      <Toast />
      <ActionPanel />
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
  subheader: {
    color: "#6B6B85",
    marginBottom: 24,
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
    marginTop: 100,
  },
  lettersPanel: {
    width: "100%",
    // backgroundColor: "rgba(0, 0, 0, 0.45)",
    // borderTopWidth: 1,
    // borderTopColor: "#1E1E2E",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
});
