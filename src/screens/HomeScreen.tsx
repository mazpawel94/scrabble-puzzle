import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import LevelButton from "../components/LevelButton";
import { useTasks } from "../hooks/useTasks";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { loading, error, getTasksByLevel } = useTasks();
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Ładowanie zadań...</Text>
      </View>
    );
  }
  if (error) {
    Alert.alert("Błąd", error, [
      { text: "Spróbuj ponownie", onPress: () => {} },
    ]);
    return null;
  }
  const handleLevelPress = (level: "easy" | "medium" | "hard") => {
    const filteredTasks = getTasksByLevel(level);
    (navigation as any).navigate("TaskScreen", {
      level,
      tasks: filteredTasks,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz poziom trudności</Text>
      <View style={styles.buttonsContainer}>
        <LevelButton level="easy" onPress={() => handleLevelPress("easy")} />
        <LevelButton
          level="medium"
          onPress={() => handleLevelPress("medium")}
        />
        <LevelButton level="hard" onPress={() => handleLevelPress("hard")} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#333",
  },
  buttonsContainer: {
    width: "100%",
    gap: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
export default HomeScreen;
