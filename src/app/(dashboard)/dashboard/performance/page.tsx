import type { Metadata } from "next";
import { PerformanceView } from "@/components/dashboard/performance-view";

export const metadata: Metadata = { title: "Performance" };

export default function PerformancePage() {
  return <PerformanceView />;
}
