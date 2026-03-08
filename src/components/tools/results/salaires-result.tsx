"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Salaire {
  id: string;
  metier: string;
  region: string | null;
  salaireMedian: string | null;
  salaireMin: string | null;
  salaireMax: string | null;
  annee: number | null;
  updatedAt: Date;
}

function formatCurrency(value: string | null): string {
  if (!value) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  return num.toLocaleString("fr-CA", { style: "currency", currency: "CAD" });
}

export function SalairesResult({ data }: { data: Salaire[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Métier</TableHead>
          <TableHead>Région</TableHead>
          <TableHead>Salaire médian</TableHead>
          <TableHead>Min</TableHead>
          <TableHead>Max</TableHead>
          <TableHead>Année</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((salaire) => (
          <TableRow key={salaire.id}>
            <TableCell className="font-medium">{salaire.metier}</TableCell>
            <TableCell>{salaire.region ?? "—"}</TableCell>
            <TableCell>{formatCurrency(salaire.salaireMedian)}</TableCell>
            <TableCell>{formatCurrency(salaire.salaireMin)}</TableCell>
            <TableCell>{formatCurrency(salaire.salaireMax)}</TableCell>
            <TableCell>{salaire.annee ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
