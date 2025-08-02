# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wibble is a modern IP address lookup web application built with React, TypeScript, and Vite. It features a cutting-edge 2025 design with "Authentic Bold Futurism" aesthetics, displaying comprehensive IP address information with advanced visual effects and immersive interactions.

## Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 19 with TypeScript and Vite build tool
- **Styling**: Tailwind CSS 4 with custom Solarized color scheme
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: Zustand for client state, React hooks for API data
- **Visualization**: Leaflet.js for geographic visualization (to be replaced with Three.js particle system)
- **Animations**: Framer Motion for advanced animations and micro-interactions
- **Theme**: Dark/light mode support using next-themes

### Design System (2025 Modern Specification)
- **Color Palette**: Solarized base with custom CSS properties for theming
- **Typography**: Inter (body), JetBrains Mono (monospace) - to be enhanced with display fonts
- **Layout**: Asymmetrical single-page design with three main zones:
  - Hero Data Zone (40% viewport): Large IP display with particle system
  - Information Flow Zone (40% viewport): Location and network data with glass morphism
  - Interactive Data Zone (20% viewport): Action buttons with advanced hover states
- **Effects**: Glass morphism, gradient animations, particle systems, micro-interactions

### Backend (functions/json.js)
- Cloudflare Function that extracts client IP from request headers
- Supports both IPv4 and IPv6 addresses
- Returns JSON response with CORS enabled
- Header priority: CF-Connecting-IP → CF-Connecting-IPv4/IPv6 → X-Real-IP

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Key Technologies & Libraries

### Core Dependencies
- React 19 + React DOM
- TypeScript 5.8+
- Vite 7 (build tool)
- Tailwind CSS 4 (styling)

### UI & Components
- @radix-ui/* (accessible UI primitives)
- shadcn/ui (component library)
- lucide-react (icons)
- framer-motion (animations)
- next-themes (theme management)

### Data & Maps
- zustand (state management)
- leaflet + react-leaflet (maps, to be replaced)
- sonner (toast notifications)

### Planned Enhancements
- Three.js for 3D particle system visualization
- Custom fonts: Druk Bold Condensed, Obviously Heavy
- WebGL-powered orbital particle system
- Advanced micro-animations with spring physics
- Responsive particle counts based on device capabilities

## Modern Design Features (2025)

- **Glass Morphism**: Backdrop blur effects with subtle transparency
- **Gradient Text**: Animated gradient effects on IP address display
- **Particle System**: 3D orbital visualization replacing traditional maps
- **Micro-Interactions**: Springy animations with modern easing functions
- **Progressive Enhancement**: Graceful fallbacks for different device capabilities
- **Accessibility**: Respects prefers-reduced-motion for all animations

## Implementation Status

Currently implementing the comprehensive 2025 design specification with:
- ✅ Solarized color system with CSS custom properties
- ✅ Modern component architecture with shadcn/ui
- ✅ Responsive grid layout with asymmetrical composition
- 🚧 Glass morphism effects and advanced animations
- 🚧 Three.js particle system for geographic visualization
- 🚧 Custom display fonts and enhanced typography
- 🚧 Advanced micro-interactions and hover states

## Key Files

- `src/App.tsx` - Main application component with layout zones
- `src/index.css` - Global styles with Solarized theme and modern effects
- `src/hooks/useIPData.ts` - IP data fetching and caching logic
- `src/components/MapComponent.tsx` - Geographic visualization (to be enhanced)
- `functions/json.js` - Cloudflare serverless function for IP extraction
- `project/design.md` - Complete 2025 design specification