import type { Metadata } from "next";
import { TaxPacksView } from "@/components/dashboard/tax-packs-view";

export const metadata: Metadata = { title: "Tax packs" };

export default function TaxPacksPage() {
  return <TaxPacksView />;
}
