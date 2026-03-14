import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import NewDiagramForm from "../NewDiagramForm";
import useActionsPanel from "./hooks/useActionsPanel";

export const ActionPanel = () => {
  const { handleNextDiagram, handleCheck, resetRack, showHint } =
    useActionsPanel();
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);

  return (
    <>
      {formIsOpen ? (
        <NewDiagramForm closeForm={() => setFormIsOpen(false)} />
      ) : null}
      <Surface style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Button mode="contained" onPress={handleCheck} style={styles.button}>
            Ok
          </Button>
          <Button mode="outlined" onPress={resetRack} style={styles.button}>
            Cofnij
          </Button>

          <Button
            mode="outlined"
            onPress={handleNextDiagram}
            style={styles.button}
          >
            Następny
          </Button>
          <Button
            mode="outlined"
            onPress={() => setFormIsOpen(true)}
            style={styles.button}
          >
            Dodaj
          </Button>
          <Button mode="outlined" onPress={showHint} style={styles.button}>
            Podpowiedź
          </Button>
          <Button mode="outlined" onPress={() => {}} style={styles.button}>
            Poddaję się
          </Button>
        </ScrollView>
      </Surface>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 100,
    // left: 0,
    // right: 0,
    backgroundColor: "#023a0a",
    elevation: 4, // cień dla "ładnego" wyglądu
    padding: 8,
    display: "flex",
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginHorizontal: 4,
    minWidth: 100, // zapobiega zbyt małym buttonom
  },
});
