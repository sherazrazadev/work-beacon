import type { Metadata } from "next";
import { PoliciesView } from "@/components/dashboard/policies-view";

export const metadata: Metadata = { title: "Policies" };

export default function PoliciesPage() {
  return <PoliciesView />;
}
