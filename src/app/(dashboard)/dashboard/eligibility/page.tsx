import type { Metadata } from "next";
import { EligibilityView } from "@/components/dashboard/eligibility-view";

export const metadata: Metadata = { title: "Work eligibility" };

export default function EligibilityPage() {
  return <EligibilityView />;
}
