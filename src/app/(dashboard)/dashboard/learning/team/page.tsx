import type { Metadata } from "next";
import { TeamLearningView } from "@/components/dashboard/team-learning-view";

export const metadata: Metadata = { title: "Team learning" };

export default function TeamLearningPage() {
  return <TeamLearningView />;
}
