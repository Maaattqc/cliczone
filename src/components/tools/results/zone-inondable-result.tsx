"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ZoneInondable {
  id: string;
  geom: string | null;
  niveau: string | null;
  source: string | null;
  ville: string | null;
  updatedAt: Date;
}

export function ZoneInondableResult({ data }: { data: ZoneInondable[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((zone) => (
        <Card key={zone.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{zone.ville ?? "Ville inconnue"}</span>
              <Badge
                variant={zone.niveau === "0-20" ? "destructive" : "secondary"}
              >
                {zone.niveau === "0-20" ? "Risque élevé" : "Risque modéré"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Niveau</span>
              <span className="font-medium">{zone.niveau ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source</span>
              <span className="font-medium">{zone.source ?? "—"}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
