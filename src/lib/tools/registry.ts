import type { ToolConfig, CityConfig } from "./types";

const tools: Record<string, ToolConfig> = {
  "verifier-entrepreneur": {
    toolSlug: "verifier-entrepreneur",
    toolName: "ContractorCheck",
    toolTitle: "Vérifier un entrepreneur",
    toolDescription:
      "Vérifiez la licence RBQ, les plaintes et l'historique d'un entrepreneur en construction au Québec.",
    inputType: "name",
    inputPlaceholder: "Nom ou numéro de licence RBQ",
    paidFeatures: [
      "Historique complet RBQ",
      "Plaintes déposées",
      "Score de fiabilité",
      "Rapport PDF téléchargeable",
    ],
    faqItems: [
      {
        question: "Comment vérifier si un entrepreneur a une licence RBQ valide?",
        answer:
          "Entrez le nom ou le numéro de licence dans l'outil. Le résultat vous indique si la licence est active, les spécialités couvertes et la région d'opération.",
      },
      {
        question: "Combien coûte le rapport complet?",
        answer:
          "Le résultat basique est gratuit. Le rapport complet avec historique, plaintes et score de fiabilité coûte 19.99$ CAD (paiement unique).",
      },
      {
        question: "Les données sont-elles à jour?",
        answer:
          "Les données sont mises à jour quotidiennement à partir du registre officiel de la Régie du bâtiment du Québec (RBQ).",
      },
      {
        question: "Quels travaux nécessitent une licence RBQ?",
        answer:
          "Tous les travaux de construction, rénovation ou démolition de plus de 1 000$ nécessitent un entrepreneur licencié par la RBQ.",
      },
      {
        question: "Que faire si un entrepreneur n'a pas de licence?",
        answer:
          "Ne signez aucun contrat. Vous pouvez signaler l'entrepreneur à la RBQ. Les travaux sans licence ne sont pas couverts par le plan de garantie.",
      },
    ],
    relatedTools: ["permis-construction", "renovation-prix", "zonage"],
    category: "entrepreneurs",
    price: 19.99,
    priceLabel: "Rapport complet",
    metaData: {
      titleTemplate: "Vérifier un entrepreneur à {ville}",
      descriptionTemplate:
        "Vérifiez la licence RBQ d'un entrepreneur à {ville}. Résultat instantané et gratuit.",
      keywords: ["vérifier entrepreneur", "licence RBQ", "plaintes entrepreneur", "construction québec"],
    },
  },
  "zone-inondable": {
    toolSlug: "zone-inondable",
    toolName: "FloodCheck",
    toolTitle: "Vérifier une zone inondable",
    toolDescription:
      "Vérifiez si une adresse est située en zone inondable au Québec. Carte interactive et historique des crues.",
    inputType: "address",
    inputPlaceholder: "Entrez une adresse",
    paidFeatures: [
      "Carte détaillée de la zone",
      "Historique des crues",
      "Impact sur la valeur",
      "Rapport PDF téléchargeable",
    ],
    faqItems: [
      {
        question: "Comment savoir si ma maison est en zone inondable?",
        answer:
          "Entrez votre adresse dans l'outil. Le résultat vous indique si l'adresse est en zone 0-20 ans (risque élevé) ou 0-100 ans (risque modéré).",
      },
      {
        question: "Quelle est la différence entre zone 0-20 ans et 0-100 ans?",
        answer:
          "La zone 0-20 ans est inondée en moyenne une fois tous les 20 ans (risque élevé). La zone 0-100 ans est inondée en moyenne une fois tous les 100 ans (risque modéré).",
      },
      {
        question: "L'assurance couvre-t-elle les inondations?",
        answer:
          "Depuis 2020, plusieurs assureurs offrent une couverture inondation au Québec. Le coût varie selon la zone de risque. Utilisez notre outil InsureScore pour estimer votre prime.",
      },
      {
        question: "Puis-je construire en zone inondable?",
        answer:
          "En zone 0-20 ans, les nouvelles constructions sont généralement interdites. En zone 0-100 ans, elles sont permises avec des mesures d'immunisation.",
      },
      {
        question: "D'où proviennent les données?",
        answer:
          "Les données proviennent du ministère de l'Environnement du Québec et sont mises à jour annuellement.",
      },
    ],
    relatedTools: ["terrain-contamine", "zonage", "score-logement"],
    category: "immobilier",
    price: 14.99,
    priceLabel: "Rapport complet",
    metaData: {
      titleTemplate: "Zone inondable à {ville}",
      descriptionTemplate:
        "Vérifiez si une adresse est en zone inondable à {ville}. Carte interactive et historique des crues.",
      keywords: ["zone inondable", "carte inondation", "risque inondation québec"],
    },
  },
  "terrain-contamine": {
    toolSlug: "terrain-contamine",
    toolName: "TerraCheck",
    toolTitle: "Vérifier un terrain contaminé",
    toolDescription:
      "Vérifiez si un terrain est contaminé au Québec. Historique environnemental et statut de décontamination.",
    inputType: "address",
    inputPlaceholder: "Entrez une adresse",
    paidFeatures: [
      "Rapport environnemental complet",
      "Historique de contamination",
      "Statut de décontamination",
      "Rapport PDF téléchargeable",
    ],
    faqItems: [
      {
        question: "Comment vérifier si un terrain est contaminé?",
        answer:
          "Entrez l'adresse du terrain. L'outil consulte l'inventaire des terrains contaminés du MELCCFP et vous indique le statut.",
      },
      {
        question: "Que signifie un terrain 'en traitement'?",
        answer:
          "Un terrain en traitement est en cours de décontamination. Des travaux sont en cours ou prévus pour retirer les contaminants.",
      },
      {
        question: "Qui paie la décontamination?",
        answer:
          "Le propriétaire du terrain est généralement responsable. Dans certains cas, des programmes gouvernementaux peuvent aider au financement.",
      },
      {
        question: "Puis-je acheter un terrain contaminé?",
        answer:
          "Oui, mais le notaire doit vous informer du statut. Le prix est généralement réduit et vous pourriez hériter de la responsabilité de décontamination.",
      },
      {
        question: "Les données sont-elles fiables?",
        answer:
          "Les données proviennent du registre officiel du ministère de l'Environnement du Québec (MELCCFP), mis à jour régulièrement.",
      },
    ],
    relatedTools: ["zone-inondable", "zonage", "verifier-entrepreneur"],
    category: "immobilier",
    price: 14.99,
    priceLabel: "Rapport complet",
    metaData: {
      titleTemplate: "Terrain contaminé à {ville}",
      descriptionTemplate:
        "Vérifiez si un terrain est contaminé à {ville}. Historique environnemental et statut officiel.",
      keywords: ["terrain contaminé", "sol contaminé", "décontamination québec"],
    },
  },
  garderies: {
    toolSlug: "garderies",
    toolName: "GarderieFind",
    toolTitle: "Trouver une place en garderie",
    toolDescription:
      "Trouvez les garderies et CPE avec des places disponibles près de chez vous au Québec.",
    inputType: "postal-code",
    inputPlaceholder: "Code postal (ex: G6V 1A1)",
    paidFeatures: [
      "Alertes places disponibles",
      "Liste d'attente estimée",
      "Inspections et rapports",
      "Comparaison des garderies",
    ],
    faqItems: [
      {
        question: "Comment trouver une place en garderie au Québec?",
        answer:
          "Entrez votre code postal pour voir les garderies et CPE près de chez vous avec le nombre de places disponibles.",
      },
      {
        question: "Combien coûte une garderie au Québec?",
        answer:
          "Les CPE et garderies subventionnées coûtent 9.10$/jour par enfant. Les garderies privées non subventionnées varient entre 35$ et 65$/jour.",
      },
      {
        question: "Quelle est la différence entre CPE et garderie privée?",
        answer:
          "Les CPE sont des organismes à but non lucratif subventionnés par le gouvernement. Les garderies privées sont des entreprises qui peuvent être subventionnées ou non.",
      },
      {
        question: "Comment s'inscrire sur La Place 0-5?",
        answer:
          "Visitez laplace0-5.com pour vous inscrire sur la liste d'attente centralisée du gouvernement. L'inscription est gratuite.",
      },
      {
        question: "Puis-je déduire les frais de garderie aux impôts?",
        answer:
          "Oui, les frais de garde sont déductibles au fédéral et donnent droit à un crédit d'impôt au provincial.",
      },
    ],
    relatedTools: ["salaires", "score-logement"],
    category: "familles",
    price: 10,
    priceLabel: "Alertes mensuelles",
    metaData: {
      titleTemplate: "Garderies et CPE à {ville}",
      descriptionTemplate:
        "Trouvez une place en garderie ou CPE à {ville}. Places disponibles en temps réel.",
      keywords: ["garderie", "CPE", "place garderie", "garderie québec"],
    },
  },
  salaires: {
    toolSlug: "salaires",
    toolName: "SalaireLab",
    toolTitle: "Salaires par métier au Québec",
    toolDescription:
      "Consultez les salaires médians, minimums et maximums par métier et par région au Québec.",
    inputType: "name",
    inputPlaceholder: "Entrez un métier (ex: plombier, infirmière)",
    paidFeatures: [
      "Comparaison par région",
      "Tendances sur 5 ans",
      "Perspectives d'emploi",
      "Rapport PDF téléchargeable",
    ],
    faqItems: [
      {
        question: "D'où proviennent les données salariales?",
        answer:
          "Les données proviennent d'Emploi-Québec et de Statistique Canada, mises à jour annuellement.",
      },
      {
        question: "Le salaire affiché est-il brut ou net?",
        answer: "Les salaires affichés sont bruts (avant impôts et déductions).",
      },
      {
        question: "Comment négocier mon salaire?",
        answer:
          "Utilisez les données de SalaireLab pour connaître la fourchette salariale de votre métier dans votre région. Visez le 75e percentile si vous avez de l'expérience.",
      },
      {
        question: "Les salaires varient-ils beaucoup entre les régions?",
        answer:
          "Oui, les salaires à Montréal sont généralement 10-20% plus élevés qu'en région, mais le coût de la vie est aussi plus élevé.",
      },
      {
        question: "À quelle fréquence les données sont-elles mises à jour?",
        answer: "Les données sont mises à jour une fois par année, généralement au printemps.",
      },
    ],
    relatedTools: ["garderies", "score-logement"],
    category: "emploi",
    price: 9.99,
    priceLabel: "Rapport détaillé",
    metaData: {
      titleTemplate: "Salaire {ville}",
      descriptionTemplate:
        "Consultez les salaires par métier à {ville}. Données officielles d'Emploi-Québec.",
      keywords: ["salaire québec", "salaire moyen", "combien gagne"],
    },
  },
};

