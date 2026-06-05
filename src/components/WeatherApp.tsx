import { useEffect, useMemo, useRef, useState } from "react";
import {
  searchCities,
  fetchWeather,
  conditionLabel,
  moodFromCondition,
  type GeoResult,
  type WeatherResponse,
} from "@/lib/weather";
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Sun,
  Gauge,
  Loader2,
  Sparkles,
  Thermometer,
  Star,
} from "lucide-react";

const DEFAULT_CITY: GeoResult = {
  id: 1,
  name: "Nairobi",
  country: "Kenya",
  country_code: "KE",
  admin1: "Nairobi County",
  latitude: -1.2921,
  longitude: 36.8219,
  timezone: "Africa/Nairobi",
};

export function WeatherApp() {
  const [city, setCity] = useState<GeoResult>(DEFAULT_CITY);
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  // search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [favorites, setFavorites] = useState<GeoResult[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [recent, setRecent] = useState<GeoResult[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    } catch {
      return [];
    }
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchWeather(city.latitude, city.longitude, { days: 7, units })
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [city, units]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await searchCities(query);
        setResults(r);
      } catch {
        /* ignore */
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recent.slice(0, 8)));
  }, [recent]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Helpers
  function isFavorite(r: GeoResult) {
    return favorites.some((f) => f.id === r.id);
  }

  function toggleFavorite(r: GeoResult) {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === r.id);
      if (exists) return prev.filter((p) => p.id !== r.id);
      return [r, ...prev].slice(0, 12);
    });
  }

  function selectResult(r: GeoResult) {
    setCity(r);
    setQuery("");
    setResults([]);
    setShowResults(false);
    setActiveIndex(null);
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.id !== r.id);
      return [r, ...filtered].slice(0, 8);
    });
  }

  const mood = useMemo(() => {
    if (!data) return "night";
    const code = data.current.condition_code;
    const hour = new Date(data.current.time).getHours();
    const isNight = hour < 6 || hour >= 19;
    return moodFromCondition(code, isNight);
  }, [data]);

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "km/h" : "mph";

  return (
    <div className={`min-h-screen bg-animated mood-${mood} transition-colors duration-700`}>
      <div className="min-h-screen bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl glass-strong">
                <Sun className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold tracking-tight">WeatherAI</h1>
                <p className="text-xs text-foreground/60">Forecasts powered by weather-ai.co</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full glass p-1 text-sm">
              {(["metric", "imperial"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    units === u
                      ? "bg-foreground text-background"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {u === "metric" ? "°C" : "°F"}
                </button>
              ))}
            </div>
          </header>

          {/* Search */}
          <div ref={boxRef} className="relative mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-3 rounded-2xl glass-strong px-4 py-3">
              <Search className="h-4 w-4 text-foreground/60" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                  setActiveIndex(null);
                }}
                onFocus={() => setShowResults(true)}
                onKeyDown={(e) => {
                  if (!results.length) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((i) => (i === null ? 0 : Math.min(results.length - 1, i + 1)));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((i) => (i === null ? results.length - 1 : Math.max(0, i - 1)));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    const idx = activeIndex ?? 0;
                    const r = results[idx];
                    if (r) selectResult(r);
                  }
                }}
                placeholder="Search any city in the world..."
                className="w-full bg-transparent text-sm placeholder:text-foreground/50 focus:outline-none"
              />
              {searching && <Loader2 className="h-4 w-4 animate-spin text-foreground/60" />}
            </div>

            {/* Floating, overlapping search panel */}
            {showResults && (
              <div className="absolute left-1/2 top-14 z-30 w-[min(880px,calc(100%-2rem))] -translate-x-1/2 rounded-3xl bg-gradient-to-br from-white/6 to-white/3 p-1 shadow-2xl backdrop-blur-md">
                <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden bg-transparent">
                  <div className="max-h-64 overflow-y-auto bg-transparent p-2">
                    {results.length > 0 ? (
                      <ul>
                        {results.map((r, i) => (
                          <li key={r.id}>
                            <button
                              onClick={() => selectResult(r)}
                              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${i === activeIndex ? "bg-white/8" : "hover:bg-white/6"}`}
                            >
                              <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-foreground/60" />
                                <div>
                                  <div className="font-medium">
                                    {r.name}{" "}
                                    <span className="text-foreground/60">
                                      {r.admin1 ? `· ${r.admin1}` : ""}
                                    </span>
                                  </div>
                                  <div className="mt-0.5 text-xs text-foreground/60">
                                    {r.country} · {r.timezone}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  title="Add to favorites"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(r);
                                  }}
                                  className="rounded-md p-1 text-foreground/70 hover:text-accent"
                                >
                                  <Star
                                    className={`h-4 w-4 ${isFavorite(r) ? "text-accent" : ""}`}
                                  />
                                </button>
                                <span className="text-xs text-foreground/60">
                                  {r.latitude.toFixed(2)}, {r.longitude.toFixed(2)}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-sm text-foreground/60">
                        {searching
                          ? "Searching…"
                          : query.trim()
                            ? "No results"
                            : "Type to search cities"}
                      </div>
                    )}
                  </div>

                  <div className="border-l border-white/6 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs text-foreground/70">Recent</div>
                      <button
                        className="text-xs text-foreground/50 hover:text-foreground"
                        onClick={() => {
                          setRecent([]);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {recent.length ? (
                        recent.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => selectResult(r)}
                            className="text-left text-sm hover:bg-white/6 rounded-md px-2 py-1"
                          >
                            {r.name} <span className="text-foreground/60">· {r.country}</span>
                          </button>
                        ))
                      ) : (
                        <div className="text-sm text-foreground/60">No recent searches</div>
                      )}

                      <div className="mt-3 border-t border-white/6 pt-3 text-xs text-foreground/70">
                        Favorites
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {favorites.length ? (
                          favorites.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => selectResult(f)}
                              className="rounded-full bg-white/6 px-3 py-1 text-sm"
                            >
                              {f.name}
                            </button>
                          ))
                        ) : (
                          <div className="text-sm text-foreground/60">
                            No favorites yet — click the <Star className="inline h-4 w-4" /> icon to
                            add one.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <main className="mt-10">
            {error && (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
                Couldn't load weather: {error}
              </div>
            )}
            {loading && !data && (
              <div className="flex items-center justify-center py-32 text-foreground/70">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading forecast…
              </div>
            )}
            {data && (
              <>
                {/* Current */}
                <section className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-3xl glass-strong p-8 lg:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{city.name}</span>
                      {city.admin1 && <span>· {city.admin1}</span>}
                      <span>· {city.country}</span>
                    </div>
                    <div className="mt-6 flex flex-wrap items-end gap-8">
                      <div className="flex items-center gap-4">
                        <img src={data.current.icon} alt="" className="h-24 w-24 drop-shadow-2xl" />
                        <div>
                          <div className="font-display text-7xl font-light leading-none tracking-tight sm:text-8xl">
                            {Math.round(data.current.temperature)}
                            <span className="text-3xl text-foreground/70">{tempUnit}</span>
                          </div>
                          <div className="mt-2 text-base text-foreground/80">
                            {conditionLabel(data.current.condition_code)}
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto text-right text-sm text-foreground/70">
                        <div>
                          {new Date(data.current.time).toLocaleString(undefined, {
                            weekday: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-xs">{data.location.timezone}</div>
                      </div>
                    </div>

                    {/* AI summary */}
                    {(() => {
                      const ai = typeof data.ai === "string" ? data.ai : data.ai?.summary;
                      if (!ai) return null;
                      return (
                        <div className="mt-8 flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                          <p className="text-sm leading-relaxed text-foreground/90">{ai}</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Detail tiles */}
                  <div className="grid grid-cols-2 gap-3">
                    <Tile
                      icon={<Thermometer className="h-4 w-4" />}
                      label="Feels like"
                      value={`${Math.round(data.hourly[0]?.feels_like ?? data.current.temperature)}${tempUnit}`}
                    />
                    <Tile
                      icon={<Droplets className="h-4 w-4" />}
                      label="Humidity"
                      value={`${data.hourly[0]?.humidity ?? "—"}%`}
                    />
                    <Tile
                      icon={<Wind className="h-4 w-4" />}
                      label="Wind"
                      value={`${Math.round(data.current.wind_speed)} ${windUnit}`}
                    />
                    <Tile
                      icon={<Sun className="h-4 w-4" />}
                      label="UV index"
                      value={`${Math.round(data.hourly[0]?.uv_index ?? 0)}`}
                    />
                    <Tile
                      icon={<Gauge className="h-4 w-4" />}
                      label="Gust"
                      value={`${Math.round(data.hourly[0]?.wind_gust ?? 0)} ${windUnit}`}
                    />
                    <Tile
                      icon={<Droplets className="h-4 w-4" />}
                      label="Rain chance"
                      value={`${data.daily[0]?.precipitation_probability ?? 0}%`}
                    />
                  </div>
                </section>

                {/* Hourly */}
                <section className="mt-8 rounded-3xl glass p-6">
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-foreground/70">
                    Next 24 hours
                  </h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {hourlySlice(data).map((h) => (
                      <div
                        key={h.time}
                        className="flex min-w-[78px] flex-col items-center rounded-2xl bg-white/5 px-3 py-3"
                      >
                        <div className="text-xs text-foreground/70">
                          {new Date(h.time).toLocaleTimeString(undefined, { hour: "numeric" })}
                        </div>
                        <img src={h.icon} alt="" className="my-2 h-10 w-10" />
                        <div className="text-base font-medium">
                          {Math.round(h.temperature)}
                          {tempUnit}
                        </div>
                        <div className="mt-1 text-[10px] text-foreground/60">
                          {h.precipitation_probability}%
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-6 rounded-3xl glass p-6">
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-foreground/70">
                    7-day forecast
                  </h2>
                  <ul className="divide-y divide-white/10">
                    {data.daily.slice(0, 7).map((d, i) => {
                      const tMin = Math.round(d.temp_min);
                      const tMax = Math.round(d.temp_max);
                      return (
                        <li
                          key={d.date}
                          className="grid grid-cols-[110px_56px_1fr_110px] items-center gap-4 py-3 text-sm"
                        >
                          <span className="text-foreground/80">
                            {i === 0
                              ? "Today"
                              : new Date(d.date).toLocaleDateString(undefined, { weekday: "long" })}
                          </span>
                          <img src={d.icon} alt="" className="h-10 w-10" />
                          <span className="text-foreground/70">
                            {conditionLabel(d.condition_code)}
                          </span>
                          <span className="text-right tabular-nums">
                            <span className="text-foreground/60">{tMin}°</span>
                            <span className="mx-2 text-foreground/30">/</span>
                            <span className="font-medium">{tMax}°</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl glass p-4 flex items-center gap-3">
                    <Sun className="h-6 w-6 text-accent" />
                    <div>
                      <div className="text-xs text-foreground/70 uppercase">Sunrise / Sunset</div>
                      <div className="mt-1 font-medium">
                        {data.daily[0]?.sunrise
                          ? new Date(data.daily[0].sunrise).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}{" "}
                        ·{" "}
                        {data.daily[0]?.sunset
                          ? new Date(data.daily[0].sunset).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl glass p-4 flex items-center gap-3">
                    <Droplets className="h-6 w-6" />
                    <div>
                      <div className="text-xs text-foreground/70 uppercase">Precip (next 7d)</div>
                      <div className="mt-1 font-medium">
                        {Math.round(
                          data.daily
                            .slice(0, 7)
                            .reduce((s, d) => s + (d.precipitation_sum ?? 0), 0),
                        )}{" "}
                        mm
                      </div>
                    </div>
                  </div>
                </section>

                <footer className="mt-10 pb-6 text-center text-xs text-foreground/60">
                  Data:{" "}
                  <a
                    className="underline hover:text-foreground"
                    href="https://weather-ai.co/docs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    weather-ai.co
                  </a>{" "}
                  · Geocoding: open-meteo
                </footer>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl glass p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/70">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 font-display text-2xl">{value}</div>
    </div>
  );
}

function hourlySlice(data: WeatherResponse) {
  const now = Date.now();
  const future = data.hourly.filter((h) => new Date(h.time).getTime() >= now - 60 * 60 * 1000);
  return (future.length ? future : data.hourly).slice(0, 24);
}
