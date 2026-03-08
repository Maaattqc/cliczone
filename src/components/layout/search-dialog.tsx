"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Database, MapPin, Building2, BarChart3, Users } from "lucide-react";
import { globalSearch } from "@/lib/actions/search";

interface SearchResult {
  category: string;
  toolSlug: string;
  label: string;
  sublabel: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  immobilier: <Building2 className="h-4 w-4 text-muted-foreground" />,
  entrepreneurs: <Users className="h-4 w-4 text-muted-foreground" />,
  familles: <MapPin className="h-4 w-4 text-muted-foreground" />,
  emploi: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
  villes: <MapPin className="h-4 w-4 text-muted-foreground" />,
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await globalSearch(searchQuery);
      if (response.success) {
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, performSearch]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const groupedResults = results.reduce<Record<string, SearchResult[]>>(
    (acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    },
    {}
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="sr-only">Recherche</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un outil, une ville..."
              className="pl-9 pr-16 h-10"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              Ctrl+K
            </kbd>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-4 px-4">
          {loading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Recherche en cours...
            </div>
          )}

          {!loading && !hasSearched && !query.trim() && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Tapez pour rechercher dans les données du Québec
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Aucun résultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4 pb-4">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </p>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Link
                        key={`${item.toolSlug}-${item.label}`}
                        href={`/${item.toolSlug}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {categoryIcons[category] || (
                          <Database className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.label}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.sublabel}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
