"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Garderie {
  id: string;
  nom: string;
  adresse: string | null;
  geom: string | null;
  type: string | null;
  placesTotal: number | null;
  placesDispo: number | null;
  codePostal: string | null;
  ville: string | null;
  updatedAt: Date;
}

export function GarderiesResult({ data }: { data: Garderie[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Places totales</TableHead>
          <TableHead>Places disponibles</TableHead>
          <TableHead>Code postal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((garderie) => (
          <TableRow key={garderie.id}>
            <TableCell className="font-medium">{garderie.nom}</TableCell>
            <TableCell>{garderie.type ?? "—"}</TableCell>
            <TableCell>{garderie.placesTotal ?? "—"}</TableCell>
            <TableCell>
              <span
                className={
                  garderie.placesDispo && garderie.placesDispo > 0
                    ? "font-semibold text-green-600 dark:text-green-400"
                    : ""
                }
              >
                {garderie.placesDispo ?? "—"}
              </span>
            </TableCell>
            <TableCell>{garderie.codePostal ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
