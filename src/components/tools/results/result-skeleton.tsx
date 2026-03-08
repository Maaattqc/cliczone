export function ResultSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" role="status" aria-label="Chargement des résultats">
      {/* Header row */}
      <div className="flex gap-4">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
      </div>

      {/* Data rows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-4 w-28 rounded bg-muted" />
        </div>
      ))}

      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
}
