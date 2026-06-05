import { createFileRoute } from "@tanstack/react-router";

const API_KEY = process.env.WEATHER_AI_KEY ?? "wai_7bf0d5.2c22cb06ff75600ce30fd203b86d52947e4c6f731e3abab4";

export const Route = createFileRoute("/api/weather")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const params = new URLSearchParams();
        for (const k of ["lat", "lon", "days", "units", "ai", "lang"]) {
          const v = url.searchParams.get(k);
          if (v) params.set(k, v);
        }
        try {
          const upstream = await fetch(`https://api.weather-ai.co/v1/weather?${params}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          });
          const body = await upstream.text();
          return new Response(body, {
            status: upstream.status,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Upstream fetch failed" }),
            { status: 502, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
