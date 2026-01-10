"use client";

import dynamic from "next/dynamic";

/**
 * Dynamic import wrapper for WaterCanvas
 * Prevents SSR issues with WebGL/Three.js
 */
export const WaterEffects = dynamic(
  () => import("./WaterCanvas").then((mod) => mod.WaterCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);
