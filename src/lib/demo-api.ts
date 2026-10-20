import { DEMO_API_KEY_DEFAULT } from "@/lib/mock/platform";

export function authorizeDemo(req: Request):
  | { ok: true; mode: "open" | "key" }
  | { ok: false } {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return { ok: true, mode: "open" };
  if (token === DEMO_API_KEY_DEFAULT || token.startsWith("wb_live_")) {
    return { ok: true, mode: "key" };
  }
  return { ok: false };
}
