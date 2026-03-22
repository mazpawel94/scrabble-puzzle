import { StyleSheet } from "react-native";
import { Portal, Snackbar } from "react-native-paper";

import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";

const Toast = () => {
  const { snackbarMessage } = useGlobalContext();
  const { setSnackbarMessage } = useGlobalActionsContext();

  return (
    <Portal>
      <Snackbar
        theme={{ colors: { primary: "white" } }}
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage("")}
        duration={1000}
        action={{
          label: "OK",
          onPress: () => setSnackbarMessage(""),
        }}
        style={[
          styles.snackbar,
          snackbarMessage.includes("Poprawne") ? styles.success : styles.error,
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
    bottom: 600,
  },
  success: {
    backgroundColor: "green", // zielony dla sukcesu
  },
  error: {
    backgroundColor: "red", // czerwony dla błędu
  },
});
