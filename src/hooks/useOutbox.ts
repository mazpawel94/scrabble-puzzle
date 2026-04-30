import {
  enqueue,
  getPendingRequests,
  removeFromQueue,
} from "@/db/repositories/outbox";
import api from "@/services/api";
import NetInfo from "@react-native-community/netinfo";

export function useOutbox() {
  const flush = async () => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) return;

    const pending = await getPendingRequests();
    console.log({ pending });
    for (const item of pending) {
      try {
        const { data } = await api.post(item.endpoint, JSON.parse(item.body));
        if (data) await removeFromQueue(item.id);
      } catch (error) {
        break; // brak internetu w trakcie — spróbuj następnym razem
      }
    }
  };

  const sendOrEnqueue = async (
    endpoint: string,
    method: string,
    body: object,
  ) => {
    const net = await NetInfo.fetch();
    if (net.isConnected) {
      try {
        if (method !== "POST") return;
        const { data } = await api.post(endpoint, body);

        if (data) {
          flush();
          return;
        }
        // jeśli request się nie udał, zakolejkuj
      } catch {}
    }
    await enqueue(endpoint, method, body);
    return null;
  };

  return { sendOrEnqueue, flush };
}
