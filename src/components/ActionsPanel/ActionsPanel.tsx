import React, { useState } from "react";
import NewDiagramForm from "../NewDiagramForm";
import { ActionBar } from "./ActionBar";
import useActionsPanel from "./hooks/useActionsPanel";

export const ActionPanel = () => {
  const {
    isDisabledResetRack,
    handleNextDiagram,
    handleCheck,
    resetRack,
    showHint,
  } = useActionsPanel();
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);

  return (
    <>
      {formIsOpen ? (
        <NewDiagramForm closeForm={() => setFormIsOpen(false)} />
      ) : null}
      <ActionBar
        actions={[
          {
            icon: "arrow-down",
            label: "Odłóż",
            onPress: resetRack,
            disabled: isDisabledResetRack,
          },
          {
            icon: "lightbulb-outline",
            label: "Podpowiedź",
            onPress: showHint,
          },
          { icon: "check", label: "Zatwierdź", onPress: handleCheck },

          // { icon: "flag-outline", label: "Poddaję się", onPress: () => {} },
          {
            icon: "skip-next",
            label: "Następny",
            onPress: handleNextDiagram,
          },
          {
            icon: "plus",
            label: "Zapisz",
            onPress: () => setFormIsOpen(true),
          },
        ]}
      />
    </>
  );
};
