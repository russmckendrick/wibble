# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wibble is a web application that displays IP address information to users. It consists of:
- A static frontend (HTML/CSS/JS) that shows IP address details and geolocation
- A Cloudflare Function endpoint at `/json` that returns IP information in JSON format

## Architecture

### Frontend (index.html, script.js, style.css)
- Uses Bootstrap 5 for styling with light/dark theme support
- Integrates Leaflet.js for map visualization
- Fetches IP data from external APIs (ipify.org and ipapi.co)
- Provides copy-to-clipboard functionality for IP addresses

### Backend (functions/json.js)
- Cloudflare Function that extracts client IP from request headers
- Supports both IPv4 and IPv6 addresses
- Returns JSON response with CORS enabled
- Header priority: CF-Connecting-IP → CF-Connecting-IPv4/IPv6 → X-Real-IP

## Development Commands

This is a static site with Cloudflare Functions. No build process is required for the frontend.

For local development:
- Use a local web server to serve the static files
- The Cloudflare Function at `/json` requires deployment to Cloudflare

## Key Implementation Details

- The frontend makes API calls to ipify.org for IP addresses and ipapi.co for geolocation
- The `/json` endpoint is a serverless function that runs on Cloudflare's edge network
- IP validation functions in json.js use regex patterns for IPv4 and IPv6
- The site is available at https://wibble.foo/