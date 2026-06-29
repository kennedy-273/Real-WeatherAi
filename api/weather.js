// const API_KEY = process.env.WEATHER_AI_KEY ?? "";

// export default async function handler(req, res) {
//   const params = new URLSearchParams();
//   for (const k of ["lat", "lon", "days", "units", "ai", "lang"]) {
//     if (req.query[k]) params.set(k, req.query[k]);
//   }
//   try {
//     const upstream = await fetch(`https://api.weather-ai.co/v1/weather?${params}`, {
//       headers: { Authorization: `Bearer ${API_KEY}` },
//     });
//     const body = await upstream.text();
//     res.status(upstream.status).setHeader("Content-Type", "application/json").send(body);
//   } catch (e) {
//     res.status(502).json({ error: e instanceof Error ? e.message : "Upstream fetch failed" });
//   }
// }
export default async function handler(req, res) {
  const API_KEY = process.env.WEATHER_AI_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: "WEATHER_AI_KEY not configured" });
  }

  const params = new URLSearchParams();
  for (const k of ["lat", "lon", "days", "units", "ai", "lang"]) {
    if (req.query[k]) params.set(k, req.query[k]);
  }

  try {
    const upstream = await fetch(`https://api.weather-ai.co/v1/weather?${params}`, {
      headers: { 
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "application/json",
      },
    });
    const body = await upstream.text();
    res.status(upstream.status)
       .setHeader("Content-Type", "application/json")
       .send(body);
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : "Upstream fetch failed" });
  }
}