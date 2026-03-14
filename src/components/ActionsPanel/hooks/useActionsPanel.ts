import {
  useGlobalActionsContext,
  useGlobalContext,
} from "@/contexts/GlobalContext";
import {
  convertBoardStateToStringSolution,
  convertWordToLettersArray,
} from "@/utils/convertCoordinates";
import { useCallback } from "react";

const useActionsPanel = () => {
  const {
    incrementIndex,
    setRevealedLocation,
    setSnackbarMessage,
    setUserSolutionTiles,
  } = useGlobalActionsContext();
  const { currentTask, currentLettersOnBoard, userSolutionTiles } =
    useGlobalContext();

  const handleNextDiagram = useCallback(() => {
    incrementIndex();
  }, []);

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
  return { handleNextDiagram, handleCheck, resetRack, showHint };
};

export default useActionsPanel;
