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
  const { currentTask, currentLettersOnBoard, userSolutionTiles } =
    useGlobalContext();

  const [isBlankModalOpen, setIsBlankModalOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

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
    if (!userSolutionTiles.length)
      return setSnackbarMessage("Ułóż jakieś słowo");
    const res = convertBoardStateToStringSolution(
      userSolutionTiles,
      currentLettersOnBoard,
    );

    if (
      currentTask?.solution.coordinates === res.coordinates &&
      currentTask.solution.word === res.word
    ) {
      setSnackbarMessage("Poprawne rozwiązanie 🎉");
      setIsActive(false);
    } else setSnackbarMessage("Spróbuj jeszcze raz");
  }, [currentTask, userSolutionTiles]);

  const handleNextDiagram = useCallback(() => incrementIndex(), []);

  const resetRack = useCallback(() => {
    setUserSolutionTiles([]);
  }, []);

  const showHint = useCallback(() => {
    const positions = convertWordToLettersArray(
      currentTask!.solution.word,
      currentTask!.solution.coordinates,
    );
    setRevealedLocation(positions.map((el) => ({ x: el.x, y: el.y })));
  }, [currentTask]);

  useEffect(() => {
    if (userSolutionTiles.some((el) => el.letter === "?"))
      setIsBlankModalOpen(true);
  }, [userSolutionTiles]);

  useEffect(() => setIsActive(true), [currentTask]);

  return {
    defineBlank,
    giveUp,
    handleCheck,
    handleNextDiagram,
    resetRack,
    showHint,

    isActive,
    isBlankModalOpen,
    isDisabledResetRack: userSolutionTiles.length === 0,
  };
};

export default useActionsPanel;
