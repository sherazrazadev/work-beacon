import assert from "node:assert/strict";
import test from "node:test";
import { COLLECTIONS, SYNCED_KEYS } from "@/lib/data/collections";
import { diffState, emptyState, rowsToState } from "@/lib/data/records-repo";
import { defaultMockStore } from "@/lib/mock/store";

test("every synced key maps to exactly one collection spec", () => {
  assert.equal(SYNCED_KEYS.length, Object.keys(COLLECTIONS).length);
  const stateKeys = Object.keys(defaultMockStore()).filter((k) => k !== "managerMode");
  assert.deepEqual([...SYNCED_KEYS].sort(), stateKeys.sort());
});

test("state round-trips through rows with order preserved", () => {
  const seed = defaultMockStore();
  const empty = emptyState();
  const ords = new Map<string, number>();
  const changes = diffState(empty, seed, ords);
  // loaded rows come back sorted by ord
  const rows = changes.upserts.map((u) => ({
    collection: u.collection as string,
    id: u.id,
    data: u.data,
    ord: u.ord,
  }));
  const { state } = rowsToState(rows);
  assert.deepEqual(state.timeOff, seed.timeOff);
  assert.deepEqual(state.shifts, seed.shifts);
  assert.deepEqual(state.featureFlags, seed.featureFlags);
  assert.equal(state.demoApiKey, seed.demoApiKey);
});

test("diff emits only changed rows and deletes", () => {
  const seed = defaultMockStore();
  const ords = new Map<string, number>();
  diffState(emptyState(), seed, ords);

  const next = {
    ...seed,
    timeOff: seed.timeOff.slice(1).map((t, i) => (i === 0 ? { ...t, hours: t.hours + 1 } : t)),
  };
  const c = diffState(seed, next, ords);
  assert.equal(c.deletes.length, 1);
  assert.equal(c.deletes[0].collection, "timeOff");
  assert.equal(c.upserts.length, 1);
  assert.equal(c.upserts[0].collection, "timeOff");
});

test("rows inserted at the front or middle get an ord between neighbours", () => {
  const seed = defaultMockStore();
  const ords = new Map<string, number>();
  diffState(emptyState(), seed, ords);
  const first = seed.timeOff[0];
  const fresh = { ...first, id: "to-new" };
  const c = diffState(seed, { ...seed, timeOff: [fresh, ...seed.timeOff] }, ords);
  assert.equal(c.upserts.length, 1);
  assert.ok(c.upserts[0].ord < (ords.get(`timeOff:${first.id}`) ?? 0));

  const mid = diffState(
    { ...seed, timeOff: [fresh, ...seed.timeOff] },
    { ...seed, timeOff: [fresh, { ...first, id: "to-mid" }, ...seed.timeOff.slice(0)] },
    ords,
  );
  const midOrd = mid.upserts[0].ord;
  assert.ok(midOrd > c.upserts[0].ord && midOrd < (ords.get(`timeOff:${first.id}`) ?? 0));
});

test("single values are wrapped and diffed by value", () => {
  const seed = defaultMockStore();
  const ords = new Map<string, number>();
  const c = diffState(seed, { ...seed, retentionDays: 365 }, ords);
  assert.equal(c.upserts.length, 1);
  assert.deepEqual(c.upserts[0].data, { value: 365 });
  assert.equal(diffState(seed, { ...seed, retentionDays: seed.retentionDays }, ords).upserts.length, 0);
});
