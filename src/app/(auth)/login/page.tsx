import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-[var(--fg-muted)]">Loading sign in…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
