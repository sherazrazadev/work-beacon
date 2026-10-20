import { NextResponse } from "next/server";
import { SEED_TIME_OFF } from "@/lib/mock/data";
import { SEED_TEAM_LEAVE } from "@/lib/mock/workforce";
import { authorizeDemo } from "@/lib/demo-api";

export async function GET(req: Request) {
  const auth = authorizeDemo(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "invalid_demo_key" }, { status: 401 });
  }
  return NextResponse.json({
    auth: auth.mode,
    data: [...SEED_TIME_OFF, ...SEED_TEAM_LEAVE].map((r) => ({
      id: r.id,
      type: r.type,
      start: r.start,
      end: r.end,
      status: r.status,
      workerId: r.workerId ?? null,
    })),
  });
}
