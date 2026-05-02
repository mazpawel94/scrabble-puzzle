import axios from "axios";

import { storage } from "@/auth/storage";
import { ITaskResult } from "@/components/ActionsPanel/hooks/useActionsPanel";
import { IStatsState } from "@/contexts/statsReducer";
import { Task } from "@/types";

export interface IDiagramParams {
  words: string;
  letters: string;
  solution: string;
  diagramIsPublic: boolean;
  tags: {
    id: string;
    text: string;
  }[];
  level: number;
}

const API_BASE_URL = "https://gcg-report-viewer.onrender.com";
export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const jwt = await storage.getJwt();
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});

export const getTasks = async (
  lastSyncedAt: string | null,
): Promise<Task[]> => {
  const { data } = await api.get(
    `/diagram${lastSyncedAt ? `?created_after=${encodeURIComponent(lastSyncedAt)}` : ""}`,
  );
  if (!data) {
    throw new Error(`API error`);
  }
  console.log(
    `Loaded new diagrams! ${data.length}. Last synced at: ${lastSyncedAt}`,
  );
  return data;
};

export const getStats = async (userId: string): Promise<IStatsState> => {
  const { data } = await api.get(`/user-diagram/${userId}/stats`);
  return data;
};

export const postDiagram = async (diagram: IDiagramParams): Promise<string> => {
  const { data } = await api.post("/diagram", diagram);
  return data;
};

export const postTaskResult = async (
  result: ITaskResult,
  functionWrapper: (
    endpoint: string,
    method: string,
    body: object,
  ) => Promise<any>,
): Promise<string> => {
  const data = await functionWrapper("/user-diagram", "POST", result);
  // const { data } = await api.post("/user-diagram", result);
  return data;
};

export default api;
