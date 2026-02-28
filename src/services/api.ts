import { ApiResponse } from "../types";

const API_BASE_URL = "https://gcg-report-viewer.onrender.com";
const api = {
  getTasks: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/diagram`);
    console.log("%csrc\services\api.ts:8 response", response);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },
};
export default api;
