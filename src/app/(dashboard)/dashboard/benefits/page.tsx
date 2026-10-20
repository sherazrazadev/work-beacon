import type { Metadata } from "next";
import { BenefitsView } from "@/components/dashboard/benefits-view";

export const metadata: Metadata = { title: "Benefits" };

export default function BenefitsPage() {
  return <BenefitsView />;
}
