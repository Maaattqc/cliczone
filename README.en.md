# ClicZone

[🇫🇷 Lire en français](README.md)

> 🌐 **[View live demo](https://mathieu-fournier.net/cliczone/)** — deployed on mathieu-fournier.net

> SaaS platform of micro-tools built on Québec's open data — contractor verification, flood zones, contaminated land, daycares, and more.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat&logo=stripe&logoColor=white)

## Why This Project

Québec's public data (RBQ, MELCCFP, various ministries) is scattered and hard to access for the average citizen. ClicZone aggregates this data into simple micro-tools: verify a contractor, check if land is contaminated, find a daycare, compare salaries — all on a single platform monetized via freemium + Stripe.

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
│  /blog/                   (SEO Articles)      │
│  ... (100 planned micro-tools)                │
│                                               │
│  Clerk (auth) │ Sentry (errors) │ Axiom (logs)│
│  Stripe (payments) │ Arcjet (rate limiting)   │
├───────────────────┬──────────────────────────┤
│   Supabase        │   Claude Agent SDK        │
│   PostgreSQL      │   (Embedded DevChatbot)   │
│   + PostGIS       │                           │
│   + Storage       │                           │
└───────────────────┴──────────────────────────┘
```

## Key Features

- **100 micro-tools** — Each tool queries Québec's open data (RBQ, flood zones, contaminated land, daycares, etc.)
- **SEO-first** — SSG pages by city for each tool, blog articles, JSON-LD structured data
- **Stripe monetization** — Freemium model with integrated checkout for B2B APIs
- **DevChatbot with Claude Agent SDK** — Embedded development chatbot that inspects UI elements, collects app context and generates real-time code diffs
- **Drizzle ORM + Supabase** — Typesafe migrations, PostGIS for geospatial queries
- **Full observability** — Sentry (errors), Axiom (logs), PostHog (analytics), Arcjet (rate limiting)

## Screenshots

![Home page](https://mathieu-fournier.net/cliczone/docs/screenshot-home.png)

## AI-Assisted Development

The project directly integrates the **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) into an embedded DevChatbot that:
- Inspects page UI elements in real time
- Collects application context (routes, state, components)
- Generates code diffs and proposes modifications via a preview panel
