# Architecture du projet — Plateforme donnees Quebec

## Vue d'ensemble

1 plateforme, 100 micro-outils, infrastructure partagee.

```
┌─────────────────────────────────────────────────┐
│                   VERCEL                         │
│                                                 │
│  Next.js App Router                             │
│  ├── /verifier-entrepreneur   (ContractorCheck) │
│  ├── /zone-inondable          (FloodCheck)      │
│  ├── /terrain-contamine       (TerraCheck)      │
│  ├── /garderies               (GarderieFind)    │
│  ├── /salaires                (SalaireLab)      │
│  ├── /score-logement          (LouerSmart)      │
│  ├── /zonage                  (ZonageExpress)   │
│  ├── /permis-construction     (AlertePermis)    │
│  ├── ... (100 outils)                           │
│  ├── /blog/                   (Articles SEO)    │
│  ├── /pro/                    (APIs B2B)        │
│  └── /api/                    (Stripe, auth)    │
│                                                 │
│  Clerk (auth)  │  Sentry (erreurs)              │
│  Axiom (logs)  │  PostHog (analytics)           │
│  Arcjet (rate limit)                            │
└──────────────┬──────────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌────────────┐    ┌──────────────┐
│  SUPABASE  │    │   SERVICES   │
│            │    │              │
│ PostgreSQL │    │ Stripe       │
│ + PostGIS  │    │ Resend       │
│ + Storage  │    │ Upstash Redis│
│            │    │ Inngest      │
└────────────┘    └──────────────┘
```

---

## Structure de fichiers Next.js

```
app/
├── layout.tsx                          # Layout global (nav, footer)
├── page.tsx                            # Homepage (catalogue des 100 outils)
├── verifier-entrepreneur/
│   ├── page.tsx                        # Outil principal
│   └── [ville]/page.tsx               # Pages par ville (SSG)
├── zone-inondable/
│   ├── page.tsx
│   └── [ville]/page.tsx
├── terrain-contamine/
│   ├── page.tsx
│   └── [ville]/page.tsx
├── garderies/
│   ├── page.tsx
│   └── [ville]/page.tsx
├── ... (100 outils, meme pattern)
├── blog/
│   └── [slug]/page.tsx                # Articles SEO (MDX)
├── pro/
│   ├── page.tsx                       # Dashboard Pro
│   └── api-docs/page.tsx             # Documentation APIs B2B
├── api/
│   ├── stripe/
│   │   ├── checkout/route.ts          # Creer une session Stripe
│   │   └── webhook/route.ts           # Webhooks Stripe
│   ├── auth/
│   │   └── webhook/route.ts           # Webhooks Clerk
│   ├── reports/
│   │   └── [tool]/route.ts            # Generation de rapport par outil
│   └── data/
│       └── [dataset]/route.ts         # API publique par dataset
├── sitemap.ts                          # Sitemap dynamique (2000+ pages)
└── robots.ts                           # robots.txt

lib/
├── db/
│   ├── schema.ts                      # Drizzle schema (toutes les tables)
│   ├── index.ts                       # Connection pool
│   └── queries/                       # Queries reutilisables
│       ├── flood.ts                   # ST_Contains pour zones inondables
│       ├── terrain.ts                 # Terrains contamines
│       └── ...
├── stripe/
│   ├── client.ts                      # Stripe instance
│   ├── checkout.ts                    # Session Checkout
│   └── billing.ts                     # Abonnements
├── data-engine/
│   ├── fetcher.ts                     # Fetch donnees donneesquebec.ca
│   ├── parsers/                       # CSV, GeoJSON, XLSX parsers
│   └── normalizer.ts                 # Normalisation des donnees
├── pdf/
│   ├── templates/                     # Templates PDF par outil
│   └── generator.ts                  # Generation PDF
├── seo/
│   ├── metadata.ts                   # Generateur meta tags par page
│   └── structured-data.ts           # JSON-LD
└── utils.ts                          # Utilitaires communs

components/
├── ui/                                # shadcn/ui (button, card, input...)
├── tools/
│   ├── tool-input.tsx                 # Input generique (adresse, nom, secteur)
│   ├── tool-result-free.tsx           # Resultat gratuit
│   ├── tool-result-paid.tsx           # Resultat payant (apres achat)
│   └── tool-cta.tsx                   # "Obtenir le rapport complet — 19.99$"
├── maps/
│   ├── leaflet-map.tsx               # Carte Leaflet reutilisable
│   └── map-markers.tsx               # Markers par type
├── layout/
│   ├── navbar.tsx                     # Navigation
│   ├── footer.tsx                     # Footer
│   └── tool-layout.tsx               # Layout commun a tous les outils
└── pdf/
    └── report-template.tsx           # Template React pour PDF
```

---

## Database schema (Drizzle)

### Tables donnees Quebec (refresh nightly via Inngest)

