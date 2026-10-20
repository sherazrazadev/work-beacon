import { Suspense } from "react";
import { CandidateView } from "@/components/dashboard/candidate-view";
import { SEED_CANDIDATES } from "@/lib/mock/talent";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SEED_CANDIDATES.map((c) => ({ id: c.id }));
}

export default async function CandidatePage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-[var(--fg-muted)]">Loading…</p>}>
      <CandidateView candidateId={id} />
    </Suspense>
  );
}
