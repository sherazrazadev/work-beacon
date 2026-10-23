import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Cookie Preferences" };

export default function CookiePreferencesPage() {
  return (
    <LegalPage title="Cookie Preferences">
      <p>
        {BRAND.name} uses essential cookies to keep you signed in, and
        localStorage to remember your cookie choice. Analytics remain off unless you choose Accept on the banner.
      </p>
      <p>
        To reset: clear this site&apos;s data in your browser, or remove the{" "}
        <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-sm text-[var(--fg)]">
          work-beacon-cookie-consent
        </code>{" "}
        key from localStorage. The banner will appear again on reload.
      </p>
    </LegalPage>
  );
}