```sql
zones_inondables    (id, geom GEOMETRY, niveau, source, updated_at)
terrains_contamines (id, geom GEOMETRY, adresse, statut, details JSONB, updated_at)
permis_construction (id, adresse, geom, type, date, cout_estime, ville, updated_at)
evaluations_fonc    (id, adresse, geom, valeur, annee, type_batiment, updated_at)
zonage              (id, geom GEOMETRY, code_zone, usages_permis JSONB, ville, updated_at)
entrepreneurs_rbq   (id, nom, licence, statut, specialites, region, updated_at)
inspections_mapaq   (id, etablissement, date, infractions JSONB, score, updated_at)
garderies_cpe       (id, nom, adresse, geom, type, places_total, places_dispo, updated_at)
actes_criminels     (id, geom GEOMETRY, type, date, quartier, updated_at)
salaires            (id, metier, region, salaire_median, salaire_min, salaire_max, annee)
```

### Tables business

```sql
users               (id, clerk_id, email, stripe_customer_id, plan, created_at)
reports             (id, user_id, tool, input JSONB, output JSONB, paid, amount, created_at)
subscriptions       (id, user_id, tool, stripe_sub_id, status, current_period_end)
alerts              (id, user_id, tool, criteria JSONB, active, created_at)
api_keys            (id, user_id, key_hash, name, rate_limit, created_at)
api_usage           (id, api_key_id, endpoint, timestamp)
```

---

## Infrastructure commune (build une fois)

| Composant | Description | Tech |
|---|---|---|
| Auth + accounts | Login, gestion users | Clerk |
| Paiements | Pay-per-use, abos, Pro | Stripe Checkout + Billing + Tax |
| Data Engine | Fetch/normalise donnees Quebec | Inngest cron + parsers CSV/GeoJSON |
| Carte | Visualisation geographique | Leaflet (→ Mapbox quand revenue > 3K$) |
| Rapport PDF | Generation de rapports telechargeables | @react-pdf/renderer |
| SEO dynamique | Pages par ville/secteur, meta tags, sitemap | Next.js SSG/ISR |
| Dashboard admin | Ventes, analytics, monitoring | PostHog + custom |
| Rate limiting | Protection scraping | Arcjet |
| Cache | Requetes frequentes | Upstash Redis |
| Email | Rapports, alertes, confirmations | Resend |
| Logs | Debug, audit trail | Axiom |
| Erreurs | Crash monitoring | Sentry |

---

## Data Engine : comment les donnees circulent

```
donneesquebec.ca (CSV, GeoJSON, XLSX, API)
         │
         ▼ (Inngest cron — nightly)
    ┌─────────────┐
    │  Fetcher     │  Download les fichiers
    │  Parser      │  CSV → JSON, GeoJSON → PostGIS
    │  Normalizer  │  Uniformiser les schemas
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  PostgreSQL  │  Upsert dans les tables
    │  + PostGIS   │  Index geographiques
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
  API Route    SSG/ISR
  (live)       (build time)
    │             │
    ▼             ▼
  Resultat     Page SEO
  dynamique    (pre-rendue)
```

### Etapes du fetch nightly

1. **Check** : le dataset a-t-il change? (ETag / Last-Modified)
2. **Download** : telecharger le fichier (CSV, GeoJSON, XLSX)
3. **Parse** : convertir en JSON structure
4. **Validate** : verifier les champs requis, types
5. **Upsert** : inserer ou mettre a jour dans PostgreSQL
6. **Log** : enregistrer le resultat (success/fail, nb rows, duration)
7. **Alert** : si un dataset fail 3x de suite → alerte email

---

## Plan d'action chronologique

| Phase | Quoi | Duree |
|---|---|---|
| **1. Infrastructure** | Auth (Clerk), Stripe, DB schema, Data Engine, template outil | 1 semaine |
| **2. Top 5 outils** | ContractorCheck, FloodCheck, TerraCheck, GarderieFind, SalaireLab | 1 semaine |
| **3. SEO de base** | Blog posts, pages par ville, Google Search Console, sitemap | En continu |
| **4. Scale outils** | Ajouter 3-5 outils par semaine | En continu |
| **5. Optimiser** | Les outils qui vendent → ameliorer, ajouter features | En continu |
| **6. Abandonner** | Les outils qui vendent pas → laisser tel quel (coutent rien) | — |
| **7. Pub** | Quand 1 outil decolle → Google Ads dessus | Quand revenue > 0 |

---

## Environments

| Env | URL | DB | Usage |
|---|---|---|---|
| Local | localhost:3000 | Supabase (dev project) | Dev |
| Preview | [auto].vercel.app | Supabase (dev project) | PR previews |
| Production | [domaine].ca | Supabase (prod project) | Live |

---

## Monitoring et alertes

| Outil | Ce qu'il monitore | Alerte |
|---|---|---|
| Sentry | Crashes frontend + backend | Email + Slack instant |
| Axiom | Logs structures (API, cron, errors) | Recherche manuelle |
| PostHog | Analytics, funnels, conversions | Dashboard |
| UptimeRobot | Site up/down | Email si down > 1 min |
| Inngest | Jobs background (fetch data, PDF) | Dashboard + retry auto |
| Stripe | Paiements fails, disputes | Email automatique |
