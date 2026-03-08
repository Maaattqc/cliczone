"use server";

import { db } from "@/lib/db";
import { garderiesCpe } from "@/lib/db/schema";
import { ilike, eq, or } from "drizzle-orm";

export async function searchGarderies(query: string) {
  try {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return {
        success: false as const,
        error: "Veuillez entrer au moins 2 caractères pour effectuer une recherche.",
      };
    }

    // Detect if the query looks like a postal code (e.g. G6V 1A1)
    const postalCodePattern = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
    const isPostalCode = postalCodePattern.test(trimmed);

    let results;

    if (isPostalCode) {
      const normalizedPostal = trimmed.toUpperCase().replace(/\s/g, " ");
      results = await db
        .select()
        .from(garderiesCpe)
        .where(
          or(
            eq(garderiesCpe.codePostal, normalizedPostal),
            eq(garderiesCpe.codePostal, trimmed.toUpperCase().replace(/\s/g, ""))
          )
        )
        .limit(10);
    } else {
      results = await db
        .select()
        .from(garderiesCpe)
        .where(ilike(garderiesCpe.ville, `%${trimmed}%`))
        .limit(10);
    }

    return { success: true as const, data: results };
  } catch (error) {
    console.error("Erreur lors de la recherche de garderies:", error);
    return {
      success: false as const,
      error: "Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.",
    };
  }
}
