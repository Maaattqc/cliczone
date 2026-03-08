import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { generateOrganizationSchema } from "@/lib/seo/structured-data";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ClicZone — Données publiques du Québec",
    template: "%s | ClicZone",
  },
  description:
    "100+ outils basés sur les données ouvertes du Québec. Vérifiez un entrepreneur, une zone inondable, un terrain contaminé et plus.",
  metadataBase: new URL("https://cliczone.ca"),
  alternates: {
    languages: { "fr-CA": "https://cliczone.ca" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} antialiased`}>
        <ClerkProvider localization={frFR}>
          <JsonLd data={generateOrganizationSchema()} />
          <Navbar />
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
