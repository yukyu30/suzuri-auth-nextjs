"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { Send, Loader2, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "かわいい猫のグッズを探して",
  "夏らしいTシャツが欲しいな",
  "おもしろいスマホケースはある？",
  "スリスリくん、自己紹介して！",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "やあやあ、拙者はスリスリくんでござる！ニンニン！\n\nSUZURIの公式忍者として、お主のグッズ探しをお手伝いするでござるよ。\n\n「かわいい猫のグッズ」「夏らしいTシャツ」など、欲しいものを教えてくれればお探しするでござる！もちろん雑談も大歓迎じゃ！",
};

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId] = useState(() => `thread-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          threadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.id || `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col">
      <CardHeader className="border-b flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-orange-500" />
          スリスリAIチャット
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (Beta)
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                忍
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>スリスリくんが考え中でござる...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center p-4">
              エラーが発生したでござる: {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* サジェストプロンプト（メッセージが少ない時のみ表示） */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-sm text-muted-foreground mb-2">
              こんな質問ができるでござる:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 入力エリア */}
        <form
          onSubmit={handleSubmit}
          className="border-t p-4 flex gap-2 flex-shrink-0"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="スリスリくんに話しかけてみよう..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
