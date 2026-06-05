# WeatherAI Dashboard

A clean, responsive weather dashboard built on the [WeatherAI API](https://weather-ai.co/docs).

## Features

- Global city search (Open-Meteo geocoding)
- Current conditions with mood-based animated background
- Detail tiles: feels-like, humidity, wind, gust, UV, rain chance
- 24-hour outlook (scrollable)
- 7-day forecast
- AI summary (when returned by the API)
- Metric / Imperial unit toggle

## Stack

- TanStack Start (React 19 + Vite 7)
- Tailwind v4 with a glassmorphism design system
- WeatherAI REST API

## Setup

```bash
bun install
bun dev
```

The app reads the API key from `VITE_WEATHER_AI_KEY` (falls back to the demo key in `src/lib/weather.ts`). Create a `.env`:

```
VITE_WEATHER_AI_KEY=wai_your_key_here
```

## Deploy

Any static-friendly host works (Netlify, Vercel, Cloudflare Pages). Build with `bun run build` and deploy the output.
