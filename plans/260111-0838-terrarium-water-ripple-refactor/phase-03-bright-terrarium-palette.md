# Phase 03: Bright Terrarium Palette

## Context
After Phase 01-02, water effect is clean glass distortion. Now apply bright Terrarium color scheme to entire site.

## Overview
Transform dark terrarium (current) to bright terrarium (target):
- Background: Soft Sage Green (#A3B18A)
- Accent: Warm Cream (#F4EEE0)
- Highlights: Golden Sun (#E1BF7D)
- Text: Dark earth tones for contrast

## Requirements
1. Update CSS custom properties for bright theme
2. Ensure text contrast meets WCAG AA (4.5:1)
3. Adjust component colors (navbar, sections, buttons)
4. Shader tint compatible with bright BG (if any color remains)

## Architecture

### Color Palette Change
| Variable | Current | Target |
|----------|---------|--------|
| --background | #0d0a08 (Dark) | #A3B18A (Sage Green) |
| --foreground | #f4eee0 (Cream) | #1a1512 (Dark Soil) |
| --color-accent-primary | #566b4d (Moss) | #3d2b1f (Bark Brown) |
| --color-accent-secondary | #e1bf7d (Golden) | #566b4d (Moss Green) |
| --color-accent-highlight | #889977 (Sage) | #E1BF7D (Golden Sun) |

### Contrast Calculation
- Sage #A3B18A vs Dark Soil #1a1512: ~7.8:1 (passes AA)
- Sage #A3B18A vs Moss #566b4d: ~2.1:1 (use for large text only)
- Cream #F4EEE0 vs Dark Soil #1a1512: ~12.5:1 (excellent)

## Implementation Steps

### 1. globals.css - CSS Variables
- [ ] Update `:root` block:
  ```css
  :root {
    /* Bright Terrarium */
    --color-soft-sage: #A3B18A;
    --color-warm-cream: #F4EEE0;
    --color-golden-sun: #E1BF7D;
    --color-dark-soil: #1a1512;
    --color-bark-brown: #3d2b1f;

    --background: var(--color-soft-sage);
    --foreground: var(--color-dark-soil);
  }
  ```
- [ ] Update `@theme inline` block for Tailwind v4

### 2. globals.css - Scrollbar
- [ ] Update scrollbar colors:
  ```css
  scrollbar-color: var(--color-bark-brown) var(--color-soft-sage);
  ::-webkit-scrollbar-track { background: var(--color-soft-sage); }
  ::-webkit-scrollbar-thumb { background: var(--color-bark-brown); }
  ```

### 3. Component Updates
- [ ] Navbar.tsx: Adjust text/bg colors for contrast
- [ ] Hero.tsx: Text color update
- [ ] About.tsx: Card backgrounds
- [ ] Projects/ProjectCard.tsx: Card styling
- [ ] Contact.tsx: Form input styling
- [ ] Section.tsx: Background adjustments

### 4. Shader Tint (Optional)
If Phase 02 shader has any color:
- [ ] Update to warm cream tint instead of white
- [ ] Adjust specular color to golden

### 5. Tailwind Classes Audit
Search for hardcoded colors:
- [ ] `bg-deep-earth` → `bg-soft-sage` or `bg-background`
- [ ] `text-warm-cream` → `text-dark-soil` or `text-foreground`
- [ ] `border-moss-green` → `border-bark-brown`

## Todo List
```markdown
- [ ] Update globals.css CSS variables
- [ ] Update @theme inline block
- [ ] Fix scrollbar colors
- [ ] Update Navbar component colors
- [ ] Update Hero section text
- [ ] Update About section cards
- [ ] Update Projects section
- [ ] Update Contact section
- [ ] Run contrast checker on all text
- [ ] Test on mobile
```

## Success Criteria
- [ ] Background is bright sage green
- [ ] Text is dark and readable
- [ ] All sections visible with proper contrast
- [ ] Scrollbar matches theme
- [ ] No white-on-bright or dark-on-dark text
- [ ] WCAG AA contrast met (4.5:1 minimum)

## Testing
1. Visual inspection of all pages
2. Use browser contrast checker extension
3. Check text readability on each section
4. Verify hover/focus states visible
5. Test in light/dark mode browser settings (no conflict)

## Accessibility Checklist
- [ ] Body text: 4.5:1 contrast minimum
- [ ] Large text (18px+): 3:1 contrast minimum
- [ ] Interactive elements: visible focus ring
- [ ] Links: distinguishable from body text
- [ ] Buttons: sufficient contrast on all states

## Unresolved Questions
1. Should there be a dark mode toggle? (Out of scope for now)
2. Do we need legacy color aliases for backwards compatibility?
3. Any third-party components that hardcode colors?
