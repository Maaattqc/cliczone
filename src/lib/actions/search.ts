"use server";

import { db } from "@/lib/db";
import {
  entrepreneursRbq,
  garderiesCpe,
  salaires,
  terrainsContamines,
  zonesInondables,
} from "@/lib/db/schema";
import { ilike } from "drizzle-orm";

export interface SearchResult {
  category: string;
  toolSlug: string;
  label: string;
  sublabel: string;
}

export async function globalSearch(query: string) {
  try {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return {
        success: false as const,
        error: "Veuillez entrer au moins 2 caractères pour effectuer une recherche.",
      };
    }

    const pattern = `%${trimmed}%`;

    const [entrepreneurs, garderies, salairesRes, terrains, zones] =
      await Promise.all([
        db
          .select({ id: entrepreneursRbq.id, nom: entrepreneursRbq.nom, licence: entrepreneursRbq.licence })
          .from(entrepreneursRbq)
          .where(ilike(entrepreneursRbq.nom, pattern))
          .limit(3),
        db
          .select({ id: garderiesCpe.id, nom: garderiesCpe.nom, ville: garderiesCpe.ville })
          .from(garderiesCpe)
          .where(ilike(garderiesCpe.nom, pattern))
          .limit(3),
        db
          .select({ id: salaires.id, metier: salaires.metier, region: salaires.region })
          .from(salaires)
          .where(ilike(salaires.metier, pattern))
          .limit(3),
        db
          .select({ id: terrainsContamines.id, adresse: terrainsContamines.adresse, ville: terrainsContamines.ville })
          .from(terrainsContamines)
          .where(ilike(terrainsContamines.adresse, pattern))
          .limit(3),
        db
          .select({ id: zonesInondables.id, ville: zonesInondables.ville, niveau: zonesInondables.niveau })
          .from(zonesInondables)
          .where(ilike(zonesInondables.ville, pattern))
          .limit(3),
      ]);

    const results: SearchResult[] = [];

    for (const e of entrepreneurs) {
      results.push({
        category: "Entrepreneurs RBQ",
        toolSlug: "verifier-entrepreneur",
        label: e.nom,
        sublabel: `Licence : ${e.licence}`,
      });
    }

    for (const g of garderies) {
      results.push({
        category: "Garderies et CPE",
        toolSlug: "garderies",
        label: g.nom,
        sublabel: g.ville ?? "",
      });
    }

    for (const s of salairesRes) {
      results.push({
        category: "Salaires",
        toolSlug: "salaires",
        label: s.metier,
        sublabel: s.region ?? "",
      });
    }

    for (const t of terrains) {
      results.push({
        category: "Terrains contaminés",
        toolSlug: "terrain-contamine",
        label: t.adresse,
        sublabel: t.ville ?? "",
      });
    }

    for (const z of zones) {
      results.push({
        category: "Zones inondables",
        toolSlug: "zone-inondable",
        label: z.ville ?? "Zone sans ville",
        sublabel: `Niveau : ${z.niveau}`,
      });
    }

    return { success: true as const, data: results };
  } catch (error) {
    console.error("Erreur lors de la recherche globale:", error);
    return {
      success: false as const,
      error: "Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.",
    };
  }
}
