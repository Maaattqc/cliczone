/** Prix par outil (en cents CAD) — importable côté client et serveur */
export const TOOL_PRICES: Record<string, { amount: number; label: string }> = {
  "verifier-entrepreneur": { amount: 1999, label: "Rapport ContractorCheck" },
  "zone-inondable": { amount: 1499, label: "Rapport FloodCheck" },
  "terrain-contamine": { amount: 1499, label: "Rapport TerraCheck" },
  garderies: { amount: 1000, label: "Alertes GarderieFind (mensuel)" },
  salaires: { amount: 999, label: "Rapport SalaireLab" },
};
