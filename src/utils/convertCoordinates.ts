import {
  letter2Indexes,
  letter3Indexes,
  LetterKey,
  POINTS,
  wordMultiplerByIndex,
} from "@/constants/BoardFields";

export const convertBoardCoordinatesToNumbers = (coordinates: string) => {
  const coord = coordinates
    .split("")
    .filter((el) => el !== "*")
    .join("");
  if (coord.slice(-1) !== coord.slice(-1).toLowerCase())
    //horizontal
    return {
      x: coord.slice(-1).charCodeAt(0) - 65,
      y: parseInt(coord.slice(0, -1)) - 1,
      verticle: false,
    };
  else
    return {
      x: coord[0].charCodeAt(0) - 65,
      y: parseInt(coord.slice(1)) - 1,
      verticle: true,
    };
};

const findLetterPoint = (tile: { letter: string; index: number }) => {
  const basicValue = POINTS[tile.letter as LetterKey] || 0;
  if (letter2Indexes.includes(tile.index)) return basicValue * 2;
  if (letter3Indexes.includes(tile.index)) return basicValue * 3;
  return basicValue;
};

const findTilesOnBoardForWord = (
  boardSlice: {
    x: number;
    y: number;
    letter: string;
    state: string;
  }[],
  startIndex: number,
  key: "x" | "y",
) => {
  const tilesOnBoard = [];
  let localStartIndex = startIndex;
  let localEndIndex = startIndex;
  while (localStartIndex > 0) {
    const checkedField = boardSlice.find(
      (el) => el[key] === localStartIndex - 1,
    );
    if (checkedField?.state === "board") {
      tilesOnBoard.push(checkedField);
      localStartIndex--;
    } else if (checkedField?.state === "newMove") localStartIndex--;
    else localStartIndex = -1;
  }
  while (localEndIndex < 14) {
    const checkedField = boardSlice.find((el) => el[key] === localEndIndex + 1);
    if (checkedField?.state === "board") {
      tilesOnBoard.push(checkedField);
      localEndIndex++;
    } else if (checkedField?.state === "newMove") localEndIndex++;
    else localEndIndex = 15;
  }
  return tilesOnBoard;
};

export const convertNumbersToBoardCoordinates = ({
  x,
  y,
  vertical,
}: {
  x: number;
  y: number;
  vertical: boolean;
}) =>
  vertical
    ? `${String.fromCharCode(x + 65)}${y + 1}`
    : `${y + 1}${String.fromCharCode(x + 65)}`;

export const convertBoardStateToStringSolution = (
  newTiles: {
    x: number;
    y: number;
    letter: string;
  }[],
  boardState: {
    x: number;
    y: number;
    letter: string;
  }[],
) => {
  // const newTiles = boardState.filter(
  //   (el) => el.state === EBoardFieldState.newMove,
  // );

  const isVertical = new Set(newTiles.map((el) => el.x)).size === 1;
  const [key, perpendicularKey] = isVertical
    ? ["x" as const, "y" as const]
    : ["y" as const, "x" as const];

  const fullBoardState = [
    ...boardState.map((el) => ({ ...el, state: "board" })),
    ...newTiles.map((el) => ({ ...el, state: "newMove" })),
  ].sort((a, b) => (a[perpendicularKey] < b[perpendicularKey] ? -1 : 1));

  const perpendicularWords = newTiles
    .map((tile) => {
      const boardSlice = fullBoardState.filter(
        (el) => el[perpendicularKey] === tile[perpendicularKey],
      );
      const tilesOnBoard = findTilesOnBoardForWord(boardSlice, tile[key], key);
      if (!tilesOnBoard.length) return null;
      return {
        points:
          (findLetterPoint({
            letter: tile.letter,
            index: tile.x + tile.y * 15,
          }) +
            tilesOnBoard.reduce(
              (acc, curr) => acc + (POINTS[curr.letter as LetterKey] || 0),
              0,
            )) *
          wordMultiplerByIndex[tile.x + tile.y * 15],
        tilesOnBoard,
      };
    })
    .filter((el) => el !== null);

  const perpendicularPoints = perpendicularWords.reduce(
    (acc, curr) => acc + curr!.points,
    0,
  );

  const mainMoveSlice = fullBoardState.filter(
    (el) => el[key] === newTiles[0][key],
  );
  const tilesOnBoard = findTilesOnBoardForWord(
    mainMoveSlice,
    newTiles[0][perpendicularKey],
    perpendicularKey,
  );

  const sortedTiles = [
    ...newTiles.map((el) => ({ ...el, state: "newMove" })),
    ...tilesOnBoard,
  ].sort((a, b) => (a[perpendicularKey] < b[perpendicularKey] ? -1 : 1));
  const wordForQuackle = sortedTiles
    .map((el) => (el.state === "newMove" ? el.letter : "."))
    .join("");

  const mainMovePoints =
    (newTiles.reduce(
      (acc, curr) =>
        acc +
        findLetterPoint({
          letter: curr.letter,
          index: curr.x + curr.y * 15,
        }),
      0,
    ) +
      tilesOnBoard.reduce(
        (acc, curr) => acc + (POINTS[curr.letter as LetterKey] || 0),
        0,
      )) *
    newTiles.reduce(
      (acc, curr) => acc * wordMultiplerByIndex[curr.x + curr.y * 15],
      1,
    );
    
  return {
    points:
      newTiles.length === 1 && !tilesOnBoard.length
        ? perpendicularPoints
        : mainMovePoints +
          perpendicularPoints +
          (newTiles.length === 7 ? 50 : 0),
    word: wordForQuackle,
    coordinates: convertNumbersToBoardCoordinates({
      x: sortedTiles[0].x,
      y: sortedTiles[0].y,
      vertical: isVertical,
    }),
    letters: wordForQuackle.replaceAll(".", ""),
  };
};

export const convertWordToLettersArray = (
  word: string,
  coordinates: string,
) => {
  const startPosition = convertBoardCoordinatesToNumbers(coordinates);
  return word
    .split("")
    .map((letter, index) => ({
      letter,
      x: startPosition.verticle ? startPosition.x : startPosition.x + index,
      y: startPosition.verticle ? startPosition.y + index : startPosition.y,
    }))
    .filter((el) => el.letter !== ".");
};
