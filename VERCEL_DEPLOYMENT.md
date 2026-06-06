# Vercel Deployment Guide

This project is configured for deployment on **Vercel**.

## Prerequisites

1. Node.js 18+ and npm
2. A Vercel account
3. Weather AI API key (from https://weather-ai.co)

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/kennedy-273/Real-WeatherAi.git
   cd weather
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` with your Weather AI API key:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and replace the `WEATHER_AI_KEY` value with your actual key.

4. Start development server:

   ```bash
   npm run dev
   ```

   The app should be available at `http://localhost:5173`

## Deployment to Vercel

### Using Vercel CLI

1. Install Vercel CLI globally:

   ```bash
   npm i -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

3. During deployment, Vercel will prompt you to:
   - Link the project to your Vercel account
   - Set the project name
   - Confirm the build command: `npm run build`
   - Confirm the output directory: `dist/client`

4. Add environment variables in Vercel dashboard:
   - Go to your project settings → Environment Variables
   - Add `WEATHER_AI_KEY` with your Weather AI API key

### Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import the GitHub repository (kennedy-273/Real-WeatherAi)
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/client`
5. Add environment variables:
   - `WEATHER_AI_KEY`: Your Weather AI API key
6. Click Deploy

## Build Process

The build process:

1. Runs `npm run build` which uses Vite + TanStack Start to bundle the app
2. Runs `npm run postbuild` which organizes the output into `dist/client`
3. Vercel serves `dist/client` as the static root with proper SPA routing

## Troubleshooting

### Blank Page After Deployment

If you see a blank page on Vercel:

1. **Check API Key**: Ensure `WEATHER_AI_KEY` environment variable is set in Vercel
2. **Check Network Tab**: Look for failed `/api/weather` requests
3. **Check Console**: Open browser DevTools to see JavaScript errors
4. **Rebuild**: Trigger a rebuild from Vercel dashboard

### API Calls Not Working

If `/api/weather` returns errors:

1. Verify the `WEATHER_AI_KEY` is correct
2. Check Vercel function logs for error details
3. Ensure the Weather AI API is accessible from Vercel's region

## Key Files

- `vercel.json` - Vercel configuration
- `vite.config.ts` - Vite bundler configuration
- `package.json` - Build scripts and dependencies
- `.vercelignore` - Files to ignore during deployment
- `.env.example` - Environment variable template
- `src/routes/api/weather.ts` - Server-side weather API proxy

## Performance Tips

1. The app uses static generation for the client bundle
2. Weather data is fetched on-demand from the client
3. Consider adding caching headers to improve performance
4. Use Vercel's Analytics to monitor performance

## Support

For issues:

- Weather AI API docs: https://weather-ai.co/docs
- Vercel docs: https://vercel.com/docs
- TanStack Start: https://tanstack.com/start
