import type { SupabaseClient } from "@supabase/supabase-js";
import {
  COLLECTIONS,
  SINGLE_ID,
  SYNCED_KEYS,
  rowKey,
  wrapSingle,
} from "@/lib/data/collections";
import { DEMO_PASSWORD, DEMO_TENANT, demoEmailFor } from "@/lib/demo-config";
import { PERSONAS, WORKERS, getWorker } from "@/lib/mock/org";
import { defaultMockStore } from "@/lib/mock/store";

/**
 * Idempotent demo seed. Needs a service-role client (server / CLI only).
 * Creates the demo tenant, its directory, one demo user per persona (all with
 * the shared demo password) and the starter records. Fake data only.
 */

const BATCH = 200;

async function ensureUser(admin: SupabaseClient, email: string): Promise<string> {
  for (let page = 1; page < 50; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) {
      // keep the shared password in sync with demo-config
      const { error: upd } = await admin.auth.admin.updateUserById(hit.id, {
        password: DEMO_PASSWORD,
        email_confirm: true,
      });
      if (upd) throw upd;
      return hit.id;
    }
    if (data.users.length < 200) break;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { demo: true },
  });
  if (error || !data.user) throw error ?? new Error(`could not create ${email}`);
  return data.user.id;
}

async function assertMatrixCoversState(admin: SupabaseClient) {
  const { data, error } = await admin.from("collection_access").select("collection,role");
  if (error) throw error;
  const have = new Map<string, number>();
  for (const r of data) have.set(r.collection, (have.get(r.collection) ?? 0) + 1);
  const missing = SYNCED_KEYS.filter((k) => have.get(k) !== 4);
  if (missing.length) {
    throw new Error(
      `collection_access is missing rows for: ${missing.join(", ")}. Add them in a migration.`,
    );
  }
  const known = new Set<string>(SYNCED_KEYS);
  const extra = [...have.keys()].filter((c) => !known.has(c));
  if (extra.length) {
    throw new Error(`collection_access has unknown collections: ${extra.join(", ")}`);
  }
}

export async function seedDemoTenant(
  admin: SupabaseClient,
  opts: { resetData?: boolean } = {},
): Promise<{ users: number; records: number }> {
  await assertMatrixCoversState(admin);

  const tid = DEMO_TENANT.id;
  const t = await admin
    .from("tenants")
    .upsert({ id: tid, slug: DEMO_TENANT.slug, name: DEMO_TENANT.name, is_demo: true });
  if (t.error) throw t.error;

  const w = await admin.from("workers").upsert(
    WORKERS.map((x) => ({
      tenant_id: tid,
      id: x.id,
      name: x.name,
      email: x.email,
      manager_id: x.managerId,
    })),
  );
  if (w.error) throw w.error;

  for (const p of PERSONAS) {
    const email = demoEmailFor(p.id);
    const userId = await ensureUser(admin, email);
    const worker = getWorker(p.workerId);
    const prof = await admin.from("profiles").upsert({
      id: userId,
      tenant_id: tid,
      email,
      full_name: worker?.name ?? p.label,
      role: p.role,
      worker_id: p.workerId,
      persona_id: p.id,
      updated_at: new Date().toISOString(),
    });
    if (prof.error) throw prof.error;
  }

  if (opts.resetData) {
    const del = await admin.from("records").delete().eq("tenant_id", tid);
    if (del.error) throw del.error;
  }

  const store = defaultMockStore() as unknown as Record<string, unknown>;
  const rows: Record<string, unknown>[] = [];
  for (const key of SYNCED_KEYS) {
    const spec = COLLECTIONS[key];
    const value = store[key];
    if (spec.kind === "single") {
      rows.push({
        tenant_id: tid,
        collection: key,
        id: SINGLE_ID,
        data: wrapSingle(value),
        ord: 0,
      });
      continue;
    }
    (value as unknown[]).forEach((item, i) => {
      rows.push({
        tenant_id: tid,
        collection: key,
        id: rowKey(key, item),
        data: item,
        ord: i,
        // personal data without an owner field belongs to the employee persona
        ...(key === "banks" ? { owner_worker: "w-alex" } : {}),
      });
    });
  }

  for (let i = 0; i < rows.length; i += BATCH) {
    const res = await admin
      .from("records")
      .upsert(rows.slice(i, i + BATCH), { onConflict: "tenant_id,collection,id" });
    if (res.error) throw res.error;
  }

  return { users: PERSONAS.length, records: rows.length };
}
