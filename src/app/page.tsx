import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllTools, getAllCities } from "@/lib/tools/registry";
import {
  Database,
  MapPin,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  FileText,
  Building2,
  Users,
  Home,
  BarChart3,
} from "lucide-react";

const categories = [
  {
    slug: "immobilier",
    label: "Immobilier",
    description: "Zones inondables, terrains contaminés, zonage et permis.",
    icon: Home,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    slug: "entrepreneurs",
    label: "Entrepreneurs",
    description: "Vérification de licences RBQ et historique des plaintes.",
    icon: Building2,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    slug: "familles",
    label: "Familles",
    description: "Garderies, CPE et places disponibles.",
    icon: Users,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    slug: "emploi",
    label: "Emploi",
    description: "Salaires par métier et région au Québec.",
    icon: BarChart3,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

const stats = [
  { icon: Database, value: "5", label: "outils disponibles" },
  { icon: MapPin, value: "20", label: "villes couvertes" },
  { icon: Shield, value: "100%", label: "données officielles" },
  { icon: Clock, value: "< 5s", label: "résultats instantanés" },
];

const steps = [
  {
    number: "01",
    title: "Choisissez un outil",
    description: "Sélectionnez parmi notre catalogue d\u2019outils de vérification adaptés à vos besoins.",
    icon: Search,
  },
  {
    number: "02",
    title: "Entrez vos informations",
    description: "Adresse, nom, code postal \u2014 selon l\u2019outil choisi, fournissez les données requises.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Obtenez le résultat",
    description: "Résultat gratuit instantané. Rapport détaillé payant disponible pour aller plus loin.",
    icon: CheckCircle2,
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
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
              Plateforme de données ouvertes du Québec
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1]">
              Accédez aux{" "}
              <span className="text-primary italic">données publiques</span>{" "}
              du Québec
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Vérifiez un entrepreneur, une zone inondable, un terrain contaminé et plus encore.
              Résultats instantanés à partir des registres officiels.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/verifier-entrepreneur">
                <Button size="lg" className="gap-2 font-medium px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Commencer une recherche
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/a-propos">
                <Button variant="outline" size="lg" className="font-medium px-6 bg-red-500 text-white hover:bg-red-600 border-red-500 hover:border-red-600">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section aria-label="Statistiques" className="border-y bg-card">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Categories */}
        <section aria-label="Catégories" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
              Explorez par catégorie
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Chaque catégorie regroupe des outils spécialisés pour répondre à vos besoins.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`}>
                <Card className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full group">
                  <CardHeader className="pb-3">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${cat.color} mb-2`}>
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {cat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explorer <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section aria-label="Comment ça fonctionne" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
              Comment ça fonctionne
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Trois étapes simples pour accéder aux données publiques du Québec.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-xl border bg-card p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary/20 font-serif">
                    {step.number}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* All tools */}
        <section aria-label="Tous les outils" className="space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-3">
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
                Tous les outils
              </h2>
              <p className="text-muted-foreground">
                Accédez à l&apos;ensemble de nos outils de vérification.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link key={tool.toolSlug} href={`/${tool.toolSlug}`}>
                <Card className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {tool.toolName}
                      </CardTitle>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {tool.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {tool.toolDescription}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Utiliser l&apos;outil <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust signals */}
        <section aria-label="Sources officielles" className="rounded-2xl border bg-card p-8 md:p-12 texture-noise">
          <div className="relative space-y-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 mx-auto">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
              Sources officielles et vérifiées
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Toutes nos données proviennent de sources gouvernementales vérifiées
              et mises à jour régulièrement.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {dataSources.map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  {source}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Cities */}
        <section aria-label="Villes" className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
              Villes couvertes
            </h2>
            <p className="text-muted-foreground">
              Nos outils couvrent les principales villes du Québec.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/verifier-entrepreneur/${city.slug}`}
                className="rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-sm transition-all"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
