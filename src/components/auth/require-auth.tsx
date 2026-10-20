"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [ready, session, router, pathname]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--fg-muted)]">
        Checking session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--fg-muted)]">
        Redirecting to sign in…
      </div>
    );
  }

  return <>{children}</>;
}
