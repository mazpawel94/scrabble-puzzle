import { useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";

// Konieczne do prawidłowego zamknięcia przeglądarki po redirect
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!;

export function useGoogleAuth() {
  const discovery = useAutoDiscovery("https://accounts.google.com");

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      // Expo Go wymaga tego redirect URI
      redirectUri: "https://auth.expo.io/@mazpawel94/my-app",
    },
    discovery,
  );

  const signInWithGoogle = useCallback(async (): Promise<string> => {
    if (!request) throw new Error("Google auth not ready");

    const result = await promptAsync();

    if (result.type === "cancel" || result.type === "dismiss") {
      throw new Error("CANCELLED");
    }

    if (result.type !== "success") {
      throw new Error(`Google auth failed: ${result.type}`);
    }

    // Wymień code na id_token przez Google Token Endpoint
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: result.params.code,
        client_id: CLIENT_ID,
        redirect_uri: request.redirectUri,
        grant_type: "authorization_code",
        code_verifier: request.codeVerifier ?? "",
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.id_token) {
      throw new Error("No id_token in Google response");
    }

    return tokenData.id_token;
  }, [request, promptAsync]);

  return { signInWithGoogle, ready: !!request };
}
