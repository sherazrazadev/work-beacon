import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

type Body = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  source?: unknown;
  /** Honeypot: real users never fill this. */
  website?: unknown;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Stores a request-demo / request-access lead. Server-side validation; service-role insert. */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots get a success response and nothing is stored.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = text(body.name, 120);
  const email = text(body.email, 254).toLowerCase();
  const company = text(body.company, 160);
  const source = body.source === "signup" ? "signup" : "request-demo";

  if (!name || !company || !EMAIL.test(email)) {
    return NextResponse.json(
      { error: "Name, a valid work email, and company are required." },
      { status: 400 },
    );
  }

  const { error } = await createSupabaseAdmin()
    .from("leads")
    .upsert({ name, email, company, source }, { onConflict: "email,source", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: "Could not save your request." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
