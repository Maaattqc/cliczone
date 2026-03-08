import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | ClicZone",
  description:
    "Politique de confidentialité de ClicZone. Découvrez comment nous protégeons vos données personnelles conformément à la Loi 25 du Québec.",
};

export default function ConfidentialitePage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Politique de confidentialité
      </h1>

      <p className="text-muted-foreground leading-relaxed">
        La présente politique de confidentialité décrit comment MF Digital, opérateur
        du site ClicZone (cliczone.ca), collecte, utilise et protège vos renseignements
        personnels, conformément à la Loi sur la protection des renseignements personnels
        dans le secteur privé du Québec (Loi 25).
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Données collectées</h2>
        <p className="text-muted-foreground leading-relaxed">
          Nous pouvons collecter les renseignements suivants lorsque vous utilisez
          nos services :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>
            Informations de navigation : adresse IP, type de navigateur, pages visitées,
            durée de la visite
          </li>
          <li>
            Informations fournies volontairement : nom, adresse courriel et tout
            renseignement soumis via nos formulaires de contact
          </li>
          <li>
            Données de recherche : les termes et adresses recherchés dans nos outils
            (sans association à votre identité)
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Utilisation des données</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les renseignements collectés sont utilisés aux fins suivantes :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>Fournir et améliorer nos services</li>
          <li>Répondre à vos demandes et communications</li>
          <li>Analyser l&apos;utilisation du site pour en améliorer la performance</li>
          <li>Assurer la sécurité et le bon fonctionnement de la plateforme</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cookies et technologies de suivi</h2>
        <p className="text-muted-foreground leading-relaxed">
          ClicZone utilise des cookies et des technologies similaires pour améliorer
          votre expérience de navigation. Ces cookies peuvent inclure :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>
            <strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site
          </li>
          <li>
            <strong>Cookies analytiques :</strong> pour mesurer l&apos;audience et
            comprendre comment les visiteurs utilisent le site
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant,
          certaines fonctionnalités du site pourraient ne plus fonctionner correctement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Partage avec des tiers</h2>
        <p className="text-muted-foreground leading-relaxed">
          Nous ne vendons ni ne louons vos renseignements personnels à des tiers.
          Nous pouvons partager certaines données avec des fournisseurs de services
          qui nous aident à exploiter le site (hébergement, analytique), dans le respect
          de la confidentialité de vos renseignements. Ces fournisseurs sont tenus par
          des obligations de confidentialité.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Conservation des données</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vos renseignements personnels sont conservés uniquement pour la durée
          nécessaire aux fins pour lesquelles ils ont été collectés. Les données
          de navigation sont conservées pour une période maximale de 12 mois. Les
          données de contact sont conservées jusqu&apos;au traitement complet de
          votre demande, puis supprimées dans un délai raisonnable.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Vos droits</h2>
        <p className="text-muted-foreground leading-relaxed">
          Conformément à la Loi 25 du Québec, vous disposez des droits suivants
          concernant vos renseignements personnels :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>Droit d&apos;accès à vos renseignements personnels</li>
          <li>Droit de rectification des renseignements inexacts</li>
          <li>Droit de retirer votre consentement à tout moment</li>
          <li>Droit à la portabilité de vos données</li>
          <li>Droit de déposer une plainte auprès de la Commission d&apos;accès à
            l&apos;information du Québec</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Nous contacter</h2>
        <p className="text-muted-foreground leading-relaxed">
          Pour toute question relative à la présente politique de confidentialité ou
          pour exercer vos droits, vous pouvez nous contacter à l&apos;adresse suivante :
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
