# Phase 1: Extend TextCanvas for Multi-Text Rendering

## Status: PLANNED

## Objective
Upgrade TextCanvas to support multiple text items with individual positions, enabling scroll-driven animation of text within the water effect.

## Tasks

### 1.1 Define TextItem Interface
- Create `TextItem` interface: { id, text, x, y, fontSize, fontFamily, color, opacity, align }
- x, y as normalized (0-1) or pixel values
- Support for relative positioning (percentage-based)

### 1.2 Update createTextCanvas Function
- Accept array of TextItem instead of single text
- Render each item at specified position
- Support different fonts/sizes per item

### 1.3 Add updateTextCanvasItems Function
- Efficient redraw for position/opacity changes
- Clear and re-render only when needed
- Optimize for 60fps animation updates

### 1.4 Type Exports
- Export all new types from module
- Ensure backward compatibility with existing usage

## Success Criteria
- [ ] Multiple text items render correctly
- [ ] Positions are accurate (pixel or percentage)
- [ ] Performance: <2ms per redraw
- [ ] Existing WaterCanvas usage unaffected
