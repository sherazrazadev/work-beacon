"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { canAccessPath, rolesAllowedForPath } from "@/lib/rbac";
import { roleLabel } from "@/lib/mock/org";

export function RequireRole({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth();
  const pathname = usePathname();

  if (!ready || !session) return null;

  const role = session.user.role;
  if (canAccessPath(role, pathname)) {
    return <>{children}</>;
  }

  const needed = rolesAllowedForPath(pathname) ?? [];

  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
        Access restricted
      </h1>
      <p className="text-sm text-[var(--fg-muted)]">
        You are signed in as <strong>{roleLabel(role)}</strong>. This page
        requires: {needed.map(roleLabel).join(" or ")}.
      </p>
      <p className="text-sm text-[var(--fg-muted)]">
        Use the persona switcher in the header to change demo role.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to home</Link>
      </Button>
    </div>
  );
}
