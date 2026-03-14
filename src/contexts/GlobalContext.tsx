import { useTasks } from "@/hooks/useTasks";
import { IBoardLayoutParams, IBoardTile, LEVEL, Task } from "@/types";
import { convertWordToLettersArray } from "@/utils/convertCoordinates";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useWindowDimensions } from "react-native";

const GUTTER = 20;
const BOARD_CHROME = 3 * 2 + 4 * 2;
const screenPadding = 12;

interface IGlobalContext {
  boardLayoutParams: IBoardLayoutParams;
  index: number;
  fieldSize: number;
  tasks: Task[];
  snackbarMessage: string;
  currentLetters: string;
  currentTask: Task | undefined;
  userSolutionTiles: IBoardTile[];
  currentLettersOnBoard: IBoardTile[];
}

interface IGlobalActionsContext {
  incrementIndex: () => void;
  setSelectedLevel: React.Dispatch<React.SetStateAction<LEVEL>>;
  setBoardLayoutParams: React.Dispatch<
    React.SetStateAction<IBoardLayoutParams>
  >;
  setUserSolutionTiles: React.Dispatch<React.SetStateAction<IBoardTile[]>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const GlobalContext = createContext<IGlobalContext>({
  boardLayoutParams: { x: 0, y: 0, width: 0, height: 0 },
  snackbarMessage: "",
  index: 0,
  fieldSize: 0,
  userSolutionTiles: [],
  tasks: [],
  currentLettersOnBoard: [],
  currentLetters: "",
  currentTask: undefined,
});

export const GlobalActionsContext = createContext<IGlobalActionsContext>({
  incrementIndex: () => {},
  setSelectedLevel: () => {},
  setBoardLayoutParams: () => {},
  setUserSolutionTiles: () => {},
  setSnackbarMessage: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const useGlobalActionsContext = () => useContext(GlobalActionsContext);

export const GlobalContextProvider = ({ children }: any) => {
  const { width } = useWindowDimensions();

  const [boardLayoutParams, setBoardLayoutParams] =
    useState<IBoardLayoutParams>({ x: 0, y: 0, width: 0, height: 0 });
  const [index, setIndex] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LEVEL>("unknown");
  const [userSolutionTiles, setUserSolutionTiles] = useState<IBoardTile[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const { getTasksByLevel } = useTasks();

  const incrementIndex = useCallback(() => {
    setIndex((prev) => prev + 1);
  }, []);

  const fieldSize = useMemo(() => {
    const availableWidth = width - screenPadding * 2 - GUTTER - BOARD_CHROME;
    return Math.floor(availableWidth / 15);
  }, [width]);

  const currentTask = useMemo(() => {
    return tasks[index] || undefined;
  }, [tasks, index]);

  const currentLetters = useMemo(
    () => tasks[index]?.letters || "",
    [tasks, index],
  );

  const currentLettersOnBoard: IBoardTile[] = useMemo(
    () =>
      currentTask
        ? currentTask.words.flatMap((move) =>
            convertWordToLettersArray(move.word, move.coordinates),
          )
        : [],
    [currentTask],
  );

  useEffect(() => {
    const tasks = getTasksByLevel(selectedLevel);
    console.log("nowy level ", selectedLevel);
    setTasks(tasks);
  }, [selectedLevel]);

  const values = {
    currentLetters,
    currentTask,
    currentLettersOnBoard,
    boardLayoutParams,
    index,
    fieldSize,
    tasks,
    snackbarMessage,
    userSolutionTiles,
  };
  const actions = useMemo(
    () => ({
      incrementIndex,
      setBoardLayoutParams,
      setSelectedLevel,
      setUserSolutionTiles,
      setSnackbarMessage,
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
