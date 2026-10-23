import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        {BRAND.name} stores the account details and workspace records your
        organisation enters (for example time off, expenses and documents) so
        the product can work. Access is limited by your role and enforced in
        the database.
      </p>
      <p>
        The demo workspace contains fake data only. Anyone with the published
        demo credential can read and change it; do not enter real personal
        data there.
      </p>
      <p>
        We use essential cookies to keep you signed in. Optional analytics are
        disabled until you accept cookies. See Cookie Preferences for controls.
      </p>
    </LegalPage>
  );
}
