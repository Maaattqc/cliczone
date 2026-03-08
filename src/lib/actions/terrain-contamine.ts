"use server";

import { db } from "@/lib/db";
import { terrainsContamines } from "@/lib/db/schema";
import { ilike, or } from "drizzle-orm";

export async function searchTerrainContamine(query: string) {
  try {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return {
        success: false as const,
        error: "Veuillez entrer au moins 2 caractères pour effectuer une recherche.",
      };
    }

    const results = await db
      .select()
      .from(terrainsContamines)
      .where(
        or(
          ilike(terrainsContamines.adresse, `%${trimmed}%`),
          ilike(terrainsContamines.ville, `%${trimmed}%`)
        )
      )
      .limit(10);

    return { success: true as const, data: results };
  } catch (error) {
    console.error("Erreur lors de la recherche de terrain contaminé:", error);
    return {
      success: false as const,
      error: "Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.",
    };
  }
}
