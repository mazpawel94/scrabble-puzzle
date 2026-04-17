import * as Crypto from "expo-crypto";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { loginAnonymous, loginWithGoogle } from "../services/authApi";
import { storage } from "./storage";
import { useGoogleAuth } from "./useGoogleAuth";

// ─── Typy ────────────────────────────────────────────────────

type AuthStatus = "loading" | "anonymous" | "authenticated";

interface JwtPayload {
  sub: string;
  isAnonymous: boolean;
  exp: number;
}

interface AuthContextValue {
  status: AuthStatus;
  userId: string | null;
  linkGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  googleReady: boolean;
}

// ─── Context ─────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const { signInWithGoogle, ready: googleReady } = useGoogleAuth();

  // Flaga chroniąca przed podwójną inicjalizacją (React Strict Mode)
  const initializingRef = useRef(false);

  // ─── Inicjalizacja sesji przy starcie ───────────────────────

  useEffect(() => {
    if (initializingRef.current) return;
    initializingRef.current = true;
    initSession();
  }, []);

  const initSession = async () => {
    try {
      const existingJwt = await storage.getJwt();

      if (existingJwt && isTokenValid(existingJwt)) {
        // Mamy ważny JWT — przywróć sesję bez wywołania backendu
        applyToken(existingJwt);
        return;
      }

      // Brak JWT lub wygasł — zaloguj anonymous (deviceToken się nie zmienia)
      await startAnonymousSession();
    } catch (err) {
      console.error("[Auth] initSession failed:", err);
      // Fallback: spróbuj stworzyć fresh anonymous session
      await startAnonymousSession();
    }
  };

  const startAnonymousSession = async () => {
    // deviceToken jest trwały — identyfikuje to konkretne urządzenie
    let deviceToken = await storage.getDeviceToken();

    if (!deviceToken) {
      deviceToken = Crypto.randomUUID();
      // deviceToken = generateUUID();
      await storage.setDeviceToken(deviceToken);
    }

    const jwt = await loginAnonymous(deviceToken);
    await storage.setJwt(jwt);
    applyToken(jwt);
  };

  // ─── Linkowanie Google ──────────────────────────────────────

  const linkGoogle = useCallback(async () => {
    const idToken = await signInWithGoogle(); // może rzucić 'CANCELLED'
    const jwt = await loginWithGoogle(idToken);
    await storage.setJwt(jwt);
    applyToken(jwt);
  }, [signInWithGoogle]);

  // ─── Wylogowanie (powrót do anonymous) ─────────────────────

  const signOut = useCallback(async () => {
    await storage.deleteJwt();
    // deviceToken zostaje — przy wylogowaniu wracamy do anonymous na tym urządzeniu
    await startAnonymousSession();
  }, []);

  // ─── Helpers ────────────────────────────────────────────────

  const applyToken = (jwt: string) => {
    const payload = jwtDecode<JwtPayload>(jwt);
    setUserId(payload.sub);
    setStatus(payload.isAnonymous ? "anonymous" : "authenticated");
  };

  const isTokenValid = (jwt: string): boolean => {
    try {
      const { exp } = jwtDecode<JwtPayload>(jwt);
      // Odświeżaj jeżeli zostało mniej niż 7 dni
      return exp * 1000 > Date.now() + 7 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ status, userId, linkGoogle, signOut, googleReady }),
    [status, userId, linkGoogle, signOut, googleReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
