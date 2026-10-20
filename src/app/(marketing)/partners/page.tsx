import type { Metadata } from "next";
import { SimpleStub } from "@/components/simple-stub";

export const metadata: Metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <SimpleStub
      title="Partner Ecosystem"
      description="Integration, expertise, and service through the Work Beacon partner program."
    />
  );
}
