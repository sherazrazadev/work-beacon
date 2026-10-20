import type { Metadata } from "next";
import { ApiExplorerView } from "@/components/dashboard/api-explorer-view";

export const metadata: Metadata = { title: "API explorer" };

export default function ApiExplorerPage() {
  return <ApiExplorerView />;
}
