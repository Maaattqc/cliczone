import Link from "next/link";

const toolLinks = [
  { href: "/verifier-entrepreneur", label: "ContractorCheck" },
  { href: "/zone-inondable", label: "FloodCheck" },
  { href: "/terrain-contamine", label: "TerraCheck" },
  { href: "/garderies", label: "GarderieFind" },
  { href: "/salaires", label: "SalaireLab" },
];

const categoryLinks = [
  { href: "/immobilier", label: "Immobilier" },
  { href: "/entrepreneurs", label: "Entrepreneurs" },
  { href: "/familles", label: "Familles" },
  { href: "/emploi", label: "Emploi" },
];

const legalLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/conditions", label: "Conditions d\u2019utilisation" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      {/* Gold accent line */}
      <div className="h-px gold-gradient" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white font-bold text-xs">
                CZ
              </div>
              <span className="text-lg font-bold tracking-tight">ClicZone</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plateforme de données publiques du Québec. Accédez aux registres officiels
              en quelques clics.
            </p>
            <p className="text-xs text-muted-foreground">
              Un produit MF Digital
            </p>
          </div>

          {/* Outils */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Outils
            </p>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Catégories
            </p>
            <ul className="space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Informations
            </p>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MF Digital. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Données sous licence CC-BY 4.0 de donneesquebec.ca
          </p>
        </div>
      </div>
    </footer>
  );
}
