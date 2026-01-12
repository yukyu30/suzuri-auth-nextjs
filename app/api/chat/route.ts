import { mastra } from "@/mastra";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { messages, threadId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const agent = mastra.getAgent("surisuri");

    // 非ストリーミングで生成
    const result = await agent.generate(messages, {
      threadId: threadId || `thread-${Date.now()}`,
    });

    // テキストレスポンスを返す
    return new Response(
      JSON.stringify({
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: result.text,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
