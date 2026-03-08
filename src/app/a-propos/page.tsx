import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | ClicZone",
  description:
    "Découvrez ClicZone, la plateforme qui rend les données publiques du Québec accessibles et utiles à tous. Un projet de MF Digital.",
};

export default function AProposPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        À propos de ClicZone
      </h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Notre mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          ClicZone a pour mission de rendre les données publiques du Québec accessibles
          et utiles à tous. Nous croyons que chaque citoyen devrait pouvoir accéder
          facilement aux informations qui le concernent, sans avoir à naviguer dans des
          bases de données complexes ou des sites gouvernementaux fragmentés.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Comment ça fonctionne</h2>
        <p className="text-muted-foreground leading-relaxed">
          ClicZone agrège et simplifie les données provenant de sources officielles
          québécoises. Nos outils interrogent les registres publics et vous présentent
          l&apos;information de manière claire et instantanée.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Nous utilisons les données ouvertes de plusieurs organismes, notamment :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>
            <strong>Données Québec</strong> (donneesquebec.ca) — le portail de données
            ouvertes du gouvernement du Québec
          </li>
          <li>
            <strong>Régie du bâtiment du Québec</strong> (RBQ) — registre des
            entrepreneurs licenciés
          </li>
          <li>
            <strong>Ministère de l&apos;Environnement</strong> (MELCCFP) — inventaire
            des terrains contaminés et zones inondables
          </li>
          <li>
            <strong>Emploi-Québec</strong> — données salariales et perspectives
            d&apos;emploi par métier et par région
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sources de données</h2>
        <p className="text-muted-foreground leading-relaxed">
          Toutes les données présentées sur ClicZone proviennent de sources officielles
          et sont mises à jour régulièrement. Les données ouvertes du gouvernement du
          Québec sont diffusées sous licence Creative Commons Attribution 4.0 (CC-BY 4.0).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          ClicZone ne modifie pas les données sources. Nous les présentons de manière
          simplifiée pour en faciliter la compréhension. Pour les données brutes,
          nous vous invitons à consulter directement les sites officiels des organismes
          concernés.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">MF Digital</h2>
        <p className="text-muted-foreground leading-relaxed">
          ClicZone est un projet développé par MF Digital, une entreprise québécoise
          spécialisée dans le développement de solutions numériques. Notre objectif est
          de créer des outils web performants et accessibles qui facilitent le quotidien
          des Québécois.
        </p>
      </section>
    </main>
  );
}
