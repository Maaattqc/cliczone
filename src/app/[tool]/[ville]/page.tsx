import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getToolConfig, getAllTools, getAllCities, getCity } from "@/lib/tools/registry";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolSearch } from "@/components/tools/tool-search";

interface Props {
  params: Promise<{ tool: string; ville: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  const cities = getAllCities();

  return tools.flatMap((t) =>
    cities.map((c) => ({ tool: t.toolSlug, ville: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolSlug, ville: villeSlug } = await params;
  const config = getToolConfig(toolSlug);
  const city = getCity(villeSlug);
  if (!config || !city) return {};

  const title = config.metaData.titleTemplate.replace("{ville}", city.name);
  const description = config.metaData.descriptionTemplate.replace("{ville}", city.name);

  return {
    title: `${title} | ClicZone`,
    description,
    keywords: [...config.metaData.keywords, city.name, city.region],
    openGraph: {
      title: `${title} | ClicZone`,
      description,
      type: "website",
    },
  };
}

export default async function CityToolPage({ params }: Props) {
  const { tool: toolSlug, ville: villeSlug } = await params;
  const config = getToolConfig(toolSlug);
  const city = getCity(villeSlug);
  if (!config || !city) notFound();

  const allCities = getAllCities().filter((c) => c.slug !== city.slug);

  return (
    <ToolLayout config={config} city={city.name}>
      <ToolSearch toolSlug={config.toolSlug} placeholder={config.inputPlaceholder} ville={city.name} inputType={config.inputType} />

      {/* City stats */}
      <section aria-label="Statistiques locales" className="space-y-2">
        <h2 className="text-xl font-semibold">
          {city.name} en bref
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Population</dt>
            <dd className="font-semibold">{city.population.toLocaleString("fr-CA")}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Région</dt>
            <dd className="font-semibold">{city.region}</dd>
          </div>
        </dl>
      </section>

      {/* Other cities */}
      <section aria-label="Autres villes" className="space-y-4">
        <h2 className="text-xl font-semibold">
          Autres villes
        </h2>
        <div className="flex flex-wrap gap-2">
          {allCities.map((c) => (
            <Link
              key={c.slug}
              href={`/${config.toolSlug}/${c.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </ToolLayout>
  );
}
