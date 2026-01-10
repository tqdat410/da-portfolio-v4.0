"use client";

import { useState, useEffect, useCallback } from "react";

interface MousePosition {
  x: number; // 0 to 1 (normalized)
  y: number; // 0 to 1 (normalized)
  isActive: boolean;
}

/**
 * Track normalized mouse position (0-1) with WebGL Y-axis flip
 * Returns isActive: false when cursor leaves window
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0.5,
    y: 0.5,
    isActive: false,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight, // Flip Y for WebGL
      isActive: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition((prev) => ({ ...prev, isActive: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return position;
}
