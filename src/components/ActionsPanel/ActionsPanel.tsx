import React, { useState } from "react";

import { BlankPickerModal } from "../BlankPickerModal";
import NewDiagramForm from "../NewDiagramForm";
import { ActionBar } from "./ActionBar";
import useActionsPanel from "./hooks/useActionsPanel";

export const ActionPanel = () => {
  const {
    hintsCount,
    isActive,
    isBlankModalOpen,
    isDisabledResetRack,
    moveIsCorrect,
    defineBlank,
    giveUp,
    handleCheck,
    handleNextDiagram,
    resetRack,
    showHint,
  } = useActionsPanel();
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);

  return (
    <>
      {formIsOpen ? (
        <NewDiagramForm closeForm={() => setFormIsOpen(false)} />
      ) : null}
      {isBlankModalOpen ? <BlankPickerModal onConfirm={defineBlank} /> : null}
      <ActionBar
        actions={[
          {
            icon: "arrow-down",
            label: "Odłóż",
            onPress: resetRack,
            disabled: isDisabledResetRack || !isActive,
          },
          {
            icon: "lightbulb-outline",
            label: "Podpowiedź",
            onPress: showHint,
            disabled: hintsCount >= 3 || !isActive,
            number: hintsCount,
          },
          {
            icon: "check",
            label: "Zatwierdź",
            onPress: handleCheck,
            disabled: !isActive || !moveIsCorrect,
          },

          ...[
            isActive
              ? { icon: "flag-outline", label: "Poddaj się", onPress: giveUp }
              : {
                  icon: "skip-next",
                  label: "Następny",
                  onPress: handleNextDiagram,
                },
          ],
          // {
          //   icon: "plus",
          //   label: "Zapisz",
          //   onPress: () => setFormIsOpen(true),
          // },
        ]}
      />
    </>
  );
};
