import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Company" };

export default function CompanyPage() {
  return (
    <>
      <PageHero
        title="Company"
        description={`Leadership, news, and why teams choose ${BRAND.name}.`}
      />
      <section className="mx-auto max-w-3xl space-y-3 px-4 py-14 sm:px-6">
        <Link href="/about" className="block text-[var(--accent)]">
          About →
        </Link>
        <Link href="/careers" className="block text-[var(--accent)]">
          Careers →
        </Link>
        <Link href="/contact-sales" className="block text-[var(--accent)]">
          Contact Sales →
        </Link>
      </section>
    </>
  );
}
