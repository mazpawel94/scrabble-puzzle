import { StyleSheet } from "react-native";
import { Portal, Snackbar, useTheme } from "react-native-paper";

import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";

const Toast = () => {
  const { snackbarMessage } = useGlobalContext();
  const { setSnackbarMessage } = useGlobalActionsContext();

  const theme = useTheme();

  if (!snackbarMessage) return null;
  return (
    <Portal>
      <Snackbar
        visible={!!snackbarMessage}
        theme={{
          colors: { inverseOnSurface: "white", inversePrimary: "white" },
        }}
        onDismiss={() => setSnackbarMessage("")}
        duration={1500}
        style={[
          styles.snackbar,
          snackbarMessage.includes("Poprawne")
            ? styles.success
            : { backgroundColor: theme.colors.error },
        ]}
      >
        {snackbarMessage}
      </Snackbar>
    </Portal>
  );
};

export default Toast;

const styles = StyleSheet.create({
  snackbar: {
    zIndex: 100,
    bottom: 100,
  },
  success: {
    backgroundColor: "green",
  },
});
