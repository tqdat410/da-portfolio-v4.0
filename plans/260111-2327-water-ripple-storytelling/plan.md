# Water Ripple Storytelling Animation Plan

## Overview
Implement scroll-driven storytelling where both name ("Trần Quốc Đạt") and roles are rendered inside the water canvas, creating unified underwater effect with text animations.

## Current State
- `WaterCanvas` renders single text via `TextCanvas` → WebGL texture → water distortion
- Roles rendered as HTML elements (z-10) above water layer - NO distortion
- Scroll animation via GSAP/CSS transforms on HTML elements

## Target State
- All text (name + roles) rendered in `TextCanvas` → WebGL texture → water distortion
- Scroll-driven animations: name slides left, roles slide in from right
- Unified "underwater" visual experience

## Architecture
```
TextCanvas (upgraded)
├── Background layer
├── Name text (animatable position)
└── Roles text (animatable positions)

↓ render to canvas ↓

WaterPlane shader
├── contentTexture (from TextCanvas)
└── simulationTexture (fluid ripples)

↓ distort ↓

Final output: All text with water ripple effect
```

## Status: IN_PROGRESS

## Phases

### Phase 1: Extend TextCanvas for Multi-Text Rendering [PLANNED]
- Add support for multiple text items with individual positions
- Each item: { text, x, y, fontSize, fontFamily, color, opacity }
- Support dynamic position/opacity updates

### Phase 2: Create AnimatedWaterCanvas Component [PLANNED]
- New component wrapping WaterCanvas with scroll animation logic
- Use useFrame() to update TextCanvas positions each frame
- Integrate scroll progress from useScrollStory

### Phase 3: Implement Scroll-Driven Animation [PLANNED]
- Name: center → left as scroll increases
- Roles: right (off-screen) → center as scroll increases
- Smooth easing and timing

### Phase 4: Update HeroStory Integration [PLANNED]
- Replace current implementation
- Remove HTML-based roles
- Test mobile fallback

### Phase 5: Testing & Polish [PLANNED]
- Visual testing
- Performance optimization
- Accessibility verification
