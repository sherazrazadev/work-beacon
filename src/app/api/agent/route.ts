import { NextResponse } from "next/server";
import { AGENT_TOOL_IDS } from "@/lib/agent/tools";
import { createSupabaseServer } from "@/lib/supabase/server";

type Body = {
  prompt?: string;
  toolIds?: string[];
};

/**
 * Optional LLM tool-picker. Off unless NEXT_PUBLIC_AGENT_LLM=1 and
 * OPENAI_API_KEY is set. Tools still run locally in the browser.
 */
export async function POST(req: Request) {
  // Signed-in users only: this endpoint can spend LLM budget.
  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const llmOn = process.env.NEXT_PUBLIC_AGENT_LLM === "1";
  if (!llmOn) {
    return NextResponse.json({ mode: "rules", reason: "flag_off" });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ mode: "rules", reason: "missing_openai_key" });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ mode: "rules", reason: "bad_json" });
  }

  const prompt = (body.prompt ?? "").trim().slice(0, 500);
  const toolIds = (body.toolIds ?? AGENT_TOOL_IDS).filter(Boolean);
  if (!prompt) {
    return NextResponse.json({ mode: "rules", reason: "empty_prompt" });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_AGENT_MODEL ?? "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Pick exactly one tool id for a Work Beacon HR demo assistant. Return JSON {"toolId":"<id>"}. Valid ids: ${toolIds.join(", ")}. If none fit, use "help".`,
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ mode: "rules", reason: "llm_http" });
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { toolId?: string };
    const toolId = parsed.toolId;
    if (!toolId || (!toolIds.includes(toolId) && toolId !== "help")) {
      return NextResponse.json({ mode: "rules", reason: "unknown_tool" });
    }
    return NextResponse.json({ mode: "llm", toolId });
  } catch {
    return NextResponse.json({ mode: "rules", reason: "llm_error" });
  }
}
