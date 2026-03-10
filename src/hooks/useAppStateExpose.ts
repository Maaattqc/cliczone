"use client";

import { useEffect } from "react";

export function useAppStateExpose(state: Record<string, unknown>) {
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__APP_STATE__ = state;
    return () => {
      delete (window as unknown as Record<string, unknown>).__APP_STATE__;
    };
  }, [state]);
}
