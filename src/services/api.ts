import { ApiResponse } from "../types";

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
const api = {
  getTasks: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/diagram`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },
  postDiagram: async (diagram: IDiagramParams): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/diagram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(diagram),
    });
    return response.text();
  },
};
export default api;
