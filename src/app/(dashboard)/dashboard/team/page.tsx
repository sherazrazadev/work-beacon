import type { Metadata } from "next";
import { TeamView } from "@/components/dashboard/team-view";

export const metadata: Metadata = { title: "My Team" };

export default function TeamPage() {
  return <TeamView />;
}
