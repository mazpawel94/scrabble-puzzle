import { Task } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

import { examples } from "@/utils/examples";
import { useSync } from "./useSync";

// na później do uzupełnienia panel admina
// import { osps50 } from "@/utils/osps50";
// import { osps52 } from "@/utils/osps52";
// if (level === "unknown")
// return examples.map((el) => ({
//   ...el,
//   id: "0",
//   createdAt: new Date().toISOString(),
// })) as Task[];
// return {
//   0: examples.map((el) => ({
//     ...el,
//     id: "0",
//     createdAt: new Date().toISOString(),
//   })) as Task[],
// };

const useHandleTasks = (userRank: number | null) => {
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);

  const [adminTasks, setAdminTasks] = useState(
    examples.map((el) => ({
      ...el,
      id: "0",
      createdAt: new Date().toISOString(),
    })) as Task[],
  );
  const adminIndexRef = useRef<number>(0);
  const queueRef = useRef<Record<number, Task[]>>({});
  const [queueReady, setQueueReady] = useState(false);

  const { diagrams } = useSync();

  const pickTask = useCallback((rank: number) => {
    const key = Math.floor(rank);

    const queue = queueRef.current;
    console.log("liczba zadań lvl 1 w pickTask: ", queue[1].length);
    // Szukaj zadania na poziomie rank, jeśli brak — szukaj na sąsiednich poziomach
    for (let offset = 0; offset <= 10; offset++) {
      for (const candidate of [key - offset, key + offset]) {
        if (candidate < 0 || candidate > 10) continue;
        const tasks = queue[candidate];
        if (tasks && tasks.length > 0) {
          const task = tasks[0];
          // Usuń z kolejki
          queueRef.current = {
            ...queue,
            [candidate]: tasks.slice(1),
          };
          console.log("selectedTaskId: ", task.id);
          return task;
        }
      }
    }
    return undefined;
  }, []);

  const nextDiagram = useCallback(
    (level?: number) => {
      if (!queueReady) return;
      if (level === -10) {
        setCurrentTask(adminTasks[adminIndexRef.current]);
        adminIndexRef.current = adminIndexRef.current + 1;
        return;
      }
      const rank = level || userRank;
      const task = pickTask(Math.min(10, Math.max(1, rank!)));
      if (!task) return;
      setCurrentTask(task);
    },
    [queueReady, userRank, pickTask, adminTasks],
  );

  useEffect(() => {
    if (diagrams.length === 0) return;
    const databaseTasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce(
      (acc, num) => ({
        ...acc,
        [num]: diagrams.filter((el) => el.level === num),
      }),
      {} as Record<number, Task[]>,
    );
    queueRef.current = databaseTasks;
    setQueueReady(true);
  }, [diagrams]);

  return { queueReady, nextDiagram, currentTask };
};

export default useHandleTasks;
