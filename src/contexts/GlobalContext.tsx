import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useWindowDimensions } from "react-native";

import { RackLetter } from "@/components/Rack/Rack";
import useCheckMoveIsCorrect from "@/hooks/useCheckMoveIsCorrect";
import useHandleTasks from "@/hooks/useHandleTasks";
import {
  getUserRank,
  setUserRank as setUserRankStorage,
} from "@/storage/syncMeta";
import {
  EBoardTileState,
  IBoardLayoutParams,
  IBoardTile,
  LEVEL,
  Task,
} from "@/types";
import { convertWordToLettersArray } from "@/utils/convertCoordinates";

const BOARD_CHROME = 3 * 2 + 4 * 2;
const screenPadding = 12;

const levelMap: Record<string, number> = {
  easy: 1,
  medium: 4,
  hard: 7,
  unknown: -10,
};

interface IGlobalContext {
  attemptsCount: number;
  boardLayoutParams: IBoardLayoutParams;
  currentLetters: string;
  currentLettersOnBoard: IBoardTile[];
  currentTask: Task | undefined;
  fieldSize: number;
  isAdmin: boolean;
  selectedLevel: LEVEL;
  moveIsCorrect: boolean;
  userRank: number | null;
  rackLetters: RackLetter[];
  revealedLocation: { x: number; y: number }[];
  snackbarMessage: string;
  textToDebug: string | null;
  userSolutionTiles: IBoardTile[];
}

interface IGlobalActionsContext {
  nextDiagram: (level?: number) => void;
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
  setUserRank: React.Dispatch<React.SetStateAction<number | null>>;
  setUserSolutionTiles: React.Dispatch<React.SetStateAction<IBoardTile[]>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalContext = createContext<IGlobalContext>({
  attemptsCount: 0,
  boardLayoutParams: { x: 0, y: 0, width: 0, height: 0 },
  currentLetters: "",
  currentLettersOnBoard: [],
  currentTask: undefined,
  fieldSize: 0,
  userRank: null,
  moveIsCorrect: false,
  rackLetters: [],
  revealedLocation: [],
  snackbarMessage: "",
  selectedLevel: "unknown",
  textToDebug: null,
  userSolutionTiles: [],
  isAdmin: false,
});

export const GlobalActionsContext = createContext<IGlobalActionsContext>({
  nextDiagram: () => {},
  setAttemptsCount: () => {},
  setBoardLayoutParams: () => {},
  setRackLetters: () => {},
  setRevealedLocation: () => {},
  setSelectedLevel: () => {},
  setSnackbarMessage: () => {},
  setTextToDebug: () => {},
  setUserSolutionTiles: () => {},
  setUserRank: () => {},
  setIsAdmin: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const useGlobalActionsContext = () => useContext(GlobalActionsContext);

export const GlobalContextProvider = ({ children }: any) => {
  const { width } = useWindowDimensions();
  const [isAdmin, setIsAdmin] = useState(false);
  const [boardLayoutParams, setBoardLayoutParams] =
    useState<IBoardLayoutParams>({ x: 0, y: 0, width: 0, height: 0 });
  const [attemptsCount, setAttemptsCount] = useState<number>(0);

  const [rackLetters, setRackLetters] = useState<RackLetter[]>([]);

  const [revealedLocation, setRevealedLocation] = useState<
    { x: number; y: number }[]
  >([]);
  const [selectedLevel, setSelectedLevel] = useState<LEVEL>("resume");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [textToDebug, setTextToDebug] = useState<string | null>(null);
  const [userSolutionTiles, setUserSolutionTiles] = useState<IBoardTile[]>([]);

  const [userRank, setUserRank] = useState<number | null>(null);

  const { queueReady, currentTask, nextDiagram } = useHandleTasks(userRank);

  const currentLetters = useMemo(
    () => currentTask?.letters || "",
    [currentTask],
  );

  const currentLettersOnBoard: IBoardTile[] = useMemo(() => {
    return currentTask
      ? currentTask.words.flatMap((move) =>
          convertWordToLettersArray(move.word, move.coordinates).map((el) => ({
            ...el,
            state: EBoardTileState.initial,
          })),
        )
      : [];
  }, [currentTask]);

  const fieldSize = useMemo(() => {
    const availableWidth = width - screenPadding * 2 - BOARD_CHROME;
    return Math.floor(availableWidth / 15);
  }, [width]);

  const { moveIsCorrect } = useCheckMoveIsCorrect(
    userSolutionTiles,
    currentLettersOnBoard,
  );

  //na bieżąco aktualizujemy localstorage, żeby rank był tam zawsze aktualny i można było wznowić grę po zamknięciu aplikacji
  useEffect(() => {
    if (userRank !== null) setUserRankStorage(userRank);
  }, [userRank]);

  useEffect(() => {
    setRevealedLocation([]);
  }, [currentTask]);

  useEffect(() => {
    if (!queueReady || !selectedLevel) return;
    const startGame = async () => {
      if (selectedLevel === "resume") {
        try {
          const savedRank = await getUserRank();
          nextDiagram(savedRank!);
          console.log({ savedRank });
          setUserRank(savedRank!);
        } catch (error) {
          console.error("Błąd pobierania rankingu z resume:", error);
          nextDiagram(1);
          setUserRank(1);
        }
        return;
      }
      const startLevel = levelMap[selectedLevel] ?? 0;
      nextDiagram(startLevel);
      setUserRank(startLevel);
    };
    startGame();
  }, [selectedLevel, queueReady]);

  const values = {
    attemptsCount,
    boardLayoutParams,
    currentLetters,
    currentLettersOnBoard,
    currentTask,
    fieldSize,
    moveIsCorrect,
    rackLetters,
    revealedLocation,
    selectedLevel,
    snackbarMessage,
    textToDebug,
    userRank,
    userSolutionTiles,
    isAdmin,
  };
  const actions = useMemo(
    () => ({
      nextDiagram,
      setAttemptsCount,
      setBoardLayoutParams,
      setRackLetters,
      setRevealedLocation,
      setSelectedLevel,
      setSnackbarMessage,
      setTextToDebug,
      setUserRank,
      setUserSolutionTiles,
      setIsAdmin,
    }),
    [nextDiagram],
  );

  return (
    <GlobalContext.Provider value={values}>
      <GlobalActionsContext.Provider value={actions}>
        {children}
      </GlobalActionsContext.Provider>
    </GlobalContext.Provider>
  );
};
