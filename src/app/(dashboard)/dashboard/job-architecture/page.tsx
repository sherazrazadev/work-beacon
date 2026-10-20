import type { Metadata } from "next";
import { JobArchitectureView } from "@/components/dashboard/job-architecture-view";

export const metadata: Metadata = { title: "Job architecture" };

export default function JobArchitecturePage() {
  return <JobArchitectureView />;
}
