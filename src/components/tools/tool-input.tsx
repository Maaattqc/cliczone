"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ToolInput({
  placeholder,
  onSubmit,
}: {
  placeholder: string;
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      setSubmitted(true);
      onSubmit?.(value.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-10 h-11"
          aria-label={placeholder}
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto h-11">
        Vérifier maintenant
      </Button>
    </form>
  );
}
