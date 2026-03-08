import type { MetadataRoute } from "next";
import { getAllTools, getAllCities } from "@/lib/tools/registry";

const BASE_URL = "https://cliczone.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const cities = getAllCities();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
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

  return [...staticPages, ...toolPages, ...cityToolPages];
}
