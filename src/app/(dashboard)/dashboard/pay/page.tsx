import type { Metadata } from "next";
import { PayView } from "@/components/dashboard/pay-view";

export const metadata: Metadata = { title: "Pay" };

export default function PayPage() {
  return <PayView />;
}
