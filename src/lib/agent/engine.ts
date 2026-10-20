import type { AgentContext, AgentReply } from "@/lib/agent/types";
import {
  fallbackReply,
  matchAgentTool,
  runAgentTool as runNamedTool,
} from "@/lib/agent/tools";

export function runAgent(input: string, ctx: AgentContext): AgentReply {
  const tool = matchAgentTool(input);
  if (!tool) return fallbackReply();
  return { ...tool.run(input.toLowerCase(), ctx), toolId: tool.id };
}

export function runAgentTool(
  toolId: string,
  input: string,
  ctx: AgentContext,
): AgentReply {
  return runNamedTool(toolId, input, ctx) ?? runAgent(input, ctx);
}
