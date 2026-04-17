import { useGlobalContext } from "@/contexts/GlobalContext";
import { convertBoardStateToStringSolution } from "@/utils/convertCoordinates";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

const BoardHeader = () => {
  const {
    attemptsCount,
    currentLettersOnBoard,
    moveIsCorrect,
    userSolutionTiles,
  } = useGlobalContext();

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
      <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.circle,
              {
                backgroundColor: 5 - i >= attemptsCount ? "#0ba522" : "#f02d13",
              },
            ]}
          />
        ))}
      </View>
      <View style={[styles.osps]}>
        <Text style={{ color: "white", fontWeight: "bold" }}>OSPS 52</Text>
      </View>

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
    marginRight: 5,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  osps: {
    display: "flex",
    backgroundColor: "#08763b",
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  text: {
    fontSize: 20,
    width: "30%",
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 5,
  },
});
