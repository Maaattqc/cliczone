"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Entrepreneur {
  id: string;
  nom: string;
  licence: string;
  statut: string;
  specialites: string[] | null;
  region: string | null;
  adresse: string | null;
  updatedAt: Date;
}

export function EntrepreneurResult({ data }: { data: Entrepreneur[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Licence</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Spécialités</TableHead>
          <TableHead>Région</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entrepreneur) => (
          <TableRow key={entrepreneur.id}>
            <TableCell className="font-medium">{entrepreneur.nom}</TableCell>
            <TableCell>{entrepreneur.licence}</TableCell>
            <TableCell>
              <Badge
                variant={
                  entrepreneur.statut.toLowerCase() === "active"
                    ? "default"
                    : "destructive"
                }
              >
                {entrepreneur.statut}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {entrepreneur.specialites?.map((spec, i) => (
                  <Badge key={i} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{entrepreneur.region ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
