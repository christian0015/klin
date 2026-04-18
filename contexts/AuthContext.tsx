"use client";

/**
 * KLIN — AuthContext
 * ──────────────────
 * Skeleton préparé pour l'authentification email / mot de passe.
 * L'implémentation complète (API calls, sessions, JWT) sera ajoutée plus tard.
 * En attendant le contexte expose les types + shape définitifs pour ne pas
 * avoir à refactorer les composants consumers.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  /** Sign in with email + password — à implémenter */
  signIn: (email: string, password: string) => Promise<void>;
  /** Register — à implémenter */
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  /** Sign out — à implémenter */
  signOut: () => Promise<void>;
  /** true when a request is in-flight */
  isLoading: boolean;
  /** Error message from last action */
  error: string | null;
  /** Clear error state */
  clearError: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── TODO: replace with real session check (e.g. /api/auth/me) ──
  useEffect(() => {
    setStatus("unauthenticated");
  }, []);

  const signIn = useCallback(async (_email: string, _password: string) => {
    // TODO: call POST /api/auth/signin
    setIsLoading(true);
    setError(null);
    try {
      // const res = await fetch("/api/auth/signin", { method: "POST", ... });
      // const data = await res.json();
      // setUser(data.user);
      // setStatus("authenticated");
      throw new Error("Auth non encore implémenté.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      setStatus("unauthenticated");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (_email: string, _password: string, _name?: string) => {
      // TODO: call POST /api/auth/signup
      setIsLoading(true);
      setError(null);
      try {
        throw new Error("Auth non encore implémenté.");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    // TODO: call POST /api/auth/signout + clear cookies/JWT
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ user, status, signIn, signUp, signOut, isLoading, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}