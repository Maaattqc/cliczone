import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { generateOrganizationSchema } from "@/lib/seo/structured-data";
import { DevChatbot } from "@/components/DevChatbot";
import { AppStateProvider } from "@/components/AppStateProvider";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
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
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${dmSans.variable} ${instrumentSerif.variable} antialiased`}>
        <ClerkProvider localization={frFR}>
          <AppStateProvider>
            <JsonLd data={generateOrganizationSchema()} />
            <Navbar />
            {children}
            <Footer />
            <DevChatbot />
          </AppStateProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
