import type { MetadataRoute } from "next";
import { getAllTools, getAllCities } from "@/lib/tools/registry";
import { getAllPosts } from "@/lib/blog/posts";

const BASE_URL = "https://cliczone.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const cities = getAllCities();
  const posts = getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = [
    "immobilier",
    "entrepreneurs",
    "familles",
    "emploi",
  ].map((cat) => ({
    url: `${BASE_URL}/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${BASE_URL}/${t.toolSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const cityToolPages: MetadataRoute.Sitemap = tools.flatMap((t) =>
    cities.map((c) => ({
      url: `${BASE_URL}/${t.toolSlug}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...blogIndex,
    ...blogPages,
    ...legalPages,
    ...toolPages,
    ...cityToolPages,
  ];
}
