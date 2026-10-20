import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export const fieldControlClass =
  "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--fg)] outline-none transition-colors hover:border-[color-mix(in_oklab,var(--fg)_28%,transparent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | null;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[var(--fg)]">{label}</span>
      <div className="mt-1">{children}</div>
      {error ? (
        <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-[var(--fg-muted)]">{hint}</p>
      ) : null}
    </label>
  );
}

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldControlClass, className)} {...props} />;
}

export function SelectInput({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldControlClass, className)} {...props} />;
}
