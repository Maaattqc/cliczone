"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAppContext } from "./useAppContext";
import { useElementInspector } from "./useElementInspector";
import { AgentSteps } from "./AgentSteps";
import type { AgentStep } from "./AgentSteps";

interface Message {
  role: "user" | "assistant";
  content: string;
  steps?: AgentStep[];
  usage?: { input_tokens: number; output_tokens: number } | null;
  cost_usd?: number | null;
  num_turns?: number | null;
  filesModified?: boolean;
  timestamp?: string;
}

const MAX_MESSAGES = 50;
const WARNING_THRESHOLD = 40;
const STORAGE_KEY = "devchatbot-history-v2";

function loadHistory(): { messages: Message[]; messageCount: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], messageCount: 0 };
    const data = JSON.parse(raw);
    return { messages: data.messages || [], messageCount: data.messageCount || 0 };
  } catch {
    return { messages: [], messageCount: 0 };
  }
}

function saveHistory(messages: Message[], messageCount: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, messageCount }));
  } catch {
    // quota exceeded
  }
}

function formatTimestamp(): string {
  const now = new Date();
  const day = now.getDate();
  const months = ["jan", "fev", "mars", "avr", "mai", "juin", "juil", "aout", "sept", "oct", "nov", "dec"];
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
}

let stepIdCounter = 0;
function nextStepId(): string {
  return `step-${++stepIdCounter}`;
}

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => loadHistory().messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(() => loadHistory().messageCount);
  const [canUndo, setCanUndo] = useState(false);
  const [liveSteps, setLiveSteps] = useState<AgentStep[]>([]);
  const [liveText, setLiveText] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const liveStepsRef = useRef<AgentStep[]>([]);
  const liveTextRef = useRef("");

  const { collectContext } = useAppContext();
  const { inspectorEnabled, setInspectorEnabled, inspectedElement, clearInspection } = useElementInspector();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveSteps, liveText]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    saveHistory(messages, messageCount);
  }, [messages, messageCount]);

  function clearHistory() {
    setMessages([]);
    setMessageCount(0);
    setCanUndo(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  const handleAgentEvent = useCallback((data: Record<string, unknown>) => {
    switch (data.type) {
      case "text": {
        const text = data.content as string || "";
        liveTextRef.current += text;
        setLiveText(liveTextRef.current);
        break;
      }

      case "text_delta": {
        const delta = data.content as string || "";
        liveTextRef.current += delta;
        setLiveText(liveTextRef.current);
        break;
      }

      case "tool_use": {
        const step: AgentStep = {
          id: nextStepId(),
          type: "tool_use",
          tool: data.tool as string,
          input: data.input as Record<string, unknown> | undefined,
          status: "running",
        };
        liveStepsRef.current = [...liveStepsRef.current, step];
        setLiveSteps(liveStepsRef.current);
        break;
      }

      case "tool_result": {
        const updated = [...liveStepsRef.current];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].status === "running") {
            updated[i] = { ...updated[i], status: "done" };
            break;
          }
        }
        liveStepsRef.current = updated;
        setLiveSteps(updated);
        break;
      }

      case "file_changed":
        setCanUndo(true);
        break;

      case "error": {
        const errStep: AgentStep = {
          id: nextStepId(),
          type: "error",
          content: data.message as string || "Erreur inconnue",
          status: "done",
        };
        liveStepsRef.current = [...liveStepsRef.current, errStep];
        setLiveSteps(liveStepsRef.current);
        break;
      }

      default:
        break;
    }
  }, []);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading || messageCount >= MAX_MESSAGES) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setMessageCount((c) => c + 1);
    liveStepsRef.current = [];
    liveTextRef.current = "";
    setLiveSteps([]);
    setLiveText("");
    setCanUndo(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: content.trim(),
          appContext: { ...collectContext(), inspectedElement: inspectedElement || null },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Stream API error:", res.status, errText);
        throw new Error("Erreur API");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let resultData: Record<string, unknown> | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "result") {
              resultData = data;
            } else {
              handleAgentEvent(data);
            }
          } catch {
            // skip malformed SSE
          }
        }
      }

      // Finalize: build assistant message from refs (always up-to-date)
      const finalSteps = liveStepsRef.current;
      const finalText = liveTextRef.current;

      const assistantMsg: Message = {
        role: "assistant",
        content: finalText || (finalSteps.length > 0 ? "" : "Aucune reponse."),
        steps: finalSteps.length > 0
          ? finalSteps.map((s) => ({ ...s, status: "done" as const }))
          : undefined,
        usage: resultData?.usage as { input_tokens: number; output_tokens: number } | undefined || null,
        cost_usd: resultData?.cost_usd as number | undefined || null,
        num_turns: resultData?.num_turns as number | undefined || null,
        filesModified: (resultData?.files_modified as boolean) || false,
        timestamp: formatTimestamp(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      liveStepsRef.current = [];
      liveTextRef.current = "";
      setLiveSteps([]);
      setLiveText("");
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Requete annulee.", timestamp: formatTimestamp() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Erreur de connexion. Reessayez.", timestamp: formatTimestamp() },
        ]);
      }
      setLiveSteps([]);
      setLiveText("");
    } finally {
      setIsLoading(false);
      abortRef.current = null;
      clearInspection();
    }
  }

  async function handleUndo() {
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "undo" }),
      });
      setCanUndo(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Modifications annulees (git checkout).", timestamp: formatTimestamp() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur lors de l'annulation.", timestamp: formatTimestamp() },
      ]);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div data-chatbot className="fixed bottom-24 right-6 z-[9999] flex w-[380px] flex-col overflow-hidden rounded-2xl border border-[#2a3447] bg-[#0f1117] shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a3447] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b5bdb] text-sm">
            {"//"}
          </div>
          <span className="text-sm font-semibold text-white">
            Claude Agent
          </span>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              title="Effacer l'historique"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#1e2433] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#1e2433] hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Clear history confirmation */}
      {showClearConfirm && (
        <div className="flex items-center gap-2 border-b border-[#2a3447] bg-[#1a1f2e] px-4 py-2 text-xs text-gray-300">
          <span>Effacer tout l&apos;historique ?</span>
          <button onClick={() => { clearHistory(); setShowClearConfirm(false); }}
            className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700">Oui</button>
          <button onClick={() => setShowClearConfirm(false)}
            className="rounded bg-[#2a3447] px-2 py-1 text-gray-300 hover:bg-[#3a4457]">Non</button>
        </div>
      )}

      {/* Messages */}
      <div className="flex max-h-[450px] min-h-[200px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isLoading && (
          <p className="py-8 text-center text-sm text-gray-500">
            Decrivez un changement sur le site.
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
            <div className="flex max-w-[90%] flex-col">
              {msg.role === "user" ? (
                <div className="rounded-xl bg-[#3b5bdb] px-3.5 py-2.5 text-sm leading-relaxed text-white">
                  {msg.content}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Agent steps */}
                  {msg.steps && msg.steps.length > 0 && (
                    <AgentSteps steps={msg.steps} />
                  )}
                  {/* Text response */}
                  {msg.content && (
                    <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.filesModified
                        ? "border border-green-500/30 bg-green-500/10 text-green-300"
                        : "bg-[#1e2433] text-gray-300"
                    }`}>
                      {msg.content}
                    </div>
                  )}
                </div>
              )}
              {/* Meta info */}
              {msg.role === "assistant" && (msg.usage || msg.timestamp || msg.cost_usd) && (
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-600">
                  {msg.usage && (
                    <span>
                      {msg.usage.input_tokens + msg.usage.output_tokens} tokens
                    </span>
                  )}
                  {msg.cost_usd != null && msg.cost_usd > 0 && (
                    <span>${msg.cost_usd.toFixed(4)}</span>
                  )}
                  {msg.num_turns != null && msg.num_turns > 0 && (
                    <span>{msg.num_turns} tours</span>
                  )}
                  {msg.timestamp && <span>{msg.timestamp}</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live streaming: show steps + text as they arrive */}
        {isLoading && (liveSteps.length > 0 || liveText) && (
          <div className="flex justify-start">
            <div className="flex max-w-[90%] flex-col gap-2">
              {liveSteps.length > 0 && <AgentSteps steps={liveSteps} />}
              {liveText && (
                <div className="rounded-xl bg-[#1e2433] px-3.5 py-2.5 text-sm leading-relaxed text-gray-300">
                  {liveText}
                  <span className="inline-block h-3 w-1 animate-pulse bg-gray-400 ml-0.5" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading indicator (when no steps/text yet) */}
        {isLoading && liveSteps.length === 0 && !liveText && (
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

        {/* Stop button */}
        {isLoading && (
          <div className="flex justify-center">
            <button
              onClick={handleStop}
              className="rounded-lg border border-[#2a3447] bg-[#1e2433] px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a3447] hover:text-white"
            >
              Arreter
            </button>
          </div>
        )}

        {/* Undo button */}
        {canUndo && !isLoading && (
          <div className="flex justify-center">
            <button
              onClick={handleUndo}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 transition-colors hover:bg-amber-500/20"
            >
              Annuler les modifications
            </button>
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

      {/* Inspected element indicator */}
      {inspectedElement && (
        <div className="mx-3 mt-2 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
          <span className="truncate">
            &lt;{inspectedElement.tag}&gt;
            {inspectedElement.id && `#${inspectedElement.id}`}
            {inspectedElement.classes.slice(0, 2).map(c => `.${c}`).join("")}
          </span>
          <button
            onClick={clearInspection}
            className="ml-auto shrink-0 rounded p-0.5 text-amber-400 hover:bg-amber-500/20"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#2a3447] p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInspectorEnabled((v) => !v)}
            title={inspectorEnabled ? "Inspecteur actif" : "Activer l'inspecteur d'elements"}
            className={`shrink-0 rounded-lg p-2 text-sm transition-colors ${
              inspectorEnabled
                ? "bg-amber-500/20 text-amber-400"
                : "text-gray-500 hover:bg-[#1e2433] hover:text-gray-300"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
            </svg>
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Decrivez un changement..."
            disabled={isLoading || messageCount >= MAX_MESSAGES}
            className="flex-1 rounded-xl border border-[#2a3447] bg-[#161d2e] px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#3b5bdb] disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading || messageCount >= MAX_MESSAGES}
            className="rounded-xl bg-[#3b5bdb] px-3.5 py-2.5 text-white transition-colors hover:bg-[#364fc7] disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
