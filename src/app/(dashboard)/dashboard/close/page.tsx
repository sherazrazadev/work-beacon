import type { Metadata } from "next";
import { CloseView } from "@/components/dashboard/close-view";

export const metadata: Metadata = { title: "Month-end close" };

export default function ClosePage() {
  return <CloseView />;
}
