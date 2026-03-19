# ClicZone

[🇬🇧 Read in English](README.en.md)

> 🌐 **[Voir la démo live](https://mathieu-fournier.net/cliczone/)** — déployé sur mathieu-fournier.net

> Plateforme SaaS de micro-outils basés sur les données ouvertes du Québec — vérification d'entrepreneurs, zones inondables, terrains contaminés, garderies, et plus.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat&logo=stripe&logoColor=white)

## Pourquoi ce projet

Les données publiques du Québec (RBQ, MELCCFP, ministères) sont éparpillées et difficiles d'accès pour le citoyen moyen. ClicZone regroupe ces données en micro-outils simples : vérifier un entrepreneur, savoir si un terrain est contaminé, trouver une garderie, comparer des salaires — le tout sur une seule plateforme monétisée via freemium + Stripe.

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
│  ... (100 micro-outils planifiés)             │
│                                               │
│  Clerk (auth) │ Sentry (errors) │ Axiom (logs)│
│  Stripe (payments) │ Arcjet (rate limiting)   │
├───────────────────┬──────────────────────────┤
│   Supabase        │   Claude Agent SDK        │
│   PostgreSQL      │   (DevChatbot intégré)    │
│   + PostGIS       │                           │
│   + Storage       │                           │
└───────────────────┴──────────────────────────┘
```

## Features principales

- **100 micro-outils** — Chaque outil requête les données ouvertes du QC (RBQ, zones inondables, terrains contaminés, garderies, etc.)
- **SEO-first** — Pages SSG par ville pour chaque outil, articles de blog, JSON-LD structured data
- **Monétisation Stripe** — Modèle freemium avec checkout intégré pour les APIs B2B
- **DevChatbot avec Claude Agent SDK** — Chatbot de développement intégré qui inspecte les éléments UI, collecte le contexte de l'app et génère des diffs de code en temps réel
- **Drizzle ORM + Supabase** — Migrations typesafe, PostGIS pour les requêtes géospatiales
- **Observabilité complète** — Sentry (erreurs), Axiom (logs), PostHog (analytics), Arcjet (rate limiting)

## Screenshots

![Page d'accueil](https://mathieu-fournier.net/cliczone/docs/screenshot-home.png)

## AI-Assisted Development

Le projet intègre directement le **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) dans un DevChatbot embarqué qui :
- Inspecte les éléments UI de la page en temps réel
- Collecte le contexte de l'application (routes, state, composants)
- Génère des code diffs et propose des modifications via un panneau de preview

