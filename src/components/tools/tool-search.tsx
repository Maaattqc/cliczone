"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { searchEntrepreneur } from "@/lib/actions/verifier-entrepreneur";
import { searchZoneInondable } from "@/lib/actions/zone-inondable";
import { searchTerrainContamine } from "@/lib/actions/terrain-contamine";
import { searchGarderies } from "@/lib/actions/garderies";
import { searchSalaires } from "@/lib/actions/salaires";

import { EntrepreneurResult } from "@/components/tools/results/entrepreneur-result";
import { ZoneInondableResult } from "@/components/tools/results/zone-inondable-result";
import { TerrainContamineResult } from "@/components/tools/results/terrain-contamine-result";
import { GarderiesResult } from "@/components/tools/results/garderies-result";
import { SalairesResult } from "@/components/tools/results/salaires-result";
import { ResultSkeleton } from "@/components/tools/results/result-skeleton";
import { NoResults } from "@/components/tools/results/no-results";
import { CheckoutButton } from "@/components/tools/checkout-button";
import { TOOL_PRICES } from "@/lib/tool-prices";

/* eslint-disable @typescript-eslint/no-explicit-any */
const actions: Record<string, (query: string, ville?: string) => Promise<any>> = {
  "verifier-entrepreneur": searchEntrepreneur,
  "zone-inondable": searchZoneInondable,
  "terrain-contamine": searchTerrainContamine,
  garderies: searchGarderies,
  salaires: searchSalaires,
};

const resultComponents: Record<string, React.ComponentType<{ data: any[] }>> = {
  "verifier-entrepreneur": EntrepreneurResult,
  "zone-inondable": ZoneInondableResult,
  "terrain-contamine": TerrainContamineResult,
  garderies: GarderiesResult,
  salaires: SalairesResult,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

interface ToolSearchProps {
  toolSlug: string;
  placeholder: string;
  ville?: string;
}

export function ToolSearch({ toolSlug, placeholder, ville }: ToolSearchProps) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    data?: unknown[];
    error?: string;
  } | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSubmittedQuery(trimmed);

    const action = actions[toolSlug];
    if (!action) {
      setResult({ success: false, error: "Outil non reconnu." });
      return;
    }

    startTransition(async () => {
      const res = await action(trimmed, ville);
      setResult(res);
    });
  }

  const ResultComponent = resultComponents[toolSlug];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-11"
            aria-label={placeholder}
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto h-11" disabled={isPending}>
          {isPending ? "Recherche..." : "Vérifier maintenant"}
        </Button>
      </form>

      {/* Results area */}
      {isPending && <ResultSkeleton />}

      {!isPending && result && (
        <>
          {!result.success && result.error && (
            <p className="text-sm text-destructive" role="alert">
              {result.error}
            </p>
          )}

          {result.success && result.data && result.data.length === 0 && (
            <NoResults query={submittedQuery} />
          )}

          {result.success &&
            result.data &&
            result.data.length > 0 &&
            ResultComponent && (
              <>
                <ResultComponent data={result.data as never[]} />
                {TOOL_PRICES[toolSlug] && (
                  <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        Obtenez le rapport complet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {TOOL_PRICES[toolSlug].label} — {(TOOL_PRICES[toolSlug].amount / 100).toFixed(2)}$ CAD
                      </p>
                    </div>
                    <CheckoutButton
                      toolSlug={toolSlug}
                      searchQuery={submittedQuery}
                      className="w-full sm:w-auto"
                    />
                  </div>
                )}
              </>
            )}
        </>
      )}
    </div>
  );
}
