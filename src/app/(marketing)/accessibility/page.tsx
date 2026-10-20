import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility">
      <p>
        {BRAND.name} aims for keyboard-operable navigation, visible focus, and
        readable contrast on marketing and demo dashboard surfaces.
      </p>
      <p>
        If you hit a blocker, use the Contact Sales / demo channels once those
        flows ship, or open an issue in your project tracker.
      </p>
    </LegalPage>
  );
}
