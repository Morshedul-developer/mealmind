export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  streaming?: boolean;
  error?: boolean;
}

export type ChatStreamEvent =
  | { type: "chunk"; chunk: string }
  | { type: "done"; conversationId: string };

export interface StreamChatInput {
  message: string;
  conversationId?: string;
  recipeId?: string;
}

// axios doesn't handle SSE well, so this one call uses raw fetch instead of
// the shared `api` instance.
export async function* streamChat(
  input: StreamChatInput
): AsyncGenerator<ChatStreamEvent> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat/stream`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error("Could not reach the chat assistant. Please try again.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line; a frame can be split
    // across multiple stream reads, so only consume complete frames.
    let separatorIndex: number;
    while ((separatorIndex = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);

      const dataLine = frame
        .split("\n")
        .find((line) => line.startsWith("data:"));
      if (!dataLine) continue;

      const payload = JSON.parse(dataLine.slice("data:".length).trim()) as {
        chunk?: string;
        done?: boolean;
        conversationId?: string;
      };

      if (payload.done && payload.conversationId) {
        yield { type: "done", conversationId: payload.conversationId };
      } else if (typeof payload.chunk === "string") {
        yield { type: "chunk", chunk: payload.chunk };
      }
    }
  }
}
