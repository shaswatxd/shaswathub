# Project-Scoped Rules & Guidelines

Always build and update this workspace according to the following guidelines:

## Core Technology Stack
- **Framework**: Next.js (App Router)
- **3D Render Loop**: React Three Fiber (R3F) + Three.js
- **3D Utilities**: `@react-three/drei`
- **Animations**: GSAP (GreenSock Animation Platform) + Framer Motion
- **3D Asset Workflow**: Optimized Blender Assets (.glb/.gltf) or Spline scenes
- **Smooth Scrolling**: Lenis Smooth Scroll

## Core Requirements
- **60 FPS Performance**:
  - Keep point lights, shadows, and physical materials to a minimum.
  - Set static Device Pixel Ratio (`dpr={1}`) to avoid GPU fill-rate throttling on high-resolution Retina or 4K monitors.
  - Merge overlapping planes to prevent transparent overdraw performance cost.
- **Optimized Assets**:
  - Keep all 3D model assets web-optimized (ideally under 2MB).
  - Preload assets to avoid hydration pop-in latency.
- **Lazy Loading**:
  - Always dynamically load WebGL/Canvas components with `{ ssr: false }` to prevent Next.js hydration failures.
  - Implement dynamic chunking where appropriate.
- **Smooth Scroll**:
  - Sync Lenis with the GSAP animation loop for smooth scroll scrubbing and reveal triggers.
