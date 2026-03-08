import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact | ClicZone",
  description:
    "Contactez l'équipe ClicZone. Posez vos questions, signalez un problème ou faites-nous part de vos suggestions.",
};

export default function ContactPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Nous contacter
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Une question, une suggestion ou un problème? N&apos;hésitez pas à nous
          écrire. Nous vous répondrons dans les meilleurs délais.
        </p>
      </section>

      {/* Contact info */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Coordonnées</h2>
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

      {/* Contact form placeholder */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Formulaire de contact</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Envoyez-nous un message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="nom"
                  className="text-sm font-medium leading-none"
                >
                  Nom
                </label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder="Votre nom"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="courriel"
                  className="text-sm font-medium leading-none"
                >
                  Courriel
                </label>
                <Input
                  id="courriel"
                  name="courriel"
                  type="email"
                  placeholder="votre@courriel.ca"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium leading-none"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Votre message"
                  disabled
                  className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button disabled>Envoyer</Button>
                <p className="text-sm text-muted-foreground">
                  Formulaire bientôt disponible
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
