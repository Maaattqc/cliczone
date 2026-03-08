"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TerrainContamine {
  id: string;
  geom: string | null;
  adresse: string;
  statut: string;
  details: Record<string, unknown> | null;
  ville: string | null;
  updatedAt: Date;
}

function getStatutVariant(statut: string) {
  const lower = statut.toLowerCase();
  if (lower.includes("contaminé") && !lower.includes("décontaminé")) {
    return "destructive" as const;
  }
  if (lower.includes("traitement")) {
    return "secondary" as const;
  }
  return "default" as const;
}

export function TerrainContamineResult({
  data,
}: {
  data: TerrainContamine[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((terrain) => (
        <Card key={terrain.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="truncate">{terrain.adresse}</span>
              <Badge variant={getStatutVariant(terrain.statut)}>
                {terrain.statut}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ville</span>
              <span className="font-medium">{terrain.ville ?? "—"}</span>
            </div>
            {terrain.details && Object.keys(terrain.details).length > 0 && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Détails</span>
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                  {Object.entries(terrain.details).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium">{key}</span> : {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
