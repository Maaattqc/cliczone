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
