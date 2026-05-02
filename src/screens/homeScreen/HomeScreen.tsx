// screens/HomeScreen.tsx
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import BoardPanel from "./BoardPanel";
import StatsPanel from "./StatsPanel";

const COLLECTIONS = [
  {
    id: "favorites",
    icon: "heart-outline",
    label: "Ulubione",
    route: "/favorites",
  },
  {
    id: "special",
    icon: "star-outline",
    label: "Zbiory specjalne",
    route: "/special",
  },
  { id: "history", icon: "history", label: "Historia", route: "/history" },
];

const PREVIEW_HEIGHT = 300;

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const viewRef = useRef(null!);

  const boardWidth = width - 12;

  const scale = PREVIEW_HEIGHT / boardWidth;
  const scaledHeight = boardWidth * scale;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ref={viewRef}
    >
      <StatsPanel />

      {/* KOLEKCJE */}
      {/* <View style={{ flexDirection: "row", gap: 10 }}>
        <CollectionTile
          icon="heart-outline"
          label="Przeglądaj ulubione"
          onPress={() => router.push("/task/esume")}
        />
        <CollectionTile
          icon="view-list-outline"
          label="Kolekcje specjalne"
          onPress={() => router.push("/task/esume")}
        />
      </View> */}

      {/* KONTYNUUJ TRENING */}
      <BoardPanel viewRef={viewRef} />
      <Text
        variant="labelLarge"
        style={{
          color: theme.colors.onSecondaryContainer,
          margin: "auto",
          textAlign: "center",
        }}
      >
        lub
      </Text>
      <View style={{ padding: 16, paddingTop: 8, display: "flex", gap: 12 }}>
        <Button
          mode="contained"
          onPress={() => router.push("/task/resume")}
          style={[styles.resumeButton, { backgroundColor: "#ebefe7" }]}
          contentStyle={{ paddingVertical: 4 }}
          icon="heart"
          textColor="#93000a"
        >
          Przeglądaj ulubione
        </Button>
        <Button
          mode="contained"
          onPress={() => router.push("/task/resume")}
          style={[styles.resumeButton, { backgroundColor: "#ebefe7" }]}
          contentStyle={{ paddingVertical: 4 }}
          icon="view-list-outline"
        >
          Rozwiązuj kolekcje specjalne
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 8,
    paddingTop: 32,
    paddingBottom: 32,
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  trainingCard: {
    borderRadius: 16,
    // paddingTop: 15,
    marginTop: 50,
    // overflow: "hidden",
  },

  boardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    opacity: 0.6,
  },
  cardActions: {
    padding: 16,
    paddingTop: 8,
  },
  resumeButton: {
    borderRadius: 8,
  },
  collectionsRow: {
    gap: 12,
    paddingBottom: 4,
  },
  collectionTile: {
    width: 110,
    height: 100,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
});
