export function generateFAQPageSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateWebApplicationSchema(tool: {
  toolName: string;
  toolDescription: string;
  toolSlug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.toolName,
    description: tool.toolDescription,
    url: `https://cliczone.ca/${tool.toolSlug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    provider: {
      "@type": "Organization",
      name: "MF Digital",
      url: "https://cliczone.ca",
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClicZone",
    legalName: "MF Digital",
    url: "https://cliczone.ca",
    logo: "https://cliczone.ca/logo.png",
    description:
      "Outils basés sur les données ouvertes du Québec. Vérifiez un entrepreneur, une zone inondable, un terrain contaminé et plus.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
      addressRegion: "QC",
    },
    sameAs: [],
  };
}

export function generateArticleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `https://cliczone.ca/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: "ClicZone",
      url: "https://cliczone.ca",
    },
    publisher: {
      "@type": "Organization",
      name: "ClicZone",
      url: "https://cliczone.ca",
      logo: {
        "@type": "ImageObject",
        url: "https://cliczone.ca/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cliczone.ca/blog/${post.slug}`,
    },
  };
}
