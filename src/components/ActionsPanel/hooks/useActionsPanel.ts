import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import { convertBoardStateToStringSolution } from "@/utils/convertCoordinates";
import { useCallback } from "react";

const useActionsPanel = () => {
  const { incrementIndex, setSnackbarMessage, setUserSolutionTiles } =
    useGlobalActionsContext();
  const { currentTask, currentLettersOnBoard, userSolutionTiles } =
    useGlobalContext();

  const handleNextDiagram = useCallback(() => {
    incrementIndex();
  }, []);

  const resetRack = useCallback(() => {
    // setRackLetters((prev) => prev.map((el) => ({ ...el, played: false })));
    setUserSolutionTiles([]);
  }, []);

  const handleCheck = useCallback(() => {
    const res = convertBoardStateToStringSolution(
      userSolutionTiles,
      currentLettersOnBoard,
    );

    // console.log({
    //   solution: currentTask?.solution,
    //   word: all.word,
    //   coord: all.coordinates,
    // });
    if (
      currentTask?.solution.coordinates === res.coordinates &&
      currentTask.solution.word === res.word
    )
      setSnackbarMessage("Poprawne rozwiązanie 🎉");
    else setSnackbarMessage("Spróbuj jeszcze raz");
  }, [currentTask, userSolutionTiles]);
  return { handleNextDiagram, handleCheck, resetRack };
};

export default useActionsPanel;
