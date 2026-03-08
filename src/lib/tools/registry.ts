import type { ToolConfig, CityConfig } from "./types";

const tools: Record<string, ToolConfig> = {
  "verifier-entrepreneur": {
    toolSlug: "verifier-entrepreneur",
    toolName: "ContractorCheck",
    toolTitle: "Verifier un entrepreneur",
    toolDescription:
      "Verifiez la licence RBQ, les plaintes et l'historique d'un entrepreneur en construction au Quebec.",
    inputType: "name",
    inputPlaceholder: "Nom ou numero de licence RBQ",
    paidFeatures: [
      "Historique complet RBQ",
      "Plaintes deposees",
      "Score de fiabilite",
      "Rapport PDF telechargeable",
    ],
    faqItems: [
      {
        question: "Comment verifier si un entrepreneur a une licence RBQ valide?",
        answer:
          "Entrez le nom ou le numero de licence dans l'outil. Le resultat vous indique si la licence est active, les specialites couvertes et la region d'operation.",
      },
      {
        question: "Combien coute le rapport complet?",
        answer:
          "Le resultat basique est gratuit. Le rapport complet avec historique, plaintes et score de fiabilite coute 19.99$ CAD (paiement unique).",
      },
      {
        question: "Les donnees sont-elles a jour?",
        answer:
          "Les donnees sont mises a jour quotidiennement a partir du registre officiel de la Regie du batiment du Quebec (RBQ).",
      },
      {
        question: "Quels travaux necessitent une licence RBQ?",
        answer:
          "Tous les travaux de construction, renovation ou demolition de plus de 1 000$ necessitent un entrepreneur licencie par la RBQ.",
      },
      {
        question: "Que faire si un entrepreneur n'a pas de licence?",
        answer:
          "Ne signez aucun contrat. Vous pouvez signaler l'entrepreneur a la RBQ. Les travaux sans licence ne sont pas couverts par le plan de garantie.",
      },
    ],
    relatedTools: ["permis-construction", "renovation-prix", "zonage"],
    category: "entrepreneurs",
    price: 19.99,
    priceLabel: "Rapport complet",
    metaData: {
      titleTemplate: "Verifier un entrepreneur a {ville}",
      descriptionTemplate:
        "Verifiez la licence RBQ d'un entrepreneur a {ville}. Resultat instantane et gratuit.",
      keywords: ["verifier entrepreneur", "licence RBQ", "plaintes entrepreneur", "construction quebec"],
    },
  },
  "zone-inondable": {
    toolSlug: "zone-inondable",
    toolName: "FloodCheck",
    toolTitle: "Verifier une zone inondable",
    toolDescription:
      "Verifiez si une adresse est situee en zone inondable au Quebec. Carte interactive et historique des crues.",
    inputType: "address",
    inputPlaceholder: "Entrez une adresse",
    paidFeatures: [
      "Carte detaillee de la zone",
      "Historique des crues",
      "Impact sur la valeur",
      "Rapport PDF telechargeable",
    ],
    faqItems: [
      {
        question: "Comment savoir si ma maison est en zone inondable?",
        answer:
          "Entrez votre adresse dans l'outil. Le resultat vous indique si l'adresse est en zone 0-20 ans (risque eleve) ou 0-100 ans (risque modere).",
      },
      {
        question: "Quelle est la difference entre zone 0-20 ans et 0-100 ans?",
        answer:
          "La zone 0-20 ans est inondee en moyenne une fois tous les 20 ans (risque eleve). La zone 0-100 ans est inondee en moyenne une fois tous les 100 ans (risque modere).",
      },
      {
        question: "L'assurance couvre-t-elle les inondations?",
        answer:
          "Depuis 2020, plusieurs assureurs offrent une couverture inondation au Quebec. Le cout varie selon la zone de risque. Utilisez notre outil InsureScore pour estimer votre prime.",
      },
      {
        question: "Puis-je construire en zone inondable?",
        answer:
          "En zone 0-20 ans, les nouvelles constructions sont generalement interdites. En zone 0-100 ans, elles sont permises avec des mesures d'immunisation.",
      },
      {
        question: "D'ou proviennent les donnees?",
        answer:
          "Les donnees proviennent du ministere de l'Environnement du Quebec et sont mises a jour annuellement.",
      },
    ],
    relatedTools: ["terrain-contamine", "zonage", "score-logement"],
    category: "immobilier",
    price: 14.99,
    priceLabel: "Rapport complet",
    metaData: {
      titleTemplate: "Zone inondable a {ville}",
      descriptionTemplate:
        "Verifiez si une adresse est en zone inondable a {ville}. Carte interactive et historique des crues.",
      keywords: ["zone inondable", "carte inondation", "risque inondation quebec"],
    },
  },
  "terrain-contamine": {
    toolSlug: "terrain-contamine",
    toolName: "TerraCheck",
    toolTitle: "Verifier un terrain contamine",
    toolDescription:
      "Verifiez si un terrain est contamine au Quebec. Historique environnemental et statut de decontamination.",
    inputType: "address",
    inputPlaceholder: "Entrez une adresse",
    paidFeatures: [
      "Rapport environnemental complet",
      "Historique de contamination",
      "Statut de decontamination",
      "Rapport PDF telechargeable",
    ],
    faqItems: [
      {
        question: "Comment verifier si un terrain est contamine?",
        answer:
          "Entrez l'adresse du terrain. L'outil consulte l'inventaire des terrains contamines du MELCCFP et vous indique le statut.",
      },
      {
        question: "Que signifie un terrain 'en traitement'?",
        answer:
          "Un terrain en traitement est en cours de decontamination. Des travaux sont en cours ou prevus pour retirer les contaminants.",
      },
      {
        question: "Qui paie la decontamination?",
        answer:
          "Le proprietaire du terrain est generalement responsable. Dans certains cas, des programmes gouvernementaux peuvent aider au financement.",
      },
      {
        question: "Puis-je acheter un terrain contamine?",
        answer:
          "Oui, mais le notaire doit vous informer du statut. Le prix est generalement reduit et vous pourriez heriter de la responsabilite de decontamination.",
      },
      {
        question: "Les donnees sont-elles fiables?",
        answer:
          "Les donnees proviennent du registre officiel du ministere de l'Environnement du Quebec (MELCCFP), mis a jour regulierement.",
      },
    ],
    relatedTools: ["zone-inondable", "zonage", "verifier-entrepreneur"],
    category: "immobilier",
    price: 14.99,
    priceLabel: "Rapport complet",
    metaData: {
      titleTemplate: "Terrain contamine a {ville}",
      descriptionTemplate:
        "Verifiez si un terrain est contamine a {ville}. Historique environnemental et statut officiel.",
      keywords: ["terrain contamine", "sol contamine", "decontamination quebec"],
    },
  },
  garderies: {
    toolSlug: "garderies",
    toolName: "GarderieFind",
    toolTitle: "Trouver une place en garderie",
    toolDescription:
      "Trouvez les garderies et CPE avec des places disponibles pres de chez vous au Quebec.",
    inputType: "postal-code",
    inputPlaceholder: "Code postal (ex: G6V 1A1)",
    paidFeatures: [
      "Alertes places disponibles",
      "Liste d'attente estimee",
      "Inspections et rapports",
      "Comparaison des garderies",
    ],
    faqItems: [
      {
        question: "Comment trouver une place en garderie au Quebec?",
        answer:
          "Entrez votre code postal pour voir les garderies et CPE pres de chez vous avec le nombre de places disponibles.",
      },
      {
        question: "Combien coute une garderie au Quebec?",
        answer:
          "Les CPE et garderies subventionnees coutent 9.10$/jour par enfant. Les garderies privees non subventionnees varient entre 35$ et 65$/jour.",
      },
      {
        question: "Quelle est la difference entre CPE et garderie privee?",
        answer:
          "Les CPE sont des organismes a but non lucratif subventionnes par le gouvernement. Les garderies privees sont des entreprises qui peuvent etre subventionnees ou non.",
      },
      {
        question: "Comment s'inscrire sur La Place 0-5?",
        answer:
          "Visitez laplace0-5.com pour vous inscrire sur la liste d'attente centralisee du gouvernement. L'inscription est gratuite.",
      },
      {
        question: "Puis-je deduire les frais de garderie aux impots?",
        answer:
          "Oui, les frais de garde sont deductibles au federal et donnent droit a un credit d'impot au provincial.",
      },
    ],
    relatedTools: ["salaires", "score-logement"],
    category: "familles",
    price: 10,
    priceLabel: "Alertes mensuelles",
    metaData: {
      titleTemplate: "Garderies et CPE a {ville}",
      descriptionTemplate:
        "Trouvez une place en garderie ou CPE a {ville}. Places disponibles en temps reel.",
      keywords: ["garderie", "CPE", "place garderie", "garderie quebec"],
    },
  },
  salaires: {
    toolSlug: "salaires",
    toolName: "SalaireLab",
    toolTitle: "Salaires par metier au Quebec",
    toolDescription:
      "Consultez les salaires medians, minimums et maximums par metier et par region au Quebec.",
    inputType: "name",
    inputPlaceholder: "Entrez un metier (ex: plombier, infirmiere)",
    paidFeatures: [
      "Comparaison par region",
      "Tendances sur 5 ans",
      "Perspectives d'emploi",
      "Rapport PDF telechargeable",
    ],
    faqItems: [
      {
        question: "D'ou proviennent les donnees salariales?",
        answer:
          "Les donnees proviennent d'Emploi-Quebec et de Statistique Canada, mises a jour annuellement.",
      },
      {
        question: "Le salaire affiche est-il brut ou net?",
        answer: "Les salaires affiches sont bruts (avant impots et deductions).",
      },
      {
        question: "Comment negocier mon salaire?",
        answer:
          "Utilisez les donnees de SalaireLab pour connaitre la fourchette salariale de votre metier dans votre region. Visez le 75e percentile si vous avez de l'experience.",
      },
      {
        question: "Les salaires varient-ils beaucoup entre les regions?",
        answer:
          "Oui, les salaires a Montreal sont generalement 10-20% plus eleves qu'en region, mais le cout de la vie est aussi plus eleve.",
      },
      {
        question: "A quelle frequence les donnees sont-elles mises a jour?",
        answer: "Les donnees sont mises a jour une fois par annee, generalement au printemps.",
      },
    ],
    relatedTools: ["garderies", "score-logement"],
    category: "emploi",
    price: 9.99,
    priceLabel: "Rapport detaille",
    metaData: {
      titleTemplate: "Salaire {ville}",
      descriptionTemplate:
        "Consultez les salaires par metier a {ville}. Donnees officielles d'Emploi-Quebec.",
      keywords: ["salaire quebec", "salaire moyen", "combien gagne"],
    },
  },
};

