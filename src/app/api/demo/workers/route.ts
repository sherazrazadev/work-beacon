import { NextResponse } from "next/server";
import { WORKERS } from "@/lib/mock/org";
import { authorizeDemo } from "@/lib/demo-api";

export async function GET(req: Request) {
  const auth = authorizeDemo(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "invalid_demo_key" }, { status: 401 });
  }
  return NextResponse.json({
    auth: auth.mode,
    data: WORKERS.map((w) => ({
      id: w.id,
      name: w.name,
      title: w.title,
      departmentId: w.departmentId,
    })),
  });
}
