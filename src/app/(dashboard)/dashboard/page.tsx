import type { Metadata } from "next";
import { HomeWidgets } from "@/components/dashboard/home-widgets";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <HomeWidgets />;
}
