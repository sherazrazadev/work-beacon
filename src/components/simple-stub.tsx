import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";

export function SimpleStub({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <PageHero title={title} description={description} />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Button asChild variant="secondary">
          <Link href="/">Back home</Link>
        </Button>
      </section>
    </>
  );
}
