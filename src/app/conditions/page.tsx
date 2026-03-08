import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | ClicZone",
  description:
    "Conditions d'utilisation du site ClicZone. Lisez les règles qui encadrent l'utilisation de nos outils et services.",
};

export default function ConditionsPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Conditions d&apos;utilisation
      </h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Acceptation des conditions</h2>
        <p className="text-muted-foreground leading-relaxed">
          En accédant au site ClicZone (cliczone.ca) et en utilisant nos services,
          vous acceptez d&apos;être lié par les présentes conditions d&apos;utilisation.
          Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le site.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Description du service</h2>
        <p className="text-muted-foreground leading-relaxed">
          ClicZone est une plateforme qui simplifie l&apos;accès aux données publiques
          du Québec. Nos outils permettent de consulter des informations provenant de
          registres officiels, notamment les zones inondables, les terrains contaminés,
          les licences d&apos;entrepreneurs, les places en garderie et les données
          salariales.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Utilisation du service</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vous vous engagez à utiliser ClicZone de manière conforme aux lois applicables
          et aux présentes conditions. Il est interdit de :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>Utiliser le site à des fins illégales ou non autorisées</li>
          <li>Tenter d&apos;accéder de manière non autorisée à nos systèmes</li>
          <li>Reproduire, copier ou revendre le service sans autorisation écrite</li>
          <li>
            Utiliser des robots, scrapers ou tout autre moyen automatisé pour extraire
            les données du site de manière excessive
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Données publiques</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les données présentées sur ClicZone proviennent de sources publiques et
          ouvertes, principalement du portail Données Québec (donneesquebec.ca).
          Ces données sont diffusées par le gouvernement du Québec sous licence
          Creative Commons Attribution 4.0 International (CC-BY 4.0).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          ClicZone présente ces données de manière simplifiée à des fins
          d&apos;information. Pour les données brutes et officielles, veuillez
          consulter directement les sites des organismes sources.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Limitation de responsabilité</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les informations fournies par ClicZone sont présentées à titre informatif
          uniquement et ne constituent en aucun cas un avis juridique, professionnel
          ou financier. MF Digital ne garantit pas l&apos;exactitude, l&apos;exhaustivité
          ou l&apos;actualité des données affichées.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          MF Digital ne pourra être tenu responsable des dommages directs ou indirects
          résultant de l&apos;utilisation des informations présentées sur le site. Les
          utilisateurs sont encouragés à vérifier les informations auprès des sources
          officielles avant de prendre toute décision.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Propriété intellectuelle</h2>
        <p className="text-muted-foreground leading-relaxed">
          Le site ClicZone, son design, son code source, ses logos et ses textes
          originaux sont la propriété de MF Digital. Toute reproduction, distribution
          ou utilisation non autorisée est strictement interdite.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Les données publiques présentées sur le site demeurent la propriété de
          leurs sources respectives et sont soumises à leurs propres conditions
          de licence.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Modifications</h2>
        <p className="text-muted-foreground leading-relaxed">
          MF Digital se réserve le droit de modifier les présentes conditions
          d&apos;utilisation à tout moment. Les modifications entreront en vigueur
          dès leur publication sur cette page. Nous vous encourageons à consulter
          régulièrement cette page pour rester informé des éventuelles mises à jour.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Droit applicable</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les présentes conditions d&apos;utilisation sont régies par les lois en
          vigueur dans la province de Québec, Canada. Tout litige relatif à
          l&apos;utilisation du site sera soumis à la compétence exclusive des
          tribunaux du Québec.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Nous contacter</h2>
        <p className="text-muted-foreground leading-relaxed">
          Pour toute question relative aux présentes conditions d&apos;utilisation,
          vous pouvez nous contacter à l&apos;adresse suivante :
        </p>
        <p className="text-muted-foreground">
          <strong>MF Digital</strong>
          <br />
          Courriel :{" "}
          <a
            href="mailto:contact@cliczone.ca"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            contact@cliczone.ca
          </a>
        </p>
      </section>
    </main>
  );
}
