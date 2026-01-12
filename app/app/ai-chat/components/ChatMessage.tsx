"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3 max-w-[80%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* アバター */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
            isUser ? "bg-blue-500" : "bg-orange-500"
          )}
        >
          {isUser ? "You" : "忍"}
        </div>

        {/* メッセージ本文 */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}
