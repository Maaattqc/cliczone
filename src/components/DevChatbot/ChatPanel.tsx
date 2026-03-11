"use client";

import { useState, useRef, useEffect } from "react";
import { injectPreviewCSS, clearAllPreviews, scopeCSSToSelector, previewDOMChange } from "./PreviewManager";
import { CodeDiff, NewFilePreview } from "./CodeDiff";
import { useAppContext } from "./useAppContext";
import { useElementInspector } from "./useElementInspector";

interface ActionSummary {
  type: "modify" | "create_file" | "install";
  description: string;
  file?: string;
  packages?: string[];
}

interface DiffItem {
  file: string;
  search: string;
  replace: string;
}

interface NewFileItem {
  file: string;
  content: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  // Legacy single-action fields (compat with old localStorage)
  modification?: { description: string; file: string } | null;
  diff?: { file: string; search: string; replace: string } | null;
  // New multi-action fields
  actions?: ActionSummary[];
  diffs?: DiffItem[];
  newFiles?: NewFileItem[];
  installPackages?: string[];
  tokenUsage?: { input_tokens: number; output_tokens: number } | null;
  timestamp?: string;
}

const MAX_MESSAGES = 50;
const WARNING_THRESHOLD = 40;
const STORAGE_KEY = "devchatbot-history";

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
    // quota exceeded — silently fail
  }
}

