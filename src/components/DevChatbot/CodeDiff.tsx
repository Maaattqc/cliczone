interface CodeDiffProps {
  file: string;
  search: string;
  replace: string;
}

export function CodeDiff({ file, search, replace }: CodeDiffProps) {
  const removedLines = search.split("\n");
  const addedLines = replace.split("\n");

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-[#2a3447] bg-[#0d1017] text-xs font-mono">
      {/* Header */}
      <div className="border-b border-[#2a3447] bg-[#161d2e] px-3 py-1.5 text-gray-400">
        {file}
      </div>

      {/* Diff content */}
      <div className="max-h-[200px] overflow-y-auto p-2">
        {removedLines.map((line, i) => (
          <div key={`r-${i}`} className="whitespace-pre-wrap text-red-400/90 bg-red-500/10 px-2 py-0.5 rounded-sm">
            <span className="mr-2 select-none text-red-500/50">-</span>
            {line}
          </div>
        ))}
        {addedLines.map((line, i) => (
          <div key={`a-${i}`} className="whitespace-pre-wrap text-green-400/90 bg-green-500/10 px-2 py-0.5 rounded-sm">
            <span className="mr-2 select-none text-green-500/50">+</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewFilePreview({ file, content }: { file: string; content: string }) {
  const lines = content.split("\n");
  return (
    <div className="my-2 overflow-hidden rounded-lg border border-[#2a3447] bg-[#0d1017] text-xs font-mono">
      <div className="border-b border-[#2a3447] bg-[#161d2e] px-3 py-1.5 text-gray-400 flex items-center gap-2">
        <span className="text-green-400">+ NEW</span>{file}
      </div>
      <div className="max-h-[200px] overflow-y-auto p-2">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap text-green-400/90 bg-green-500/10 px-2 py-0.5 rounded-sm">
            <span className="mr-2 select-none text-green-500/50">{(i + 1).toString().padStart(3)}</span>{line}
          </div>
        ))}
      </div>
    </div>
  );
}
