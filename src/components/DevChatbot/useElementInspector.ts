import { useState, useEffect, useRef, useCallback } from "react";
import { extractElementSnapshot } from "./contextCollectors";
import type { InspectedElementSnapshot } from "./contextCollectors";

function createOverlay(id: string): HTMLDivElement {
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (el) return el;
  el = document.createElement("div");
  el.id = id;
  el.style.cssText =
    "position:fixed;pointer-events:none;z-index:99998;transition:all 0.15s ease;border-radius:3px;display:none;";
  document.body.appendChild(el);
  return el;
}

function positionOverlay(overlay: HTMLDivElement, rect: DOMRect) {
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.display = "block";
}

function hideOverlay(overlay: HTMLDivElement) {
  overlay.style.display = "none";
}

function createLabel(id: string): HTMLDivElement {
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (el) return el;
  el = document.createElement("div");
  el.id = id;
  el.style.cssText =
    "position:fixed;pointer-events:none;z-index:99999;font-family:monospace;font-size:11px;padding:2px 6px;border-radius:4px;white-space:nowrap;display:none;transition:opacity 0.12s ease;";
  document.body.appendChild(el);
  return el;
}

function positionLabel(label: HTMLDivElement, rect: DOMRect, tag: string, id: string, classes: string[]) {
  const text = `<${tag.toLowerCase()}>${id ? `#${id}` : ""}${classes.slice(0, 2).map(c => `.${c}`).join("")}`;
  label.textContent = text;

  // Place label above element, or below if near top of viewport
  const labelHeight = 22;
  const top = rect.top > labelHeight + 4 ? rect.top - labelHeight - 4 : rect.bottom + 4;
  label.style.top = `${top}px`;
  label.style.left = `${Math.max(4, rect.left)}px`;
  label.style.display = "block";
}

export function useElementInspector() {
  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<InspectedElementSnapshot | null>(null);

  const hoveredRef = useRef<HTMLElement | null>(null);
  const selectedRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearInspection = useCallback(() => {
    selectedRef.current = null;
    setInspectedElement(null);
    const selOverlay = document.getElementById("__inspector-selected");
    const selLabel = document.getElementById("__inspector-selected-label");
    if (selOverlay) hideOverlay(selOverlay as HTMLDivElement);
    if (selLabel) (selLabel as HTMLDivElement).style.display = "none";
  }, []);

  useEffect(() => {
    if (!inspectorEnabled) {
      // Cleanup on disable — keep selected overlay if an element is selected
      hoveredRef.current = null;
      document.body.style.cursor = "";

      const hoverOverlay = document.getElementById("__inspector-hover");
      const hoverLabel = document.getElementById("__inspector-hover-label");
      if (hoverOverlay) hideOverlay(hoverOverlay as HTMLDivElement);
      if (hoverLabel) (hoverLabel as HTMLDivElement).style.display = "none";

      // Only clear selection if user manually disabled (no element selected)
      if (!selectedRef.current) {
        const selOverlay = document.getElementById("__inspector-selected");
        const selLabel = document.getElementById("__inspector-selected-label");
        if (selOverlay) hideOverlay(selOverlay as HTMLDivElement);
        if (selLabel) (selLabel as HTMLDivElement).style.display = "none";
        setInspectedElement(null);
      }
      return;
    }

    document.body.style.cursor = "crosshair";

    const hoverOverlay = createOverlay("__inspector-hover");
    hoverOverlay.style.background = "rgba(56, 189, 248, 0.08)";
    hoverOverlay.style.border = "2px solid rgba(56, 189, 248, 0.6)";
    hoverOverlay.style.boxShadow = "0 0 0 1px rgba(56, 189, 248, 0.15), 0 2px 8px rgba(56, 189, 248, 0.1)";

    const hoverLabel = createLabel("__inspector-hover-label");
    hoverLabel.style.background = "rgba(15, 23, 42, 0.9)";
    hoverLabel.style.color = "rgba(56, 189, 248, 0.9)";
    hoverLabel.style.border = "1px solid rgba(56, 189, 248, 0.3)";

    const selOverlay = createOverlay("__inspector-selected");
    selOverlay.style.background = "rgba(245, 158, 11, 0.06)";
    selOverlay.style.border = "2px solid rgba(245, 158, 11, 0.7)";
    selOverlay.style.boxShadow = "0 0 0 1px rgba(245, 158, 11, 0.15), 0 2px 12px rgba(245, 158, 11, 0.12)";

    const selLabel = createLabel("__inspector-selected-label");
    selLabel.style.background = "rgba(15, 23, 42, 0.9)";
    selLabel.style.color = "rgba(245, 158, 11, 0.9)";
    selLabel.style.border = "1px solid rgba(245, 158, 11, 0.3)";

    function isIgnored(el: HTMLElement): boolean {
      if (el === document.body || el === document.documentElement) return true;
      if (el.closest("[data-chatbot]")) return true;
      if (el.id?.startsWith("__inspector-")) return true;
      return false;
    }

    function handleMouseMove(e: MouseEvent) {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const target = e.target as HTMLElement;
        if (!target || isIgnored(target)) {
          hideOverlay(hoverOverlay);
          hoverLabel.style.display = "none";
          return;
        }

        if (target === hoveredRef.current) return;
        hoveredRef.current = target;

        const rect = target.getBoundingClientRect();
        positionOverlay(hoverOverlay, rect);

        const tag = target.tagName;
        const id = target.id || "";
        const classes = Array.from(target.classList).filter(c => !c.startsWith("__"));
        positionLabel(hoverLabel, rect, tag, id, classes);
      });
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target || isIgnored(target)) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      selectedRef.current = target;

      const rect = target.getBoundingClientRect();
      positionOverlay(selOverlay, rect);

      const tag = target.tagName;
      const id = target.id || "";
      const classes = Array.from(target.classList).filter(c => !c.startsWith("__"));
      positionLabel(selLabel, rect, tag, id, classes);

      const snapshot = extractElementSnapshot(target);
      setInspectedElement(snapshot);

      // Auto-disable inspector after selection — one pick at a time
      hideOverlay(hoverOverlay);
      hoverLabel.style.display = "none";
      hoveredRef.current = null;
      setInspectorEnabled(false);
    }

    // Update selected overlay position on scroll/resize
    function updateSelectedPosition() {
      if (selectedRef.current?.isConnected) {
        const rect = selectedRef.current.getBoundingClientRect();
        positionOverlay(selOverlay, rect);
        const tag = selectedRef.current.tagName;
        const id = selectedRef.current.id || "";
        const classes = Array.from(selectedRef.current.classList).filter(c => !c.startsWith("__"));
        positionLabel(selLabel, rect, tag, id, classes);
      }
    }

    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("scroll", updateSelectedPosition, true);
    window.addEventListener("resize", updateSelectedPosition);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("scroll", updateSelectedPosition, true);
      window.removeEventListener("resize", updateSelectedPosition);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      hideOverlay(hoverOverlay);
      hoverLabel.style.display = "none";
      document.body.style.cursor = "";
    };
  }, [inspectorEnabled]);

  return {
    inspectorEnabled,
    setInspectorEnabled,
    inspectedElement,
    clearInspection,
  };
}
