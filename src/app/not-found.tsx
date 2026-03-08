import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllTools } from "@/lib/tools/registry";

export default function NotFound() {
  const tools = getAllTools();

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12 text-center">
      <section className="space-y-4">
        <p className="text-6xl font-bold text-muted-foreground">404</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Page introuvable
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
      </section>

      <div>
        <Link href="/">
          <Button size="lg">Retour à l&apos;accueil</Button>
        </Link>
      </div>

      <section className="space-y-4 text-left">
        <h2 className="text-xl font-semibold text-center">Outils populaires</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.toolSlug}
              href={`/${tool.toolSlug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              {tool.toolTitle}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
