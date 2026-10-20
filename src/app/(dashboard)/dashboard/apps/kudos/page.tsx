import type { Metadata } from "next";
import { KudosApp } from "@/components/dashboard/kudos-app";

export const metadata: Metadata = { title: "Kudos" };

export default function KudosPage() {
  return <KudosApp />;
}
