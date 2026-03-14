import { useGlobalActionsContext } from "@/contexts/GlobalContext";
import { LEVEL } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { useWindowDimensions } from "react-native";

const useDiagramScreen = () => {
  const { level } = useLocalSearchParams<{ level: string }>();
  const { height } = useWindowDimensions();

  const { setSelectedLevel } = useGlobalActionsContext();

  const panelHeight = height * 0.2;

  const handleFieldPress = useCallback((row: number, col: number) => {
    console.log(`Kliknięto pole [${row}, ${col}]`);
  }, []);

  useEffect(() => {
    setSelectedLevel(level as LEVEL);
  }, [level]);

  return { height, level, panelHeight, handleFieldPress };
};

export default useDiagramScreen;
