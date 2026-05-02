import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { useAuth } from "@/auth/AuthContext";
import { ITaskResult } from "@/components/ActionsPanel/hooks/useActionsPanel";
import { getStats } from "@/services/api";
import { initialStats, IStatsState, statsReducer } from "./statsReducer";

interface IStatsContext extends IStatsState {
  initialStatsValue: IStatsState;
}
interface IStatsActionsContext {
  updateStats: (result: ITaskResult) => void;
}

export const StatsContext = createContext<IStatsContext>({
  ...initialStats,
  initialStatsValue: initialStats,
});

export const StatsActionsContext = createContext<IStatsActionsContext>({
  updateStats: (result: ITaskResult) => {},
});

export const useStatsContext = () => useContext(StatsContext);

export const useStatsActionsContext = () => useContext(StatsActionsContext);

export const StatsContextProvider = ({ children }: any) => {
  const { userId } = useAuth();

  const [stats, dispatch] = useReducer(statsReducer, initialStats);
  const [initialStatsValue, setInitialStatsValue] =
    useState<IStatsState>(initialStats); //to się przyda, żeby prosto mierzyć statystki aktualnej sesji

  useEffect(() => {
    if (!userId) return;
    getStats(userId).then((data) => {
      dispatch({ type: "SET_STATS", payload: data });
      setInitialStatsValue(data);
    });
  }, [userId]);

  const actions = useMemo(
    () => ({
      updateStats: (result: ITaskResult) =>
        dispatch({ type: "UPDATE_AFTER_SOLVE", payload: result }),
    }),
    [],
  );

  return (
    <StatsContext.Provider value={{ ...stats, initialStatsValue }}>
      <StatsActionsContext.Provider value={actions}>
        {children}
      </StatsActionsContext.Provider>
    </StatsContext.Provider>
  );
};
