import { BRAND } from "@/lib/brand";
import type { DemoRole } from "@/lib/mock/org";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  /** True when the user belongs to the demo tenant (fake data only). */
  demo: boolean;
  role: DemoRole;
  personaId: string;
  workerId: string;
  tenantId: string;
  tenantName: string;
};

export type AuthSession = {
  user: AuthUser;
  signedInAt: string;
};

export const SIGN_IN_HELP = {
  title: "Need help signing in?",
  body: `Accounts are created by invitation. Ask your ${BRAND.name} administrator for an invite, or use "Forgot password" if you already have an account.`,
} as const;

export const MIN_PASSWORD_LENGTH = 10;

export function validateLogin(email: string, password: string): string | null {
  const e = email.trim();
  if (!e || !e.includes("@")) return "Enter a valid work email.";
  if (!password) return "Enter your password.";
  return null;
}

export function validateNewPassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}
