"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Search } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "./search-dialog";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const links = [
    { href: "/immobilier", label: "Immobilier" },
    { href: "/entrepreneurs", label: "Entrepreneurs" },
    { href: "/familles", label: "Familles" },
    { href: "/emploi", label: "Emploi" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <>
      {/* Top accent bar */}
      <div className="h-1 gold-gradient" />

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white font-bold text-sm transition-transform group-hover:scale-105 shadow-sm">
              CZ
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-foreground">
                ClicZone
              </span>
              <span className="hidden lg:inline text-xs text-muted-foreground ml-2 border-l pl-2 border-border">
                Données du Québec
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
<Button
              variant="ghost"
              size="sm"
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
              className="gap-2 text-muted-foreground"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline text-xs">Rechercher</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Ctrl K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Changer le thème"
            >
              {dark ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            <div className="hidden sm:flex items-center gap-1.5 ml-1 pl-1.5 border-l border-border">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button size="sm" className="font-medium bg-blue-700 hover:bg-blue-800 text-white border-0 shadow-sm">
                    Connexion
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button size="sm" className="w-full font-medium bg-blue-700 hover:bg-blue-800 text-white border-0">
                    Connexion
                  </Button>
                </SignInButton>
              </Show>
            </div>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
