export interface ToolConfig {
  toolSlug: string;
  toolName: string;
  toolTitle: string;
  toolDescription: string;
  inputType: "address" | "name" | "licence" | "sector" | "postal-code";
  inputPlaceholder: string;
  paidFeatures: string[];
  faqItems: { question: string; answer: string }[];
  relatedTools: string[];
  category: string;
  price: number;
  priceLabel: string;
  metaData: {
    titleTemplate: string;
    descriptionTemplate: string;
    keywords: string[];
  };
}

export interface CityConfig {
  slug: string;
  name: string;
  region: string;
  population: number;
}
