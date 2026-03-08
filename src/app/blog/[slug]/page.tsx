import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogCard } from "@/components/blog/blog-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/structured-data";
import { getAllPosts, getPost } from "@/lib/blog/posts";

function formatDateFr(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const relatedPosts = allPosts
    .filter((_, i) => i !== currentIndex)
    .slice(0, 2);

  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <JsonLd data={generateArticleSchema(post)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Accueil", url: "https://cliczone.ca" },
          { name: "Blogue", url: "https://cliczone.ca/blog" },
          {
            name: post.title,
            url: `https://cliczone.ca/blog/${post.slug}`,
          },
        ])}
      />

      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Accueil
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <Link href="/blog" className="hover:text-foreground transition-colors">
          Blogue
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      <article className="space-y-6">
        <header className="space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {formatDateFr(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readTime} de lecture
            </span>
          </div>
        </header>

        <Separator />

        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {relatedPosts.length > 0 && (
        <section className="space-y-4 pt-4">
          <Separator />
          <h2 className="text-xl font-semibold">Articles connexes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
