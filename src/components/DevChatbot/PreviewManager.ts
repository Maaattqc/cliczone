export function injectPreviewCSS(css: string): () => void {
  const style = document.createElement("style");
  style.setAttribute("data-chatbot-preview", "true");
  style.textContent = css;
  document.head.appendChild(style);
  return () => style.remove();
}

export function clearAllPreviews() {
  document
    .querySelectorAll("[data-chatbot-preview]")
    .forEach((el) => el.remove());
}

/**
 * Replaces the selector of each CSS rule with the unique selector of the inspected element.
 * This ensures the preview only affects the targeted element.
 */
export function scopeCSSToSelector(css: string, uniqueSelector: string): string {
  try {
    return css.replace(/([^{}]+)\{([^}]+)\}/g, (_match, _selector: string, declarations: string) => {
      return `${uniqueSelector} { ${declarations.trim()} }`;
    });
  } catch {
    return css;
  }
}

/**
 * Preview a DOM text/content change by finding the element via CSS selector
 * and temporarily replacing its innerHTML.
 * Returns a cleanup function to revert, or null if element not found.
 */
export function previewDOMChange(
  cssSelector: string,
  replaceJSX: string
): (() => void) | null {
  try {
    const el = document.querySelector(cssSelector) as HTMLElement;
    if (!el) return null;

    const originalHTML = el.innerHTML;

    // Convert JSX to HTML: className → class
    let html = replaceJSX.replace(/className=/g, "class=");

    // Extract inner content if wrapped with the same tag as the target element
    const elTag = el.tagName.toLowerCase();
    const regex = new RegExp(
      `^\\s*<${elTag}[^>]*>([\\s\\S]*)<\\/${elTag}>\\s*$`
    );
    const match = html.match(regex);

    if (match) {
      el.innerHTML = match[1].trim();
    } else {
      // Fallback: strip all tags and use as plain text
      el.textContent = html.replace(/<[^>]+>/g, "").trim();
    }

    return () => {
      el.innerHTML = originalHTML;
    };
  } catch {
    return null;
  }
}
