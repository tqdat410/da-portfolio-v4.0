"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { FlexibleColumnSplitter } from "./flexible-column-splitter";

interface FlexibleColumnLayoutProps {
  listPanel: ReactNode;
  detailPanel: ReactNode | null;
  defaultListWidth?: number; // percentage, default 40
  minListWidth?: number;     // percentage, default 25
  maxListWidth?: number;     // percentage, default 65
}

/**
 * SAP Fiori-style Flexible Column Layout.
 * Two-column master-detail with draggable splitter.
 * Desktop: side-by-side. Mobile: stacked with back navigation.
 */
export function FlexibleColumnLayout({
  listPanel,
  detailPanel,
  defaultListWidth = 40,
  minListWidth = 25,
  maxListWidth = 65,
}: FlexibleColumnLayoutProps) {
  const [listWidth, setListWidth] = useState(defaultListWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback(
    (deltaX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const containerWidth = container.offsetWidth;
      const deltaPercent = (deltaX / containerWidth) * 100;
      setListWidth((prev) => {
        const next = prev + deltaPercent;
        return Math.min(maxListWidth, Math.max(minListWidth, next));
      });
    },
    [minListWidth, maxListWidth]
  );

  const hasDetail = detailPanel !== null;

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      {/* List Panel */}
      <div
        className="h-full overflow-y-auto transition-[width] duration-75"
        style={{ width: hasDetail ? `${listWidth}%` : "100%" }}
      >
        {listPanel}
      </div>

      {/* Splitter + Detail Panel (only when detail is open) */}
      {hasDetail && (
        <>
          <FlexibleColumnSplitter onDrag={handleDrag} />
          <div
            className="h-full overflow-y-auto flex-1 min-w-0"
          >
            {detailPanel}
          </div>
        </>
      )}
    </div>
  );
}