function formatTimestamp(): string {
  const now = new Date();
  const day = now.getDate();
  const months = ["jan", "fév", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
}

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => loadHistory().messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(() => loadHistory().messageCount);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [hasPreviewCSS, setHasPreviewCSS] = useState(false);
  const previewCleanupRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { collectContext, captureScreenshot } = useAppContext();
  const [screenshotEnabled, setScreenshotEnabled] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { inspectorEnabled, setInspectorEnabled, inspectedElement, clearInspection } = useElementInspector();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    saveHistory(messages, messageCount);
  }, [messages, messageCount]);

  function clearHistory() {
    setMessages([]);
    setMessageCount(0);
    localStorage.removeItem(STORAGE_KEY);
  }

  function parseResponse(raw: string): {
    text: string;
    actions?: ActionSummary[];
    diffs?: DiffItem[];
    newFiles?: NewFileItem[];
    installPackages?: string[];
    css_preview?: string | null;
  } {
    try {
      const cleaned = raw
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      const items: Record<string, unknown>[] = Array.isArray(parsed) ? parsed : [parsed];

      // Single text response
      if (items.length === 1 && items[0].type === "text") {
        return { text: (items[0].message as string) || raw };
      }

      const actions: ActionSummary[] = [];
      const diffs: DiffItem[] = [];
      const newFiles: NewFileItem[] = [];
      const installPackages: string[] = [];
      let css_preview: string | null = null;

      for (const item of items) {
        if (item.type === "modify") {
          actions.push({
            type: "modify",
            description: item.description as string,
            file: item.file as string,
          });
          diffs.push({
            file: item.file as string,
            search: item.search as string,
            replace: item.replace as string,
          });
          if (item.css_preview && !css_preview) {
            css_preview = item.css_preview as string;
          }
        } else if (item.type === "create_file") {
          actions.push({
            type: "create_file",
            description: item.description as string,
            file: item.file as string,
          });
          newFiles.push({
            file: item.file as string,
            content: item.content as string,
          });
        } else if (item.type === "install") {
          const pkgs = item.packages as string[];
          actions.push({
            type: "install",
            description: item.description as string,
            packages: pkgs,
          });
          installPackages.push(...pkgs);
        }
      }

      if (actions.length === 0) return { text: raw };

      return {
        text: "",
        actions,
        diffs: diffs.length > 0 ? diffs : undefined,
        newFiles: newFiles.length > 0 ? newFiles : undefined,
        installPackages: installPackages.length > 0 ? installPackages : undefined,
        css_preview,
      };
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
          appContext: { ...collectContext(), inspectedElement: inspectedElement || null },
          ...(screenshot ? { screenshot } : {}),
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Chat API error:", res.status, errText);
        throw new Error("Erreur API");
      }
      const data = await res.json();
      const { text, actions, diffs, newFiles, installPackages, css_preview } = parseResponse(
        data.response || ""
      );

      if (data.hasModification && actions && actions.length > 0) {
        setPendingApproval(true);

        // CSS preview — only for single modify action
        let scopedPreview = css_preview;
        if (scopedPreview && inspectedElement?.cssSelector) {
          scopedPreview = scopeCSSToSelector(scopedPreview, inspectedElement.cssSelector);
        }
        if (scopedPreview) {
          const cleanup = injectPreviewCSS(scopedPreview);
          previewCleanupRef.current = cleanup;
          setHasPreviewCSS(true);
        }

        // DOM text preview — only for single modify action without CSS preview
        let hasDOMPreview = false;
        if (!scopedPreview && inspectedElement?.cssSelector && diffs && diffs.length === 1) {
          const domCleanup = previewDOMChange(inspectedElement.cssSelector, diffs[0].replace);
          if (domCleanup) {
            previewCleanupRef.current = domCleanup;
            setHasPreviewCSS(true);
            hasDOMPreview = true;
          }
        }

        const description = actions.map((a) => a.description).filter(Boolean).join(" + ");

        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: description,
            actions,
            diffs: (scopedPreview || hasDOMPreview) ? undefined : diffs,
            newFiles,
            installPackages,
            tokenUsage: data.usage || null,
            timestamp: formatTimestamp(),
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: text || data.response, tokenUsage: data.usage || null, timestamp: formatTimestamp() },
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
      clearInspection();
    }
  }

  async function handleApproval(approved: boolean) {
    setPendingApproval(false);

    if (!approved) {
      // Reject: remove preview immediately
      if (previewCleanupRef.current) {
        previewCleanupRef.current();
        previewCleanupRef.current = null;
      }
      clearAllPreviews();
      setHasPreviewCSS(false);
    }

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: approved ? "approve" : "reject" }),
    });

    if (approved) {
      // Keep preview CSS visible until Next.js Hot Reload finishes.
      // Listen for the HMR "idle" status which means compilation + apply is done.
      const cleanupPreview = () => {
        if (previewCleanupRef.current) {
          previewCleanupRef.current();
          previewCleanupRef.current = null;
        }
        clearAllPreviews();
        setHasPreviewCSS(false);
      };

      const hmr = (module as unknown as { hot?: { status: () => string; addStatusHandler: (cb: (status: string) => void) => void; removeStatusHandler: (cb: (status: string) => void) => void } }).hot;
      if (hmr) {
        let wasApplying = false;
        const handler = (status: string) => {
          if (status === "apply") wasApplying = true;
          if (wasApplying && status === "idle") {
            hmr.removeStatusHandler(handler);
            // Small delay to let the DOM re-render with new styles
            setTimeout(cleanupPreview, 200);
          }
        };
        hmr.addStatusHandler(handler);
        // Safety timeout in case HMR never fires (e.g. no-op change, error)
        setTimeout(() => {
          hmr.removeStatusHandler(handler);
          cleanupPreview();
        }, 30000);
      } else {
        // No HMR available (production), just clean up after a short delay
        setTimeout(cleanupPreview, 2000);
      }
    }

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

        {messages.map((msg, i) => {
          const hasActions = msg.actions && msg.actions.length > 0;
          const hasModification = hasActions || !!msg.modification;

          return (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex max-w-[85%] flex-col">
              <div
                className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#3b5bdb] text-white"
                    : hasModification
                      ? "border border-green-500/30 bg-green-500/10 text-green-300"
                      : "bg-[#1e2433] text-gray-300"
                }`}
              >
                {hasActions ? (
                  <div>
                    <div className="mb-1 font-medium">{msg.content}</div>
                    {msg.actions!.map((act, j) => (
                      <div key={j} className="text-xs text-green-400/70">
                        {act.type === "modify" && <span>Modifie : {act.file}</span>}
                        {act.type === "create_file" && <span>Crée : {act.file}</span>}
                        {act.type === "install" && <span>Installe : {act.packages?.join(", ")}</span>}
                      </div>
                    ))}
                    {msg.diffs?.map((d, j) => (
                      <CodeDiff key={`d-${j}`} file={d.file} search={d.search} replace={d.replace} />
                    ))}
                    {msg.newFiles?.map((nf, j) => (
                      <NewFilePreview key={`nf-${j}`} file={nf.file} content={nf.content} />
                    ))}
                    {msg.installPackages && msg.installPackages.length > 0 && (
                      <div className="my-2 rounded-lg border border-[#2a3447] bg-[#0d1017] px-3 py-2 text-xs font-mono text-gray-300">
                        $ npm install {msg.installPackages.join(" ")}
                      </div>
                    )}
                  </div>
                ) : msg.modification ? (
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
              {msg.role === "assistant" && (msg.tokenUsage || msg.timestamp) && (
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-600">
                  {msg.tokenUsage && (
                    <span>
                      {msg.tokenUsage.input_tokens + msg.tokenUsage.output_tokens} tokens
                      ({msg.tokenUsage.input_tokens}↓ {msg.tokenUsage.output_tokens}↑)
                    </span>
                  )}
                  {msg.timestamp && <span>{msg.timestamp}</span>}
                </div>
              )}
            </div>
          </div>
          );
        })}

        {/* Preview indicator + Approve/Reject buttons */}
        {pendingApproval && !isLoading && (
          <div className="flex flex-col gap-2">
            {hasPreviewCSS && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 text-xs text-blue-300">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                Preview active — vérifiez le résultat sur la page
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
            title={inspectorEnabled ? "Inspecteur actif" : "Activer l'inspecteur d'éléments"}
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
