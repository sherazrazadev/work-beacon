import type { Metadata } from "next";
import { ProcurementView } from "@/components/dashboard/procurement-view";

export const metadata: Metadata = { title: "Procurement" };

export default function ProcurementPage() {
  return <ProcurementView />;
}
