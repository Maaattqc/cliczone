import { useState, useEffect, useRef, useCallback } from "react";
import { extractElementSnapshot } from "./contextCollectors";
import type { InspectedElementSnapshot } from "./contextCollectors";

export function useElementInspector() {
  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<InspectedElementSnapshot | null>(null);

  const hoveredRef = useRef<HTMLElement | null>(null);
  const selectedRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearInspection = useCallback(() => {
    if (selectedRef.current?.isConnected) {
      selectedRef.current.style.outline = "";
    }
    selectedRef.current = null;
    setInspectedElement(null);
  }, []);

  useEffect(() => {
    if (!inspectorEnabled) {
      // Cleanup on disable
      if (hoveredRef.current?.isConnected) {
        hoveredRef.current.style.outline = "";
      }
      if (selectedRef.current?.isConnected) {
        selectedRef.current.style.outline = "";
      }
      hoveredRef.current = null;
      selectedRef.current = null;
      setInspectedElement(null);
      document.body.style.cursor = "";
      return;
    }

    document.body.style.cursor = "crosshair";

    function isIgnored(el: HTMLElement): boolean {
      if (el === document.body || el === document.documentElement) return true;
      if (el.closest("[data-chatbot]")) return true;
      return false;
    }

    function handleMouseMove(e: MouseEvent) {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const target = e.target as HTMLElement;
        if (!target || isIgnored(target)) return;

        if (target === hoveredRef.current) return;

        // Remove previous hover outline (but not from selected element)
        if (hoveredRef.current?.isConnected && hoveredRef.current !== selectedRef.current) {
          hoveredRef.current.style.outline = "";
        }

        hoveredRef.current = target;

        // Don't override selected element's amber outline
        if (target !== selectedRef.current) {
          target.style.outline = "2px solid #3b82f6";
        }
      });
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target || isIgnored(target)) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Remove previous selected outline
      if (selectedRef.current?.isConnected) {
        selectedRef.current.style.outline = "";
      }

      selectedRef.current = target;
      target.style.outline = "3px solid #f59e0b";

      const snapshot = extractElementSnapshot(target);
      setInspectedElement(snapshot);
    }

    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
      document.removeEventListener("click", handleClick, true);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (hoveredRef.current?.isConnected) {
        hoveredRef.current.style.outline = "";
      }
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
