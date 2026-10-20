import type { Metadata } from "next";
import { TimeOffView } from "@/components/dashboard/time-off-view";

export const metadata: Metadata = { title: "Time Off" };

export default function TimeOffPage() {
  return <TimeOffView />;
}
