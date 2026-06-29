import { createFileRoute } from "@tanstack/react-router";
import { WeatherApp } from "@/components/WeatherApp";

export const Route = createFileRoute("/")({
  component: WeatherApp,
});
