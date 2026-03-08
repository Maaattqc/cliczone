import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getToolsByCategory, getAllCities } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "Vérification d'entrepreneurs | ClicZone",
  description:
    "Vérifiez les licences RBQ et l'historique des entrepreneurs en construction au Québec. Données officielles de la Régie du bâtiment.",
};

export default function EntrepreneursPage() {
  const tools = getToolsByCategory("entrepreneurs");
  const cities = getAllCities();
  const firstTool = tools[0];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Vérification d&apos;entrepreneurs
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Vérifiez les licences RBQ et l&apos;historique des entrepreneurs au Québec.
        </p>
      </section>

      {/* Tool cards */}
      <section aria-label="Outils entrepreneurs" className="space-y-6">
        <h2 className="text-2xl font-semibold">Nos outils</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link key={tool.toolSlug} href={`/${tool.toolSlug}`}>
              <Card className="hover:border-primary/30 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tool.toolName}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {tool.priceLabel} — {tool.price}&nbsp;$
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
      <section aria-label="Villes couvertes" className="space-y-6">
        <h2 className="text-2xl font-semibold">Villes couvertes</h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${firstTool.toolSlug}/${city.slug}`}
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
