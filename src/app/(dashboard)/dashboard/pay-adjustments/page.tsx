import type { Metadata } from "next";
import { PayAdjustmentsView } from "@/components/dashboard/pay-adjustments-view";

export const metadata: Metadata = { title: "Pay adjustments" };

export default function PayAdjustmentsPage() {
  return <PayAdjustmentsView />;
}
