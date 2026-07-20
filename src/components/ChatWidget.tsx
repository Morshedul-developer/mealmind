"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useIsClient } from "@/hooks/useIsClient";
import { streamChat, type ChatMessage } from "@/lib/chat-api";

interface ChatWidgetProps {
  recipeId?: string;
  recipeTitle?: string;
}

const FOLLOW_UP_SUGGESTIONS = [
  { icon: "swap_horiz", label: "Suggest a substitution" },
  { icon: "eco", label: "Make it healthier" },
  { icon: "groups", label: "Scale this recipe" },
];

let idCounter = 0;
function makeId() {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
}

export function ChatWidget({ recipeId, recipeTitle }: ChatWidgetProps) {
  const { data: session, isPending } = useSession();

  // useSession() can resolve at different speeds on the server (always
  // pending, since there's no client-side session store to read yet) vs.
  // the client (may resolve before hydration finishes), which causes a
  // hydration mismatch. isClient is false during SSR and the client's
  // first render, so both always agree.
  const isClient = useIsClient();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: recipeTitle
        ? `Hi! I'm your Chef Assistant. Ask me anything about ${recipeTitle} — substitutions, techniques, or how to scale it.`
        : "Hi! I'm your Chef Assistant. Ask me anything about cooking, ingredients, or techniques.",
    },
  ]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { id: makeId(), role: "user", content: trimmed };
    const assistantId = makeId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      streaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsStreaming(true);

    try {
      for await (const event of streamChat({ message: trimmed, conversationId, recipeId })) {
        if (event.type === "chunk") {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + event.chunk }
                : message
            )
          );
        } else {
          setConversationId(event.conversationId);
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId ? { ...message, streaming: false } : message
            )
          );
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: "Sorry, I couldn't respond right now. Please try again.",
                streaming: false,
                error: true,
              }
            : message
        )
      );
    } finally {
      setIsStreaming(false);
      // Safety net in case the stream ended without a "done" event.
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId && message.streaming
            ? { ...message, streaming: false }
            : message
        )
      );
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  if (!isClient || isPending) return null;

  if (!session) {
    return (
      <Link
        href="/login"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white border border-border text-charcoal shadow-lg rounded-full px-5 py-3 text-label font-semibold hover:bg-cream-alt transition-colors"
      >
        <span className="material-symbols-outlined text-primary">chat_bubble</span>
        Log in to chat
      </Link>
    );
  }

  const lastMessage = messages[messages.length - 1];
  const showSuggestions =
    lastMessage?.role === "assistant" && !lastMessage.streaming && !isStreaming;

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-primary-hover"
        >
          <span className="material-symbols-outlined text-[28px]">chat_bubble</span>
        </button>
      )}

      <div
        className={`fixed right-0 top-20 h-[calc(100vh-80px)] w-full lg:w-[400px] bg-white z-50 border-l border-border flex flex-col shadow-[-8px_0_24px_rgba(34,32,29,0.06)] transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                temp_preferences_custom
              </span>
            </div>
            <div>
              <h3 className="font-heading text-title leading-tight">Chef Assistant</h3>
              <p className="text-caption text-secondary">AI-Powered Kitchen Guide</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="p-2 hover:bg-cream-alt rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scrollbar bg-cream/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-1 max-w-[85%] ${
                message.role === "user" ? "items-end ml-auto" : "items-start"
              }`}
            >
              {message.role === "user" ? (
                <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-md">
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              ) : (
                <div
                  className={`p-4 rounded-2xl rounded-tl-none shadow-sm ${
                    message.error
                      ? "bg-error/10 text-error"
                      : "bg-cream-alt text-charcoal-muted"
                  }`}
                >
                  {message.content && (
                    <p className="whitespace-pre-line">{message.content}</p>
                  )}
                  {message.streaming && (
                    <div className={`flex gap-1 ${message.content ? "mt-2" : ""}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 streaming-dot" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 streaming-dot" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 streaming-dot" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pt-2">
              {FOLLOW_UP_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => sendMessage(suggestion.label)}
                  className="bg-secondary-light hover:bg-secondary hover:text-white transition-colors px-4 py-2 rounded-full text-secondary font-medium flex items-center gap-1 text-label border border-secondary/20"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {suggestion.icon}
                  </span>
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-border bg-white shrink-0">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about ingredients, timing..."
              rows={1}
              disabled={isStreaming}
              className="w-full bg-cream border border-border rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none placeholder:text-charcoal-muted/60 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              aria-label="Send message"
              className="absolute right-3 bottom-3 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-hover active:scale-90 transition-all shadow-sm disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            </button>
          </div>
          <p className="text-caption text-charcoal-muted/70 mt-2 px-1">
            Shift + Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
