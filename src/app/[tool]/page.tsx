import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getToolConfig, getAllTools, getAllCities } from "@/lib/tools/registry";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolInput } from "@/components/tools/tool-input";

interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateStaticParams() {
  return getAllTools().map((t) => ({ tool: t.toolSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: slug } = await params;
  const config = getToolConfig(slug);
  if (!config) return {};

  return {
    title: `${config.toolTitle} | ClicZone`,
    description: config.toolDescription,
    keywords: config.metaData.keywords,
    openGraph: {
      title: `${config.toolTitle} | ClicZone`,
      description: config.toolDescription,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const config = getToolConfig(slug);
  if (!config) notFound();

  const cities = getAllCities();

  return (
    <ToolLayout config={config}>
      <ToolInput placeholder={config.inputPlaceholder} />

      {/* City links for SEO */}
      <section aria-label="Villes disponibles" className="space-y-4">
        <h2 className="text-xl font-semibold">
          {config.toolTitle} par ville
        </h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${config.toolSlug}/${city.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>
    </ToolLayout>
  );
}
