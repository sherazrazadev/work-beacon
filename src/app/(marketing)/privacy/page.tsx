import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        {BRAND.name} is a local demo. We do not operate a production tenant or
        collect employee data from third-party systems.
      </p>
      <p>
        Demo auth and agent conversations may be stored in your browser
        (localStorage) on this device only. Clear site data to remove them.
      </p>
      <p>
        Optional analytics are disabled until you accept cookies. See Cookie
        Preferences for controls.
      </p>
    </LegalPage>
  );
}
