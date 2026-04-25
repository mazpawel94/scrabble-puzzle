import { Task } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSync } from "./useSync";

// na później do uzupełnienia panel admina
// import { examples } from "@/utils/examples";
// import { osps50 } from "@/utils/osps50";
// import { osps52 } from "@/utils/osps52";
// if (level === "unknown")
//   // return examples.map((el) => ({
//   //   ...el,
//   //   id: "0",
//   //   createdAt: new Date().toISOString(),
//   // })) as Task[];
//   return {
//     0: examples.map((el) => ({
//       ...el,
//       id: "0",
//       createdAt: new Date().toISOString(),
//     })) as Task[],
//   };

const useHandleTasks = (userRank: number | null) => {
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);

  const queueRef = useRef<Record<number, Task[]>>({});
  const [queueReady, setQueueReady] = useState(false);

  const { diagrams } = useSync();

  const pickTask = useCallback((rank: number) => {
    const key = Math.floor(rank);

    console.log("Picking task for rank:", rank, "key:", key);
    const queue = queueRef.current;

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
          return task;
        }
      }
    }
    return undefined;
  }, []);

  const nextDiagram = useCallback(
    (level?: number) => {
      if (!queueReady) return;
      const rank = level || userRank;
      const task = pickTask(Math.min(10, Math.max(1, rank!)));
      if (!task) return;
      setCurrentTask(task);
    },
    [queueReady, userRank, pickTask],
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
    console.log("Diagrams length:", diagrams.length);
    queueRef.current = databaseTasks;
    setQueueReady(true);
  }, [diagrams]);

  return { queueReady, nextDiagram, currentTask };
};

export default useHandleTasks;
