import type { Metadata } from "next";
import { AccessView } from "@/components/dashboard/access-view";

export const metadata: Metadata = { title: "Access requests" };

export default function AccessPage() {
  return <AccessView />;
}
