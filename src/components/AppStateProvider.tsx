"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAppStateExpose } from "@/hooks/useAppStateExpose";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const state = useMemo(
    () => ({
      currentPage: pathname,
    }),
    [pathname]
  );

  useAppStateExpose(state);

  return <>{children}</>;
}
