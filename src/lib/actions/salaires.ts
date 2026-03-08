"use server";

import { db } from "@/lib/db";
import { salaires } from "@/lib/db/schema";
import { ilike } from "drizzle-orm";

export async function searchSalaires(query: string) {
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
      .from(salaires)
      .where(ilike(salaires.metier, `%${trimmed}%`))
      .limit(10);

    return { success: true as const, data: results };
  } catch (error) {
    console.error("Erreur lors de la recherche de salaires:", error);
    return {
      success: false as const,
      error: "Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.",
    };
  }
}
