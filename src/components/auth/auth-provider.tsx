"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AuthSession } from "@/lib/auth";
import type { DemoRole } from "@/lib/mock/org";
import { DEMO_PASSWORD, demoEmailFor } from "@/lib/demo-config";
import { getSupabase } from "@/lib/supabase/client";

type AuthContextValue = {
  session: AuthSession | null;
  ready: boolean;
  /** Resolves to an error message, or null on success. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  /** Demo tenant only: signs in as the persona's demo user. */
  switchPersona: (personaId: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role: DemoRole;
  worker_id: string | null;
  persona_id: string | null;
  tenant_id: string;
  tenants: { name: string; is_demo: boolean } | null;
};

async function fetchSession(): Promise<AuthSession | null> {
  const sb = getSupabase();
  const { data: auth } = await sb.auth.getSession();
  const uid = auth.session?.user.id;
  if (!uid) return null;

  const { data, error } = await sb
    .from("profiles")
    .select("id,email,full_name,role,worker_id,persona_id,tenant_id,tenants(name,is_demo)")
    .eq("id", uid)
    .maybeSingle<ProfileRow>();
  if (error || !data) return null;

  return {
    signedInAt: new Date().toISOString(),
    user: {
      id: data.id,
      email: data.email,
      name: data.full_name,
      demo: data.tenants?.is_demo ?? false,
      role: data.role,
      personaId: data.persona_id ?? data.role,
      workerId: data.worker_id ?? "",
      tenantId: data.tenant_id,
      tenantName: data.tenants?.name ?? "",
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);
  const seq = useRef(0);

  const refresh = useCallback(async () => {
    const mine = ++seq.current;
    const next = await fetchSession().catch(() => null);
    if (mine !== seq.current) return;
    setSession(next);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
    const { data } = getSupabase().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        seq.current += 1;
        setSession(null);
        setReady(true);
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        // defer: never call Supabase from inside the auth callback
        window.setTimeout(() => void refresh(), 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await getSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        return error.status === 400 || error.status === 401
          ? "Email or password is incorrect."
          : error.message;
      }
      await refresh();
      return null;
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
    seq.current += 1;
    setSession(null);
  }, []);

  const switchPersona = useCallback(
    async (personaId: string) => {
      if (!session?.user.demo) return "Persona switching is only available in the demo workspace.";
      const { error } = await getSupabase().auth.signInWithPassword({
        email: demoEmailFor(personaId),
        password: DEMO_PASSWORD,
      });
      if (error) return error.message;
      await refresh();
      return null;
    },
    [session?.user.demo, refresh],
  );

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
