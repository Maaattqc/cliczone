import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// ============================================
// Donnees Quebec (refresh nightly via Inngest)
// ============================================

export const entrepreneursRbq = pgTable(
  "entrepreneurs_rbq",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nom: text("nom").notNull(),
    licence: varchar("licence", { length: 20 }).notNull(),
    statut: varchar("statut", { length: 50 }).notNull(),
    specialites: jsonb("specialites").$type<string[]>().default([]),
    region: varchar("region", { length: 100 }),
    adresse: text("adresse"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_entrepreneurs_licence").on(table.licence),
    index("idx_entrepreneurs_nom").on(table.nom),
    index("idx_entrepreneurs_region").on(table.region),
  ]
);

export const zonesInondables = pgTable(
  "zones_inondables",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // geom stocke en text (WKT) — PostGIS queries via sql`` raw
    geom: text("geom"),
    niveau: varchar("niveau", { length: 20 }), // "0-20" | "0-100"
    source: text("source"),
    ville: varchar("ville", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_zones_ville").on(table.ville)]
);

export const terrainsContamines = pgTable(
  "terrains_contamines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    geom: text("geom"),
    adresse: text("adresse").notNull(),
    statut: varchar("statut", { length: 50 }).notNull(),
    details: jsonb("details").$type<Record<string, unknown>>(),
    ville: varchar("ville", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_terrains_ville").on(table.ville),
    index("idx_terrains_adresse").on(table.adresse),
  ]
);

export const permisConstruction = pgTable(
  "permis_construction",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adresse: text("adresse").notNull(),
    geom: text("geom"),
    type: varchar("type", { length: 100 }),
    date: timestamp("date"),
    coutEstime: numeric("cout_estime"),
    ville: varchar("ville", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_permis_ville").on(table.ville),
    index("idx_permis_date").on(table.date),
  ]
);

export const evaluationsFoncieres = pgTable(
  "evaluations_foncieres",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adresse: text("adresse").notNull(),
    geom: text("geom"),
    valeur: numeric("valeur"),
    annee: integer("annee"),
    typeBatiment: varchar("type_batiment", { length: 100 }),
    ville: varchar("ville", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_eval_ville").on(table.ville),
    index("idx_eval_adresse").on(table.adresse),
  ]
);

export const zonage = pgTable(
  "zonage",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    geom: text("geom"),
    codeZone: varchar("code_zone", { length: 50 }),
    usagesPermis: jsonb("usages_permis").$type<string[]>().default([]),
    ville: varchar("ville", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_zonage_ville").on(table.ville)]
);

export const inspectionsMapaq = pgTable(
  "inspections_mapaq",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    etablissement: text("etablissement").notNull(),
    adresse: text("adresse"),
    date: timestamp("date"),
    infractions: jsonb("infractions").$type<Record<string, unknown>[]>().default([]),
    score: integer("score"),
    ville: varchar("ville", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_mapaq_ville").on(table.ville),
    index("idx_mapaq_etablissement").on(table.etablissement),
  ]
);

export const garderiesCpe = pgTable(
  "garderies_cpe",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nom: text("nom").notNull(),
    adresse: text("adresse"),
    geom: text("geom"),
    type: varchar("type", { length: 50 }), // "CPE" | "garderie_privee" | "garderie_subventionnee"
    placesTotal: integer("places_total"),
    placesDispo: integer("places_dispo"),
    codePostal: varchar("code_postal", { length: 10 }),
    ville: varchar("ville", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_garderies_ville").on(table.ville),
    index("idx_garderies_code_postal").on(table.codePostal),
  ]
);

export const salaires = pgTable(
  "salaires",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    metier: text("metier").notNull(),
    region: varchar("region", { length: 100 }),
    salaireMedian: numeric("salaire_median"),
    salaireMin: numeric("salaire_min"),
    salaireMax: numeric("salaire_max"),
    annee: integer("annee"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_salaires_metier").on(table.metier),
    index("idx_salaires_region").on(table.region),
  ]
);

// ============================================
// Tables business
// ============================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: varchar("clerk_id", { length: 100 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
    plan: varchar("plan", { length: 20 }).default("free").notNull(), // "free" | "pro"
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_users_clerk").on(table.clerkId)]
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    tool: varchar("tool", { length: 100 }).notNull(),
    input: jsonb("input").$type<Record<string, unknown>>().notNull(),
    output: jsonb("output").$type<Record<string, unknown>>(),
    paid: boolean("paid").default(false).notNull(),
    amount: numeric("amount"),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_reports_user").on(table.userId),
    index("idx_reports_tool").on(table.tool),
  ]
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    tool: varchar("tool", { length: 100 }).notNull(),
    stripeSubId: varchar("stripe_sub_id", { length: 100 }),
    status: varchar("status", { length: 30 }).notNull(), // "active" | "canceled" | "past_due"
    currentPeriodEnd: timestamp("current_period_end"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_subs_user").on(table.userId)]
);

export const alerts = pgTable(
  "alerts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    tool: varchar("tool", { length: 100 }).notNull(),
    criteria: jsonb("criteria").$type<Record<string, unknown>>().notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_alerts_user").on(table.userId)]
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    keyHash: varchar("key_hash", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 100 }),
    rateLimit: integer("rate_limit").default(100).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_apikeys_hash").on(table.keyHash)]
);

export const apiUsage = pgTable(
  "api_usage",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    apiKeyId: uuid("api_key_id")
      .references(() => apiKeys.id)
      .notNull(),
    endpoint: varchar("endpoint", { length: 200 }).notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => [index("idx_usage_key").on(table.apiKeyId)]
);
