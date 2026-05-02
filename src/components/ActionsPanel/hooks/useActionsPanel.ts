import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/auth/AuthContext";
import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { useStatsActionsContext } from "@/contexts/StatsContext";
import { deleteDiagram } from "@/db";
import { useOutbox } from "@/hooks/useOutbox";
import { postTaskResult } from "@/services/api";
import { EBoardTileState } from "@/types";
import {
  convertBoardStateToStringSolution,
  convertWordToLettersArray,
} from "@/utils/convertCoordinates";

export interface ITaskResult {
  userId: string;
  diagramId: string;
  attempts: number;
  usedHints: number;
  correctlySolved: boolean;
}

const useActionsPanel = () => {
  const {
    nextDiagram,
    setAttemptsCount,
    setRackLetters,
    setRevealedLocation,
    setSnackbarMessage,
    setUserSolutionTiles,
    setUserRank,
  } = useGlobalActionsContext();

  const { updateStats } = useStatsActionsContext();

  const { userId } = useAuth();

  const {
    attemptsCount,
    currentTask,
    currentLettersOnBoard,
    moveIsCorrect,
    userSolutionTiles,
    selectedLevel,
    userRank,
  } = useGlobalContext();

  const { sendOrEnqueue } = useOutbox();

  const [isBlankModalOpen, setIsBlankModalOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [hintsCount, setHintsCount] = useState<number>(0);

  const [userDiagramRank, setUserDiagramRank] = useState<number>(1);

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
      const taskResult = {
        userId: userId!,
        diagramId: currentTask!.id,
        attempts: attemptsCount,
        usedHints: hintsCount,
        correctlySolved: isCorrect,
      };
      updateStats(taskResult);
      postTaskResult(taskResult, sendOrEnqueue);
    },
    [selectedLevel, currentTask, userId, attemptsCount, hintsCount],
  );
  const giveUp = useCallback(() => {
    setIsActive(false);
    setUserDiagramRank(-1);
    setUserRank((prev) => prev! - 1);
    handleTaskCompletion(false);
    const solutionTiles = convertWordToLettersArray(
      currentTask!.solution.word,
      currentTask!.solution.coordinates,
    );
    setUserSolutionTiles(
      solutionTiles.map((el) => ({
        ...el,
        state: EBoardTileState.correct,
        isLocked: true,
      })),
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
      setSnackbarMessage(`Poprawne rozwiązanie 🎉`);
      setUserSolutionTiles((prev) =>
        prev.map((el) => ({
          ...el,
          state: EBoardTileState.correct,
          isLocked: true,
        })),
      );
      setRackLetters((prev) => prev.map((el) => ({ ...el, played: true })));
      setUserRank((prev) => prev! + Math.max(-1, userDiagramRank));
      setIsActive(false);
      handleTaskCompletion(true);
    } else {
      setUserDiagramRank((prev) => prev - 0.2);
      setAttemptsCount((prev) => prev + 1);
      if (attemptsCount < 5) setSnackbarMessage(`Spróbuj jeszcze raz`);
      else giveUp();
    }
  }, [
    currentTask,
    giveUp,
    moveIsCorrect,
    userSolutionTiles,
    userDiagramRank,
    attemptsCount,
  ]);

  const handleNextDiagram = useCallback(async () => {
    await deleteDiagram(currentTask!.id);
    setUserSolutionTiles([]);
    if (userDiagramRank === 1) nextDiagram((currentTask!.level || -1) + 1);
    else if (userDiagramRank <= -1) nextDiagram((currentTask!.level || 1) - 1);
    else nextDiagram(Math.floor(userRank!));
  }, [userDiagramRank, userRank, currentTask, nextDiagram]);

  const shuffleRack = useCallback(() => {
    setRackLetters((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }, []);

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
        setUserDiagramRank((prev) => prev - 1.2);
        break;
      case 1: {
        resetRack();
        setUserDiagramRank((prev) => prev - 0.5);
        const firstTile = solutionTiles[0];
        setUserSolutionTiles([
          { ...firstTile, state: EBoardTileState.newMove, isLocked: true },
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
        setUserDiagramRank((prev) => prev - 0.3);

        setUserSolutionTiles([
          {
            ...solutionTiles[0],
            state: EBoardTileState.newMove,
            isLocked: true,
          },
          { ...lastTile, state: EBoardTileState.newMove, isLocked: true },
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
    setUserDiagramRank(1);
  }, [currentTask]);

  return {
    defineBlank,
    giveUp,
    handleCheck,
    handleNextDiagram,
    resetRack,
    showHint,
    shuffleRack,
    hintsCount,
    isActive,
    isBlankModalOpen,
    availableHints: Math.min(
      3,
      currentTask?.solution.word.replaceAll(".", "").length || 0,
    ),
    isDisabledResetRack: userSolutionTiles.length === 0,
    moveIsCorrect,
  };
};

export default useActionsPanel;
