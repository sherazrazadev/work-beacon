import type { Metadata } from "next";
import { RequestDemoForm } from "@/components/auth/request-demo-form";

export const metadata: Metadata = { title: "Request Demo" };

export default function RequestDemoPage() {
  return <RequestDemoForm />;
}
