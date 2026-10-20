import { BRAND } from "@/lib/brand";
import type { DemoRole } from "@/lib/mock/org";
import { PERSONAS, getPersona, getWorker } from "@/lib/mock/org";

export const AUTH_STORAGE_KEY = "work-beacon-auth-session";

export type AuthUser = {
  email: string;
  name: string;
  demo: boolean;
  role: DemoRole;
  personaId: string;
  workerId: string;
};

export type AuthSession = {
  user: AuthUser;
  signedInAt: string;
  ssoDemo?: boolean;
};

export const DEMO_ACCOUNT = {
  email: "demo@workbeacon.app",
  password: "demo",
  name: "Alex Rivera",
} as const;

export const PRODUCT_LOGINS = [
  { id: "planning", label: "Beacon Planning", hint: "Opens in a new tab (stub)" },
  { id: "contracts", label: "Contracts Suite", hint: "Opens in a new tab (stub)" },
  { id: "pulse", label: "Pulse Engagement", hint: "Opens in a new tab (stub)" },
] as const;

export type SignInOptions = {
  demo?: boolean;
  name?: string;
  personaId?: string;
  role?: DemoRole;
  workerId?: string;
  ssoDemo?: boolean;
};

function personaDefaults(personaId?: string) {
  const persona = getPersona(personaId ?? "employee") ?? PERSONAS[0];
  const worker = getWorker(persona.workerId);
  return {
    personaId: persona.id,
    role: persona.role,
    workerId: persona.workerId,
    name: worker?.name ?? DEMO_ACCOUNT.name,
    email: worker?.email ?? DEMO_ACCOUNT.email,
  };
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.user?.email) return null;
    // Migrate older sessions missing persona fields
    if (!parsed.user.role || !parsed.user.workerId) {
      const d = personaDefaults("employee");
      parsed.user = {
        ...parsed.user,
        role: parsed.user.role ?? d.role,
        personaId: parsed.user.personaId ?? d.personaId,
        workerId: parsed.user.workerId ?? d.workerId,
      };
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function createSession(
  email: string,
  options?: SignInOptions,
): AuthSession {
  const d = personaDefaults(options?.personaId);
  const demo = options?.demo ?? email === DEMO_ACCOUNT.email;
  return {
    user: {
      email: options?.workerId
        ? (getWorker(options.workerId)?.email ?? email)
        : email || d.email,
      name: options?.name ?? d.name,
      demo,
      role: options?.role ?? d.role,
      personaId: options?.personaId ?? d.personaId,
      workerId: options?.workerId ?? d.workerId,
    },
    signedInAt: new Date().toISOString(),
    ssoDemo: options?.ssoDemo ?? false,
  };
}

export function applyPersona(
  session: AuthSession,
  personaId: string,
): AuthSession {
  const persona = getPersona(personaId);
  if (!persona) return session;
  const worker = getWorker(persona.workerId);
  return {
    ...session,
    user: {
      ...session.user,
      personaId: persona.id,
      role: persona.role,
      workerId: persona.workerId,
      name: worker?.name ?? session.user.name,
      email: worker?.email ?? session.user.email,
      demo: true,
    },
  };
}

export function validateLogin(email: string, password: string): string | null {
  const e = email.trim();
  if (!e || !e.includes("@")) return "Enter a valid work email.";
  if (password.length < 4) return "Password must be at least 4 characters.";
  return null;
}

export const SIGN_IN_HELP = {
  title: "Need help signing in?",
  body: `To reach your ${BRAND.name} tenant, ask your HR or IT team for your company's unique sign-in link. This demo uses a local fake session only — no real tenant is contacted.`,
} as const;
