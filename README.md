# ClicZone

[🇬🇧 Read in English](README.en.md) · [📁 GitHub](https://github.com/Maaattqc/cliczone)

> 🌐 **[Voir la démo live](https://cliczone.ca)** — cliczone.ca

> Plateforme SaaS de micro-outils basés sur les données ouvertes du Québec — vérification d'entrepreneurs, zones inondables, terrains contaminés, garderies, salaires, et plus.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat&logo=stripe&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=flat&logo=dotnet&logoColor=white)

## Pourquoi ce projet

Les données publiques du Québec (RBQ, MELCCFP, ministères) sont éparpillées et difficiles d'accès. ClicZone regroupe ces données en micro-outils simples : vérifier un entrepreneur, savoir si un terrain est contaminé, trouver une garderie, comparer des salaires — le tout sur une seule plateforme monétisée via freemium + Stripe.

## Stack complète

### 🎨 Frontend
| Tech | Usage |
|------|-------|
| Next.js 16 (App Router) | SSR/SSG, routing, API routes |
| React 19 + TypeScript | UI |
| Tailwind CSS + shadcn/ui | Styling |
| Drizzle ORM | Queries typesafe PostgreSQL |
| Clerk | Auth (login, sessions, webhooks) |
| Stripe | Paiements, abonnements freemium |
| `@anthropic-ai/claude-agent-sdk` | DevChatbot embarqué |
| Sentry | Error tracking |
| Arcjet | Rate limiting |
| `html2canvas` | Capture UI pour le DevChatbot |

### ⚙️ Backend
| Tech | Usage |
|------|-------|
| .NET / C# (ASP.NET Core) | API secondaire — proxies données QC |
| Next.js API Routes | Endpoints frontend intégrés |

### 🗄️ Base de données
| Tech | Usage |
|------|-------|
| Supabase (PostgreSQL) | DB principale |
| PostGIS | Requêtes géospatiales (zones inondables) |
| Supabase Storage | Fichiers |
| Drizzle ORM | Migrations typesafe |

### 🤖 AI & APIs externes
| Service | Usage |
|---------|-------|
| Claude Agent SDK | DevChatbot temps réel intégré à l'app |
| Données RBQ | Vérification entrepreneurs licenciés |
| Données MELCCFP | Terrains contaminés, zones inondables |
| Données Emploi QC | Comparatif de salaires |

## Features principales

- **Micro-outils données QC** — Vérification entrepreneur (RBQ), zones inondables, terrains contaminés, garderies, salaires
- **SEO-first** — Pages SSG par ville pour chaque outil, articles de blog, JSON-LD structured data
- **Modèle freemium** — Checkout Stripe intégré pour les plans API B2B
- **DevChatbot Claude Agent SDK** — Chatbot embarqué qui inspecte les éléments UI, collecte le contexte de l'app et génère des code diffs en temps réel
- **Observabilité complète** — Sentry, Arcjet rate limiting, PostHog analytics

## Architecture

```
┌──────────────────────────────────────────────┐
│              Next.js 16 (App Router)          │
│                                               │
│  /verifier-entrepreneur   (ContractorCheck)   │
│  /zone-inondable          (FloodCheck)        │
│  /terrain-contamine       (TerraCheck)        │
│  /garderies               (GarderieFind)      │
│  /salaires                (SalaireLab)        │
│  /blog/                   (Articles SEO)      │
│                                               │
│  Clerk (auth) │ Sentry │ Arcjet               │
│  Stripe (payments) │ Claude Agent SDK         │
├───────────────────┬──────────────────────────┤
│   Supabase        │   .NET/C# API             │
│   PostgreSQL      │   Proxy données ouvertes  │
│   + PostGIS       │   QC (RBQ, MELCCFP...)    │
│   + Storage       │                           │
└───────────────────┴──────────────────────────┘
```

## Ce que j'ai appris

- **Next.js App Router** — SSR, SSG, server components, API routes, middlewares
- **Intégration multi-APIs** — Clerk, Stripe, Sentry, Arcjet, PostGIS dans un seul projet
- **Claude Agent SDK** — intégration d'un agent AI dans une app web en temps réel
- **SEO programmatique** — génération de pages par ville, JSON-LD, sitemap dynamique
- **Architecture hybride** — frontend Next.js + backend .NET pour les APIs données
- **Modèle freemium** — design d'un funnel freemium avec Stripe Checkout

## Screenshots

![Page d'accueil](https://mathieu-fournier.net/cliczone/docs/screenshot-home.png)

## 🤖 Développement assisté par IA

Conçu et architecturé par moi — Claude Code a accéléré l'implémentation des composants et l'intégration des APIs. Le projet intègre aussi directement le **Claude Agent SDK** comme feature produit (DevChatbot).

## Setup

```bash
git clone https://github.com/Maaattqc/cliczone.git
cd cliczone
cp .env.example .env.local
# Remplir Supabase, Clerk, Stripe, Anthropic
npm install
npm run dev
```
