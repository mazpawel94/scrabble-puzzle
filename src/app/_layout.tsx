import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

import AppBackground from "@/components/AppBackground";
import { Colors } from "@/constants/theme";
import { GlobalContextProvider } from "@/contexts/GlobalContext";
import { useDbMigrations } from "@/db";

export default function RootLayout() {
  const { success, error } = useDbMigrations();

  useEffect(() => {
    async function checkForUpdate() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log("Błąd update:", error);
      }
    }
    checkForUpdate();
  }, []);

  if (error) console.error("Migration error:", error);
  if (!success) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <PaperProvider>
        <GlobalContextProvider>
          <AppBackground />
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
              animation: "fade_from_bottom",
            }}
          />
        </GlobalContextProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
