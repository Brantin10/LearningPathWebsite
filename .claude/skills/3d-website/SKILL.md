---
name: 3d-website
description: Build premium interactive 3D websites with cinematic motion, WebGL scenes, smooth scrolling, bold typography, and shader effects. Use when asked to create a 3D website, interactive landing page, WebGL experience, agency-style site, immersive web experience, or anything involving Three.js / React Three Fiber / GSAP animations.
---

This skill creates premium interactive 3D marketing websites inspired by award-winning agency sites (igloo.inc style). It produces production-ready code with cinematic motion, WebGL scenes, smooth scrolling, shader effects, and bold typography.

The user provides a website concept, brand, or brief. You build the full experience.

## Tech Stack (Non-Negotiable)

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + clsx
- **3D Core**: three.js + @react-three/fiber + @react-three/drei
- **Animation**: GSAP (timelines, scroll-driven) + Framer Motion (DOM interactions only)
- **Smooth Scroll**: Lenis
- **Post-processing**: @react-three/postprocessing
- **State**: Zustand
- **Debug**: Leva, lil-gui (dev only)
- **Assets**: sharp, @gltf-transform/cli

## Architecture Rules

### Separation of Concerns
- **`src/experience/`** = All 3D/WebGL code (canvas, scenes, objects, materials, shaders, post-processing)
- **`src/sections/`** = HTML content sections (hero, intro, services, work, about, contact)
- **`src/components/`** = Reusable DOM components (ui, layout, nav, footer, common)
- **`src/animations/`** = GSAP timelines, scroll triggers, transitions
- **`src/hooks/`** = useLenis, useViewport, useScrollProgress, usePreloadAssets
- **`src/shaders/`** = GLSL files (vertex, fragment, noise, distort)

### Canvas Strategy
- ONE persistent `<SceneCanvas>` layer for the entire page
- HTML sections overlay above/below the canvas
- Single main camera with GSAP + scroll-based interpolation
- Modular scene objects driven by normalized scroll progress
- Asset preloading: only load what's needed for first screen, lazy-load the rest

### Animation Strategy
- GSAP timelines for deterministic motion and section transitions
- Framer Motion ONLY for lightweight DOM interactions (hover states, reveals)
- No chaotic easing spam — smooth, cinematic, intentional
- Subtle parallax, never aggressive
- Respect `prefers-reduced-motion`

## Design System

### Colors (Dark-Preferred)
```
background: #0A0A0A
surface:    #121212
primary:    #FFFFFF
secondary:  #A1A1AA
accent:     #7C5CFF
accent_soft: #B6A8FF
```
Override with user's brand colors when provided.

### Typography
- **Fonts**: Satoshi, Neue Montreal, Space Grotesk, or user's brand font
- **Display**: `clamp(3rem, 8vw, 8rem)`
- **H1**: `clamp(2.5rem, 6vw, 6rem)`
- **H2**: `clamp(2rem, 4vw, 4rem)`
- **Body**: `clamp(1rem, 1.2vw, 1.125rem)`
- Oversized typography with generous spacing

### Spacing Scale
4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px

### Border Radius
sm: 8px, md: 14px, lg: 24px

### Motion Durations
fast: 0.3s, medium: 0.6s, slow: 1.2s

## Visual Direction

Execute EVERY site with these principles:
- **Minimal but dramatic** — premium agency/studio feel
- **Dark or neutral base** with selective highlights
- **Oversized typography** with large whitespace
- **Sharp contrast** between stillness and motion
- **Full viewport sections** for major storytelling beats
- **Strong vertical rhythm** — avoid cluttered UI
- **3D motion supports content**, never distracts from it
- **Editorial layout** with cinematic transitions

## Site Sections (Default Structure)

1. **Hero**: Immediate visual impact — 3D object, strong headline, shader-driven reveal, intro motion
2. **Intro**: Value proposition with layered text and motion
3. **Services**: Animated cards or scroll-linked 3D object states
4. **Work**: Project cards with high-end thumbnails, hover motion, optional 3D transitions
5. **About**: Identity and philosophy
6. **Contact**: Strong CTA and footer navigation

## Required Features
- Interactive WebGL hero section
- Smooth scrolling (Lenis)
- Scroll-driven camera movement
- Shader distortion or reveal effect
- Layered HTML content sections
- Responsive navigation
- Work/project cards
- Contact CTA
- Mobile responsive behavior

## Optional Enhancements
- Custom cursor
- Hover-linked 3D object response
- Post-processing bloom/noise pass
- Video textures
- Page transition system

## Performance Budget

### Rules
- Hero GLB: < 3 MB, total initial payload < 5 MB
- Compress textures — prefer KTX2 or WebP
- Limit overdraw and full-screen shader passes
- Clamp DPR on low-powered devices
- Pause expensive updates when tab is inactive
- Use suspense and staged asset loading

### Mobile Fallbacks
- Disable expensive post-processing
- Reduce shader complexity
- Lower texture resolution
- Simplify or disable particle systems
- Reduce motion intensity

## Asset Pipeline

### 3D Models
- Source: Blender, export as GLB
- Optimize: `gltf-transform optimize` + Draco compression
- Textures: limit to 2K unless necessary
- Store: `public/models/source/` (original) and `public/models/optimized/` (runtime)

### Images & Textures
- Formats: WebP, AVIF (images), WebP/KTX2/PNG (textures)
- Max width: 2560px
- Tools: sharp, Squoosh
- Store: `public/textures/source/` and `public/textures/compressed/`

### Video
- Formats: MP4, WebM
- Compression: ffmpeg
- Keep under 5 MB, use short looping clips

## Accessibility (Non-Negotiable)
- Semantic HTML for ALL content sections
- Keyboard-accessible navigation
- Respect `prefers-reduced-motion`
- Readable text contrast
- No critical information behind motion-only interactions
- Proper heading structure + alt text

## Build Phases

**Phase 1 — Foundation**: Next.js + Tailwind + layout + nav + persistent SceneCanvas
**Phase 2 — Hero**: Hero section + 3D model + intro animation + scroll-linked camera + first shader
**Phase 3 — Story Sections**: All content sections + scene states tied to scroll + card motion + GSAP transitions
**Phase 4 — Polish**: Post-processing + typography tuning + asset compression + mobile fallbacks + reduced-motion
**Phase 5 — Release**: Metadata + testing + performance audit + deploy to Vercel

## Coding Guidelines
- Functional React components only
- Strict TypeScript typing throughout
- Small, composable hooks
- No giant monolithic scene files
- No coupling animation timelines directly to JSX — use helper modules
- Clear, consistent file naming

## What To Ask The User

Before building, gather:
- **Brand**: name, tagline, logo, colors, fonts
- **Copy**: hero headline, services, about text, contact CTA
- **Assets**: 3D model direction, project thumbnails, moodboard references
- **Goals**: target audience, desired user action, SEO importance, future CMS needs

If the user doesn't provide these, use compelling placeholder content and the default design system above. The site should look premium even with placeholder content.
