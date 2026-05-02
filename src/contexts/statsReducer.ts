export interface IStatsState {
  totalSolved: number;
  correctlySolved: number;
  solvedWithoutHints: number;
  solvedWithoutMistakes: number;
  longestNoHintsStreak: number;
  longestNoMistakesStreak: number;
  currentNoHintsStreak: number;
  currentNoMistakesStreak: number;
}

export const initialStats: IStatsState = {
  totalSolved: 0,
  correctlySolved: 0,
  solvedWithoutHints: 0,
  solvedWithoutMistakes: 0,
  longestNoHintsStreak: 0,
  longestNoMistakesStreak: 0,
  currentNoHintsStreak: 0,
  currentNoMistakesStreak: 0,
};

type SolveResult = {
  correctlySolved: boolean;
  usedHints: number;
  attempts: number;
};

type StatsAction =
  | { type: "SET_STATS"; payload: IStatsState }
  | { type: "UPDATE_AFTER_SOLVE"; payload: SolveResult };

export function statsReducer(
  state: IStatsState,
  action: StatsAction,
): IStatsState {
  switch (action.type) {
    case "SET_STATS":
      return action.payload;

    case "UPDATE_AFTER_SOLVE": {
      const { correctlySolved, usedHints, attempts } = action.payload;

      const noHints = correctlySolved && usedHints === 0;
      const noMistakes = correctlySolved && attempts === 0;

      const newCurrentNoHintsStreak = noHints
        ? state.currentNoHintsStreak + 1
        : 0;
      const newCurrentNoMistakesStreak = noMistakes
        ? state.currentNoMistakesStreak + 1
        : 0;

      return {
        totalSolved: state.totalSolved + 1,
        correctlySolved: state.correctlySolved + (correctlySolved ? 1 : 0),
        solvedWithoutHints: state.solvedWithoutHints + (noHints ? 1 : 0),
        solvedWithoutMistakes:
          state.solvedWithoutMistakes + (noMistakes ? 1 : 0),
        longestNoHintsStreak: Math.max(
          state.longestNoHintsStreak,
          newCurrentNoHintsStreak,
        ),
        longestNoMistakesStreak: Math.max(
          state.longestNoMistakesStreak,
          newCurrentNoMistakesStreak,
        ),
        currentNoHintsStreak: newCurrentNoHintsStreak,
        currentNoMistakesStreak: newCurrentNoMistakesStreak,
      };
    }

    default:
      return state;
  }
}
