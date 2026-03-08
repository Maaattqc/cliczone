"use client";

import { Button } from "@/components/ui/button";

export function ScrollToSearchButton() {
  return (
    <Button
      className="w-full sm:w-auto mt-4"
      size="lg"
      onClick={() => {
        const input = document.querySelector<HTMLInputElement>(
          "input[type='text']"
        );
        if (input) {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
          input.focus();
        }
      }}
    >
      Effectuer une recherche
    </Button>
  );
}
