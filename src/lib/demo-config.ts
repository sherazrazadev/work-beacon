import { PERSONAS } from "@/lib/mock/org";

/**
 * The ONE shared demo credential (owner decision D3). It only unlocks the demo
 * tenant, which holds fake data. It is shown on the sign-in page by design.
 * Persona switching signs in as the persona's demo user with this same password.
 */
export const DEMO_PASSWORD = "Beacon-Demo-2026";

export const DEMO_TENANT = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "northstar-demo",
  name: "Northstar Labs",
} as const;

/** Sign-in identity for the default (employee) persona. */
export const DEMO_LOGIN_EMAIL = "demo@workbeacon.app";

export function demoEmailFor(personaId: string): string {
  return personaId === "employee"
    ? DEMO_LOGIN_EMAIL
    : `demo.${personaId.replace(/_/g, "-")}@workbeacon.app`;
}

export const DEMO_PERSONA_IDS: string[] = PERSONAS.map((p) => p.id);

export function isDemoEmail(email: string | undefined | null): boolean {
  return !!email && /^demo(\.[a-z-]+)?@workbeacon\.app$/.test(email);
}
