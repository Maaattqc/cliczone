import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Note: Base UI Accordion — no type/collapsible props needed
import type { ToolConfig } from "@/lib/tools/types";
import { getAllTools } from "@/lib/tools/registry";

function Breadcrumb({ tool, city }: { tool: ToolConfig; city?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        Accueil
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      <Link href={`/${tool.category}`} className="hover:text-foreground transition-colors capitalize">
        {tool.category}
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      {city ? (
        <>
          <Link href={`/${tool.toolSlug}`} className="hover:text-foreground transition-colors">
            {tool.toolName}
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-foreground">{city}</span>
        </>
      ) : (
        <span className="text-foreground">{tool.toolName}</span>
      )}
    </nav>
  );
}

function ToolCTA({ tool }: { tool: ToolConfig }) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{tool.priceLabel}</span>
          <span className="text-2xl font-bold text-primary">{tool.price}$</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tool.paidFeatures.map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span>{feature}</span>
          </div>
        ))}
        <Button className="w-full sm:w-auto mt-4" size="lg">
          Obtenir le rapport
        </Button>
      </CardContent>
    </Card>
  );
}

function ToolFAQ({ items }: { items: ToolConfig["faqItems"] }) {
  return (
    <section aria-label="Questions fréquentes" className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">Questions fréquentes</h2>
      <Accordion className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function RelatedTools({ slugs }: { slugs: string[] }) {
  const allTools = getAllTools();
  const related = slugs
    .map((s) => allTools.find((t) => t.toolSlug === s))
    .filter(Boolean);

  if (related.length === 0) return null;

  return (
    <section aria-label="Outils liés" className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">Outils liés</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((tool) => (
          <Link key={tool!.toolSlug} href={`/${tool!.toolSlug}`}>
            <Card className="hover:border-primary/30 transition-colors h-full">
              <CardHeader>
                <CardTitle className="text-base">{tool!.toolName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tool!.toolDescription}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ToolLayout({
  config,
  city,
  children,
}: {
  config: ToolConfig;
  city?: string;
  children: React.ReactNode;
}) {
  const title = city
    ? `${config.toolTitle} à ${city}`
    : config.toolTitle;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div>
        <Breadcrumb tool={config} city={city} />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{config.toolDescription}</p>
      </div>

      {children}

      <ToolCTA tool={config} />
      <ToolFAQ items={config.faqItems} />
      <RelatedTools slugs={config.relatedTools} />
    </main>
  );
}
