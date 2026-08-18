"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Building2, Loader2, RotateCcw, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MarkdownMessage } from "@/components/markdown-message";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What's IPE 25's story?",
  "Who are our class representatives?",
  "What are the lab facilities?",
  "How do I contact the department?",
];

const MAX_LENGTH = 1000;

export function DepartmentAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/assistant" }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  });

  const busy = status === "streaming" || status === "submitted";
  const empty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy || trimmed.length > MAX_LENGTH) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  function reset() {
    setMessages([]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 gap-2 rounded-full shadow-lg"
        aria-label="Open IPE 25 assistant"
      >
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:inline">IPE 25 Info</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="flex w-full max-w-md flex-col gap-0 p-0"
        >
          <SheetHeader className="gap-1 border-b border-border px-4 py-3 pr-20">
            <SheetTitle>IPE 25 Assistant</SheetTitle>
            <p className="text-xs text-muted-foreground">
              Grounded in IPE 25&apos;s own data — our story, timeline, class reps
              — plus department reference info like faculty, courses, labs,
              admission, and contact.
            </p>
          </SheetHeader>

          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-10"
            onClick={reset}
            disabled={empty}
            aria-label="Start over"
            title="Start over"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <ScrollArea className="flex-1">
            <div
              className={cn(
                "px-4 py-4",
                empty ? "flex min-h-full flex-col items-center justify-center" : "space-y-3",
              )}
            >
              {empty && (
                <div className="w-full max-w-sm space-y-4 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-accent/70" />
                  <p className="text-sm text-muted-foreground">
                    Ask about IPE 25 — our story, timeline, class reps — or
                    department basics like faculty, courses, labs and
                    admission. Bangla or English both work.
                  </p>
                  <div className="flex flex-col gap-2 text-left">
                    {SUGGESTIONS.map((s) => (
                      <Card
                        key={s}
                        role="button"
                        tabIndex={0}
                        onClick={() => submit(s)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submit(s);
                        }}
                        className="cursor-pointer px-3.5 py-2.5 text-left text-sm transition-colors hover:border-accent/40 hover:bg-accent/8"
                      >
                        {s}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {busy && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  thinking…
                </div>
              )}

              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error.message || "Something went wrong. Please try again."}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-end gap-2 p-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about IPE 25… (Enter to send, Shift+Enter for a new line)"
                disabled={busy}
                rows={1}
                maxLength={MAX_LENGTH}
                className={cn(
                  "max-h-32 min-h-9 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              />
              <Button
                type="submit"
                size="icon"
                disabled={busy || !input.trim()}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
              AI assistant — verify official department info with the
              department office.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground whitespace-pre-wrap"
            : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        {isUser ? text : <MarkdownMessage text={text} />}
      </div>
    </div>
  );
}
