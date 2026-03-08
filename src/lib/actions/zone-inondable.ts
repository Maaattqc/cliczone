"use server";

import { db } from "@/lib/db";
import { zonesInondables } from "@/lib/db/schema";
import { ilike } from "drizzle-orm";

export async function searchZoneInondable(query: string) {
  try {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return {
        success: false as const,
        error: "Veuillez entrer au moins 2 caractères pour effectuer une recherche.",
      };
    }

    // Extract potential city name from address
    // Try the last part after a comma, or the full string
    const parts = trimmed.split(",").map((p) => p.trim());
    const cityCandidate = parts.length > 1 ? parts[parts.length - 1] : trimmed;

    const results = await db
      .select()
      .from(zonesInondables)
      .where(ilike(zonesInondables.ville, `%${cityCandidate}%`))
      .limit(10);

    return { success: true as const, data: results };
  } catch (error) {
    console.error("Erreur lors de la recherche de zone inondable:", error);
    return {
      success: false as const,
      error: "Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.",
    };
  }
}
