import { createFileRoute } from "@tanstack/react-router";
import { WeatherApp } from "@/components/WeatherApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeatherAI — Real-time forecasts with AI insight" },
      { name: "description", content: "A clean weather dashboard built on the WeatherAI API: current conditions, hourly outlook, and 7-day forecast for any city." },
      { property: "og:title", content: "WeatherAI Dashboard" },
      { property: "og:description", content: "Real-time weather and forecasts powered by weather-ai.co." },
    ],
  }),
  component: WeatherApp,
});
