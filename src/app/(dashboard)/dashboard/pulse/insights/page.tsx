import type { Metadata } from "next";
import { PulseInsightsView } from "@/components/dashboard/pulse-insights-view";

export const metadata: Metadata = { title: "Pulse insights" };

export default function PulseInsightsPage() {
  return <PulseInsightsView />;
}
