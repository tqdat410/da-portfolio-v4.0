"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  // Use useSyncExternalStore for proper SSR hydration
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  // Default to false on server (assume motion is OK)
  return false;
}

function subscribeToReducedMotion(callback: () => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}
