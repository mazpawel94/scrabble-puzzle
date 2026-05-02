import { useStatsContext } from "@/contexts/StatsContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";

const StatsPanel = () => {
  const theme = useTheme();
  const router = useRouter();

  const { correctlySolved } = useStatsContext();

  if (!correctlySolved) return null;

  return (
    <Surface
      style={[
        styles.statsCard,
        { backgroundColor: theme.colors.secondaryContainer },
      ]}
      elevation={1}
    >
      <View style={styles.statsRow}>
        <View style={styles.statsCount}>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSecondaryContainer,
              marginHorizontal: 8,
              marginTop: 12,
            }}
          >
            Poprawnie rozwiązanych zadań:
          </Text>
          <Text
            variant="displaySmall"
            style={{
              color: theme.colors.onSecondaryContainer,
              fontWeight: "700",
              transform: [{ translateY: 6 }],
            }}
          >
            {correctlySolved}
          </Text>
        </View>
      </View>
      <Button
        mode="text"
        compact
        onPress={() => router.push("/stats")}
        textColor={theme.colors.primary}
        style={{ alignSelf: "flex-end", marginLeft: -8, marginTop: 4 }}
      >
        pełne statystyki →
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    marginTop: 30,
    flexGrow: 1,
    marginHorizontal: 20,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsCount: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
  },
});

export default StatsPanel;