const cities: CityConfig[] = [
  { slug: "montreal", name: "Montréal", region: "Montréal", population: 1762949 },
  { slug: "quebec", name: "Québec", region: "Capitale-Nationale", population: 549459 },
  { slug: "laval", name: "Laval", region: "Laval", population: 438366 },
  { slug: "gatineau", name: "Gatineau", region: "Outaouais", population: 291041 },
  { slug: "longueuil", name: "Longueuil", region: "Montérégie", population: 249277 },
  { slug: "sherbrooke", name: "Sherbrooke", region: "Estrie", population: 168849 },
  { slug: "levis", name: "Lévis", region: "Chaudière-Appalaches", population: 149683 },
  { slug: "trois-rivieres", name: "Trois-Rivières", region: "Mauricie", population: 140420 },
  { slug: "saguenay", name: "Saguenay", region: "Saguenay–Lac-Saint-Jean", population: 148050 },
  { slug: "terrebonne", name: "Terrebonne", region: "Lanaudière", population: 119224 },
  { slug: "saint-jean-sur-richelieu", name: "Saint-Jean-sur-Richelieu", region: "Montérégie", population: 98036 },
  { slug: "drummondville", name: "Drummondville", region: "Centre-du-Québec", population: 79789 },
  { slug: "granby", name: "Granby", region: "Estrie", population: 68352 },
  { slug: "saint-hyacinthe", name: "Saint-Hyacinthe", region: "Montérégie", population: 56529 },
  { slug: "saint-jerome", name: "Saint-Jérôme", region: "Laurentides", population: 77860 },
  { slug: "rimouski", name: "Rimouski", region: "Bas-Saint-Laurent", population: 49860 },
  { slug: "victoriaville", name: "Victoriaville", region: "Centre-du-Québec", population: 47425 },
  { slug: "saint-georges", name: "Saint-Georges", region: "Chaudière-Appalaches", population: 34068 },
  { slug: "thetford-mines", name: "Thetford Mines", region: "Chaudière-Appalaches", population: 25709 },
  { slug: "riviere-du-loup", name: "Rivière-du-Loup", region: "Bas-Saint-Laurent", population: 19860 },
];

export function getToolConfig(slug: string): ToolConfig | undefined {
  return tools[slug];
}

export function getAllTools(): ToolConfig[] {
  return Object.values(tools);
}

export function getToolsByCategory(category: string): ToolConfig[] {
  return Object.values(tools).filter((t) => t.category === category);
}

export function getAllCities(): CityConfig[] {
  return cities;
}

export function getCity(slug: string): CityConfig | undefined {
  return cities.find((c) => c.slug === slug);
}
