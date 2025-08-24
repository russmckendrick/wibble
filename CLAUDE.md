# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Cloudflare Workers project named "wibble" that serves a React 19 IP Address Checker application. The application uses RetroUI for a bold, retro-styled user interface, Framer Motion for animations, and the public-ip library to display the user's public IP addresses (IPv4 and IPv6).

## Architecture

- **Runtime**: Cloudflare Workers (serverless edge computing)
- **Frontend**: React 19 RC with TypeScript
- **UI Library**: RetroUI (retro-styled components with bold colors and shadows)
- **Animation**: Framer Motion for advanced animations and transitions
- **Notifications**: Sonner for toast notifications
- **Build System**: esbuild for JavaScript bundling, Tailwind CSS for styling
- **Entry Points**: 
  - Worker: `src/index.ts` - Cloudflare Workers handler
  - Client: `src/client.tsx` - React application entry point
- **Static Assets**: Served from `public/` directory
- **Configuration**: `wrangler.jsonc` for Cloudflare Workers deployment settings

## Development Commands

### Core Commands
- `npm run build` - Build both CSS and JavaScript for production
- `npm run dev` - Build and start local development server at http://localhost:8787/
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm test` - Run tests using Vitest with Cloudflare Workers pool
- `npm run cf-typegen` - Generate TypeScript types from Wrangler configuration

### Build Commands
- `npm run build:css` - Build and watch Tailwind CSS in development
- `npm run build:css:prod` - Build minified Tailwind CSS for production
- `npm run build:js` - Bundle React application using esbuild

### Testing
- Uses Vitest with `@cloudflare/vitest-pool-workers` for Workers-specific testing
- Tests are in `test/index.spec.ts`
- Supports both unit-style and integration-style tests
- Unit tests use `createExecutionContext()` and `waitOnExecutionContext()`
- Integration tests use `SELF.fetch()` for end-to-end testing

## Key Files

### Core Application
- `src/client.tsx` - React application entry point with root rendering
- `src/components/App.tsx` - Main React application component
- `src/components/IPDisplay.tsx` - IP address display component using public-ip library
- `src/index.ts` - Cloudflare Workers handler (serves static assets)

### UI Components (RetroUI)
- `src/components/retroui/Button.tsx` - RetroUI Button component with bold styling
- `src/components/retroui/Card.tsx` - RetroUI Card component with shadows and borders  
- `src/components/retroui/Sonner.tsx` - Toast notification component with RetroUI styling
- `src/lib/utils.ts` - Utility functions including `cn()` for class merging

### Configuration & Build
- `wrangler.jsonc` - Cloudflare Workers configuration
- `build.js` - esbuild configuration for React bundling
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - Component library configuration
- `public/index.html` - HTML template that loads the React app
- `public/dist/` - Built assets (CSS and JavaScript)

## TypeScript Configuration

- Target: ES2021 with bundler module resolution
- Strict mode enabled
- No emit (bundling handled by Wrangler)
- JSX support configured for React
- Excludes test directory from main compilation

## Development Notes

### React & RetroUI
- Uses React 19 RC with modern patterns (createRoot, automatic JSX transform)
- RetroUI provides bold, retro-styled components with:
  - Thick black borders (border-2 border-black)
  - Drop shadows and hover effects
  - Bright colors (yellow, pink, cyan backgrounds)
  - Pixel-perfect aesthetic with Press Start 2P font
- Components use class-variance-authority for dynamic styling

### Public IP Integration
- `public-ip` library fetches IP addresses from multiple services
- Supports IPv4, IPv6, and general IP detection
- Error handling and loading states included
- Uses HTTPS services (icanhazip, ipify) for browser compatibility

### Build Process
- esbuild bundles React app to `public/dist/app.js`
- Tailwind CSS compiles to `public/dist/globals.css`
- Static assets served by Cloudflare Workers
- Development requires running both CSS and JS builds

### Cloudflare Workers
- Worker serves static assets from public directory
- Observability enabled for monitoring
- Compatible with Workers runtime limitations