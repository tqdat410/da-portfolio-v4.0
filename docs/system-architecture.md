# System Architecture

**Last Updated:** 2026-01-11
**Architecture Pattern:** Layered (Client/Server separation, SSR-first)
**3D Engine:** Three.js via React Three Fiber (R3F)
**Animation:** GSAP (ScrollTrigger)

## High-Level Architecture

```
│                     Next.js App Router                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │      Root Layout (Server Component)                     ││
│  │  - Metadata generation                                  ││
│  │  - Global CSS                                           ││
│  │  ┌───────────────────────────────────────────────────┐ ││
│  │  │  Navbar (Client Component)                        │ ││
│  │  │  - Active section detection                       │ ││
│  │  │  - Light effects                                  │ ││
│  │  └───────────────────────────────────────────────────┘ ││
│  │  ┌───────────────────────────────────────────────────┐ ││
│  │  │  HeroStory (Client Component)                     │ ││
│  │  │  - WaterEffects (R3F Canvas)                      │ ││
│  │  │  - Scroll-triggered animation (GSAP)              │ ││
│  │  │  - RoleCarousel                                   │ ││
│  │  └───────────────────────────────────────────────────┘ ││
│  │  ┌───────────────────────────────────────────────────┐ ││
│  │  │  Content Sections (Client Components)             │ ││
│  │  │  - About, Projects, Contact                       │ ││
│  │  │  - Data from typed content object                 │ ││
│  │  └───────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. Server Layer (Next.js App Router)

**Responsibility:** Metadata, routing, static generation

**Files:**
- `src/app/layout.tsx` - Root server component
- `src/app/page.tsx` - Home page

**Characteristics:**
- Single-language (English)
- Static export compatible
- Minimal server-side logic

### 2. Client Layer

#### A. Story Components (`components/story/`)

**Responsibility:** Orchestrating immersive, scroll-driven storytelling experiences.

**Key Components:**
- `HeroStory.tsx`: Main entry point. Combines water effects with scroll animation.
- `RoleCarousel.tsx`: Horizontal scrolling list of roles.
- `StorySection.tsx`: Base wrapper for story segments.

**Animation Logic (GSAP):**
```
useScrollStory Hook
  └── GSAP ScrollTrigger
      ├── Pin HeroSection
      └── Translate RoleCarousel (x: -distance)
```

#### B. Water Effects (`components/water/`)

**Responsibility:** R3F Canvas and GPU simulation.

**Key Logic:**
- `WaterCanvas.tsx`: R3F Canvas setup.
- `useFluidSimulation.ts`: GPGPU fluid simulation (pressure/velocity).
- `shaders/simulation.ts`: Physics shader.
- `shaders/water.ts`: Rendering shader (distortion).

#### C. UI Sections (`components/sections/`)

**Responsibility:** Standard content presentation.

**Key Components:**
- `About`, `Projects`, `Contact`
- Direct content import from `src/content/portfolio.ts`

### 3. Data Layer (`src/content/`)

**Responsibility:** Centralized content management.

**File:** `src/content/portfolio.ts`

**Structure:**
- Typed interfaces (`HeroContent`, `ProjectItem`, etc.)
- Single `content` object export
- Replaces previous i18n JSON files

### 4. Hook Layer

#### Animation Hooks
- `useScrollStory`: Encapsulates ScrollTrigger logic
- `useGSAP`: Safe GSAP registration
- `useReducedMotion`: Accessibility preference detection

#### Utility Hooks
- `useIsMobile`: Responsive layout adaptation
- `useFluidSimulation`: FBO swapping logic for fluid physics

## Rendering Pipeline (Water)

```
Frame Loop (useFrame)
  │
  ├─ 1. Simulation Pass (GPGPU)
  │   ├─ Advection (velocity transport)
  │   ├─ External Forces (mouse/touch input)
  │   ├─ Viscosity/Decay
  │   └─ Output: Data Texture (R=pressure, G=velocity)
  │
  ├─ 2. Rendering Pass
  │   ├─ Vertex Shader (Standard Plane)
  │   └─ Fragment Shader
  │       ├─ Sample Data Texture
  │       ├─ Calculate Refraction/Distortion
  │       └─ Output Color
  │
  └─ 3. React Render
      └─ UI Overlay (HTML/CSS)
```

## Performance Optimization

1. **GPGPU Simulation**: Physics calculations on GPU, not CPU.
2. **Ping-Pong FBO**: Efficient texture swapping without memory allocation.
3. **Lazy Loading**: `WaterEffects` loads dynamically to avoid blocking main thread.
4. **Scroll Performance**: `will-change` hints (via GSAP) and pinned layers.

## Accessibility

1. **Reduced Motion**:
   - `useReducedMotion` hook disables GSAP animations and simplifies water effects.
   - Fallback static layouts provided.
2. **Screen Readers**:
   - Canvas text duplicated in visually hidden `<h1>` tags.
   - Interactive elements accessible via keyboard.
