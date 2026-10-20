import type { Metadata } from "next";
import { PositionsView } from "@/components/dashboard/positions-view";

export const metadata: Metadata = { title: "Positions" };

export default function PositionsPage() {
  return <PositionsView />;
}