const cities: CityConfig[] = [
  { slug: "montreal", name: "Montreal", region: "Montreal", population: 1762949 },
  { slug: "quebec", name: "Quebec", region: "Capitale-Nationale", population: 549459 },
  { slug: "laval", name: "Laval", region: "Laval", population: 438366 },
  { slug: "gatineau", name: "Gatineau", region: "Outaouais", population: 291041 },
  { slug: "longueuil", name: "Longueuil", region: "Monteregie", population: 249277 },
  { slug: "sherbrooke", name: "Sherbrooke", region: "Estrie", population: 168849 },
  { slug: "levis", name: "Levis", region: "Chaudiere-Appalaches", population: 149683 },
  { slug: "trois-rivieres", name: "Trois-Rivieres", region: "Mauricie", population: 140420 },
  { slug: "saguenay", name: "Saguenay", region: "Saguenay-Lac-Saint-Jean", population: 148050 },
  { slug: "terrebonne", name: "Terrebonne", region: "Lanaudiere", population: 119224 },
  { slug: "saint-jean-sur-richelieu", name: "Saint-Jean-sur-Richelieu", region: "Monteregie", population: 98036 },
  { slug: "drummondville", name: "Drummondville", region: "Centre-du-Quebec", population: 79789 },
  { slug: "granby", name: "Granby", region: "Estrie", population: 68352 },
  { slug: "saint-hyacinthe", name: "Saint-Hyacinthe", region: "Monteregie", population: 56529 },
  { slug: "saint-jerome", name: "Saint-Jerome", region: "Laurentides", population: 77860 },
  { slug: "rimouski", name: "Rimouski", region: "Bas-Saint-Laurent", population: 49860 },
  { slug: "victoriaville", name: "Victoriaville", region: "Centre-du-Quebec", population: 47425 },
  { slug: "saint-georges", name: "Saint-Georges", region: "Chaudiere-Appalaches", population: 34068 },
  { slug: "thetford-mines", name: "Thetford Mines", region: "Chaudiere-Appalaches", population: 25709 },
  { slug: "riviere-du-loup", name: "Riviere-du-Loup", region: "Bas-Saint-Laurent", population: 19860 },
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
