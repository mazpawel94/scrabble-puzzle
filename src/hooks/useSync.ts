import { getTasks } from "@/services/api";
import { Task } from "@/types";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { getAllDiagrams, upsertDiagrams } from "../db";
import { getLastSyncedAt, setLastSyncedAt } from "../storage/syncMeta";

export function useSync() {
  const [diagrams, setDiagrams] = useState<Task[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    (async () => {
      // 1. Załaduj lokalne dane natychmiast
      const local = await getAllDiagrams();
      setDiagrams(
        local.map((el) => ({
          ...el,
          words: JSON.parse(el.words),
          solution: JSON.parse(el.solution),
          level: el.level || undefined,
        })),
      );

      // 2. Sync w tle jeśli jest internet
      const net = await NetInfo.fetch();
      if (!net.isConnected) return;

      try {
        setSyncing(true);
        const lastSyncedAt = await getLastSyncedAt();
        const res: Task[] = await getTasks(lastSyncedAt);
        if (!res) throw new Error(`HTTP error`);
        const newTasks = res.map((el) => ({
          id: el.id,
          isPublic: "true",
          createdAt: el.createdAt,
          solution:
            typeof el.solution === "string"
              ? el.solution
              : JSON.stringify(el.solution),
          letters: el.letters,
          words:
            typeof el.words === "string" ? el.words : JSON.stringify(el.words),
          level: el.level || 0,
        }));

        if (newTasks.length > 0) {
          await upsertDiagrams(newTasks);
          const actualData = await getAllDiagrams();
          setDiagrams(
            actualData.map((el) => ({
              ...el,
              words: JSON.parse(el.words),
              solution: JSON.parse(el.solution),
              level: el.level || undefined,
            })),
          );
        }

        await setLastSyncedAt(new Date().toISOString());
      } catch (e) {
        console.warn("Sync failed, using local data:", e);
      } finally {
        console.log("--------------Sync complete--------------");
        setSyncing(false);
      }
    })();
  }, []);

  return { diagrams, syncing };
}
