"use server";

import { db } from "@/lib/db";
import { entrepreneursRbq } from "@/lib/db/schema";
import { ilike, eq, or, and } from "drizzle-orm";

export async function searchEntrepreneur(query: string, ville?: string) {
  try {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return {
        success: false as const,
        error: "Veuillez entrer au moins 2 caractères pour effectuer une recherche.",
      };
    }

    const nameOrLicence = or(
      ilike(entrepreneursRbq.nom, `%${trimmed}%`),
      eq(entrepreneursRbq.licence, trimmed)
    );

    let results;

    if (ville) {
      // First try with city filter
      results = await db
        .select()
        .from(entrepreneursRbq)
        .where(and(nameOrLicence, ilike(entrepreneursRbq.region, `%${ville}%`)))
        .limit(10);

      // If no results with city filter, fall back to unfiltered
      if (results.length === 0) {
        results = await db
          .select()
          .from(entrepreneursRbq)
          .where(nameOrLicence)
          .limit(10);
      }
    } else {
      results = await db
        .select()
        .from(entrepreneursRbq)
        .where(nameOrLicence)
        .limit(10);
    }

    return { success: true as const, data: results };
  } catch (error) {
    console.error("Erreur lors de la recherche d'entrepreneur:", error);
    return {
      success: false as const,
      error: "Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.",
    };
  }
}
