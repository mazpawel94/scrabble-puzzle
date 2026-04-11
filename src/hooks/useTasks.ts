import api from "@/services/api";
import { ApiResponse, LEVEL, Task } from "@/types";
import { dotts } from "@/utils/dotts";
import { examples } from "@/utils/examples";
import { osps52 } from "@/utils/osps52";
import { useEffect, useState } from "react";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data: ApiResponse = await api.getTasks();
        setTasks(data.tasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  const getTasksByLevel = (level: LEVEL) => {
    if (level === "unknown") return examples;
    if (level === "hard") return dotts;
    if (level === "medium") return osps52;
    return tasks.filter((task) => task.level === level);
  };
  return { tasks, loading, error, getTasksByLevel };
};
