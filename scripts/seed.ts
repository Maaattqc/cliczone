/**
 * Seed script — Inserts realistic sample data into Supabase via REST API.
 * Run: npx tsx scripts/seed.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cxkaxfpvojgymiuqunkw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabaseInsert(table: string, rows: Record<string, unknown>[]) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to insert into ${table}: ${res.status} ${text}`);
  }
  console.log(`  ✓ ${table}: ${rows.length} rows inserted`);
}

// ============================================
// Data
// ============================================

const villes = [
  "Montréal", "Québec", "Laval", "Gatineau", "Longueuil",
  "Sherbrooke", "Lévis", "Trois-Rivières", "Saguenay", "Terrebonne",
  "Saint-Jean-sur-Richelieu", "Drummondville", "Granby", "Saint-Hyacinthe",
  "Saint-Jérôme", "Rimouski", "Victoriaville", "Saint-Georges",
  "Thetford Mines", "Rivière-du-Loup",
];

const regions: Record<string, string> = {
  "Montréal": "Montréal",
  "Québec": "Capitale-Nationale",
  "Laval": "Laval",
  "Gatineau": "Outaouais",
  "Longueuil": "Montérégie",
  "Sherbrooke": "Estrie",
  "Lévis": "Chaudière-Appalaches",
  "Trois-Rivières": "Mauricie",
  "Saguenay": "Saguenay–Lac-Saint-Jean",
  "Terrebonne": "Lanaudière",
  "Saint-Jean-sur-Richelieu": "Montérégie",
  "Drummondville": "Centre-du-Québec",
  "Granby": "Estrie",
  "Saint-Hyacinthe": "Montérégie",
  "Saint-Jérôme": "Laurentides",
  "Rimouski": "Bas-Saint-Laurent",
  "Victoriaville": "Centre-du-Québec",
  "Saint-Georges": "Chaudière-Appalaches",
  "Thetford Mines": "Chaudière-Appalaches",
  "Rivière-du-Loup": "Bas-Saint-Laurent",
};

const rues = [
  "rue Principale", "boulevard Laurier", "avenue du Parc", "rue Saint-Jean",
  "rue des Érables", "boulevard René-Lévesque", "rue de la Montagne",
  "avenue Cartier", "rue Notre-Dame", "boulevard Charest",
  "rue King", "avenue Maguire", "rue Wellington", "boulevard de l'Université",
  "rue Saint-Joseph", "avenue Royale", "rue du Pont", "boulevard Hamel",
  "rue Racine", "avenue Bégin",
];

const prenoms = [
  "Jean-Pierre", "Michel", "André", "Pierre", "Robert", "Stéphane",
  "Martin", "Luc", "François", "Daniel", "Marc", "Yves", "Serge",
  "Mario", "Alain", "Jacques", "Louis", "Bernard", "Patrick", "Denis",
];

const noms = [
  "Tremblay", "Gagnon", "Roy", "Côté", "Bouchard", "Gauthier",
  "Morin", "Lavoie", "Fortin", "Gagné", "Ouellet", "Pelletier",
  "Bélanger", "Lévesque", "Bergeron", "Leblanc", "Paquette",
  "Girard", "Simard", "Boucher",
];

const specialites = [
  "Entrepreneur général",
  "Électricité",
  "Plomberie",
  "Chauffage",
  "Ventilation et climatisation",
  "Isolation",
  "Revêtement extérieur",
  "Toiture",
  "Excavation et terrassement",
  "Béton",
  "Maçonnerie",
  "Charpenterie et menuiserie",
  "Peinture",
  "Systèmes d'alarme",
  "Ascenseurs",
];

const metiers = [
  { metier: "Plombier", min: 45000, median: 62000, max: 85000 },
  { metier: "Électricien", min: 44000, median: 60000, max: 82000 },
  { metier: "Infirmière", min: 49000, median: 68000, max: 92000 },
  { metier: "Infirmier auxiliaire", min: 38000, median: 48000, max: 58000 },
  { metier: "Développeur logiciel", min: 55000, median: 78000, max: 120000 },
  { metier: "Comptable", min: 45000, median: 65000, max: 95000 },
  { metier: "Enseignant au primaire", min: 46000, median: 62000, max: 88000 },
  { metier: "Enseignant au secondaire", min: 46000, median: 65000, max: 92000 },
  { metier: "Mécanicien automobile", min: 35000, median: 48000, max: 68000 },
  { metier: "Soudeur", min: 40000, median: 55000, max: 75000 },
  { metier: "Charpentier-menuisier", min: 38000, median: 52000, max: 72000 },
  { metier: "Technicien en génie civil", min: 42000, median: 58000, max: 78000 },
  { metier: "Ingénieur civil", min: 60000, median: 82000, max: 115000 },
  { metier: "Ingénieur mécanique", min: 58000, median: 80000, max: 110000 },
  { metier: "Architecte", min: 50000, median: 72000, max: 105000 },
  { metier: "Avocat", min: 55000, median: 85000, max: 150000 },
  { metier: "Notaire", min: 50000, median: 75000, max: 120000 },
  { metier: "Pharmacien", min: 70000, median: 95000, max: 125000 },
  { metier: "Dentiste", min: 80000, median: 130000, max: 200000 },
  { metier: "Médecin de famille", min: 200000, median: 280000, max: 380000 },
  { metier: "Technicien informatique", min: 38000, median: 52000, max: 70000 },
  { metier: "Analyste financier", min: 50000, median: 70000, max: 100000 },
  { metier: "Gestionnaire de projet", min: 55000, median: 78000, max: 110000 },
  { metier: "Travailleur social", min: 42000, median: 58000, max: 78000 },
  { metier: "Éducateur spécialisé", min: 38000, median: 50000, max: 65000 },
  { metier: "Cuisinier", min: 30000, median: 38000, max: 52000 },
  { metier: "Boucher", min: 32000, median: 42000, max: 55000 },
  { metier: "Camionneur", min: 40000, median: 55000, max: 75000 },
  { metier: "Agent immobilier", min: 30000, median: 55000, max: 120000 },
  { metier: "Technicien en éducation spécialisée", min: 36000, median: 48000, max: 60000 },
  { metier: "Préposé aux bénéficiaires", min: 33000, median: 42000, max: 52000 },
  { metier: "Arpenteur-géomètre", min: 55000, median: 75000, max: 100000 },
  { metier: "Opérateur de machinerie lourde", min: 42000, median: 58000, max: 80000 },
  { metier: "Designer graphique", min: 35000, median: 50000, max: 72000 },
  { metier: "Technicien en administration", min: 35000, median: 45000, max: 58000 },
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genLicence(): string {
  return `${randInt(1000, 9999)}-${randInt(1000, 9999)}-${randInt(10, 99)}`;
}

function genPostalCode(ville: string): string {
  const prefixes: Record<string, string[]> = {
    "Montréal": ["H1A", "H2B", "H3C", "H4E", "H1K", "H2L", "H3N", "H4P"],
    "Québec": ["G1A", "G1K", "G1R", "G2E", "G1V", "G1X", "G2G", "G2J"],
    "Laval": ["H7A", "H7G", "H7L", "H7N", "H7P", "H7R", "H7S", "H7T"],
    "Gatineau": ["J8P", "J8T", "J8V", "J8X", "J8Y", "J8Z", "J9A", "J9H"],
    "Longueuil": ["J4G", "J4H", "J4J", "J4K", "J4L", "J4N", "J4R", "J4T"],
    "Sherbrooke": ["J1E", "J1G", "J1H", "J1J", "J1K", "J1L", "J1N", "J1R"],
    "Lévis": ["G6V", "G6W", "G6X", "G6Y", "G6Z", "G7A"],
    "Trois-Rivières": ["G8T", "G8V", "G8W", "G8Y", "G8Z", "G9A"],
    "Saguenay": ["G7G", "G7H", "G7J", "G7K", "G7S", "G7T"],
    "Terrebonne": ["J6V", "J6W", "J6X", "J6Y", "J7M"],
  };
  const prefix = prefixes[ville] ? rand(prefixes[ville]) : `${rand(["G", "H", "J"])}${randInt(1, 9)}${rand("ABCEGHJKLMNPRSTVWXYZ".split(""))}`;
  return `${prefix} ${randInt(1, 9)}${rand("ABCEGHJKLMNPRSTVWXYZ".split(""))}${randInt(1, 9)}`;
}

// ============================================
// Generators
// ============================================

function generateEntrepreneurs(): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  for (const ville of villes) {
    const count = ville === "Montréal" ? 15 : ville === "Québec" ? 10 : randInt(3, 8);
    for (let i = 0; i < count; i++) {
      const prenom = rand(prenoms);
      const nom = rand(noms);
      const statut = Math.random() > 0.15 ? "Active" : rand(["Suspendue", "Annulée", "Expirée"]);
      const nbSpec = randInt(1, 4);
      const specs: string[] = [];
      for (let j = 0; j < nbSpec; j++) {
        const s = rand(specialites);
        if (!specs.includes(s)) specs.push(s);
      }
      rows.push({
        nom: `${prenom} ${nom} Construction`,
        licence: genLicence(),
        statut,
        specialites: specs,
        region: regions[ville],
        adresse: `${randInt(1, 999)} ${rand(rues)}, ${ville}, QC`,
      });
    }
  }
  return rows;
}

function generateZonesInondables(): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const villesInondables = [
    "Montréal", "Québec", "Laval", "Gatineau", "Longueuil",
    "Sherbrooke", "Lévis", "Trois-Rivières", "Saguenay",
    "Saint-Jean-sur-Richelieu", "Drummondville", "Rimouski",
    "Rivière-du-Loup",
  ];
  for (const ville of villesInondables) {
    const count = ville === "Montréal" ? 8 : ville === "Gatineau" ? 6 : randInt(2, 5);
    for (let i = 0; i < count; i++) {
      rows.push({
        niveau: Math.random() > 0.4 ? "0-100" : "0-20",
        source: "Ministère de l'Environnement du Québec (MELCCFP)",
        ville,
      });
    }
  }
  return rows;
}

function generateTerrainsContamines(): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const types = [
    "Ancien poste d'essence",
    "Ancien site industriel",
    "Ancien dépôt de matériaux",
    "Ancien terrain ferroviaire",
    "Ancien garage automobile",
    "Ancien nettoyeur à sec",
    "Ancien entrepôt chimique",
    "Ancien atelier de peinture",
  ];
  const contaminants = [
    "Hydrocarbures pétroliers",
    "Métaux lourds",
    "Solvants chlorés",
    "BPC",
    "HAP",
    "Composés organiques volatils",
  ];

  for (const ville of villes) {
    const count = ville === "Montréal" ? 12 : ville === "Québec" ? 6 : randInt(1, 5);
    for (let i = 0; i < count; i++) {
      const statut = rand(["Contaminé", "Contaminé", "En traitement", "Décontaminé"]);
      rows.push({
        adresse: `${randInt(1, 9999)} ${rand(rues)}, ${ville}, QC`,
        statut,
        details: {
          type: rand(types),
          contaminants: [rand(contaminants), rand(contaminants)].filter((v, i, a) => a.indexOf(v) === i),
          année_identification: randInt(1990, 2024),
          superficie_m2: randInt(200, 15000),
        },
        ville,
      });
    }
  }
  return rows;
}

function generateGarderies(): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const nomsGarderies = [
    "Les Petits Trésors", "Au Jardin Enchanté", "Les Coccinelles",
    "Le Petit Prince", "Les Tournesols", "Arc-en-Ciel", "Les Lutins",
    "La Ribambelle", "Les Étoiles Filantes", "Le Nid Douillet",
    "Les Papillons", "La Maison des Enfants", "Les Petits Pas",
    "Soleil Levant", "Les Bout'choux", "La Fée des Bois",
    "Les Petits Explorateurs", "Mon Petit Monde", "Les Coquins",
    "Le Carrousel",
  ];
  const types = ["CPE", "Garderie privée subventionnée", "Garderie privée non subventionnée"];

  for (const ville of villes) {
    const count = ville === "Montréal" ? 12 : ville === "Québec" ? 8 : randInt(3, 6);
    for (let i = 0; i < count; i++) {
      const nom = `${rand(nomsGarderies)} de ${ville.split("-")[0]}`;
      const type = rand(types);
      const placesTotal = type === "CPE" ? randInt(60, 120) : randInt(30, 80);
      const placesDispo = Math.random() > 0.7 ? randInt(0, 8) : 0;
      rows.push({
        nom,
        adresse: `${randInt(1, 999)} ${rand(rues)}, ${ville}, QC`,
        type,
        places_total: placesTotal,
        places_dispo: placesDispo,
        code_postal: genPostalCode(ville),
        ville,
      });
    }
  }
  return rows;
}

function generateSalaires(): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const regionsUniques = [...new Set(Object.values(regions))];

  for (const m of metiers) {
    for (const region of regionsUniques) {
      // Ajuster les salaires par région (Montréal +10%, régions éloignées -5%)
      const factor = region === "Montréal" ? 1.10
        : region === "Capitale-Nationale" ? 1.05
        : region === "Bas-Saint-Laurent" || region === "Saguenay–Lac-Saint-Jean" ? 0.95
        : 1.0;

      rows.push({
        metier: m.metier,
        region,
        salaire_median: Math.round(m.median * factor),
        salaire_min: Math.round(m.min * factor),
        salaire_max: Math.round(m.max * factor),
        annee: 2025,
      });
    }
  }
  return rows;
}

// ============================================
// Main
// ============================================

async function main() {
  if (!SUPABASE_KEY) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local");
    process.exit(1);
  }

  console.log("🌱 Seed des données ClicZone...\n");

  // Créer les tables via SQL si elles n'existent pas
  console.log("📋 Création des tables...");
  const createSQL = `
    CREATE TABLE IF NOT EXISTS entrepreneurs_rbq (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      nom text NOT NULL,
      licence varchar(20) NOT NULL,
      statut varchar(50) NOT NULL,
      specialites jsonb DEFAULT '[]',
      region varchar(100),
      adresse text,
      updated_at timestamptz DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS zones_inondables (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      geom text,
      niveau varchar(20),
      source text,
      ville varchar(100),
      updated_at timestamptz DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS terrains_contamines (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      geom text,
      adresse text NOT NULL,
      statut varchar(50) NOT NULL,
      details jsonb,
      ville varchar(100),
      updated_at timestamptz DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS garderies_cpe (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      nom text NOT NULL,
      adresse text,
      geom text,
      type varchar(50),
      places_total integer,
      places_dispo integer,
      code_postal varchar(10),
      ville varchar(100),
      updated_at timestamptz DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS salaires (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      metier text NOT NULL,
      region varchar(100),
      salaire_median numeric,
      salaire_min numeric,
      salaire_max numeric,
      annee integer,
      updated_at timestamptz DEFAULT now() NOT NULL
    );
  `;

  const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  // Tables might already exist from migration, that's fine

  // Use Supabase SQL editor API to create tables
  const sqlEditorRes = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: createSQL }),
  });

  if (!sqlEditorRes.ok) {
    console.log("  ⚠ Impossible d'exécuter SQL directement, les tables doivent déjà exister.");
    console.log("  → Utilisation du SQL Editor Supabase si nécessaire.\n");
  } else {
    console.log("  ✓ Tables créées/vérifiées\n");
  }

  // Clear existing data
  console.log("🧹 Nettoyage des données existantes...");
  for (const table of ["entrepreneurs_rbq", "zones_inondables", "terrains_contamines", "garderies_cpe", "salaires"]) {
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=not.is.null`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
    });
    if (delRes.ok) {
      console.log(`  ✓ ${table} vidée`);
    } else {
      console.log(`  ⚠ ${table}: ${delRes.status} (table n'existe peut-être pas encore)`);
    }
  }

  console.log("\n📊 Insertion des données...");

  // Entrepreneurs
  const entrepreneurs = generateEntrepreneurs();
  await supabaseInsert("entrepreneurs_rbq", entrepreneurs);

  // Zones inondables
  const zones = generateZonesInondables();
  await supabaseInsert("zones_inondables", zones);

  // Terrains contaminés
  const terrains = generateTerrainsContamines();
  await supabaseInsert("terrains_contamines", terrains);

  // Garderies
  const garderies = generateGarderies();
  await supabaseInsert("garderies_cpe", garderies);

  // Salaires (plus de données, on batch par 100)
  const allSalaires = generateSalaires();
  for (let i = 0; i < allSalaires.length; i += 100) {
    const batch = allSalaires.slice(i, i + 100);
    await supabaseInsert("salaires", batch);
  }

  console.log(`\n✅ Seed terminé!`);
  console.log(`   → ${entrepreneurs.length} entrepreneurs`);
  console.log(`   → ${zones.length} zones inondables`);
  console.log(`   → ${terrains.length} terrains contaminés`);
  console.log(`   → ${garderies.length} garderies`);
  console.log(`   → ${allSalaires.length} entrées salaires (${metiers.length} métiers × ${[...new Set(Object.values(regions))].length} régions)`);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
