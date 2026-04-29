"use client";

import { useEffect, useState, useCallback } from "react";
import { TYPE_COLORS } from "../lib/typeColors";
import PokemonModal from "./PokemonModal";

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

interface PokemonBasic {
  name: string;
  url: string;
}

const PAGE_SIZE = 20;

export default function PokemonGrid() {
  const [allPokemon, setAllPokemon] = useState<PokemonBasic[]>([]);
  const [displayed, setDisplayed] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("poke-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Fetch all pokemon names (for search)
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0")
      .then(r => r.json())
      .then(d => setAllPokemon(d.results))
      .catch(() => setError("Failed to load Pokémon list."));
  }, []);

  // Fetch types for filter dropdown
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then(r => r.json())
      .then(d => setTypes(d.results.map((t: PokemonBasic) => t.name).filter((t: string) => t !== "unknown" && t !== "shadow")));
  }, []);

  // Fetch details for current page
  const fetchDetails = useCallback(async (list: PokemonBasic[]) => {
    setLoading(true);
    try {
      const start = (page - 1) * PAGE_SIZE;
      const pageList = list.slice(start, start + PAGE_SIZE);
      const details = await Promise.all(
        pageList.map(p =>
          fetch(p.url).then(r => r.json()).then(d => ({
            id: d.id,
            name: d.name,
            image: d.sprites.other["official-artwork"].front_default || d.sprites.front_default,
            types: d.types.map((t: { type: { name: string } }) => t.type.name),
          }))
        )
      );
      setDisplayed(details);
    } catch {
      setError("Failed to load Pokémon details.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Filter & paginate
  useEffect(() => {
    if (!allPokemon.length) return;

    let filtered = allPokemon;
    if (search.trim()) {
      filtered = filtered.filter(p => p.name.includes(search.toLowerCase().trim()));
    }

    if (typeFilter) {
      // We'll filter after fetch by type
      fetchDetails(filtered);
    } else {
      fetchDetails(filtered);
    }
  }, [allPokemon, search, page, typeFilter, fetchDetails]);

  const toggleFav = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("poke-favorites", JSON.stringify(updated));
  };

  const totalPages = Math.ceil(
    (search
      ? allPokemon.filter(p => p.name.includes(search.toLowerCase()))
      : allPokemon
    ).length / PAGE_SIZE
  );

  const visiblePokemon = typeFilter
    ? displayed.filter(p => p.types.includes(typeFilter))
    : displayed;

  return (
    <>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px]"
        />
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && <p style={{ color: "var(--accent2)" }}>{error}</p>}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visiblePokemon.map(p => (
              <div key={p.id} className="poke-card p-4" onClick={() => setSelected(p.id)}>
                <button className="fav-btn" onClick={e => { e.stopPropagation(); toggleFav(p.id); }}>
                  {favorites.includes(p.id) ? "⭐" : "☆"}
                </button>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full aspect-square object-contain"
                  loading="lazy"
                />
                <p className="text-center capitalize font-bold mt-2 text-sm" style={{ color: "var(--text)" }}>
                  {p.name}
                </p>
                <p className="text-center text-xs mb-2" style={{ color: "var(--muted)" }}>
                  #{String(p.id).padStart(3, "0")}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {p.types.map(t => (
                    <span
                      key={t}
                      className="type-badge"
                      style={{ background: TYPE_COLORS[t] || "#555", color: "#fff" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!typeFilter && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-30"
                style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                ← Prev
              </button>
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-30"
                style={{ background: "var(--accent)", color: "#000", border: "none" }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selected && (
        <PokemonModal id={selected} onClose={() => setSelected(null)} favorites={favorites} onToggleFav={toggleFav} />
      )}
    </>
  );
}