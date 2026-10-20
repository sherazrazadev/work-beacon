import type { Metadata } from "next";
import { CompView } from "@/components/dashboard/comp-view";

export const metadata: Metadata = { title: "Compensation" };

export default function CompPage() {
  return <CompView />;
}
