"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { WORKERS } from "@/lib/mock/org";
import { moneyUsd } from "@/lib/mock/money";

export function PayAdjustmentsView() {
  const { session } = useAuth();
  const {
    ready,
    state,
    addOffCycle,
    payOffCycle,
    addGarnishment,
    releaseGarnishment,
    addRetro,
  } = useMock();
  const finance = session?.user.role === "finance";
  const [msg, setMsg] = useState<string | null>(null);
  const [ocWorker, setOcWorker] = useState("w-alex");
  const [ocAmt, setOcAmt] = useState("400");
  const [ocReason, setOcReason] = useState("Spot bonus");
  const [garWorker, setGarWorker] = useState("w-casey");
  const [garAgency, setGarAgency] = useState("");
  const [garAmt, setGarAmt] = useState("100");
  const [retWorker, setRetWorker] = useState("w-alex");
  const [retAmt, setRetAmt] = useState("100");
  const [retNote, setRetNote] = useState("");

  if (!ready) return <DashboardSkeleton />;

  function onOffCycle(e: FormEvent) {
    e.preventDefault();
    if (!finance) return;
    addOffCycle({
      workerId: ocWorker,
      amount: Number(ocAmt) || 0,
      reason: ocReason.trim() || "Off-cycle",
    });
    setMsg("Off-cycle draft saved.");
  }

  function onGarnish(e: FormEvent) {
    e.preventDefault();
    addGarnishment({
      workerId: garWorker,
      agency: garAgency.trim() || "Agency",
      amountPerPeriod: Number(garAmt) || 0,
    });
    setGarAgency("");
    setMsg("Garnishment active.");
  }

  function onRetro(e: FormEvent) {
    e.preventDefault();
    if (!finance) return;
    addRetro({
      workerId: retWorker,
      amount: Number(retAmt) || 0,
      note: retNote.trim() || "Retro",
      periodLabel: "Prior period",
    });
    setRetNote("");
    setMsg("Retro queued for next calculate.");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Pay adjustments
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Garnishments, off-cycle payments, and retro. Applied on the next
          calculate.
        </p>
      </div>
      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Garnishments
        </h2>
        <ul className="mt-3 space-y-2">
          {state.garnishments.map((g) => (
            <li
              key={g.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
            >
              <span>
                {WORKERS.find((w) => w.id === g.workerId)?.name} · {g.agency} ·{" "}
                {moneyUsd(g.amountPerPeriod)} · {g.status}
              </span>
              {g.status === "Active" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => releaseGarnishment(g.id)}
                >
                  Release
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
        <form onSubmit={onGarnish} className="mt-3 flex flex-wrap gap-2">
          <select
            value={garWorker}
            onChange={(e) => setGarWorker(e.target.value)}
            className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
          >
            {WORKERS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <input
            value={garAgency}
            onChange={(e) => setGarAgency(e.target.value)}
            placeholder="Agency"
            className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
          />
          <input
            value={garAmt}
            onChange={(e) => setGarAmt(e.target.value)}
            inputMode="decimal"
            className="w-24 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
          />
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
      </section>

      {finance ? (
        <>
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
              Off-cycle
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {state.offCyclePays.length === 0 ? (
                <li className="text-[var(--fg-muted)]">None.</li>
              ) : (
                state.offCyclePays.map((o) => (
                  <li
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                  >
                    <span>
                      {WORKERS.find((w) => w.id === o.workerId)?.name} ·{" "}
                      {moneyUsd(o.amount)} · {o.reason} · {o.status}
                    </span>
                    {o.status === "Draft" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setMsg(
                            payOffCycle(o.id)
                              ? "Paid — stub on Pay."
                              : "Could not pay.",
                          );
                        }}
                      >
                        Pay
                      </Button>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
            <form onSubmit={onOffCycle} className="mt-3 flex flex-wrap gap-2">
              <select
                value={ocWorker}
                onChange={(e) => setOcWorker(e.target.value)}
                className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
              >
                {WORKERS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <input
                value={ocAmt}
                onChange={(e) => setOcAmt(e.target.value)}
                inputMode="decimal"
                className="w-24 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
              />
              <input
                value={ocReason}
                onChange={(e) => setOcReason(e.target.value)}
                className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
              />
              <Button type="submit" size="sm">
                Draft
              </Button>
            </form>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
              Retro
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {state.retroAdjustments.map((r) => (
                <li key={r.id}>
                  {WORKERS.find((w) => w.id === r.workerId)?.name} ·{" "}
                  {moneyUsd(r.amount)} · {r.note} ·{" "}
                  {r.appliedToRunId ? `applied ${r.appliedToRunId}` : "queued"}
                </li>
              ))}
            </ul>
            <form onSubmit={onRetro} className="mt-3 flex flex-wrap gap-2">
              <select
                value={retWorker}
                onChange={(e) => setRetWorker(e.target.value)}
                className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
              >
                {WORKERS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <input
                value={retAmt}
                onChange={(e) => setRetAmt(e.target.value)}
                inputMode="decimal"
                className="w-24 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
              />
              <input
                value={retNote}
                onChange={(e) => setRetNote(e.target.value)}
                placeholder="Note"
                className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm min-h-10 sm:min-h-8"
              />
              <Button type="submit" size="sm">
                Queue
              </Button>
            </form>
          </section>
        </>
      ) : null}
    </div>
  );
}
