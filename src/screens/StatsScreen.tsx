import { useGlobalContext } from "@/contexts/GlobalContext";
import { useStatsContext } from "@/contexts/StatsContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

// --- Typy ---

interface Stats {
  totalSolved: number;
  correctlySolved: number;
  solvedWithoutHints: number;
  solvedWithoutMistakes: number;
  longestNoHintsStreak: number;
  longestNoMistakesStreak: number;
  currentNoHintsStreak: number;
  currentNoMistakesStreak: number;
}

// --- Motywy ---

const lightTheme = {
  background: "#F7F6F3",
  surface: "#FFFFFF",
  surfaceSecondary: "#F0EEE9",
  textPrimary: "#1A1A18",
  textSecondary: "#6B6A65",
  textTertiary: "#9E9D98",
  border: "rgba(0,0,0,0.08)",
};

const darkTheme = {
  background: "#141413",
  surface: "#1E1E1C",
  surfaceSecondary: "#262624",
  textPrimary: "#F0EFE9",
  textSecondary: "#9E9D98",
  textTertiary: "#6B6A65",
  border: "rgba(255,255,255,0.08)",
};

// --- Komponent paska postępu ---

interface ProgressBarProps {
  progress: number; // 0–1
  color: string;
}

const ProgressBar = ({ progress, color }: ProgressBarProps) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 800,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={[styles.progressBg, { backgroundColor: "#fff" }]}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            backgroundColor: color,
            width: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

// --- Komponent karty metryki ---

interface MetricCardProps {
  label: string;
  value: number;
  sublabel: string;
  progress: number;
}

const getProgressColor = (progress: number) => {
  if (progress < 0.3) return "#ff2424";
  if (progress < 0.6) return "#ff9924";
  if (progress < 0.8) return "#2082dd";
  if (progress < 0.9) return "#24afff";
  if (progress < 0.96) return "#06bda5";
  return "#06bd77";
};
const MetricCard = ({ label, value, sublabel, progress }: MetricCardProps) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);
  const color = getProgressColor(progress);
  const pct = Math.round(progress * 100);
  const theme = useTheme();
  return (
    <Animated.View
      style={[
        styles.metricCard,
        {
          backgroundColor: theme.colors.secondaryContainer,
          opacity: 0.9,
          transform: [{ scale: anim }],
        },
      ]}
    >
      <Text
        style={[
          styles.metricLabel,
          { color: theme.colors.onSecondaryContainer },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.metricValue,
          { color: theme.colors.onSecondaryContainer },
        ]}
      >
        {value}
      </Text>
      <ProgressBar progress={progress} color={color} />
      <View style={styles.progressLabels}>
        <Text
          style={[
            styles.progressText,
            { color: theme.colors.onPrimaryContainer },
          ]}
        >
          {sublabel}
        </Text>
        <Text
          style={[
            styles.progressText,
            { color: theme.colors.onPrimaryContainer },
          ]}
        >
          {pct}%
        </Text>
      </View>
    </Animated.View>
  );
};

// --- Komponent karty serii ---

interface StreakCardProps {
  title: string;
  current: number;
  best: number;
  iconName: "check" | "lightbulb-outline";
}

