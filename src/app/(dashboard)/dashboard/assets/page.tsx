import type { Metadata } from "next";
import { AssetsView } from "@/components/dashboard/assets-view";

export const metadata: Metadata = { title: "IT assets" };

export default function AssetsPage() {
  return <AssetsView />;
}
