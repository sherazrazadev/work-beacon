import type { Metadata } from "next";
import { PayStatementView } from "@/components/dashboard/pay-statement-view";
import { SEED_PAY_STUBS } from "@/lib/mock/data";

export const metadata: Metadata = { title: "Pay statement" };

export function generateStaticParams() {
  return SEED_PAY_STUBS.map((s) => ({ id: s.id }));
}

export default async function PayStatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PayStatementView stubId={id} />;
}
