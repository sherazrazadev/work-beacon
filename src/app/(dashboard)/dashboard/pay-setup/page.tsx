import type { Metadata } from "next";
import { PaySetupView } from "@/components/dashboard/pay-setup-view";

export const metadata: Metadata = { title: "Pay setup" };

export default function PaySetupPage() {
  return <PaySetupView />;
}
