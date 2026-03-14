import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { StyleSheet } from "react-native";
import { Portal, Snackbar } from "react-native-paper";

const Toast = () => {
  const { snackbarMessage } = useGlobalContext();
  const { setSnackbarMessage } = useGlobalActionsContext();
  console.log(
    "%csrc\screens\DiagramScreen.tsx:101 snackbarMessage",
    "color: #007acc;",
    snackbarMessage,
  );

  return (
    <Portal>
      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage("")}
        duration={3000}
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
    bottom: 300,
  },
  success: {
    backgroundColor: "green", // zielony dla sukcesu
    color: "white",
  },
  error: {
    color: "white",
    backgroundColor: "red", // czerwony dla błędu
  },
});
