import { SearchX } from "lucide-react";

export function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX
        className="h-12 w-12 text-muted-foreground mb-4"
        aria-hidden="true"
      />
      <p className="text-muted-foreground text-sm">
        {`Aucun résultat trouvé pour \u00ab\u202f${query}\u202f\u00bb.`}
      </p>
    </div>
  );
}