const StreakCard = ({ title, current, best, iconName }: StreakCardProps) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const progressRatio = best > 0 ? Math.min(current / best, 1) : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressRatio,
      duration: 900,
      delay: 500,
      useNativeDriver: false,
    }).start();
  }, [progressRatio]);

  return (
    <Animated.View
      style={[
        styles.streakCard,
        {
          backgroundColor: theme.colors.onPrimary,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.streakIcon,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
      >
        <MaterialCommunityIcons name={iconName} size={24} />
      </View>
      <View style={styles.streakBody}>
        <Text style={[styles.streakTitle, { color: "#fff" }]}>{title}</Text>
        <View style={styles.streakNumbers}>
          <Text style={[styles.streakCurrent, { color: "#fff" }]}>
            {current}
          </Text>
          <Text
            style={[styles.streakBest, { color: theme.colors.surfaceVariant }]}
          >
            rekord:
            <Text
              style={{
                color: theme.colors.surface,
                fontWeight: "600",
              }}
            >
              {best}
            </Text>
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export const StatsScreen = () => {
  const stats = useStatsContext();
  const { diagramsLength } = useGlobalContext();

  const correctPct =
    stats.totalSolved > 0 ? stats.correctlySolved / stats.totalSolved : 0;
  const totalTasksPct =
    stats.totalSolved > 0
      ? stats.totalSolved /
        (diagramsLength + stats.initialStatsValue.totalSolved)
      : 0;
  const noMistakesPct =
    stats.correctlySolved > 0
      ? stats.solvedWithoutMistakes / stats.correctlySolved
      : 0;
  const noHintsPct =
    stats.correctlySolved > 0
      ? stats.solvedWithoutHints / stats.correctlySolved
      : 0;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const theme = useTheme();
  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Nagłówek */}
      <Animated.View
        style={{ opacity: headerOpacity, transform: [{ translateY: headerY }] }}
      >
        <Text style={[styles.heading, { color: theme.colors.onPrimary }]}>
          Twoje statystyki
        </Text>
      </Animated.View>

      <Text style={[styles.sectionLabel, { color: theme.colors.secondary }]}>
        Wyniki
      </Text>
      <View style={styles.grid}>
        <MetricCard
          label="Wyświetlone"
          value={stats.totalSolved}
          sublabel={`ze wszystkich(${diagramsLength + stats.totalSolved})`}
          progress={totalTasksPct}
        />
        <MetricCard
          label="Rozwiązane"
          value={stats.correctlySolved}
          sublabel="skuteczność"
          progress={correctPct}
        />
        <MetricCard
          label="Za pierwszym razem"
          value={stats.solvedWithoutMistakes}
          sublabel="z poprawnych"
          progress={noMistakesPct}
        />
        <MetricCard
          label="Bez podpowiedzi"
          value={stats.solvedWithoutHints}
          sublabel="z poprawnych"
          progress={noHintsPct}
        />
      </View>

      {/* Sekcja: Serie */}
      <Text style={[styles.sectionLabel, { color: "#fff" }]}>
        Aktualne serie
      </Text>
      <View style={styles.streaks}>
        <StreakCard
          title="Za pierwszym razem"
          current={stats.currentNoMistakesStreak}
          best={stats.longestNoMistakesStreak}
          iconName="check"
        />
        <StreakCard
          title="Bez podpowiedzi"
          current={stats.currentNoHintsStreak}
          best={stats.longestNoHintsStreak}
          iconName="lightbulb-outline"
        />
      </View>
    </ScrollView>
  );
};

// --- Style ---

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 25, fontWeight: "600", marginBottom: 4 },
  subheading: { fontSize: 14, marginBottom: 4 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 24,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    width: "48%",
    borderRadius: 10,
    padding: 14,
  },
  metricLabel: { fontSize: 12, marginBottom: 4 },
  metricValue: { fontSize: 28, fontWeight: "500", lineHeight: 32 },
  progressBg: {
    height: 4,
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: { height: "100%", borderRadius: 99 },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  progressText: { fontSize: 11 },
  streaks: { gap: 10 },
  streakCard: {
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  streakIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  streakBody: { flex: 1 },
  streakTitle: { fontSize: 13, marginBottom: 2 },
  streakNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  streakCurrent: { fontSize: 30, fontWeight: "500", lineHeight: 36 },
  streakBest: { fontSize: 12 },
  iconWrap: { alignItems: "center", justifyContent: "center" },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkLeft: {
    position: "absolute",
    width: 5,
    height: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "45deg" }, { translateX: -1 }, { translateY: 1 }],
  },
  checkRight: {
    position: "absolute",
    width: 8,
    height: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "-45deg" }, { translateX: 2 }],
  },
});

export default StatsScreen;
