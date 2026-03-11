import { CodeDiff, NewFilePreview } from "./CodeDiff";

export interface AgentStep {
  id: string;
  type: "thinking" | "tool_use" | "tool_result" | "text" | "error";
  tool?: string;
  input?: Record<string, unknown>;
  content?: string;
  status: "running" | "done";
}

function ToolIcon({ tool }: { tool: string }) {
  switch (tool) {
    case "Read":
      return <span className="text-blue-400">R</span>;
    case "Edit":
      return <span className="text-yellow-400">E</span>;
    case "Write":
      return <span className="text-green-400">W</span>;
    case "Glob":
    case "Grep":
      return <span className="text-purple-400">S</span>;
    case "Bash":
      return <span className="text-orange-400">$</span>;
    default:
      return <span className="text-gray-400">?</span>;
  }
}

function ToolLabel({ tool, input }: { tool: string; input?: Record<string, unknown> }) {
  const filePath = (input?.file_path || input?.filePath || input?.path || input?.pattern || "") as string;
  const shortPath = filePath.split("/").slice(-2).join("/");

  switch (tool) {
    case "Read":
      return <>Lecture de <span className="text-gray-300">{shortPath}</span></>;
    case "Edit":
      return <>Modification de <span className="text-gray-300">{shortPath}</span></>;
    case "Write":
      return <>Creation de <span className="text-gray-300">{shortPath}</span></>;
    case "Glob":
      return <>Recherche de fichiers <span className="text-gray-300">{shortPath}</span></>;
    case "Grep":
      return <>Recherche dans le code <span className="text-gray-300">{(input?.pattern as string || "").slice(0, 40)}</span></>;
    case "Bash":
      return <>Commande <span className="text-gray-300 font-mono">{((input?.command as string) || "").slice(0, 50)}</span></>;
    default:
      return <>{tool}</>;
  }
}

function StepItem({ step, isExpanded, onToggle }: { step: AgentStep; isExpanded: boolean; onToggle: () => void }) {
  if (step.type === "text" || step.type === "thinking") {
    if (!step.content) return null;
    return (
      <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
        {step.content}
      </div>
    );
  }

  if (step.type === "error") {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
        {step.content}
      </div>
    );
  }

  if (step.type !== "tool_use" || !step.tool) return null;

  const isFileChange = step.tool === "Edit" || step.tool === "Write";
  const defaultExpanded = isFileChange;

  return (
    <div className="rounded-lg border border-[#2a3447] bg-[#0d1017] overflow-hidden">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-400 hover:bg-[#161d2e] transition-colors"
      >
        <span className="font-mono text-[10px] w-4 text-center">
          <ToolIcon tool={step.tool} />
        </span>
        <span className="flex-1 text-left truncate">
          <ToolLabel tool={step.tool} input={step.input} />
        </span>
        {step.status === "running" && (
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        )}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform ${isExpanded || defaultExpanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {(isExpanded || defaultExpanded) && step.input && (
        <div className="border-t border-[#2a3447]">
          {step.tool === "Edit" && step.input.old_string && step.input.new_string ? (
            <CodeDiff
              file={((step.input.file_path || "") as string).split("/").slice(-2).join("/")}
              search={step.input.old_string as string}
              replace={step.input.new_string as string}
            />
          ) : null}
          {step.tool === "Write" && step.input.content ? (
            <NewFilePreview
              file={((step.input.file_path || "") as string).split("/").slice(-2).join("/")}
              content={(step.input.content as string).slice(0, 2000)}
            />
          ) : null}
          {step.tool === "Bash" && step.input.command ? (
            <div className="px-3 py-2 text-xs font-mono text-gray-300 bg-[#0d1017]">
              $ {step.input.command as string}
            </div>
          ) : null}
          {step.tool === "Read" && (
            <div className="px-3 py-1.5 text-[10px] text-gray-500">
              {(step.input.file_path || "") as string}
            </div>
          )}
          {(step.tool === "Glob" || step.tool === "Grep") && (
            <div className="px-3 py-1.5 text-[10px] text-gray-500">
              {step.tool === "Grep" ? `Pattern: ${(step.input.pattern || "") as string}` : `Pattern: ${(step.input.pattern || "") as string}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AgentSteps({ steps }: { steps: AgentStep[] }) {
  // Group consecutive text steps into one
  const renderedSteps: AgentStep[] = [];
  for (const step of steps) {
    if (step.type === "text" && renderedSteps.length > 0) {
      const last = renderedSteps[renderedSteps.length - 1];
      if (last.type === "text") {
        // Merge text content
        last.content = (last.content || "") + (step.content || "");
        continue;
      }
    }
    renderedSteps.push({ ...step });
  }

  return (
    <div className="flex flex-col gap-2">
      {renderedSteps.map((step) => (
        <CollapsibleStep key={step.id} step={step} />
      ))}
    </div>
  );
}

function CollapsibleStep({ step }: { step: AgentStep }) {
  const isFileChange = step.tool === "Edit" || step.tool === "Write";
  // File changes start expanded, others collapsed
  const defaultOpen = isFileChange || step.type === "text" || step.type === "error";

  return (
    <StepItem
      step={step}
      isExpanded={defaultOpen}
      onToggle={() => {/* Toggle handled by CSS/state if needed */}}
    />
  );
}
