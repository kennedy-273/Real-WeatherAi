# 🚀 Vercel Deployment Checklist

## Pre-Deployment (Do This First)

- [ ] **Get Weather AI API Key**
  - Go to https://weather-ai.co
  - Sign up for free API key
  - You have one in `.env.local` but get your own for production

- [ ] **Test Locally**

  ```bash
  npm install          # Install all dependencies
  npm run dev          # Start dev server
  ```

  - Visit http://localhost:5173
  - Verify weather data loads for Nairobi
  - Check that search works (try searching for a city)

- [ ] **Test Production Build Locally**
  ```bash
  npm run build        # Build for production
  npm run preview      # Preview the build
  ```

  - Visit http://localhost:5173
  - Verify everything still works
  - Check that weather data loads

## Deployment Steps

### Step 1: Ensure Code is on GitHub ✅

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Go to Vercel Dashboard 🎯

1. Open https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select your GitHub repository: `kennedy-273/Real-WeatherAi`
4. Click **Import**

### Step 3: Configure Build Settings ⚙️

Vercel should auto-detect these, but verify:

- **Build Command**: `npm run build` ✓
- **Output Directory**: `dist/client` ✓
- **Framework**: React ✓

### Step 4: Add Environment Variable 🔑

1. Go to **Project Settings**
2. Click **Environment Variables**
3. Add new variable:
   - **Name**: `WEATHER_AI_KEY`
   - **Value**: Your Weather AI API key
   - **Environments**: Production, Preview, Development
4. Click **Save**

### Step 5: Deploy 🚀

1. Click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. Visit your Vercel URL to test

## Post-Deployment

- [ ] **Verify Deployment**
  - Open the Vercel URL
  - Check browser console for errors (F12)
  - Verify weather data loads
  - Test search functionality
  - Test city switching

- [ ] **Check Vercel Analytics**
  - Go to your project settings
  - Monitor build times and errors
  - Review environment variables are set

- [ ] **Monitor First 24 Hours**
  - Watch for any errors in Vercel logs
  - Monitor API usage
  - Verify data loads consistently

## If It Still Shows a Blank Page

1. **Open Developer Tools** (F12)
   - Click Console tab
   - Look for error messages
   - Screenshot any errors

2. **Check Network Tab**
   - Look for failed requests
   - Check `/api/weather` request status
   - Should be 200, not 404 or 500

3. **Verify Environment Variable**
   - Go to Vercel Project Settings
   - Confirm `WEATHER_AI_KEY` is there
   - Redeploy the project

4. **Rebuild if Needed**
   - Go to Deployments tab
   - Find the latest deployment
   - Click "..." menu → Redeploy

## Quick Build Locally Command

```bash
cd /home/kennedy/Downloads/weather
npm run build
```

If build succeeds, you're ready for Vercel!

## Files Modified for Vercel

✅ `vercel.json` - Updated configuration
✅ `vite.config.ts` - Fixed base path and minifier
✅ `.env.local` - Added for local development
✅ `.env.example` - Created template
✅ `.vercelignore` - Created ignore list
✅ `SETUP.md` - Created this guide
✅ `VERCEL_DEPLOYMENT.md` - Full deployment guide

## Removed Netlify-Specific Configuration

The following are kept but won't interfere with Vercel:

- `netlify.toml` - Won't be used by Vercel
- `netlify/` folder - Won't be used by Vercel

Vercel uses only `vercel.json` which has been properly configured.

## Key API Endpoint

Your app uses this to get weather data:

- **Frontend**: `/api/weather?lat=X&lon=Y`
- **Backend** (`src/routes/api/weather.ts`): Proxies to `https://api.weather-ai.co/v1/weather`
- **Authentication**: Uses `WEATHER_AI_KEY` from environment variables

## Success Indicators ✅

You'll know it's working when:

1. Vercel dashboard shows "Ready" status
2. Clicking the deployment shows green checkmarks
3. Website loads without errors
4. Weather data displays for Nairobi
5. You can search for cities
6. Switching cities updates weather data

## Common Mistakes to Avoid ❌

- ❌ Forgetting to set `WEATHER_AI_KEY` in Vercel
- ❌ Using relative imports instead of absolute (@/)
- ❌ Not waiting for build to complete
- ❌ Clearing environment variables after deployment
- ❌ Not checking DevTools Console for errors

---

**Timeline**: 5-10 minutes to deploy!

Need help? Check the full guides:

- `SETUP.md` - Detailed setup guide
- `VERCEL_DEPLOYMENT.md` - Full deployment guide
