export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: "comment-verifier-entrepreneur-quebec",
    title: "Comment vérifier un entrepreneur au Québec",
    excerpt:
      "Avant de confier vos travaux de construction ou de rénovation, apprenez à vérifier la licence RBQ d'un entrepreneur et à vous protéger contre les fraudes.",
    date: "2026-02-15",
    category: "Entrepreneurs",
    readTime: "5 min",
    content: `
      <p>Faire appel à un entrepreneur pour des travaux de construction ou de rénovation est une décision importante. Au Québec, la <strong>Régie du bâtiment du Québec (RBQ)</strong> encadre l'industrie de la construction et exige que tout entrepreneur réalisant des travaux de plus de 1 000 $ détienne une licence valide. Mais comment s'assurer que l'entrepreneur que vous engagez est bel et bien en règle?</p>

      <h2>Pourquoi vérifier la licence RBQ?</h2>
      <p>Un entrepreneur sans licence vous expose à plusieurs risques. D'abord, les travaux réalisés par un entrepreneur non licencié ne sont <strong>pas couverts par le plan de garantie</strong> obligatoire. Ensuite, en cas de malfaçon, vos recours légaux sont limités. Enfin, vous pourriez être tenu responsable en tant que donneur d'ouvrage si un accident survient sur le chantier. La vérification prend quelques minutes et peut vous éviter des milliers de dollars en problèmes.</p>

      <h2>Les étapes pour vérifier un entrepreneur</h2>
      <p>La première étape consiste à demander le <strong>numéro de licence RBQ</strong> à l'entrepreneur. Ce numéro doit figurer sur tous ses documents officiels, y compris les soumissions et les contrats. Une fois le numéro en main, vous pouvez le vérifier directement sur le site de la RBQ ou utiliser un outil comme <strong>ClicZone ContractorCheck</strong> pour obtenir un portrait complet incluant l'historique des plaintes et le statut de la licence.</p>

      <h2>Ce qu'il faut vérifier au-delà de la licence</h2>
      <p>La licence active ne fait pas tout. Assurez-vous que les <strong>sous-catégories de la licence</strong> correspondent aux travaux que vous souhaitez faire réaliser. Un entrepreneur licencié en plomberie n'est pas nécessairement autorisé à faire de l'électricité. Vérifiez également si l'entrepreneur détient une <strong>assurance responsabilité</strong> et demandez des références de projets récents. Consultez le registre des plaintes de la RBQ pour voir si des plaintes ont été déposées contre lui. Ces précautions supplémentaires vous donneront une bien meilleure image de la fiabilité de l'entrepreneur.</p>
    `,
  },
  {
    slug: "zones-inondables-quebec-guide",
    title: "Zones inondables au Québec : guide complet",
    excerpt:
      "Tout ce que vous devez savoir sur les zones inondables au Québec : comment vérifier votre adresse, les impacts sur l'assurance et la valeur de votre propriété.",
    date: "2026-01-28",
    category: "Immobilier",
    readTime: "7 min",
    content: `
      <p>Les inondations sont le risque naturel le plus fréquent au Québec. Chaque printemps, des milliers de résidences sont touchées par la crue des eaux, particulièrement le long du fleuve Saint-Laurent et de ses affluents. Comprendre les zones inondables est essentiel, que vous soyez propriétaire ou à la recherche d'une nouvelle maison.</p>

      <h2>Les deux types de zones inondables</h2>
      <p>Le gouvernement du Québec classe les zones inondables en deux catégories principales. La <strong>zone 0-20 ans</strong> (aussi appelée zone de grand courant) correspond aux secteurs inondés en moyenne une fois tous les 20 ans. Dans cette zone, les nouvelles constructions sont généralement interdites et les rénovations majeures sont très encadrées. La <strong>zone 0-100 ans</strong> (zone de faible courant) est inondée en moyenne une fois par siècle. Les constructions y sont permises, mais des mesures d'immunisation sont obligatoires, comme le rehaussement du premier plancher au-dessus du niveau de crue centenaire.</p>

      <h2>Impact sur l'assurance et la valeur de la propriété</h2>
      <p>Être situé en zone inondable a des conséquences directes sur votre <strong>prime d'assurance habitation</strong>. Depuis 2020, plusieurs assureurs québécois offrent une couverture spécifique contre les inondations, mais les primes varient considérablement selon la zone de risque. En zone 0-20 ans, certaines compagnies refusent tout simplement de couvrir le risque d'inondation. Du côté de la valeur immobilière, une propriété en zone inondable peut perdre entre <strong>10 % et 30 %</strong> de sa valeur par rapport à une propriété similaire hors zone, surtout après un épisode d'inondation majeur.</p>

      <h2>Comment vérifier si votre adresse est en zone inondable</h2>
      <p>Plusieurs ressources sont à votre disposition. La carte interactive du <strong>ministère de l'Environnement du Québec</strong> permet de visualiser les zones de risque. Vous pouvez également consulter les schémas d'aménagement de votre MRC ou utiliser l'outil <strong>ClicZone FloodCheck</strong> pour obtenir un résultat instantané avec l'historique des crues pour votre adresse. Si vous êtes en processus d'achat, le notaire est tenu de vérifier si la propriété se trouve en zone inondable et de vous en informer. Prenez le temps de faire ces vérifications avant de signer une promesse d'achat, car les surprises dans ce domaine peuvent être très coûteuses.</p>
    `,
  },
  {
    slug: "trouver-place-garderie-quebec",
    title: "Comment trouver une place en garderie au Québec",
    excerpt:
      "Le guide pratique pour les parents québécois : inscription sur La Place 0-5, différences entre CPE et garderies privées, et astuces pour accélérer le processus.",
    date: "2026-02-05",
    category: "Familles",
    readTime: "6 min",
    content: `
      <p>Trouver une place en garderie au Québec est souvent décrit comme un véritable parcours du combattant. Avec plus de <strong>50 000 enfants</strong> sur les listes d'attente à travers la province, la demande dépasse largement l'offre, surtout dans les grandes villes comme Montréal, Québec et Gatineau. Voici un guide complet pour maximiser vos chances de décrocher une place.</p>

      <h2>La Place 0-5 : le guichet unique</h2>
      <p>La première étape incontournable est de vous inscrire sur <strong>La Place 0-5</strong> (laplace0-5.com), le guichet unique du gouvernement pour les demandes de places en services de garde. L'inscription est gratuite et vous permet de postuler simultanément à plusieurs garderies et CPE. Il est fortement recommandé de vous inscrire <strong>dès la grossesse confirmée</strong>, car les listes d'attente peuvent s'étendre sur 12 à 24 mois. Vous pouvez choisir jusqu'à dix services de garde dans votre demande et les classer par ordre de préférence.</p>

      <h2>CPE, garderie subventionnée ou garderie privée?</h2>
      <p>Le réseau québécois comprend trois types de services de garde. Les <strong>CPE (Centres de la petite enfance)</strong> sont des organismes à but non lucratif offrant des places à contribution réduite (9,10 $ par jour en 2026). Ils sont soumis à des normes strictes et sont généralement les plus recherchés. Les <strong>garderies subventionnées</strong> sont des entreprises privées offrant aussi des places à contribution réduite, au même tarif que les CPE. Enfin, les <strong>garderies privées non subventionnées</strong> fixent leurs propres tarifs, variant entre 35 $ et 65 $ par jour, mais offrent un crédit d'impôt qui réduit considérablement le coût réel.</p>

      <h2>Astuces pour accélérer le processus</h2>
      <p>Au-delà de l'inscription sur La Place 0-5, plusieurs stratégies peuvent améliorer vos chances. Contactez directement les garderies de votre quartier, car certaines places ne passent pas par le guichet unique. Élargissez votre zone géographique si possible : un CPE situé près de votre lieu de travail plutôt que de votre domicile peut être une excellente option. Renseignez-vous sur les <strong>milieux familiaux</strong>, qui sont des services de garde en résidence privée pouvant accueillir jusqu'à six enfants. Ils offrent souvent des places plus rapidement. Enfin, utilisez un outil comme <strong>ClicZone GarderieFind</strong> pour repérer les garderies avec des places disponibles près de chez vous en temps réel.</p>
    `,
  },
  {
    slug: "terrains-contamines-ce-quil-faut-savoir",
    title: "Terrains contaminés : ce qu'il faut savoir avant d'acheter",
    excerpt:
      "Guide essentiel pour les acheteurs : comment identifier un terrain contaminé, comprendre vos obligations légales et éviter les mauvaises surprises.",
    date: "2026-03-01",
    category: "Immobilier",
    readTime: "6 min",
    content: `
      <p>L'achat d'un terrain ou d'une propriété est l'un des investissements les plus importants dans une vie. Or, au Québec, plus de <strong>9 000 terrains</strong> figurent dans l'inventaire officiel des terrains contaminés du ministère de l'Environnement (MELCCFP). Que vous achetiez un terrain vacant pour y construire ou une propriété existante, la vérification du statut environnemental est une étape que vous ne pouvez pas négliger.</p>

      <h2>Qu'est-ce qu'un terrain contaminé?</h2>
      <p>Un terrain est considéré comme contaminé lorsque la concentration de certaines substances dans le sol ou les eaux souterraines dépasse les <strong>critères établis par le MELCCFP</strong>. Les sources de contamination sont variées : anciennes stations-service, sites industriels, dépotoirs, ateliers mécaniques, nettoyeurs à sec, et bien d'autres. Les contaminants les plus fréquents comprennent les <strong>hydrocarbures pétroliers</strong>, les métaux lourds (plomb, arsenic, chrome) et les composés organiques volatils. Même un terrain résidentiel peut être contaminé si une activité polluante s'y est déroulée par le passé.</p>

      <h2>Vos obligations légales en tant qu'acheteur</h2>
      <p>Au Québec, la <strong>Loi sur la qualité de l'environnement</strong> prévoit que le propriétaire d'un terrain contaminé est responsable de sa décontamination, même s'il n'a pas causé la contamination. Cette règle, souvent appelée le principe du « pollueur-payeur élargi », signifie qu'en achetant un terrain contaminé, vous pourriez hériter d'une facture de décontamination pouvant atteindre <strong>des centaines de milliers de dollars</strong>. Le notaire a l'obligation de vérifier le registre des terrains contaminés et de vous en informer, mais une recherche proactive de votre part est fortement recommandée.</p>

      <h2>Comment se protéger</h2>
      <p>Avant de signer une promesse d'achat, consultez le <strong>répertoire des terrains contaminés</strong> du MELCCFP ou utilisez l'outil <strong>ClicZone TerraCheck</strong> pour une vérification instantanée. Si le terrain a un historique industriel ou commercial, exigez une <strong>étude environnementale de phase I</strong> (revue documentaire) et, si nécessaire, une <strong>phase II</strong> (échantillonnage du sol). Incluez une clause conditionnelle à la promesse d'achat stipulant que la vente est sujette à des résultats environnementaux satisfaisants. Ces précautions peuvent vous éviter des dépenses considérables et des années de procédures juridiques.</p>
    `,
  },
  {
    slug: "salaires-quebec-2026",
    title: "Salaires au Québec en 2026 : les métiers les mieux payés",
    excerpt:
      "Découvrez les métiers les mieux rémunérés au Québec en 2026, les tendances salariales par région et des conseils pour négocier votre salaire.",
    date: "2026-03-05",
    category: "Emploi",
    readTime: "5 min",
    content: `
      <p>Le marché de l'emploi québécois continue d'évoluer rapidement en 2026. La pénurie de main-d'œuvre dans plusieurs secteurs pousse les salaires à la hausse, créant des opportunités intéressantes pour les travailleurs qualifiés. Voici un portrait des métiers les mieux payés et des tendances salariales à surveiller cette année.</p>

      <h2>Les métiers les mieux rémunérés en 2026</h2>
      <p>Sans surprise, le secteur de la <strong>technologie</strong> continue de dominer le palmarès. Les développeurs logiciels séniors gagnent entre 95 000 $ et 140 000 $ par année, tandis que les spécialistes en intelligence artificielle et en science des données peuvent dépasser les 150 000 $. Le secteur de la <strong>santé</strong> offre également des salaires compétitifs : les médecins spécialistes dépassent les 300 000 $, les pharmaciens se situent autour de 110 000 $ et les infirmières praticiennes spécialisées atteignent environ 95 000 $. Dans la <strong>construction</strong>, les métiers spécialisés comme les grutiers (85 000 $ à 110 000 $) et les électriciens industriels (75 000 $ à 100 000 $) connaissent une forte demande. Enfin, les <strong>ingénieurs</strong> en génie civil, mécanique et électrique gagnent entre 80 000 $ et 120 000 $ selon leur expérience.</p>

      <h2>Les écarts régionaux</h2>
      <p>Les salaires varient considérablement d'une région à l'autre au Québec. <strong>Montréal</strong> offre généralement les salaires les plus élevés, avec une prime de 10 à 20 % par rapport à la moyenne provinciale, particulièrement dans les secteurs de la finance et de la technologie. <strong>Québec</strong> se démarque dans le secteur public et les technologies de l'information. Toutefois, il est essentiel de considérer le <strong>coût de la vie</strong> : un salaire de 70 000 $ à Trois-Rivières peut offrir un meilleur pouvoir d'achat qu'un salaire de 85 000 $ à Montréal, compte tenu de la différence de prix des logements.</p>

      <h2>Comment utiliser ces données pour négocier</h2>
      <p>Connaître sa valeur sur le marché est la clé d'une négociation salariale réussie. Utilisez l'outil <strong>ClicZone SalaireLab</strong> pour consulter les salaires médians de votre métier dans votre région. Visez le <strong>75e percentile</strong> si vous avez plusieurs années d'expérience pertinente. Préparez des arguments concrets basés sur vos réalisations et la valeur que vous apportez à l'entreprise. N'oubliez pas de négocier l'ensemble de la rémunération, incluant les avantages sociaux, le télétravail, les vacances supplémentaires et les possibilités de formation. Ces éléments peuvent représenter jusqu'à 30 % de la valeur totale de votre rémunération.</p>
    `,
  },
];

export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
