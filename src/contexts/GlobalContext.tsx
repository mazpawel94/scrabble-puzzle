import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useWindowDimensions } from "react-native";

import { RackLetter } from "@/components/Rack/Rack";
import useCheckMoveIsCorrect from "@/hooks/useCheckMoveIsCorrect";
import { useTasks } from "@/hooks/useTasks";
import { IBoardLayoutParams, IBoardTile, LEVEL, Task } from "@/types";
import { convertWordToLettersArray } from "@/utils/convertCoordinates";

const BOARD_CHROME = 3 * 2 + 4 * 2;
const screenPadding = 12;

interface IGlobalContext {
  attemptsCount: number;
  boardLayoutParams: IBoardLayoutParams;
  currentLetters: string;
  currentLettersOnBoard: IBoardTile[];
  currentTask: Task | undefined;
  fieldSize: number;
  selectedLevel: LEVEL;
  moveIsCorrect: boolean;
  index: number;
  rackLetters: RackLetter[];
  revealedLocation: { x: number; y: number }[];
  snackbarMessage: string;
  tasks: Task[];
  textToDebug: string | null;
  userSolutionTiles: IBoardTile[];
}

interface IGlobalActionsContext {
  incrementIndex: () => void;
  setAttemptsCount: React.Dispatch<React.SetStateAction<number>>;
  setBoardLayoutParams: React.Dispatch<
    React.SetStateAction<IBoardLayoutParams>
  >;
  setRackLetters: React.Dispatch<React.SetStateAction<RackLetter[]>>;
  setRevealedLocation: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }[]>
  >;
  setSelectedLevel: React.Dispatch<React.SetStateAction<LEVEL>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setTextToDebug: React.Dispatch<React.SetStateAction<string | null>>;
  setUserSolutionTiles: React.Dispatch<React.SetStateAction<IBoardTile[]>>;
}

export const GlobalContext = createContext<IGlobalContext>({
  attemptsCount: 0,
  boardLayoutParams: { x: 0, y: 0, width: 0, height: 0 },
  currentLetters: "",
  currentLettersOnBoard: [],
  currentTask: undefined,
  fieldSize: 0,
  index: 0,
  moveIsCorrect: false,
  rackLetters: [],
  revealedLocation: [],
  snackbarMessage: "",
  selectedLevel: "unknown",
  tasks: [],
  textToDebug: null,
  userSolutionTiles: [],
});

export const GlobalActionsContext = createContext<IGlobalActionsContext>({
  incrementIndex: () => {},
  setAttemptsCount: () => {},
  setBoardLayoutParams: () => {},
  setRackLetters: () => {},
  setRevealedLocation: () => {},
  setSelectedLevel: () => {},
  setSnackbarMessage: () => {},
  setTextToDebug: () => {},
  setUserSolutionTiles: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const useGlobalActionsContext = () => useContext(GlobalActionsContext);

export const GlobalContextProvider = ({ children }: any) => {
  const { width } = useWindowDimensions();

  const [boardLayoutParams, setBoardLayoutParams] =
    useState<IBoardLayoutParams>({ x: 0, y: 0, width: 0, height: 0 });
  const [index, setIndex] = useState<number>(0);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);

  const [rackLetters, setRackLetters] = useState<RackLetter[]>([]);

  const [revealedLocation, setRevealedLocation] = useState<
    { x: number; y: number }[]
  >([]);
  const [selectedLevel, setSelectedLevel] = useState<LEVEL>("unknown");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [textToDebug, setTextToDebug] = useState<string | null>(null);
  const [userSolutionTiles, setUserSolutionTiles] = useState<IBoardTile[]>([]);

  const currentTask = useMemo(() => {
    return tasks[index] || undefined;
  }, [tasks, index]);

  const currentLetters = useMemo(
    () => tasks[index]?.letters || "",
    [tasks, index],
  );

  const currentLettersOnBoard: IBoardTile[] = useMemo(() => {
    return currentTask
      ? currentTask.words.flatMap((move) =>
          convertWordToLettersArray(move.word, move.coordinates),
        )
      : [];
  }, [currentTask]);

  const fieldSize = useMemo(() => {
    const availableWidth = width - screenPadding * 2 - BOARD_CHROME;
    return Math.floor(availableWidth / 15);
  }, [width]);

  const { getTasksByLevel } = useTasks();
  const { moveIsCorrect } = useCheckMoveIsCorrect(
    userSolutionTiles,
    currentLettersOnBoard,
  );

  const incrementIndex = useCallback(() => {
    setIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const tasks = getTasksByLevel(selectedLevel);
    setTasks(tasks);
  }, [selectedLevel]);

  useEffect(() => {
    setRevealedLocation([]);
  }, [index]);

  const values = {
    attemptsCount,
    boardLayoutParams,
    currentLetters,
    currentLettersOnBoard,
    currentTask,
    fieldSize,
    index,
    moveIsCorrect,
    rackLetters,
    revealedLocation,
    selectedLevel,
    snackbarMessage,
    tasks,
    textToDebug,
    userSolutionTiles,
  };
  const actions = useMemo(
    () => ({
      incrementIndex,
      setAttemptsCount,
      setBoardLayoutParams,
      setRackLetters,
      setRevealedLocation,
      setSelectedLevel,
      setSnackbarMessage,
      setTextToDebug,
      setUserSolutionTiles,
    }),
    [],
  );

  return (
    <GlobalContext.Provider value={values}>
      <GlobalActionsContext.Provider value={actions}>
        {children}
      </GlobalActionsContext.Provider>
    </GlobalContext.Provider>
  );
};
