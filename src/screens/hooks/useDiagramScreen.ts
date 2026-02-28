import { useTasks } from "@/hooks/useTasks";
import { convertBoardCoordinatesToNumbers } from "@/utils/convertCoordinates";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";

const convertWordToLettersArray = (
  word: string,
  coordinates: string,
  fieldSize: number,
) => {
  const startPosition = convertBoardCoordinatesToNumbers(coordinates);
  return word
    .split("")
    .map((letter, index) => ({
      letter,
      x:
        fieldSize *
        (startPosition.verticle ? startPosition.x : startPosition.x + index),
      y:
        fieldSize *
        (startPosition.verticle ? startPosition.y + index : startPosition.y),
    }))
    .filter((el) => el.letter !== ".");
};

const GUTTER = 20;
const BOARD_CHROME = 3 * 2 + 4 * 2;
// Ile miejsca zajmuje header + subheader + paddingTop
const HEADER_HEIGHT = 50 + 30 + 8 + 24;
const screenPadding = 12;

const useDiagramScreen = () => {
  const { level } = useLocalSearchParams<{ level: string }>();
  const { width, height } = useWindowDimensions();

  const { getTasksByLevel } = useTasks();
  const tasks = getTasksByLevel(level as any);

  const fieldSize = useMemo(() => {
    const availableWidth = width - screenPadding * 2 - GUTTER - BOARD_CHROME;
    return Math.floor(availableWidth / 15);
  }, [width]);

  const currentTask = useMemo(() => {
    if (!tasks.length) return null;
    const lettersOnBoard = tasks[0].words.flatMap((move) =>
      convertWordToLettersArray(move.word, move.coordinates, fieldSize),
    );
    console.log({ lettersOnBoard, letters: tasks[0].letters });
    return { lettersOnBoard, letters: tasks[0].letters };
  }, [tasks, fieldSize]);

  const boardAreaHeight = height * 0.7;
  const panelHeight = height * 0.2;

  // Wymiary planszy z koordynatami
  const boardWidth = fieldSize * 15 + GUTTER + BOARD_CHROME;
  const boardHeight = fieldSize * 15 + GUTTER + BOARD_CHROME;

  const handleFieldPress = useCallback((row: number, col: number) => {
    console.log(`Kliknięto pole [${row}, ${col}]`);
  }, []);

  return {
    currentTask,
    width,
    height,
    level,
    boardAreaHeight,
    panelHeight,
    fieldSize,
    boardWidth,
    boardHeight,
    tasks,
    handleFieldPress,
  };
};

export default useDiagramScreen;
