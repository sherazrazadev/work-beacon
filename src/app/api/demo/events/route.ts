import { NextResponse } from "next/server";
import { SEED_PROCESS_EVENTS } from "@/lib/mock/platform";
import { authorizeDemo } from "@/lib/demo-api";

export async function GET(req: Request) {
  const auth = authorizeDemo(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "invalid_demo_key" }, { status: 401 });
  }
  return NextResponse.json({ auth: auth.mode, data: SEED_PROCESS_EVENTS });
}
