import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { PRODUCTS, getProduct } from "@/lib/content";
import { PRODUCT_DETAILS } from "@/lib/marketing-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProduct(slug)?.name ?? "Products" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  const detail = PRODUCT_DETAILS[slug];
  if (!product || !detail) notFound();

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={product.name}
        description={product.summary}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-sm uppercase tracking-wider text-[var(--fg-muted)]">
          Built for {detail.who}
        </p>

        <h2 className="mt-8 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Modules
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {detail.modules.map((m) => (
            <li key={m.name} className="border-t border-[var(--border)] pt-4">
              <h3 className="font-semibold text-[var(--fg)]">{m.name}</h3>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{m.detail}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Outcomes
        </h2>
        <ul className="mt-4 space-y-3">
          {detail.outcomes.map((o) => (
            <li
              key={o}
              className="border-l-2 border-[var(--accent)] pl-3 text-[var(--fg-muted)]"
            >
              {o}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/request-demo">Request Demo</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products">All products</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/pricing">See packaging</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
