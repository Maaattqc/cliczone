import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "Blogue",
  description:
    "Guides et conseils pour naviguer les données publiques du Québec. Articles sur l'immobilier, les entrepreneurs, les garderies, l'emploi et plus.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Blogue</h1>
        <p className="mt-2 text-muted-foreground">
          Guides et conseils pour naviguer les données publiques du Québec.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
