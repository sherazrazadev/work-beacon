import type { Metadata } from "next";
import { MarketplaceAppsView } from "@/components/dashboard/marketplace-apps-view";

export const metadata: Metadata = { title: "Apps" };

export default function DashboardMarketplacePage() {
  return <MarketplaceAppsView />;
}
