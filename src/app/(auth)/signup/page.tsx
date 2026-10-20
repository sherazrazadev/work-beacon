import type { Metadata } from "next";
import { RequestDemoForm } from "@/components/auth/request-demo-form";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return <RequestDemoForm />;
}
