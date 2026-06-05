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
npm install          # Install dependencies
npm run dev          # Start development server
```

Create a `.env.local` file with your Weather AI key:

```
WEATHER_AI_KEY=wai_your_key_here
```

Get a free API key from [weather-ai.co](https://weather-ai.co)

## Deploy to Vercel ✅

This project is configured for **Vercel deployment**. 

### Quick Deploy (2 minutes)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository

3. Add environment variable in project settings:
   - **Name:** `WEATHER_AI_KEY`
   - **Value:** Your Weather AI API key

4. Click Deploy! 🚀

### Detailed Instructions

- See [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) for step-by-step guide
- See [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) for complete documentation
- See [`SETUP.md`](./SETUP.md) for local development guide
- See [`MIGRATION_SUMMARY.md`](./MIGRATION_SUMMARY.md) for what changed

### Local Production Test

Before deploying, test the production build locally:

```bash
npm run build        # Build for production
npm run preview      # Preview the build
```

Visit `http://localhost:5173` to verify everything works.

