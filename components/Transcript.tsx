"use client";

import { Messages } from "@/type";
import { Mic } from "lucide-react";
import { useEffect, useRef } from "react";

export type TranscriptProps = {
  messages: Messages[];
  currentMessage?: string;
  currentUserMessage?: string;
};

const isUser = (role: string) => role === "user";

export default function Transcript({
  messages,
  currentMessage = "",
  currentUserMessage = "",
}: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasStreamUser = currentUserMessage.length > 0;
  const hasStreamAssistant = currentMessage.length > 0;
  const isEmpty =
    messages.length === 0 && !hasStreamUser && !hasStreamAssistant;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, currentMessage, currentUserMessage]);

  return (
    <section className="transcript-container flex-1 min-h-0 w-full">
      {isEmpty ? (
        <div className="transcript-empty">
          <Mic
            className="mb-4 h-12 w-12 text-[var(--text-muted)]"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="transcript-empty-text">No conversation yet</p>
          <p className="transcript-empty-hint">
            Click the mic button above to start talking
          </p>
        </div>
      ) : (
        <div ref={scrollRef} className="transcript-messages">
          {messages.map((m, i) => {
            const user = isUser(m.role);
            return (
              <div
                key={`${m.role}-${i}-${m.content.slice(0, 24)}`}
                className={`transcript-message ${
                  user
                    ? "transcript-message-user"
                    : "transcript-message-assistant"
                }`}
              >
                <div
                  className={`transcript-bubble ${
                    user
                      ? "transcript-bubble-user"
                      : "transcript-bubble-assistant"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          {hasStreamUser && (
            <div className="transcript-message transcript-message-user">
              <div className="transcript-bubble transcript-bubble-user">
                {currentUserMessage}
                <span className="transcript-cursor" aria-hidden />
              </div>
            </div>
          )}
          {hasStreamAssistant && (
            <div className="transcript-message transcript-message-assistant">
              <div className="transcript-bubble transcript-bubble-assistant">
                {currentMessage}
                <span className="transcript-cursor" aria-hidden />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
