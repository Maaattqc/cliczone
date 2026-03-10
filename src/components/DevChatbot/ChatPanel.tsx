"use client";

import { useState, useRef, useEffect } from "react";
import { injectPreviewCSS, clearAllPreviews } from "./PreviewManager";
import { CodeDiff } from "./CodeDiff";
import { useAppContext } from "./useAppContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  modification?: { description: string; file: string } | null;
  diff?: { file: string; search: string; replace: string } | null;
}

const MAX_MESSAGES = 50;
const WARNING_THRESHOLD = 40;

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [hasPreviewCSS, setHasPreviewCSS] = useState(false);
  const previewCleanupRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { collectContext, captureScreenshot } = useAppContext();
  const [screenshotEnabled, setScreenshotEnabled] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function parseResponse(raw: string): {
    text: string;
    modification?: { description: string; file: string };
    diff?: { file: string; search: string; replace: string };
    css_preview?: string | null;
  } {
    try {
      const cleaned = raw
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.type === "text") return { text: parsed.message || raw };
      if (parsed.type === "modify")
        return {
          text: "",
          modification: {
            description: parsed.description,
            file: parsed.file,
          },
          diff: {
            file: parsed.file,
            search: parsed.search,
            replace: parsed.replace,
          },
          css_preview: parsed.css_preview || null,
        };
      return { text: raw };
    } catch {
      return { text: raw };
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading || messageCount >= MAX_MESSAGES) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setMessageCount((c) => c + 1);

    try {
      let screenshot: string | null = null;
      if (screenshotEnabled) {
        screenshot = await captureScreenshot();
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          appContext: collectContext(),
          ...(screenshot ? { screenshot } : {}),
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Chat API error:", res.status, errText);
        throw new Error("Erreur API");
      }
      const data = await res.json();
      const { text, modification, diff, css_preview } = parseResponse(
        data.response || ""
      );

      if (data.hasModification && modification) {
        setPendingApproval(true);

        // CSS preview path — inject instantly
        if (css_preview) {
          const cleanup = injectPreviewCSS(css_preview);
          previewCleanupRef.current = cleanup;
          setHasPreviewCSS(true);
        }

        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: modification.description,
            modification,
            // Only show diff inline when there's no CSS preview
            diff: css_preview ? null : diff,
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: text || data.response },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Erreur de connexion. Réessayez.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApproval(approved: boolean) {
    setPendingApproval(false);

    // Remove CSS preview if active
    if (previewCleanupRef.current) {
      previewCleanupRef.current();
      previewCleanupRef.current = null;
    }
    clearAllPreviews();
    setHasPreviewCSS(false);

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: approved ? "approve" : "reject" }),
    });

    const statusMsg: Message = {
      role: "assistant",
      content: approved
        ? "Modification approuvée et écrite dans le fichier."
        : "Modification rejetée.",
    };
    setMessages((prev) => [...prev, statusMsg]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div data-chatbot className="fixed bottom-24 right-6 z-[9999] flex w-[360px] flex-col overflow-hidden rounded-2xl border border-[#2a3447] bg-[#0f1117] shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a3447] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b5bdb] text-sm">
            ⚡
          </div>
          <span className="text-sm font-semibold text-white">
            Éditeur live
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#1e2433] hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex max-h-[400px] min-h-[200px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            Décrivez un changement sur le site.
            <br />
            <span className="text-gray-600">
              Ex: &quot;Rends le bouton plus gros et bleu&quot;
            </span>
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#3b5bdb] text-white"
                  : msg.modification
                    ? "border border-green-500/30 bg-green-500/10 text-green-300"
                    : "bg-[#1e2433] text-gray-300"
              }`}
            >
              {msg.modification ? (
                <div>
                  <div className="mb-1 font-medium">{msg.content}</div>
                  <div className="text-xs text-green-400/70">
                    {msg.modification.file}
                  </div>
                  {msg.diff && (
                    <CodeDiff
                      file={msg.diff.file}
                      search={msg.diff.search}
                      replace={msg.diff.replace}
                    />
                  )}
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* Preview indicator + Approve/Reject buttons */}
        {pendingApproval && !isLoading && (
          <div className="flex flex-col gap-2">
            {hasPreviewCSS && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 text-xs text-blue-300">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                Preview CSS active — vérifiez le résultat sur la page
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleApproval(true)}
                className="flex-1 rounded-xl bg-green-600 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                Approuver
              </button>
              <button
                onClick={() => handleApproval(false)}
                className="flex-1 rounded-xl bg-red-600/80 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Rejeter
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-[#1e2433] px-3.5 py-2.5">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rate limit */}
      {messageCount >= WARNING_THRESHOLD && messageCount < MAX_MESSAGES && (
        <div className="mx-4 mb-2 rounded-lg bg-yellow-900/30 px-3 py-1.5 text-xs text-yellow-400">
          {MAX_MESSAGES - messageCount} messages restants
        </div>
      )}
      {messageCount >= MAX_MESSAGES && (
        <div className="mx-4 mb-2 rounded-lg bg-red-900/30 px-3 py-1.5 text-xs text-red-400">
          Limite atteinte. Rechargez la page.
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#2a3447] p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreenshotEnabled((v) => !v)}
            title={screenshotEnabled ? "Screenshot actif" : "Activer le screenshot"}
            className={`shrink-0 rounded-lg p-2 text-sm transition-colors ${
              screenshotEnabled
                ? "bg-[#3b5bdb]/20 text-[#3b5bdb]"
                : "text-gray-500 hover:bg-[#1e2433] hover:text-gray-300"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              pendingApproval
                ? "Approuvez ou rejetez d'abord..."
                : "Décrivez un changement..."
            }
            disabled={isLoading || pendingApproval || messageCount >= MAX_MESSAGES}
            className="flex-1 rounded-xl border border-[#2a3447] bg-[#161d2e] px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#3b5bdb] disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={
              !input.trim() ||
              isLoading ||
              pendingApproval ||
              messageCount >= MAX_MESSAGES
            }
            className="rounded-xl bg-[#3b5bdb] px-3.5 py-2.5 text-white transition-colors hover:bg-[#364fc7] disabled:opacity-40"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
