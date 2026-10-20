"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthSession,
  SignInOptions,
  applyPersona,
  clearSession,
  createSession,
  readSession,
  writeSession,
} from "@/lib/auth";

type AuthContextValue = {
  session: AuthSession | null;
  ready: boolean;
  signIn: (email: string, options?: SignInOptions) => void;
  signOut: () => void;
  switchPersona: (personaId: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setReady(true);
  }, []);

  const signIn = useCallback((email: string, options?: SignInOptions) => {
    const next = createSession(email, options);
    writeSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const switchPersona = useCallback((personaId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = applyPersona(prev, personaId);
      writeSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ session, ready, signIn, signOut, switchPersona }),
    [session, ready, signIn, signOut, switchPersona],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
