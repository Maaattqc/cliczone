import { useCallback } from "react";
import {
  getNavigation,
  getVisibleForms,
  getVisibleTables,
  getVisibleButtons,
  getActiveElement,
  getVisibleErrors,
  captureScreenshot,
} from "./contextCollectors";
import type { ButtonSnapshot } from "./contextCollectors";

export interface AppContext {
  navigation: ReturnType<typeof getNavigation>;
  forms: ReturnType<typeof getVisibleForms>;
  tables: ReturnType<typeof getVisibleTables>;
  buttons: ButtonSnapshot[];
  appState: Record<string, unknown>;
  activeElement: ReturnType<typeof getActiveElement>;
  errors: string[];
  timestamp: string;
}

export function useAppContext() {
  const collectContext = useCallback((): AppContext => ({
    navigation: getNavigation(),
    forms: getVisibleForms(),
    tables: getVisibleTables(),
    buttons: getVisibleButtons(),
    appState: (window as unknown as Record<string, unknown>).__APP_STATE__ as Record<string, unknown> || {},
    activeElement: getActiveElement(),
    errors: getVisibleErrors(),
    timestamp: new Date().toISOString(),
  }), []);

  return { collectContext, captureScreenshot };
}
