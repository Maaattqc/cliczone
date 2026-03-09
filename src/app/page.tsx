import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllTools, getAllCities } from "@/lib/tools/registry";
import {
  Database,
  MapPin,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";

const categories = [
  { slug: "immobilier", label: "Immobilier", description: "Zones inondables, terrains contaminés, zonage et permis." },
  { slug: "entrepreneurs", label: "Entrepreneurs", description: "Vérification de licences RBQ et historique des plaintes." },
  { slug: "familles", label: "Familles", description: "Garderies, CPE et places disponibles." },
  { slug: "emploi", label: "Emploi", description: "Salaires par métier et région au Québec." },
];

const stats = [
  { icon: Database, value: "5", label: "outils disponibles" },
  { icon: MapPin, value: "20", label: "villes couvertes" },
  { icon: Shield, value: "100%", label: "Données officielles" },
  { icon: Clock, value: "< 5s", label: "Résultats instantanés" },
];

const steps = [
  {
    number: "1",
    title: "Choisissez un outil",
    description: "Sélectionnez parmi notre catalogue d\u2019outils de vérification adaptés à vos besoins.",
  },
  {
    number: "2",
    title: "Entrez vos informations",
    description: "Adresse, nom, code postal \u2014 selon l\u2019outil choisi, fournissez les données requises.",
  },
  {
    number: "3",
    title: "Obtenez le résultat",
    description: "Résultat gratuit instantané. Rapport détaillé payant disponible pour aller plus loin.",
  },
];

const dataSources = [
  "Régie du bâtiment du Québec (RBQ)",
  "Ministère de l\u2019Environnement (MELCCFP)",
  "Emploi-Québec",
  "DonneesQuebec.ca",
  "Statistique Canada",
];

export default function HomePage() {
  const tools = getAllTools();
  const cities = getAllCities();

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Données publiques du Québec, simplifiées.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Vérifiez un entrepreneur, une zone inondable, un terrain contaminé et plus encore.
          Résultats instantanés à partir des registres officiels.
        </p>
      </section>

      {/* Stats */}
      <section aria-label="Statistiques" className="rounded-xl bg-muted/50 p-6 sm:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section aria-label="Comment ça fonctionne" className="space-y-8">
        <h2 className="text-2xl font-semibold text-center">Comment ça fonctionne</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section aria-label="Sources officielles" className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold">Sources officielles</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Toutes nos données proviennent de sources gouvernementales vérifiées et mises à jour régulièrement.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {dataSources.map((source) => (
            <span
              key={source}
              className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {source}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section aria-label="Catégories" className="space-y-6">
        <h2 className="text-2xl font-semibold">Par catégorie</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`}>
              <Card className="hover:border-primary/30 transition-colors h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{cat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* All tools */}
      <section aria-label="Tous les outils" className="space-y-6">
        <h2 className="text-2xl font-semibold">Tous les outils</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link key={tool.toolSlug} href={`/${tool.toolSlug}`}>
              <Card className="hover:border-primary/30 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tool.toolName}</CardTitle>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.toolDescription}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities */}
      <section aria-label="Villes" className="space-y-6">
        <h2 className="text-2xl font-semibold">Villes couvertes</h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/verifier-entrepreneur/${city.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
