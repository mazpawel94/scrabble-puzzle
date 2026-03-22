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

export default function RootLayout() {
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
