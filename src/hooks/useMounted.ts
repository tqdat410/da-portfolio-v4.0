"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook to detect if the component has mounted on the client.
 * Useful for preventing hydration mismatches with client-only code.
 * Uses useSyncExternalStore for SSR-safe behavior.
 *
 * @returns `true` after the component has mounted, `false` during SSR
 *
 * @example
 * ```tsx
 * const isMounted = useMounted();
 * if (!isMounted) return <Skeleton />;
 * return <ClientOnlyComponent />;
 * ```
 */
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}
