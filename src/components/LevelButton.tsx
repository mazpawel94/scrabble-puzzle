import { useGlobalActionsContext } from "@/contexts/GlobalContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
interface LevelButtonProps {
  level: "easy" | "medium" | "hard" | "unknown";
  onPress: () => void;
  style?: ViewStyle;
}
const levelColors = {
  easy: "#4CAF50",
  medium: "#FF9800",
  hard: "#F44336",
  unknown: "#777",
};
const levelLabels = {
  easy: "Łatwy",
  medium: "Średni",
  hard: "Trudny",
  unknown: "Nieznany",
};
const LevelButton: React.FC<LevelButtonProps> = ({ level, onPress, style }) => {
  const { setSelectedLevel } = useGlobalActionsContext();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: levelColors[level] }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{levelLabels[level]}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
  },
});
export default LevelButton;
