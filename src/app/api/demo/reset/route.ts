import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import { DEMO_TENANT } from "@/lib/demo-config";
import { seedDemoTenant } from "@/lib/seed/demo-seed";

/**
 * Re-seeds the DEMO tenant only. Requires a signed-in demo-tenant user; real
 * tenants can never be reset through this route.
 */
export async function POST() {
  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims as { tenant_id?: string; app_role?: string } | undefined;
  if (!claims) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (claims.tenant_id !== DEMO_TENANT.id || claims.app_role !== "hr_admin") {
    return NextResponse.json(
      { error: "Reset is only available to HR admins in the demo workspace." },
      { status: 403 },
    );
  }

  try {
    const result = await seedDemoTenant(createSupabaseAdmin(), { resetData: true });
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "Reset failed." }, { status: 500 });
  }
}
