import type { Metadata } from "next";
import { PlanningView } from "@/components/dashboard/planning-view";

export const metadata: Metadata = { title: "Beacon Planning" };

export default function PlanningPage() {
  return <PlanningView />;
}
