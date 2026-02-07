# Phase 2: Flexible Column Layout Component

**Priority:** High | **Effort:** M | **Status:** Pending

## Overview

Build a reusable `FlexibleColumnLayout` component inspired by SAP Fiori's FCL pattern. Two-column layout: **list panel (left)** + **detail panel (right)**, with a draggable splitter to resize.

## Context

SAP Fiori FCL = master-detail on same page. User sees list on one side, clicks an item, detail appears on the other side. A vertical divider between them can be dragged to resize the panels.

## Architecture

```
src/components/layout/
├── FlexibleColumnLayout.tsx   # Main FCL wrapper
└── flexible-column-splitter.tsx  # Draggable divider
```

## FlexibleColumnLayout Props

```tsx
interface FlexibleColumnLayoutProps {
  listPanel: React.ReactNode;
  detailPanel: React.ReactNode | null;
  defaultListWidth?: number;    // percentage, default 40
  minListWidth?: number;        // percentage, default 25
  maxListWidth?: number;        // percentage, default 65
}
```

## Implementation

### 2.1 FlexibleColumnLayout component
- Full-height container (`h-screen`) with `flex` row layout
- Left panel: list content, scrollable independently
- Right panel: detail content, scrollable independently
- When `detailPanel` is null → list takes full width
- When `detailPanel` is set → split view with splitter

### 2.2 Draggable Splitter
- Vertical bar (4px wide, subtle hover effect)
- `onMouseDown` starts drag → `mousemove` updates width ratio → `mouseup` ends drag
- Touch support: `onTouchStart/Move/End`
- Cursor: `col-resize`
- Visual: subtle line, highlighted on hover/drag
- Constrain within min/max percentage bounds

### 2.3 Responsive behavior
- Desktop (>=768px): side-by-side FCL layout
- Mobile (<768px): stack vertically — list on top, detail below (or full-screen detail with back button)

### 2.4 Styling
- Silver Mist theme — white/slate bg, clean borders
- No heavy effects — fast, clean page
- List panel: `bg-white` or `bg-slate-50`
- Detail panel: `bg-white`
- Splitter: `bg-slate-200 hover:bg-slate-400` transition

## Success Criteria
- [ ] Panels resize smoothly via drag
- [ ] Min/max constraints respected
- [ ] Works on mobile (stacked layout)
- [ ] No layout shift or flicker during drag
- [ ] Touch support works
