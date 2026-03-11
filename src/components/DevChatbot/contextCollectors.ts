// Types
export interface InspectedElementSnapshot {
  tag: string;
  id: string;
  classes: string[];
  textContent: string;
  attributes: Record<string, string>;
  boundingRect: { x: number; y: number; width: number; height: number };
  computedStyles: {
    color: string; backgroundColor: string;
    fontSize: string; fontWeight: string;
    padding: string; margin: string;
    display: string; position: string;
    borderRadius: string; border: string;
  };
  parentTag: string;
  childCount: number;
  cssSelector: string;
  nearestHref: string;
  siblingTexts: string[];
  sourceHint: string;
}

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

function buildCssSelector(el: HTMLElement): string {
  if (el.id) return `#${CSS.escape(el.id)}`;

  // Build a selector part for a single element
  function selectorPart(node: HTMLElement): string {
    const tag = node.tagName.toLowerCase();
    if (node.id) return `#${CSS.escape(node.id)}`;

    let part = tag;

    // Add up to 4 classes
    const classes = Array.from(node.classList).slice(0, 4);
    for (const cls of classes) {
      part += `.${CSS.escape(cls)}`;
    }

    // Add data-* attributes as discriminants
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      if (attr.name.startsWith("data-") && attr.name !== "data-chatbot" && attr.name !== "data-chatbot-preview") {
        part += `[${attr.name}="${CSS.escape(attr.value)}"]`;
        break; // one data attr is enough
      }
    }

    // Add :nth-of-type if there are siblings of the same tag
    const parent = node.parentElement;
    if (parent) {
      const sameTagSiblings = Array.from(parent.children).filter(
        (child) => child.tagName === node.tagName
      );
      if (sameTagSiblings.length > 1) {
        const index = sameTagSiblings.indexOf(node) + 1;
        part += `:nth-of-type(${index})`;
      }
    }

    return part;
  }

  // Build selector bottom-up, up to 5 levels, stopping when unique
  const parts: string[] = [];
  let current: HTMLElement | null = el;
  let depth = 0;

  while (current && current !== document.body && current !== document.documentElement && depth < 5) {
    if (current.id) {
      parts.unshift(`#${CSS.escape(current.id)}`);
      break;
    }
    parts.unshift(selectorPart(current));
    depth++;

    // Test uniqueness
    const candidate = parts.join(" > ");
    try {
      if (document.querySelectorAll(candidate).length === 1) {
        return candidate;
      }
    } catch {
      // invalid selector, keep going
    }

    current = current.parentElement;
  }

  return parts.join(" > ");
}

function parentSummary(el: HTMLElement): string {
  const parent = el.parentElement;
  if (!parent || parent === document.body) return "body";
  const tag = parent.tagName.toLowerCase();
  const id = parent.id ? `#${parent.id}` : "";
  const cls = parent.classList.length > 0 ? `.${Array.from(parent.classList).slice(0, 2).join(".")}` : "";
  return `${tag}${id}${cls}`;
}

/**
 * Walk up from el to find the nearest <a> href.
 */
function findNearestHref(el: HTMLElement): string {
  let current: HTMLElement | null = el;
  for (let i = 0; i < 5 && current; i++) {
    if (current.tagName === "A" && (current as HTMLAnchorElement).href) {
      // Return the pathname portion, which matches source code (href="/a-propos")
      try {
        return new URL((current as HTMLAnchorElement).href).pathname;
      } catch {
        return (current as HTMLAnchorElement).getAttribute("href") || "";
      }
    }
    current = current.parentElement;
  }
  return "";
}

/**
 * Get text content of siblings to help locate element in source code.
 */
function getSiblingTexts(el: HTMLElement): string[] {
  const parent = el.parentElement;
  if (!parent) return [];
  const texts: string[] = [];
  for (const child of Array.from(parent.children)) {
    if (child === el) continue;
    const text = (child.textContent || "").trim().slice(0, 80);
    if (text) texts.push(text);
  }
  return texts.slice(0, 3);
}

/**
 * Build a "source hint" — search the loaded source files for the text content
 * to help Claude know which file + approximate location.
 */
function buildSourceHint(el: HTMLElement): string {
  const text = (el.textContent || "").trim();
  if (!text || text.length > 100) return "";

  // Try to find a nearby ancestor with a recognizable structure
  const hints: string[] = [];

  // The direct text is the most useful identifier
  hints.push(`Texte: "${text}"`);

  // Check for nearby href
  const href = findNearestHref(el);
  if (href) hints.push(`Lien: href="${href}"`);

  // Check for variant/size props visible as data attributes or aria
  const parent = el.parentElement;
  if (parent) {
    const parentText = (parent.textContent || "").trim().slice(0, 200);
    if (parentText !== text) {
      hints.push(`Contexte parent: "${parentText.slice(0, 100)}"`);
    }
  }

  return hints.join(" | ");
}

export function extractElementSnapshot(el: HTMLElement): InspectedElementSnapshot {
  const rect = el.getBoundingClientRect();
  const cs = window.getComputedStyle(el);

  const attributes: Record<string, string> = {};
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (["class", "id", "style"].includes(attr.name)) continue;
    attributes[attr.name] = attr.value;
  }

  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || "",
    classes: Array.from(el.classList),
    textContent: (el.textContent || "").trim().slice(0, 300),
    attributes,
    boundingRect: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    nearestHref: findNearestHref(el),
    siblingTexts: getSiblingTexts(el),
    sourceHint: buildSourceHint(el),
    computedStyles: {
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      padding: cs.padding,
      margin: cs.margin,
      display: cs.display,
      position: cs.position,
      borderRadius: cs.borderRadius,
      border: cs.border,
    },
    parentTag: parentSummary(el),
    childCount: el.children.length,
    cssSelector: buildCssSelector(el),
  };
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
