# IP Checker

A modern, retro-styled IP address checker built with React 19 and deployed on Cloudflare Workers.

🌐 **Live Site**: [wibble.foo](https://www.wibble.foo/)

## Features

- **IP Detection**: Displays your public IPv4 and IPv6 addresses
- **Retro UI**: Bold, nostalgic design with vibrant colors and drop shadows
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Copy to Clipboard**: One-click copying with toast notifications
- **Lightning Fast**: Deployed on Cloudflare's global edge network

## Tech Stack

- **Frontend**: React 19 RC + TypeScript
- **Styling**: Tailwind CSS + RetroUI components
- **Animations**: Framer Motion
- **Runtime**: Cloudflare Workers
- **Build**: esbuild + Wrangler

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

## Architecture

Built as a Cloudflare Workers application serving a React SPA. The worker handles static asset serving while the React app fetches IP addresses client-side using the `public-ip` library.