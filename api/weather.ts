import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_KEY =
  process.env.WEATHER_AI_KEY ?? "wai_7bf0d5.2c22cb06ff75600ce30fd203b86d52947e4c6f731e3abab4";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );
    res.status(200).end();
    return;
  }

  const { lat, lon, days = "7", units = "metric", ai = "true", lang } = req.query;

  if (!lat || !lon) {
    res.status(400).json({ error: "Missing lat or lon parameters" });
    return;
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    days: String(days),
    units: String(units),
    ai: String(ai),
  });

  if (lang) {
    params.set("lang", String(lang));
  }

  try {
    const upstream = await fetch(`https://api.weather-ai.co/v1/weather?${params}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!upstream.ok) {
      throw new Error(`Weather API returned ${upstream.status}`);
    }

    const body = await upstream.json();

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(body);
  } catch (error) {
    console.error("Weather API error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({
      error: error instanceof Error ? error.message : "Upstream fetch failed",
    });
  }
}
