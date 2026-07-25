"use client";
import { FormEvent, useEffect, useState } from "react";
import { Place, searchPlaces } from "@/lib/weatherApi";

export function LocationSearch({ onSelect }: { onSelect: (place: Place) => void }) {
  const [query, setQuery] = useState(""); const [results, setResults] = useState<Place[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  useEffect(() => { if (query.trim().length < 2) { setResults([]); return; } const controller = new AbortController(); const timer = setTimeout(async () => { setLoading(true); try { setResults(await searchPlaces(query, controller.signal)); setError(""); } catch (e) { if ((e as Error).name !== "AbortError") setError((e as Error).message); } finally { setLoading(false); } }, 350); return () => { clearTimeout(timer); controller.abort(); }; }, [query]);
  const submit = (e: FormEvent) => { e.preventDefault(); if (results[0]) onSelect(results[0]); };
  return <div className="search-wrap"><form className="search" onSubmit={submit}><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти город" aria-label="Поиск города" /><span className="search-status">{loading ? "…" : ""}</span></form>{error && <p className="error small">{error}</p>}{results.length > 0 && <div className="search-results">{results.map((place) => <button key={`${place.latitude}-${place.longitude}`} onClick={() => { onSelect(place); setQuery(""); setResults([]); }}><b>{place.name}</b><span>{place.country}</span></button>)}</div>}</div>;
}
