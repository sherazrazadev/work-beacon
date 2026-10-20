import type { Metadata } from "next";
import { LearningView } from "@/components/dashboard/learning-view";

export const metadata: Metadata = { title: "Learning" };

export default function LearningPage() {
  return <LearningView />;
}
