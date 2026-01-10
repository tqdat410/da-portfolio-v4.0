"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

interface PerformanceState {
  fps: number;
  shouldReduceEffects: boolean;
}

// SINGLETON: One performance monitor per app
// Module-level state ensures consistent FPS tracking across all components
let performanceState: PerformanceState = {
  fps: 60,
  shouldReduceEffects: false,
};
const listeners = new Set<() => void>();
let monitoringStarted = false;

function subscribeToPerformance(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getPerformanceSnapshot(): PerformanceState {
  return performanceState;
}

function getPerformanceServerSnapshot(): PerformanceState {
  return { fps: 60, shouldReduceEffects: false };
}

function updatePerformanceState(newState: Partial<PerformanceState>) {
  performanceState = { ...performanceState, ...newState };
  listeners.forEach((listener) => listener());
}

/**
 * Monitor frame rate and suggest effect reduction when needed
 * Uses useSyncExternalStore for React 19 compatible state management
 */
export function usePerformanceMonitor() {
  const state = useSyncExternalStore(
    subscribeToPerformance,
    getPerformanceSnapshot,
    getPerformanceServerSnapshot
  );

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lowFpsCountRef = useRef(0);

  useEffect(() => {
    // Only start monitoring once
    if (monitoringStarted) return;
    monitoringStarted = true;

    lastTimeRef.current = performance.now();

    let rafId: number;

    const measureFps = () => {
      frameCountRef.current++;
      const currentTime = performance.now();

      if (currentTime - lastTimeRef.current >= 1000) {
        const currentFps = frameCountRef.current;
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;

        // Track consecutive low FPS periods
        if (currentFps < 30) {
          lowFpsCountRef.current++;
          if (lowFpsCountRef.current >= 3) {
            updatePerformanceState({
              fps: currentFps,
              shouldReduceEffects: true,
            });
          }
        } else {
          lowFpsCountRef.current = Math.max(0, lowFpsCountRef.current - 1);
          updatePerformanceState({
            fps: currentFps,
            shouldReduceEffects: lowFpsCountRef.current >= 3,
          });
        }
      }

      rafId = requestAnimationFrame(measureFps);
    };

    rafId = requestAnimationFrame(measureFps);

    return () => {
      cancelAnimationFrame(rafId);
      monitoringStarted = false;
    };
  }, []);

  return state;
}
