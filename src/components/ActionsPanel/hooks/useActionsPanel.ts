import { useCallback, useEffect, useState } from "react";

import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import {
  convertBoardStateToStringSolution,
  convertWordToLettersArray,
} from "@/utils/convertCoordinates";

const useActionsPanel = () => {
  const {
    incrementIndex,
    setRackLetters,
    setRevealedLocation,
    setSnackbarMessage,
    setUserSolutionTiles,
  } = useGlobalActionsContext();
  const {
    currentTask,
    currentLettersOnBoard,
    moveIsCorrect,
    userSolutionTiles,
  } = useGlobalContext();

  const [isBlankModalOpen, setIsBlankModalOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [hintsCount, setHintsCount] = useState<number>(0);

  const defineBlank = useCallback((letter: string) => {
    setUserSolutionTiles((prev) =>
      prev.map((el) =>
        el.letter === "?" ? { ...el, letter: letter.toLowerCase() } : el,
      ),
    );
    setIsBlankModalOpen(false);
  }, []);

  const giveUp = useCallback(() => {
    setIsActive(false);
    const solutionTiles = convertWordToLettersArray(
      currentTask!.solution.word,
      currentTask!.solution.coordinates,
    );
    setUserSolutionTiles(
      solutionTiles.map((el) => ({ ...el, isNewMove: true })),
    );
    setRackLetters((prev) => prev.map((el) => ({ ...el, played: true })));
  }, [currentTask]);

  const handleCheck = useCallback(() => {
    if (!userSolutionTiles.length || !moveIsCorrect)
      return setSnackbarMessage("Ułóż poprawne słowo");
    const { coordinates, word } = convertBoardStateToStringSolution(
      userSolutionTiles,
      currentLettersOnBoard,
    );

    if (
      currentTask?.solution.coordinates === coordinates &&
      currentTask.solution.word === word
    ) {
      setSnackbarMessage("Poprawne rozwiązanie 🎉");
      setIsActive(false);
    } else setSnackbarMessage("Spróbuj jeszcze raz");
  }, [currentTask, moveIsCorrect, userSolutionTiles]);

  const handleNextDiagram = useCallback(() => incrementIndex(), []);

  const resetRack = useCallback(() => {
    setUserSolutionTiles((prev) => prev.filter((el) => el.isLocked));
    setRackLetters((prev) => {
      const tempRack = prev.map((el) => ({ ...el, played: false }));
      userSolutionTiles
        .filter((el) => el.isLocked)
        .forEach((el) => {
          const letter =
            el.letter !== el.letter.toUpperCase() ? "?" : el.letter;
          const index = tempRack.findIndex(
            (l) => l.letter === letter && !l.played,
          );
          if (index !== -1) tempRack[index].played = true;
        });
      return tempRack;
    });
  }, [userSolutionTiles]);

  const showHint = useCallback(() => {
    const solutionTiles = convertWordToLettersArray(
      currentTask!.solution.word,
      currentTask!.solution.coordinates,
    );
    switch (hintsCount) {
      case 0:
        setRevealedLocation(solutionTiles.map((el) => ({ x: el.x, y: el.y })));
        break;
      case 1: {
        resetRack();
        const firstTile = solutionTiles[0];
        setUserSolutionTiles([
          { ...firstTile, isNewMove: true, isLocked: true },
        ]);
        const letter =
          firstTile.letter !== firstTile.letter.toUpperCase()
            ? "?"
            : firstTile.letter;
        setRackLetters((prev) =>
          prev.map((el, i) =>
            el.letter === letter &&
            prev.findIndex((e) => e.letter === letter) === i
              ? { ...el, played: true }
              : el,
          ),
        );
        break;
      }
      case 2: {
        resetRack();
        const lastTile = solutionTiles[solutionTiles.length - 1];
        setUserSolutionTiles([
          { ...solutionTiles[0], isNewMove: true, isLocked: true },
          { ...lastTile, isNewMove: true, isLocked: true },
        ]);
        const letter =
          lastTile.letter !== lastTile.letter.toUpperCase()
            ? "?"
            : lastTile.letter;
        setRackLetters((prev) =>
          prev.map((el, i) =>
            el.letter === letter &&
            prev.findIndex((e) => e.letter === letter) === i
              ? { ...el, played: true }
              : el,
          ),
        );
        break;
      }
    }
    setHintsCount((prev) => prev + 1);
  }, [currentTask, hintsCount, resetRack]);

  useEffect(() => {
    if (userSolutionTiles.some((el) => el.letter === "?"))
      setIsBlankModalOpen(true);
  }, [userSolutionTiles]);

  useEffect(() => {
    setIsActive(true);
    setHintsCount(0);
  }, [currentTask]);

  return {
    defineBlank,
    giveUp,
    handleCheck,
    handleNextDiagram,
    resetRack,
    showHint,
    hintsCount,
    isActive,
    isBlankModalOpen,
    isDisabledResetRack: userSolutionTiles.length === 0,
    moveIsCorrect,
  };
};

export default useActionsPanel;
