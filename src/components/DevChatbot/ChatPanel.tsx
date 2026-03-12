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
  } catch {}
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

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => { saveHistory(messages, messageCount); }, [messages, messageCount]);

  function clearHistory() {
    setMessages([]);
    setMessageCount(0);
    setCanUndo(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  const handleAgentEvent = useCallback((data: Record<string, unknown>) => {
    switch (data.type) {
      case "text": {
        liveTextRef.current += (data.content as string || "");
        setLiveText(liveTextRef.current);
        break;
      }
      case "text_delta": {
        liveTextRef.current += (data.content as string || "");
        setLiveText(liveTextRef.current);
        break;
      }
      case "tool_use": {
        const step: AgentStep = {
          id: nextStepId(), type: "tool_use",
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
      case "file_changed": setCanUndo(true); break;
      case "error": {
        const errStep: AgentStep = {
          id: nextStepId(), type: "error",
          content: data.message as string || "Erreur inconnue",
          status: "done",
        };
        liveStepsRef.current = [...liveStepsRef.current, errStep];
        setLiveSteps(liveStepsRef.current);
        break;
      }
      default: break;
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
      if (!res.ok) throw new Error("Erreur API");

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
            if (data.type === "result") resultData = data;
            else handleAgentEvent(data);
          } catch { /* skip */ }
        }
      }

      const finalSteps = liveStepsRef.current;
      const finalText = liveTextRef.current;
      const assistantMsg: Message = {
        role: "assistant",
        content: finalText || (finalSteps.length > 0 ? "" : "Aucune reponse."),
        steps: finalSteps.length > 0 ? finalSteps.map((s) => ({ ...s, status: "done" as const })) : undefined,
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
      const msg = (err as Error).name === "AbortError" ? "Requete annulee." : "Erreur de connexion. Reessayez.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg, timestamp: formatTimestamp() }]);
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Modifications annulees.", timestamp: formatTimestamp() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Erreur lors de l'annulation.", timestamp: formatTimestamp() }]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <div data-chatbot className="chatbot-glass fixed bottom-24 right-6 z-[9999] flex w-[400px] flex-col overflow-hidden rounded-[20px]">

      {/* Animated gradient mesh — gives the glass something to refract */}
      <div className="chatbot-mesh" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-[10px] chatbot-glass-inner">
            <span className="text-[13px] font-bold text-white/90">M</span>
            {isLoading && (
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
            )}
          </div>
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-white/90">
            Mat Agent
          </span>
        </div>
        <div className="flex items-center">
          {messages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.08] hover:text-white/70"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.08] hover:text-white/70"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="relative z-10 mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

      {/* Clear confirm */}
      {showClearConfirm && (
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-2.5 text-[12px]">
          <span className="text-white/50">Tout effacer ?</span>
          <div className="flex gap-1.5">
            <button onClick={() => { clearHistory(); setShowClearConfirm(false); }}
              className="rounded-md bg-red-500/15 px-2.5 py-1 text-red-300/90 transition-colors hover:bg-red-500/25">Oui</button>
            <button onClick={() => setShowClearConfirm(false)}
              className="rounded-md chatbot-glass-inner px-2.5 py-1 text-white/50 transition-colors hover:bg-white/[0.1]">Non</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="chatbot-scroll relative z-10 flex max-h-[480px] min-h-[200px] flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-4">

        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl chatbot-glass-inner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[13px] text-white/50 font-medium">Decrivez un changement</p>
              <p className="mt-1 text-[11px] text-white/25">Ex: Rends le bouton plus gros</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex max-w-[88%] flex-col">
              {msg.role === "user" ? (
                <div className="rounded-[14px] rounded-br-[6px] chatbot-glass-inner px-3.5 py-2.5 text-[13px] leading-[1.55] text-white/90">
                  {msg.content}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {msg.steps && msg.steps.length > 0 && <AgentSteps steps={msg.steps} />}
                  {msg.content && (
                    <div className={`rounded-[14px] rounded-bl-[6px] px-3.5 py-2.5 text-[13px] leading-[1.55] ${
                      msg.filesModified
                        ? "bg-emerald-400/[0.08] text-emerald-200/90 ring-1 ring-inset ring-emerald-400/15"
                        : "text-white/80"
                    }`}>
                      {msg.content}
                    </div>
                  )}
                </div>
              )}
              {msg.role === "assistant" && (msg.usage || msg.timestamp) && (
                <div className="mt-1 flex items-center gap-2 px-1 text-[10px] text-white/25 font-mono">
                  {msg.usage && <span>{msg.usage.input_tokens + msg.usage.output_tokens}</span>}
                  {msg.cost_usd != null && msg.cost_usd > 0 && <span>${msg.cost_usd.toFixed(3)}</span>}
                  {msg.timestamp && <span>{msg.timestamp}</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live stream */}
        {isLoading && (liveSteps.length > 0 || liveText) && (
          <div className="flex justify-start">
            <div className="flex max-w-[88%] flex-col gap-2">
              {liveSteps.length > 0 && <AgentSteps steps={liveSteps} />}
              {liveText && (
                <div className="rounded-[14px] rounded-bl-[6px] px-3.5 py-2.5 text-[13px] leading-[1.55] text-white/75">
                  {liveText}
                  <span className="ml-0.5 inline-block h-[13px] w-[1.5px] animate-pulse rounded-full bg-cyan-400/50 align-text-bottom" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading dots */}
        {isLoading && liveSteps.length === 0 && !liveText && (
          <div className="flex justify-start">
            <div className="rounded-[14px] rounded-bl-[6px] chatbot-glass-inner px-4 py-3">
              <div className="flex gap-[5px]">
                <span className="h-[5px] w-[5px] animate-bounce rounded-full bg-cyan-400/40 [animation-delay:0ms]" />
                <span className="h-[5px] w-[5px] animate-bounce rounded-full bg-cyan-400/40 [animation-delay:150ms]" />
                <span className="h-[5px] w-[5px] animate-bounce rounded-full bg-cyan-400/40 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Stop */}
        {isLoading && (
          <div className="flex justify-center pt-1">
            <button onClick={() => abortRef.current?.abort()}
              className="rounded-full chatbot-glass-inner px-4 py-1.5 text-[11px] text-white/40 transition-all hover:bg-white/[0.1] hover:text-white/70">
              Stop
            </button>
          </div>
        )}

        {/* Undo */}
        {canUndo && !isLoading && (
          <div className="flex justify-center pt-1">
            <button onClick={handleUndo}
              className="rounded-full chatbot-glass-inner px-4 py-1.5 text-[11px] text-white/40 transition-all hover:bg-white/[0.1] hover:text-white/70">
              Annuler
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Limits */}
      {messageCount >= WARNING_THRESHOLD && messageCount < MAX_MESSAGES && (
        <div className="relative z-10 mx-4 mb-2 rounded-lg chatbot-glass-inner px-3 py-1.5 text-[11px] text-amber-300/60">
          {MAX_MESSAGES - messageCount} restants
        </div>
      )}
      {messageCount >= MAX_MESSAGES && (
        <div className="relative z-10 mx-4 mb-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] text-red-300/70">
          Limite atteinte.
        </div>
      )}

      {/* Inspected element */}
      {inspectedElement && (
        <div className="relative z-10 mx-4 mb-1 flex items-center gap-2 rounded-xl chatbot-glass-inner px-3 py-2 text-[11px] text-white/40 font-mono">
          <span className="truncate">
            &lt;{inspectedElement.tag}&gt;
            {inspectedElement.id && `#${inspectedElement.id}`}
            {inspectedElement.classes.slice(0, 2).map(c => `.${c}`).join("")}
          </span>
          <button onClick={clearInspection}
            className="ml-auto shrink-0 rounded p-0.5 text-white/30 transition-colors hover:text-white/60">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 p-3 pt-2">
        <div className="flex items-center gap-2 rounded-[14px] chatbot-glass-input px-1.5 py-1">
          <button
            onClick={() => setInspectorEnabled((v) => !v)}
            title="Inspecteur"
            className={`shrink-0 rounded-[10px] p-2 transition-all ${
              inspectorEnabled
                ? "bg-white/[0.12] text-cyan-300/80"
                : "text-white/25 hover:text-white/50 hover:bg-white/[0.06]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Decrivez un changement..."
            disabled={isLoading || messageCount >= MAX_MESSAGES}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] text-white/85 placeholder-white/30 outline-none disabled:opacity-30"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading || messageCount >= MAX_MESSAGES}
            className="chatbot-btn-send shrink-0 rounded-[10px] p-2 text-white disabled:opacity-20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
