// Types
export interface FieldSnapshot {
  name: string;
  type: string;
  value: string;
  placeholder: string;
  required: boolean;
  hasError: boolean;
}

export interface FormSnapshot {
  id: string;
  fields: FieldSnapshot[];
}

export interface TableSnapshot {
  id: string;
  headers: string[];
  rowCount: number;
  selectedRow: Record<string, string> | null;
}

export interface ElementSnapshot {
  tag: string;
  id: string;
  name: string;
  type: string;
}

export interface ButtonSnapshot {
  text: string;
  type: string | null;
  id: string;
  className: string;
  disabled: boolean;
}

export interface NavigationSnapshot {
  route: string;
  title: string;
  activeTab: string | null;
}

// Champs sensibles à filtrer
const SENSITIVE_PATTERNS = /password|passwd|token|secret|credit.?card|cvv|ssn|sin/i;
const MAX_VALUE_LENGTH = 200;

function isVisible(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    el.offsetParent !== null
  );
}

function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

function sanitizeValue(value: string, fieldName: string, fieldType: string): string {
  if (fieldType === "password" || SENSITIVE_PATTERNS.test(fieldName)) {
    return "[FILTERED]";
  }
  if (value.length > MAX_VALUE_LENGTH) {
    return value.slice(0, MAX_VALUE_LENGTH) + "…";
  }
  return value;
}

export function getNavigation(): NavigationSnapshot {
  const route = window.location.pathname + window.location.search;
  const title = document.title;

  // Try to find active tab/nav item
  const activeTab =
    document.querySelector('[aria-selected="true"]')?.textContent?.trim() ||
    document.querySelector(".active, [data-state='active']")?.textContent?.trim() ||
    null;

  return { route, title, activeTab };
}

export function getVisibleForms(): FormSnapshot[] {
  const forms = Array.from(document.querySelectorAll("form"));
  const results: FormSnapshot[] = [];

  for (const form of forms) {
    if (!isVisible(form as HTMLElement)) continue;

    const fields: FieldSnapshot[] = [];
    const inputs = form.querySelectorAll("input, select, textarea");

    for (const input of Array.from(inputs)) {
      const el = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const name = el.name || el.id || "";
      const type = (el as HTMLInputElement).type || el.tagName.toLowerCase();

      if (type === "hidden") continue;

      fields.push({
        name,
        type,
        value: sanitizeValue(el.value || "", name, type),
        placeholder: (el as HTMLInputElement).placeholder || "",
        required: el.required,
        hasError:
          el.getAttribute("aria-invalid") === "true" ||
          el.classList.contains("error") ||
          el.classList.contains("is-invalid"),
      });
    }

    results.push({
      id: form.id || form.getAttribute("name") || `form-${results.length}`,
      fields,
    });
  }

  return results;
}

export function getVisibleTables(): TableSnapshot[] {
  const tables = Array.from(document.querySelectorAll("table"));
  const results: TableSnapshot[] = [];

  for (const table of tables) {
    if (!isVisible(table as HTMLElement)) continue;

    const headers = Array.from(table.querySelectorAll("th")).map(
      (th) => th.textContent?.trim() || ""
    );

    const rows = table.querySelectorAll("tbody tr");
    const selectedRow = table.querySelector("tr[aria-selected='true'], tr.selected");

    let selectedData: Record<string, string> | null = null;
    if (selectedRow) {
      const cells = Array.from(selectedRow.querySelectorAll("td"));
      selectedData = {};
      cells.forEach((cell, i) => {
        const key = headers[i] || `col-${i}`;
        selectedData![key] = cell.textContent?.trim() || "";
      });
    }

    results.push({
      id: table.id || `table-${results.length}`,
      headers,
      rowCount: rows.length,
      selectedRow: selectedData,
    });
  }

  return results;
}

export function getActiveElement(): ElementSnapshot | null {
  const el = document.activeElement;
  if (!el || el === document.body) return null;

  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || "",
    name: (el as HTMLInputElement).name || "",
    type: (el as HTMLInputElement).type || "",
  };
}

export function getVisibleButtons(): ButtonSnapshot[] {
  const elements = Array.from(document.querySelectorAll("button, a[href]"));
  return elements
    .filter((el) => isInViewport(el) && isVisible(el as HTMLElement))
    .map((el) => ({
      text: el.textContent?.trim() || "",
      type: el.getAttribute("type"),
      id: el.id,
      className: el.className,
      disabled: (el as HTMLButtonElement).disabled || false,
    }));
}

export async function captureScreenshot(): Promise<string | null> {
  try {
    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(document.body, {
      scale: 0.35,
      logging: false,
      useCORS: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: window.innerHeight,
      height: window.innerHeight,
      y: window.scrollY,
      // Exclure le chatbot du screenshot sans toucher au DOM
      ignoreElements: (el: Element) => el.hasAttribute("data-chatbot"),
    });

    const base64 = canvas.toDataURL("image/jpeg", 0.4).split(",")[1];

    if (base64.length > 800_000) {
      console.warn("Screenshot trop volumineux, ignoré:", Math.round(base64.length / 1024), "KB");
      return null;
    }

    return base64;
  } catch (e) {
    console.warn("Screenshot échoué:", e);
    return null;
  }
}

export function getVisibleErrors(): string[] {
  const selectors = [
    '[role="alert"]',
    ".error-message",
    ".alert-danger",
    ".text-red-500",
    ".text-destructive",
    "[data-error]",
    ".field-error",
    ".form-error",
  ];

  const errors: string[] = [];
  const seen = new Set<string>();

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const el of Array.from(elements)) {
      const htmlEl = el as HTMLElement;
      if (!isVisible(htmlEl)) continue;
      const text = htmlEl.textContent?.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        errors.push(text);
      }
    }
  }

  return errors;
}
