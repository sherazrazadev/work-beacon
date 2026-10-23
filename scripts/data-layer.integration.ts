/**
 * Integration check of the data layer against LOCAL Supabase (npm run db:start,
 * npm run db:seed). Signs in as each demo persona and verifies what Postgres
 * lets them read/write through the same repository code the app uses.
 *   npm run test:integration
 */
import assert from "node:assert/strict";
import test from "node:test";
import { createClient } from "@supabase/supabase-js";
import { DEMO_PASSWORD, DEMO_TENANT, demoEmailFor } from "@/lib/demo-config";
import {
  RecordsWriter,
  diffState,
  loadRecords,
} from "@/lib/data/records-repo";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { seedDemoTenant } from "@/lib/seed/demo-seed";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
assert.match(url, /127\.0\.0\.1|localhost/, "integration tests run on local Supabase only");

async function as(personaId: string) {
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await sb.auth.signInWithPassword({
    email: demoEmailFor(personaId),
    password: DEMO_PASSWORD,
  });
  assert.equal(error, null, `sign in ${personaId}`);
  return sb;
}

test.before(async () => {
  await seedDemoTenant(createSupabaseAdmin(), { resetData: true });
});

test("role visibility matches the permission matrix", async () => {
  const emp = await loadRecords(await as("employee"));
  const fin = await loadRecords(await as("finance"));
  const hr = await loadRecords(await as("hr_admin"));
  const mgr = await loadRecords(await as("manager"));

  assert.equal(emp.state.journals.length, 0, "employee cannot read journals");
  assert.ok(fin.state.journals.length > 0, "finance reads journals");
  assert.equal(emp.state.payrollRuns.length, 0, "employee cannot read payroll runs");
  assert.ok(fin.state.payrollRuns.length > 0, "finance reads payroll runs");
  assert.ok(emp.state.timeOff.every((t) => t.workerId === "w-alex"), "employee sees own leave only");
  assert.ok(hr.state.timeOff.length > emp.state.timeOff.length, "hr sees all leave");
  assert.ok(mgr.state.timeOff.length > 0, "manager sees team leave");
  assert.equal(emp.state.candidates.length, 0, "employee cannot read candidates");
  assert.ok(hr.state.candidates.length > 0, "hr reads candidates");
});

test("write, reorder-safe insert, and delete round-trip as the employee", async () => {
  const sb = await as("employee");
  const before = await loadRecords(sb);
  const errors: string[] = [];
  const writer = new RecordsWriter(sb, DEMO_TENANT.id, (m) => errors.push(m));

  const next = {
    ...before.state,
    timeOff: [
      {
        id: "to-it-1",
        workerId: "w-alex",
        type: "Vacation" as const,
        start: "2026-12-01",
        end: "2026-12-02",
        hours: 16,
        status: "Pending" as const,
        stepIndex: 0,
      },
      ...before.state.timeOff,
    ],
  };
  writer.enqueue(diffState(before.state, next, before.ords));
  await writer.idle();
  assert.deepEqual(errors, []);

  const after = await loadRecords(sb);
  assert.equal(after.state.timeOff[0].id, "to-it-1", "new row keeps front position");
  assert.equal(after.state.timeOff.length, before.state.timeOff.length + 1);

  const removed = { ...after.state, timeOff: after.state.timeOff.slice(1) };
  writer.enqueue(diffState(after.state, removed, after.ords));
  await writer.idle();
  assert.deepEqual(errors, []);
  assert.equal((await loadRecords(sb)).state.timeOff.length, before.state.timeOff.length);
});

test("employee write to a forbidden collection is rejected by the database", async () => {
  const sb = await as("employee");
  const before = await loadRecords(sb);
  const errors: string[] = [];
  const writer = new RecordsWriter(sb, DEMO_TENANT.id, (m) => errors.push(m));
  const next = {
    ...before.state,
    journals: [{ id: "j-evil", date: "2026-10-20", memo: "x", status: "Draft" as const, lines: [] }],
  };
  writer.enqueue(diffState(before.state, next, before.ords));
  await writer.idle();
  assert.equal(errors.length, 1, "save error surfaced");
  const admin = createSupabaseAdmin();
  const { data } = await admin.from("records").select("id").eq("id", "j-evil");
  assert.equal(data?.length, 0, "nothing was stored");
});

test("anon key cannot read tenant data", async () => {
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await sb.from("records").select("id").limit(1);
  assert.ok(error, "anon is denied");
});

test.after(async () => {
  await seedDemoTenant(createSupabaseAdmin(), { resetData: true });
});
