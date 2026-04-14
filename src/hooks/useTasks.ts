import { LEVEL, Task } from "@/types";
import { examples } from "@/utils/examples";
import { useState } from "react";
import { useSync } from "./useSync";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { diagrams } = useSync();

  const getTasksByLevel = (level: LEVEL) => {
    if (level === "unknown")
      return examples.map((el) => ({
        ...el,
        id: "0",
        createdAt: new Date().toISOString(),
      })) as Task[];

    if (level === "easy")
      return diagrams.filter((el) => el.level && el.level <= 3) as Task[];
    if (level === "medium")
      return diagrams.filter(
        (el) => el.level && el.level > 3 && el.level <= 5,
      ) as Task[];
    if (level === "hard")
      return diagrams.filter((el) => el.level && el.level > 6) as Task[];
    return [];
  };
  return { loading, error, getTasksByLevel };
};
