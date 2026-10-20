import type { Metadata } from "next";
import { MobilityView } from "@/components/dashboard/mobility-view";

export const metadata: Metadata = { title: "Internal jobs" };

export default function MobilityPage() {
  return <MobilityView />;
}
