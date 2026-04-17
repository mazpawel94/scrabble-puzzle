import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/auth/AuthContext";
import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { postTaskResult } from "@/services/api";
import {
  convertBoardStateToStringSolution,
  convertWordToLettersArray,
} from "@/utils/convertCoordinates";

const useActionsPanel = () => {
  const {
    incrementIndex,
    setAttemptsCount,
    setRackLetters,
    setRevealedLocation,
    setSnackbarMessage,
    setUserSolutionTiles,
  } = useGlobalActionsContext();

  const { userId } = useAuth();

  const {
    attemptsCount,
    currentTask,
    currentLettersOnBoard,
    moveIsCorrect,
    userSolutionTiles,
    selectedLevel,
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

  const handleTaskCompletion = useCallback(
    (isCorrect: boolean) => {
      if (selectedLevel === "unknown") return;
      postTaskResult({
        userId: userId!,
        diagramId: currentTask!.id,
        attempts: attemptsCount,
        usedHints: hintsCount,
        correctlySolved: isCorrect,
      });
    },
    [selectedLevel, currentTask, userId, attemptsCount, hintsCount],
  );
  const giveUp = useCallback(() => {
    setIsActive(false);
    handleTaskCompletion(false);
    const solutionTiles = convertWordToLettersArray(
      currentTask!.solution.word,
      currentTask!.solution.coordinates,
    );
    setUserSolutionTiles(
      solutionTiles.map((el) => ({ ...el, isNewMove: true })),
    );
    setRackLetters((prev) => prev.map((el) => ({ ...el, played: true })));
  }, [currentTask, handleTaskCompletion]);

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
      handleTaskCompletion(true);
    } else {
      setAttemptsCount((prev) => prev + 1);
      if (attemptsCount < 5) setSnackbarMessage("Spróbuj jeszcze raz");
      else giveUp();
    }
  }, [currentTask, giveUp, moveIsCorrect, userSolutionTiles]);

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
            prev.findIndex((e) => e.letter === letter && !e.played) === i
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
    setAttemptsCount(0);
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
