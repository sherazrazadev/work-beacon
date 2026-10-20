import type { Metadata } from "next";
import { CareersApplyForm } from "@/components/careers-apply-form";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Careers" };

const ROLES = [
  {
    title: "Product Designer",
    loc: "Remote",
    blurb: "Shape ESS/MSS and agent experiences with clarity over chrome.",
  },
  {
    title: "Platform Engineer",
    loc: "Remote",
    blurb: "APIs, tools, and governance for builders extending Work Beacon.",
  },
  {
    title: "Customer Success",
    loc: "Hybrid",
    blurb: "Guide demo tenants from first login to executive readout.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Careers"
        description={`Build the ${BRAND.name} platform with operators who prefer clarity over complexity.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="space-y-6">
          {ROLES.map((r) => (
            <li key={r.title} className="border-t border-[var(--border)] pt-4">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                {r.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--accent)]">{r.loc}</p>
              <p className="mt-2 text-[var(--fg-muted)]">{r.blurb}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Apply (mock)
        </h2>
        <p className="mt-2 mb-6 text-sm text-[var(--fg-muted)]">
          Demo form only — nothing leaves the browser.
        </p>
        <CareersApplyForm />
      </section>
    </>
  );
}
