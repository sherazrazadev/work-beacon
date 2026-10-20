import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col bg-[var(--dash-bg)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--fg)]"
        >
          {BRAND.name}
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  );
}
