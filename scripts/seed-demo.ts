/**
 * Seeds (or with --reset, re-seeds) the demo tenant.
 *   npm run db:seed            # idempotent; keeps data users changed
 *   npm run db:seed -- --reset # wipes demo tenant records first
 * Refuses non-local Supabase URLs unless --remote-ok is passed.
 */
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { seedDemoTenant } from "@/lib/seed/demo-seed";

const args = new Set(process.argv.slice(2));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const local = /^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(url);

if (!local && !args.has("--remote-ok")) {
  console.error(
    `Refusing to seed ${url || "(no URL)"}: not a local Supabase. Pass --remote-ok to seed a hosted project on purpose.`,
  );
  process.exit(1);
}

seedDemoTenant(createSupabaseAdmin(), { resetData: args.has("--reset") })
  .then((r) => console.log(`Seeded demo tenant: ${r.users} users, ${r.records} records`))
  .catch((e) => {
    console.error("Seed failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
