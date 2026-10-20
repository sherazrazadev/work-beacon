import type { Metadata } from "next";
import { ContingentView } from "@/components/dashboard/contingent-view";

export const metadata: Metadata = { title: "Contingent" };

export default function ContingentPage() {
  return <ContingentView />;
}
