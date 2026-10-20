import type { Metadata } from "next";
import { MovesView } from "@/components/dashboard/moves-view";

export const metadata: Metadata = { title: "Transfers & promotions" };

export default function MovesPage() {
  return <MovesView />;
}
