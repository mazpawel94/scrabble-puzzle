import api from "./api";

// ─── Endpointy auth ───────────────────────────────────────────

export async function loginAnonymous(deviceToken: string): Promise<string> {
  const { data } = await api.post<{ accessToken: string }>("/auth/anonymous", {
    deviceToken,
  });
  return data.accessToken;
}

export async function loginWithGoogle(idToken: string): Promise<string> {
  const { data } = await api.post<{ accessToken: string }>("/auth/google", {
    idToken,
  });
  return data.accessToken;
}
