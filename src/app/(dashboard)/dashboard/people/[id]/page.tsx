import { Suspense } from "react";
import { WorkerProfileView } from "@/components/dashboard/worker-profile-view";
import { WORKERS } from "@/lib/mock/org";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return WORKERS.map((w) => ({ id: w.id }));
}

export default async function WorkerPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-[var(--fg-muted)]">Loading…</p>}>
      <WorkerProfileView workerId={id} />
    </Suspense>
  );
}
