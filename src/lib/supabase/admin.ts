import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Service-role client. SERVER ONLY: bypasses RLS. Never import from a client
 * component; CI greps the production bundle for the key.
 */
export function createSupabaseAdmin(): SupabaseClient {
  const { url } = supabaseEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set (server env only).");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
