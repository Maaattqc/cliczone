"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/actions/checkout";

interface CheckoutButtonProps {
  toolSlug: string;
  searchQuery: string;
  label?: string;
  className?: string;
}

export function CheckoutButton({
  toolSlug,
  searchQuery,
  label = "Obtenir le rapport",
  className,
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!searchQuery.trim()) return;

    startTransition(async () => {
      const result = await createCheckoutSession(toolSlug, searchQuery);
      if (result.success) {
        window.location.href = result.url;
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending || !searchQuery.trim()}
      className={className}
      size="lg"
    >
      {isPending ? "Redirection..." : label}
    </Button>
  );
}
