import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath } from "@/lib/rbac";
import type { DemoRole } from "@/lib/mock/org";

const ROLES: DemoRole[] = ["employee", "manager", "hr_admin", "finance"];

/**
 * Refreshes the Supabase session cookie on every matched request and enforces
 * sign-in plus route roles for /dashboard before anything renders. Authorization
 * of data still happens in Postgres (RLS); this is the first, cheap gate.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return new NextResponse("Server is missing Supabase configuration.", {
      status: 500,
    });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // Verifies the JWT (never trust getSession() on the server).
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { app_role?: string } | undefined;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (!claims) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(login);
    }
    const role = ROLES.find((r) => r === claims.app_role);
    // Missing role claim = stale token; the client refreshes it. RLS still applies.
    if (role && !canAccessPath(role, pathname)) {
      const home = request.nextUrl.clone();
      home.pathname = "/dashboard";
      home.search = "";
      return NextResponse.redirect(home);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/auth/:path*",
    "/reset-password",
    "/api/agent",
    "/api/demo/reset",
    "/api/session/:path*",
  ],
};
