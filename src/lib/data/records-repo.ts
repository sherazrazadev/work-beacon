import type { SupabaseClient } from "@supabase/supabase-js";
import {
  COLLECTIONS,
  SINGLE_ID,
  SYNCED_KEYS,
  rowKey,
  unwrapSingle,
  wrapSingle,
  type SyncedKey,
} from "@/lib/data/collections";
import { defaultMockStore, type MockStoreState } from "@/lib/mock/store";

/** Position of each list row (`collection:id` -> ord), kept alongside state. */
export type OrdMap = Map<string, number>;

export type RecordRow = {
  collection: SyncedKey;
  id: string;
  data: unknown;
  ord: number;
};

export type Changes = {
  upserts: RecordRow[];
  deletes: { collection: SyncedKey; id: string }[];
};

const PAGE = 1000;
const BATCH = 200;
const ordKey = (collection: string, id: string) => `${collection}:${id}`;

/** State with every list empty and every single value at its default. */
export function emptyState(): MockStoreState {
  const base = defaultMockStore() as unknown as Record<string, unknown>;
  for (const key of SYNCED_KEYS) {
    if (COLLECTIONS[key].kind === "list") base[key] = [];
  }
  return base as unknown as MockStoreState;
}

type DbRow = { collection: string; id: string; data: unknown; ord: number };

export function rowsToState(rows: DbRow[]): { state: MockStoreState; ords: OrdMap } {
  const state = emptyState() as unknown as Record<string, unknown>;
  const ords: OrdMap = new Map();
  for (const row of rows) {
    const key = row.collection as SyncedKey;
    const spec = COLLECTIONS[key];
    if (!spec) continue; // unknown collection: ignore rather than crash
    if (spec.kind === "single") {
      state[key] = unwrapSingle(row.data);
    } else {
      (state[key] as unknown[]).push(row.data);
      ords.set(ordKey(key, row.id), row.ord);
    }
  }
  return { state: state as unknown as MockStoreState, ords };
}

/** Load everything the signed-in user may read (RLS decides what that is). */
export async function loadRecords(sb: SupabaseClient): Promise<{
  state: MockStoreState;
  ords: OrdMap;
}> {
  const rows: DbRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from("records")
      .select("collection,id,data,ord")
      .order("collection")
      .order("ord")
      .order("id")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data as DbRow[]));
    if (data.length < PAGE) break;
  }
  return rowsToState(rows);
}

/**
 * Compute row changes between two states. New list rows get a fractional `ord`
 * between their neighbours so inserts at the front/middle/end need no
 * renumbering. `ords` is updated in place.
 */
export function diffState(
  prev: MockStoreState,
  next: MockStoreState,
  ords: OrdMap,
): Changes {
  const changes: Changes = { upserts: [], deletes: [] };

  for (const key of SYNCED_KEYS) {
    const a = prev[key] as unknown;
    const b = next[key] as unknown;
    if (a === b) continue;
    const spec = COLLECTIONS[key];

    if (spec.kind === "single") {
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        changes.upserts.push({
          collection: key,
          id: SINGLE_ID,
          data: wrapSingle(b),
          ord: 0,
        });
      }
      continue;
    }

    const prevItems = a as unknown[];
    const nextItems = b as unknown[];
    const prevById = new Map<string, unknown>();
    for (const item of prevItems) prevById.set(rowKey(key, item), item);
    const nextIds = nextItems.map((item) => rowKey(key, item));

    // resolve ord for every next item (known ones keep theirs)
    const resolved: number[] = [];
    for (let i = 0; i < nextItems.length; i += 1) {
      const known = ords.get(ordKey(key, nextIds[i]));
      if (known !== undefined) {
        resolved.push(known);
        continue;
      }
      const before = i > 0 ? resolved[i - 1] : undefined;
      let after: number | undefined;
      for (let j = i + 1; j < nextItems.length; j += 1) {
        const o = ords.get(ordKey(key, nextIds[j]));
        if (o !== undefined) {
          after = o;
          break;
        }
      }
      let ord = 0;
      if (before !== undefined && after !== undefined) ord = (before + after) / 2;
      else if (before !== undefined) ord = before + 1;
      else if (after !== undefined) ord = after - 1;
      resolved.push(ord);
    }

    nextItems.forEach((item, i) => {
      const id = nextIds[i];
      const old = prevById.get(id);
      const isNew = !ords.has(ordKey(key, id)) || old === undefined;
      if (!isNew && old === item) return;
      if (!isNew && JSON.stringify(old) === JSON.stringify(item)) return;
      ords.set(ordKey(key, id), resolved[i]);
      changes.upserts.push({ collection: key, id, data: item, ord: resolved[i] });
    });

    const keep = new Set(nextIds);
    for (const id of prevById.keys()) {
      if (!keep.has(id)) {
        changes.deletes.push({ collection: key, id });
        ords.delete(ordKey(key, id));
      }
    }
  }

  return changes;
}

export const hasChanges = (c: Changes) =>
  c.upserts.length > 0 || c.deletes.length > 0;

/** Serialised writer: changes are applied in the order they were made. */
export class RecordsWriter {
  private chain: Promise<void> = Promise.resolve();

  constructor(
    private readonly sb: SupabaseClient,
    private readonly tenantId: string,
    private readonly onError: (message: string) => void,
  ) {}

  enqueue(changes: Changes) {
    if (!hasChanges(changes)) return;
    this.chain = this.chain.then(() => this.apply(changes)).catch((e: unknown) => {
      this.onError(e instanceof Error ? e.message : "Save failed");
    });
  }

  /** Resolves when everything queued so far has been written. */
  idle() {
    return this.chain;
  }

  private async apply(changes: Changes) {
    for (let i = 0; i < changes.upserts.length; i += BATCH) {
      const rows = changes.upserts.slice(i, i + BATCH).map((r) => ({
        tenant_id: this.tenantId,
        collection: r.collection,
        id: r.id,
        data: r.data,
        ord: r.ord,
      }));
      const { error } = await this.sb
        .from("records")
        .upsert(rows, { onConflict: "tenant_id,collection,id" });
      if (error) throw new Error(error.message);
    }

    const byCollection = new Map<string, string[]>();
    for (const d of changes.deletes) {
      byCollection.set(d.collection, [...(byCollection.get(d.collection) ?? []), d.id]);
    }
    for (const [collection, ids] of byCollection) {
      for (let i = 0; i < ids.length; i += BATCH) {
        const { error } = await this.sb
          .from("records")
          .delete()
          .eq("tenant_id", this.tenantId)
          .eq("collection", collection)
          .in("id", ids.slice(i, i + BATCH));
        if (error) throw new Error(error.message);
      }
    }
  }
}
