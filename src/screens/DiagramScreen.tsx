import { Platform, StyleSheet, Text, View } from "react-native";

import ScrabbleBoardWithCoords from "@/components/ScrabbleBoardWithCoords";
import ZoomablePanView from "@/components/ZoomablePanView";
import { SafeAreaView } from "react-native-safe-area-context";
import useDiagramScreen from "./hooks/useDiagramScreen";

export default function DiagramScreen() {
  const {
    currentTask,
    width,
    height,
    level,
    boardAreaHeight,
    panelHeight,
    fieldSize,
    boardWidth,
    boardHeight,
    tasks,
    handleFieldPress,
  } = useDiagramScreen();
  return (
    <SafeAreaView style={styles.root}>
      {/* Górne 80% – plansza */}
      <Text style={[styles.header, { height: height * 0.1 }]}>
        Poziom: {level}
      </Text>
      <Text style={styles.subheader}>Zadań: {tasks.length}</Text>
      <View style={[styles.boardArea, { height: boardAreaHeight }]}>
        {Platform.OS === "web" ? (
          <Text style={styles.webInfo}>Skia nie jest wspierana na web.</Text>
        ) : (
          <ZoomablePanView
            contentWidth={boardWidth}
            contentHeight={boardHeight}
            containerWidth={width}
            containerHeight={boardAreaHeight}
            minScale={1}
            maxScale={5}
          >
            <ScrabbleBoardWithCoords
              fieldSize={fieldSize}
              onFieldPress={handleFieldPress}
              boardTiles={currentTask?.lettersOnBoard || []}
            />
          </ZoomablePanView>
        )}
      </View>

      {/* Dolne 20% – panel liter */}
      <View style={[styles.lettersPanel, { height: panelHeight }]}>
        {/* TODO: litery gracza */}
        <Text style={styles.panelPlaceholder}>{currentTask?.letters}</Text>
      </View>
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
  boardArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lettersPanel: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderTopWidth: 1,
    borderTopColor: "#1E1E2E",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  panelPlaceholder: {
    color: "#6B6B85",
    fontSize: 14,
  },
});
