import { useState } from "react";
import { CodeDiff, NewFilePreview } from "./CodeDiff";

export interface AgentStep {
  id: string;
  type: "thinking" | "tool_use" | "tool_result" | "text" | "error";
  tool?: string;
  input?: Record<string, unknown>;
  content?: string;
  status: "running" | "done";
}

const toolMeta: Record<string, { label: string; accent: string }> = {
  Read:  { label: "Lecture",    accent: "border-l-white/10" },
  Edit:  { label: "Edit",      accent: "border-l-amber-500/30" },
  Write: { label: "Nouveau",   accent: "border-l-emerald-500/30" },
  Glob:  { label: "Fichiers",  accent: "border-l-white/10" },
  Grep:  { label: "Recherche", accent: "border-l-white/10" },
  Bash:  { label: "Terminal",  accent: "border-l-orange-500/20" },
};

function shortPath(input?: Record<string, unknown>): string {
  const p = (input?.file_path || input?.filePath || input?.path || input?.pattern || "") as string;
  return p.split("/").slice(-2).join("/");
}

function StepItem({ step }: { step: AgentStep }) {
  const [expanded, setExpanded] = useState<boolean | null>(null);

  if (step.type === "text" || step.type === "thinking") {
    if (!step.content) return null;
    return (
      <div className="text-[12px] text-white/60 leading-relaxed whitespace-pre-wrap">
        {step.content}
      </div>
    );
  }

  if (step.type === "error") {
    return (
      <div className="rounded-lg bg-red-500/[0.05] px-3 py-2 text-[11px] text-red-400/60 ring-1 ring-inset ring-red-500/10">
        {step.content}
      </div>
    );
  }

  if (step.type !== "tool_use" || !step.tool) return null;

  const meta = toolMeta[step.tool] || { label: step.tool, accent: "border-l-white/10" };
  const isFileChange = step.tool === "Edit" || step.tool === "Write";
  const isOpen = expanded !== null ? expanded : isFileChange;

  return (
    <div className={`rounded-lg border-l-2 ${meta.accent} chatbot-glass-inner overflow-hidden`}>
      <button
        onClick={() => setExpanded(isOpen ? false : true)}
        className="flex items-center gap-2 w-full px-3 py-[7px] text-[11px] text-white/45 hover:text-white/70 transition-colors"
      >
        <span className="text-white/20 font-mono text-[10px] w-3 text-center shrink-0">
          {step.tool === "Bash" ? "$" : step.tool === "Edit" ? "~" : step.tool === "Write" ? "+" : ">"}
        </span>
        <span className="flex-1 text-left truncate">
          {meta.label}{" "}
          <span className="text-white/20 font-mono">
            {step.tool === "Bash"
              ? ((step.input?.command as string) || "").slice(0, 40)
              : step.tool === "Grep"
                ? ((step.input?.pattern as string) || "").slice(0, 30)
                : shortPath(step.input)
            }
          </span>
        </span>
        {step.status === "running" ? (
          <span className="relative flex h-[6px] w-[6px] shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/20" />
            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-white/40" />
          </span>
        ) : (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/15 shrink-0">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-white/15 shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && step.input && (
        <div className="border-t border-white/[0.03]">
          {step.tool === "Edit" && step.input.old_string && step.input.new_string ? (
            <CodeDiff
              file={shortPath(step.input)}
              search={step.input.old_string as string}
              replace={step.input.new_string as string}
            />
          ) : null}
          {step.tool === "Write" && step.input.content ? (
            <NewFilePreview
              file={shortPath(step.input)}
              content={(step.input.content as string).slice(0, 2000)}
            />
          ) : null}
          {step.tool === "Bash" && step.input.command ? (
            <div className="px-3 py-2 text-[10px] font-mono text-white/25">
              $ {step.input.command as string}
            </div>
          ) : null}
          {step.tool === "Read" && (
            <div className="px-3 py-1.5 text-[10px] font-mono text-white/15">
              {(step.input.file_path || "") as string}
            </div>
          )}
          {(step.tool === "Glob" || step.tool === "Grep") && (
            <div className="px-3 py-1.5 text-[10px] font-mono text-white/15">
              {(step.input.pattern || "") as string}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AgentSteps({ steps }: { steps: AgentStep[] }) {
  const renderedSteps: AgentStep[] = [];
  for (const step of steps) {
    if (step.type === "text" && renderedSteps.length > 0) {
      const last = renderedSteps[renderedSteps.length - 1];
      if (last.type === "text") {
        last.content = (last.content || "") + (step.content || "");
        continue;
      }
    }
    renderedSteps.push({ ...step });
  }

  return (
    <div className="flex flex-col gap-1">
      {renderedSteps.map((step) => (
        <StepItem key={step.id} step={step} />
      ))}
    </div>
  );
}
