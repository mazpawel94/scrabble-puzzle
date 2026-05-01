import React, { useState } from "react";

import { useGlobalContext } from "@/contexts/GlobalContext";
import { BlankPickerModal } from "../BlankPickerModal";
import NewDiagramForm from "../NewDiagramForm";
import { ActionBar } from "./ActionBar";
import useActionsPanel from "./hooks/useActionsPanel";

export const ActionPanel = () => {
  const {
    availableHints,
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
    shuffleRack,
  } = useActionsPanel();
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
  const { isAdmin } = useGlobalContext();

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
          ...[
            isAdmin
              ? {
                  icon: "plus",
                  label: "Zapisz",
                  onPress: () => setFormIsOpen(true),
                }
              : {
                  icon: "swap-horizontal-variant",
                  label: "Mieszaj",
                  onPress: shuffleRack,
                  disabled: !isActive,
                },
          ],

          {
            icon: "check",
            label: "Zatwierdź",
            onPress: handleCheck,
            disabled: !isActive || !moveIsCorrect,
          },
          {
            icon: "lightbulb-outline",
            label: "Podpowiedź",
            onPress: showHint,
            disabled: hintsCount >= availableHints || !isActive,
            number: hintsCount,
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
        ]}
      />
    </>
  );
};
