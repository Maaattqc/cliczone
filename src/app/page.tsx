import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllTools, getAllCities } from "@/lib/tools/registry";

const categories = [
  { slug: "immobilier", label: "Immobilier", description: "Zones inondables, terrains contamines, zonage et permis." },
  { slug: "entrepreneurs", label: "Entrepreneurs", description: "Verification de licences RBQ et historique des plaintes." },
  { slug: "familles", label: "Familles", description: "Garderies, CPE et places disponibles." },
  { slug: "emploi", label: "Emploi", description: "Salaires par metier et region au Quebec." },
];

export default function HomePage() {
  const tools = getAllTools();
  const cities = getAllCities();

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Donnees publiques du Quebec, simplifiees.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Verifiez un entrepreneur, une zone inondable, un terrain contamine et plus encore.
          Resultats instantanes a partir des registres officiels.
        </p>
      </section>

      {/* Categories */}
      <section aria-label="Categories" className="space-y-6">
        <h2 className="text-2xl font-semibold">Par categorie</h2>
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
