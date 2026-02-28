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
