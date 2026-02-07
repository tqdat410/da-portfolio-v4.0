"use client";

import { useCallback, useRef } from "react";

interface FlexibleColumnSplitterProps {
  onDrag: (deltaX: number) => void;
}

/**
 * Draggable vertical splitter for FlexibleColumnLayout.
 * Supports both mouse and touch interactions.
 */
export function FlexibleColumnSplitter({ onDrag }: FlexibleColumnSplitterProps) {
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging.current) return;
      const delta = clientX - lastX.current;
      lastX.current = clientX;
      onDrag(delta);
    },
    [onDrag]
  );

  const handleEnd = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      lastX.current = e.clientX;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientX);
      const onMouseUp = () => {
        handleEnd();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [handleMove, handleEnd]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = true;
      lastX.current = e.touches[0].clientX;
      document.body.style.userSelect = "none";

      const onTouchMove = (ev: TouchEvent) => handleMove(ev.touches[0].clientX);
      const onTouchEnd = () => {
        handleEnd();
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
      };
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    },
    [handleMove, handleEnd]
  );

  return (
    <div
      className="relative flex-shrink-0 w-1 cursor-col-resize group z-10"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="separator"
      aria-orientation="vertical"
      tabIndex={0}
      aria-label="Resize panels"
    >
      {/* Hit area - wider than visual for easier grabbing */}
      <div className="absolute inset-y-0 -left-2 -right-2" />
      {/* Visual bar */}
      <div className="h-full w-full bg-slate-200 transition-colors duration-150 group-hover:bg-slate-400 group-active:bg-slate-500" />
      {/* Center grip dots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 rounded-full bg-slate-500" />
        <div className="w-1 h-1 rounded-full bg-slate-500" />
        <div className="w-1 h-1 rounded-full bg-slate-500" />
      </div>
    </div>
  );
}
