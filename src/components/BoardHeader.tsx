import { useGlobalContext } from "@/contexts/GlobalContext";
import { convertBoardStateToStringSolution } from "@/utils/convertCoordinates";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

const BoardHeader = () => {
  const { currentLettersOnBoard, moveIsCorrect, userSolutionTiles } =
    useGlobalContext();

  const points = useMemo(
    () =>
      moveIsCorrect && currentLettersOnBoard.length
        ? convertBoardStateToStringSolution(
            userSolutionTiles,
            currentLettersOnBoard,
          )?.points || 1
        : null,
    [currentLettersOnBoard, userSolutionTiles],
  );
  return (
    <View style={[styles.wrapper]}>
      <Text style={[styles.text]}>{points ? `Punkty: ${points}` : null}</Text>
    </View>
  );
};

export default BoardHeader;

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    alignSelf: "stretch",
    marginLeft: 5,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  text: {
    fontSize: 20,
  },
});
