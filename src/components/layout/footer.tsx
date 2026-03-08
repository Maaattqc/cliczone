import Link from "next/link";

const toolLinks = [
  { href: "/verifier-entrepreneur", label: "ContractorCheck" },
  { href: "/zone-inondable", label: "FloodCheck" },
  { href: "/terrain-contamine", label: "TerraCheck" },
  { href: "/garderies", label: "GarderieFind" },
  { href: "/salaires", label: "SalaireLab" },
  { href: "/zonage", label: "ZonageExpress" },
  { href: "/permis-construction", label: "AlertePermis" },
  { href: "/renovation-prix", label: "RenoPrix" },
];

const categoryLinks = [
  { href: "/immobilier", label: "Immobilier" },
  { href: "/entrepreneurs", label: "Entrepreneurs" },
  { href: "/familles", label: "Familles" },
  { href: "/emploi", label: "Emploi" },
  { href: "/environnement", label: "Environnement" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-primary">ClicZone</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Donnees publiques du Quebec, simplifiees.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              MF Digital
            </p>
          </div>

          {/* Outils populaires */}
          <div>
            <p className="text-sm font-semibold">Outils populaires</p>
            <ul className="mt-3 space-y-2">
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

          {/* Categories */}
          <div>
            <p className="text-sm font-semibold">Categories</p>
            <ul className="mt-3 space-y-2">
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

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold">Informations</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/a-propos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  A propos
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Confidentialite
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MF Digital. Tous droits reserves. Donnees
          sous licence CC-BY 4.0 de donneesquebec.ca.
        </div>
      </div>
    </footer>
  );
}
