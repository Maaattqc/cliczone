"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlaskConical, Send, CheckCircle2 } from "lucide-react";

interface TestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestFormModal({ open, onOpenChange }: TestFormModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleClose(v: boolean) {
    if (!v) {
      // Reset on close
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setMessage("");
      }, 200);
    }
    onOpenChange(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate sending — no backend endpoint yet
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-violet-500" />
            Programme Beta
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="font-medium text-foreground">Merci pour votre inscription !</p>
            <p className="text-sm text-muted-foreground">
              Nous vous contacterons lorsque de nouvelles fonctionnalites seront disponibles.
            </p>
            <Button variant="outline" size="sm" onClick={() => handleClose(false)} className="mt-2">
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Inscrivez-vous pour tester les nouvelles fonctionnalites en avant-premiere.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                placeholder="Commentaires ou suggestions (optionnel)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <Button type="submit" disabled={loading || !email.trim()} className="w-full gap-2">
              <Send className="h-4 w-4" />
              {loading ? "Envoi..." : "S'inscrire au beta"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
