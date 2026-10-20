import type { Metadata } from "next";
import { EnrollmentView } from "@/components/dashboard/enrollment-view";

export const metadata: Metadata = { title: "Enrollment" };

export default function EnrollmentPage() {
  return <EnrollmentView />;
}
