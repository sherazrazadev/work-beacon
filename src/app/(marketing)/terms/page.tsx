import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms">
      <p>
        This site is a portfolio / demo rebuild inspired by public enterprise
        marketing patterns. It is not affiliated with, endorsed by, or a
        product of any other company.
      </p>
      <p>
        Content is provided as-is for demonstration. Do not submit real
        credentials or sensitive personal data.
      </p>
      <p>
        {BRAND.name} grants no license to third-party trademarks that may
        appear in industry discussions.
      </p>
    </LegalPage>
  );
}
