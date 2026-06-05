// WeatherAI API client — calls go through /api/weather to avoid CORS.
// Docs: https://weather-ai.co/docs

export type WeatherResponse = {
  location: {
    lat: number;
    lon: number;
    timezone: string;
    country: string;
    requested_lat: number;
    requested_lon: number;
  };
  current: {
    time: string;
    temperature: number;
    wind_speed: number;
    wind_direction: number;
    condition_code: string;
    icon: string;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    precipitation_probability: number;
    wind_speed: number;
    condition_code: string;
    icon: string;
    humidity: number;
    feels_like: number;
    wind_gust: number;
    uv_index: number;
  }>;
  daily: Array<{
    date: string;
    temp_min: number;
    temp_max: number;
    precipitation_sum: number;
    sunrise: string;
    sunset: string;
    condition_code: string;
    icon: string;
    precipitation_probability: number;
    wind_max: number;
  }>;
  ai?: { summary?: string } | string | null;
};

export type GeoResult = {
  id: number;
  name: string;
  country: string;
  country_code: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return data.results ?? [];
}

export async function fetchWeather(
  lat: number,
  lon: number,
  opts: { days?: number; units?: "metric" | "imperial"; ai?: boolean } = {}
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    days: String(opts.days ?? 7),
    units: opts.units ?? "metric",
    ai: String(opts.ai ?? true),
  });
  const res = await fetch(`/api/weather?${params}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WeatherAI ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

// WMO weather code → label
export function conditionLabel(code: string | number): string {
  const c = String(code);
  const map: Record<string, string> = {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy",
    "3": "Overcast",
    "45": "Foggy",
    "48": "Rime fog",
    "51": "Light drizzle",
    "53": "Moderate drizzle",
    "55": "Dense drizzle",
    "61": "Light rain",
    "63": "Moderate rain",
    "65": "Heavy rain",
    "71": "Light snow",
    "73": "Moderate snow",
    "75": "Heavy snow",
    "80": "Rain showers",
    "81": "Heavy showers",
    "82": "Violent showers",
    "95": "Thunderstorm",
    "96": "Thunderstorm w/ hail",
    "99": "Severe thunderstorm",
  };
  return map[c] ?? "—";
}

// Pick a background gradient palette based on condition + day/night
export function moodFromCondition(code: string, isNight: boolean): string {
  const c = Number(code);
  if (isNight) return "night";
  if (c === 0 || c === 1) return "clear";
  if (c === 2) return "partly";
  if (c === 3 || c === 45 || c === 48) return "cloudy";
  if (c >= 51 && c <= 67) return "rain";
  if (c >= 71 && c <= 77) return "snow";
  if (c >= 80 && c <= 82) return "rain";
  if (c >= 95) return "storm";
  return "clear";
}
