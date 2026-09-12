import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const media = window.matchMedia("(min-width: 768px)");
  media.addEventListener("change", callback);
  return () => {
    media.removeEventListener("change", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(min-width: 768px)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * useIsDesktop
 * SSR-safe media query hook checking for min-width: 768px.
 * Defaults to false during server rendering to prevent hydration mismatches.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
